'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function placeOrder(orderData: {
  subtotal: number;
  total: number;
  paymentMethod: string;
  shippingAddress: Record<string, unknown>;
  items: Array<{ id: string; quantity: number; product: { name: string; images: string[]; salePrice?: number; price: number } }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to place an order');
  }

  const orderNumber = `GA-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: 'pending',
      subtotal: orderData.subtotal,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      shipping_address: orderData.shippingAddress,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Order creation error:', orderError);
    throw new Error(orderError.message);
  }

  // 2. Create order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.product.name,
    product_image: item.product.images[0],
    quantity: item.quantity,
    price: item.product.salePrice || item.product.price,
    total: (item.product.salePrice || item.product.price) * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items creation error:', itemsError);
    // Note: In a production app, you might want to rollback the order creation here
    throw new Error(itemsError.message);
  }

  revalidatePath('/profile');
  return { success: true, orderId: orderNumber };
}

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }

  return data.map(o => ({
    id: o.order_number,
    date: new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
    total: o.total,
    items: o.order_items.reduce((acc: number, item: Record<string, unknown>) => acc + (item.quantity as number), 0)
  }));
}
