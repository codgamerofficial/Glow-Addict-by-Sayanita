'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { AdminRole, AdminUserWithRole } from '@/types/admin';

// -- Helpers --
async function createAuditLog(action: string, entity: string, entityId?: string, details?: Record<string, unknown>) {
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
  try {
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
  } catch (error) {
    console.warn('Supabase not configured or error fetching stats:', error);
    return { totalOrders: 0, totalProducts: 0, totalCustomers: 0 };
  }
}

// -- Products --
export async function getAdminProducts() {
  try {
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
  } catch (error) {
    console.warn('Supabase not configured or error fetching products:', error);
    return [];
  }
}

export async function createProduct(product: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'product', data.id, product);
  revalidatePath('/admin/products');
  return { success: true, data };
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
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

export async function createCoupon(coupon: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('coupons').insert(coupon).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'coupon', data.id, coupon);
  revalidatePath('/admin/coupons');
  return { success: true, data };
}

export async function updateCoupon(id: string, updates: Record<string, unknown>) {
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

export async function createInfluencer(influencer: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('influencers').insert(influencer).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'influencer', data.id, influencer);
  revalidatePath('/admin/influencers');
  return { success: true, data };
}

export async function updateInfluencer(id: string, updates: Record<string, unknown>) {
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
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('cms_banners').select('*').order('display_order', { ascending: true });
    if (error) {
      console.error('Failed to fetch CMS banners:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.warn('Supabase not configured or error fetching banners:', error);
    return [];
  }
}

export async function createBanner(banner: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cms_banners').insert(banner).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'banner', data.id, banner);
  revalidatePath('/admin/cms');
  return { success: true, data };
}

export async function updateBanner(id: string, updates: Record<string, unknown>) {
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
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('cms_collections').select('*').order('display_order', { ascending: true });
    if (error) {
      console.error('Failed to fetch CMS collections:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.warn('Supabase not configured or error fetching collections:', error);
    return [];
  }
}

export async function createCollection(collection: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('cms_collections').insert(collection).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'collection', data.id, collection);
  revalidatePath('/admin/cms');
  return { success: true, data };
}

export async function updateCollection(id: string, updates: Record<string, unknown>) {
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

export async function updateStoreSettings(updates: Record<string, unknown>) {
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
    adminName: (log.admin_users as Record<string, unknown>)?.name || log.admin_id || 'Unknown',
    action: log.action,
    entity: log.entity,
    entityId: log.entity_id,
    timestamp: log.timestamp,
  }));
}

// -- Inventory Management --
export async function getAdminInventory() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, brand_name, category_name, images, stock_quantity, low_stock_threshold, sku')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin inventory:', error);
    return [];
  }
  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    brandName: p.brand_name || '—',
    categoryName: p.category_name || '—',
    images: p.images || [],
    stockQuantity: p.stock_quantity,
    lowStockThreshold: p.low_stock_threshold || 100,
    sku: p.sku || `GA-${p.id.replace('p', '').padStart(3, '0')}`,
  }));
}

export async function updateStockQuantity(id: string, quantity: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').update({ stock_quantity: quantity }).eq('id', id);
  if (error) throw new Error(error.message);

  await createAuditLog('update_stock', 'product', id, { stock_quantity: quantity });
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');
  return { success: true };
}

export async function updateLowStockAlert(id: string, threshold: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').update({ low_stock_threshold: threshold }).eq('id', id);
  if (error) throw new Error(error.message);

  await createAuditLog('update_low_stock_threshold', 'product', id, { low_stock_threshold: threshold });
  revalidatePath('/admin/inventory');
  return { success: true };
}

export async function getLowStockProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, stock_quantity, low_stock_threshold, sku')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch low stock products:', error);
    return [];
  }
  return (data || []).filter(p => p.stock_quantity <= (p.low_stock_threshold || 100));
}

// -- Role Management --
export async function getAdminRoles(): Promise<AdminRole[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin roles:', error);
    return [];
  }
  return data;
}

export async function createRole(role: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('admin_roles').insert(role).select().single();
  if (error) throw new Error(error.message);
  
  await createAuditLog('create', 'admin_role', data.id, role);
  revalidatePath('/admin/settings/roles');
  return { success: true, data };
}

export async function updateRole(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from('admin_roles').update(updates).eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update', 'admin_role', id, updates);
  revalidatePath('/admin/settings/roles');
  return { success: true };
}

export async function deleteRole(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('admin_roles').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  await createAuditLog('delete', 'admin_role', id);
  revalidatePath('/admin/settings/roles');
  return { success: true };
}

export async function getAdminUsersWithRoles(): Promise<AdminUserWithRole[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_users')
    .select(`
      *,
      admin_roles ( id, name, permissions )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin users with roles:', error);
    return [];
  }
  
  // Format to match expected shape
  return data.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    role: user.admin_roles ? {
      id: user.admin_roles.id,
      name: user.admin_roles.name,
      permissions: user.admin_roles.permissions
    } : null,
    created_at: user.created_at
  }));
}

export async function updateUserRole(userId: string, roleId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('admin_users').update({ role_id: roleId }).eq('id', userId);
  if (error) throw new Error(error.message);
  
  await createAuditLog('update_user_role', 'admin_user', userId, { role_id: roleId });
  revalidatePath('/admin/settings/roles');
  return { success: true };
}