'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function placeOrder(orderData: any, userId: string) {
  if (!userId) {
    throw new Error('You must be logged in to place an order');
  }

  const orderNumber = `GA-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // 1. Create the order document
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      status: 'pending',
      subtotal: orderData.subtotal,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      shipping_address: orderData.shippingAddress,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItems = orderData.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.images[0],
    quantity: item.quantity,
    price: item.product.salePrice || item.product.price,
    total: (item.product.salePrice || item.product.price) * item.quantity,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  revalidatePath('/profile');
  return { success: true, orderId: orderNumber };
}

export async function getUserOrders(userId: string) {
  if (!userId) return [];

  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (orders || []).map(o => {
      return {
        id: o.order_number,
        date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        total: o.total,
        items: o.order_items.reduce((acc: number, item: any) => acc + item.quantity, 0)
      };
    });
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
}
