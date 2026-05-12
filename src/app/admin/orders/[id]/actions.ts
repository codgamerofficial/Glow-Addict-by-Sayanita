'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Order } from '@/types/order';

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status:', error);
    throw new Error(error.message);
  }

  await revalidatePath(`/admin/orders/${orderId}`);
  await revalidatePath('/admin/orders');
}

export async function verifyPayment(orderId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'verified', status: 'confirmed' })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to verify payment:', error);
    throw new Error(error.message);
  }

  await revalidatePath(`/admin/orders/${orderId}`);
  await revalidatePath('/admin/orders');
}

export async function saveTrackingNumber(orderId: string, trackingNumber: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status: 'shipped', tracking_number: trackingNumber })
    .eq('id', orderId);

  if (error) {
    console.error('Failed to save tracking number:', error);
    throw new Error(error.message);
  }

  await revalidatePath(`/admin/orders/${orderId}`);
  await revalidatePath('/admin/orders');
}