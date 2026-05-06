'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// -- Helpers --
async function createAuditLog(action: string, entity: string, entityId?: string, details?: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.from('audit_logs').insert({
    admin_id: user?.id,
    action,
    entity,
    entity_id: entityId,
    details
  });
}

// -- Dashboard Stats --
export async function getDashboardStats() {
  const supabase = await createClient();
  
  // Real implementation would calculate these from tables
  // For now, we'll fetch basic counts to demonstrate backend connection
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalCustomers },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('admin_users').select('*', { count: 'exact', head: true }), // Using admin_users as a proxy for customers if real customers aren't separated
  ]);

  return {
    totalOrders: totalOrders || 0,
    totalProducts: totalProducts || 0,
    totalCustomers: totalCustomers || 0,
    // Add other mocked or calculated stats here...
  };
}

// -- Products --
export async function getAdminProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin products:', error);
    return [];
  }
  return data;
}

export async function createProduct(product: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'product', data.id, product);
  revalidatePath('/admin/products');
  return { success: true, data };
}

export async function updateProduct(id: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'product', id, updates);
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('delete', 'product', id);
  revalidatePath('/admin/products');
  return { success: true };
}

// -- Orders --
export async function getAdminOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin orders:', error);
    return [];
  }
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update_status', 'order', id, { status });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

// -- Customers (Assuming we use auth.users or a profiles table for customers, for now fetching all users might require service role) --
export async function getAdminCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin customers:', error);
    return [];
  }
  
  return data.map(p => ({
    id: p.id,
    name: p.name || 'Anonymous',
    email: '---', // Real email is in auth.users, need service role to fetch safely or store in profile
    loyaltyPoints: p.loyalty_points,
    skinType: p.skin_type,
    joinedAt: p.updated_at
  }));
}

// -- Coupons --
export async function getAdminCoupons() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  if (error) console.error('Failed to fetch coupons:', error);
  return data || [];
}

export async function createCoupon(coupon: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('coupons').insert(coupon).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'coupon', data.id, coupon);
  revalidatePath('/admin/coupons');
  return { success: true, data };
}

export async function updateCoupon(id: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('coupons').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'coupon', id, updates);
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('delete', 'coupon', id);
  revalidatePath('/admin/coupons');
  return { success: true };
}

// -- Influencers --
export async function getAdminInfluencers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('influencers').select('*').order('created_at', { ascending: false });
  if (error) console.error('Failed to fetch influencers:', error);
  return data || [];
}

export async function createInfluencer(influencer: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('influencers').insert(influencer).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'influencer', data.id, influencer);
  revalidatePath('/admin/influencers');
  return { success: true, data };
}

export async function updateInfluencer(id: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('influencers').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'influencer', id, updates);
  revalidatePath('/admin/influencers');
  return { success: true };
}

export async function deleteInfluencer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('influencers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('delete', 'influencer', id);
  revalidatePath('/admin/influencers');
  return { success: true };
}

// -- AI Recommendations --
export async function getAdminAIRecommendations() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('ai_recommendations').select('*').order('created_at', { ascending: false });
  if (error) console.error('Failed to fetch AI recommendations:', error);
  return data || [];
}

// -- CMS Banners --
export async function getAdminBanners() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cms_banners').select('*').order('display_order', { ascending: true });
  if (error) console.error('Failed to fetch CMS banners:', error);
  return data || [];
}

export async function createBanner(banner: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cms_banners').insert(banner).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'banner', data.id, banner);
  revalidatePath('/admin/cms');
  return { success: true, data };
}

export async function updateBanner(id: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('cms_banners').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'banner', id, updates);
  revalidatePath('/admin/cms');
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('cms_banners').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('delete', 'banner', id);
  revalidatePath('/admin/cms');
  return { success: true };
}

// -- CMS Collections --
export async function getAdminCollections() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cms_collections').select('*').order('display_order', { ascending: true });
  if (error) console.error('Failed to fetch CMS collections:', error);
  return data || [];
}

export async function createCollection(collection: any) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cms_collections').insert(collection).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'collection', data.id, collection);
  revalidatePath('/admin/cms');
  return { success: true, data };
}

export async function updateCollection(id: string, updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('cms_collections').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'collection', id, updates);
  revalidatePath('/admin/cms');
  return { success: true };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('cms_collections').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('delete', 'collection', id);
  revalidatePath('/admin/cms');
  return { success: true };
}

// -- Store Settings --
export async function getStoreSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'global').single();
  if (error) console.error('Failed to fetch store settings:', error);
  return data;
}

export async function updateStoreSettings(updates: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('settings').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', 'global');
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'settings', 'global', updates);
  revalidatePath('/admin/settings');
  return { success: true };
}

// -- Notifications --
export async function getAdminNotifications() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
  if (error) console.error('Failed to fetch notifications:', error);
  return data || [];
}

// -- Audit Logs --
export async function getAdminAuditLogs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('audit_logs').select(`
    *,
    admin_users ( name )
  `).order('timestamp', { ascending: false }).limit(50);
  
  if (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
  
  // Format to match the frontend shape
  return data.map((log) => ({
    id: log.id,
    adminName: (log.admin_users as any)?.name || log.admin_id || 'Unknown',
    action: log.action,
    entity: log.entity,
    entityId: log.entity_id,
    timestamp: log.timestamp,
  }));
}
