'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import type { AdminRole } from '@/types/admin';

// -- Helpers --
async function createAuditLog(action: string, entity: string, entityId?: string, details?: Record<string, unknown>) {
  await supabaseAdmin.from('audit_logs').insert({
    action,
    entity,
    entity_id: entityId,
    details,
  });
}

// -- Dashboard Stats --
export async function getDashboardStats() {
  try {
    const [
      { count: ordersCount },
      { count: productsCount },
      { count: customersCount }
    ] = await Promise.all([
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalOrders: ordersCount || 0,
      totalProducts: productsCount || 0,
      totalCustomers: customersCount || 0,
    };
  } catch (error) {
    console.warn('Supabase error fetching stats:', error);
    return { totalOrders: 0, totalProducts: 0, totalCustomers: 0 };
  }
}

// -- Products --
export async function getAdminProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error fetching products:', error);
    return [];
  }
}

export async function createProduct(product: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  
  await createAuditLog('create', 'product', data.id, product);
  revalidatePath('/admin/products');
  return { success: true, id: data.id };
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update', 'product', id, updates);
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('delete', 'product', id);
  revalidatePath('/admin/products');
  return { success: true };
}

// -- Orders --
export async function getAdminOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update_status', 'order', id, { status });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

// -- Customers --
export async function getAdminCustomers() {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(p => ({
    id: p.id,
    name: p.name || 'Anonymous',
    email: p.email || '---',
    loyaltyPoints: p.loyalty_points || 0,
    skinType: p.skin_type,
    joinedAt: p.created_at
  }));
}

// -- Coupons --
export async function getAdminCoupons() {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createCoupon(coupon: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .insert(coupon)
    .select()
    .single();

  if (error) throw error;
  
  await createAuditLog('create', 'coupon', data.id, coupon);
  revalidatePath('/admin/coupons');
  return { success: true, id: data.id };
}

export async function updateCoupon(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('coupons')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update', 'coupon', id, updates);
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const { error } = await supabaseAdmin
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('delete', 'coupon', id);
  revalidatePath('/admin/coupons');
  return { success: true };
}

// -- Influencers --
export async function getAdminInfluencers() {
  const { data, error } = await supabaseAdmin
    .from('influencers')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createInfluencer(influencer: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('influencers')
    .insert(influencer)
    .select()
    .single();

  if (error) throw error;
  
  await createAuditLog('create', 'influencer', data.id, influencer);
  revalidatePath('/admin/influencers');
  return { success: true, id: data.id };
}

export async function updateInfluencer(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('influencers')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update', 'influencer', id, updates);
  revalidatePath('/admin/influencers');
  return { success: true };
}

export async function deleteInfluencer(id: string) {
  const { error } = await supabaseAdmin
    .from('influencers')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('delete', 'influencer', id);
  revalidatePath('/admin/influencers');
  return { success: true };
}

// -- CMS Banners --
export async function getAdminBanners() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cms_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error fetching banners:', error);
    return [];
  }
}

export async function createBanner(banner: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('cms_banners')
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  
  await createAuditLog('create', 'banner', data.id, banner);
  revalidatePath('/admin/cms');
  return { success: true, data };
}

export async function updateBanner(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('cms_banners')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update', 'banner', id, updates);
  revalidatePath('/admin/cms');
  return { success: true };
}

export async function deleteBanner(id: string) {
  const { error } = await supabaseAdmin
    .from('cms_banners')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('delete', 'banner', id);
  revalidatePath('/admin/cms');
  return { success: true };
}

// -- CMS Collections --
export async function getAdminCollections() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cms_collections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error fetching collections:', error);
    return [];
  }
}

export async function createCollection(collection: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('cms_collections')
    .insert(collection)
    .select()
    .single();

  if (error) throw error;
  
  await createAuditLog('create', 'collection', data.id, collection);
  revalidatePath('/admin/cms');
  return { success: true, data };
}

export async function updateCollection(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('cms_collections')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update', 'collection', id, updates);
  revalidatePath('/admin/cms');
  return { success: true };
}

export async function deleteCollection(id: string) {
  const { error } = await supabaseAdmin
    .from('cms_collections')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('delete', 'collection', id);
  revalidatePath('/admin/cms');
  return { success: true };
}

// -- Store Settings --
export async function getStoreSettings() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('*')
    .eq('id', 'global')
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateStoreSettings(updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ id: 'global', ...updates, updated_at: new Date().toISOString() });

  if (error) throw error;
  
  await createAuditLog('update', 'settings', 'global', updates);
  revalidatePath('/admin/settings');
  return { success: true };
}

// -- Inventory Management --
export async function getAdminInventory() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    brandName: p.brand_name || '—',
    categoryName: p.category_name || '—',
    images: p.images || [],
    stockQuantity: p.stock_quantity || 0,
    lowStockThreshold: p.low_stock_threshold || 100,
    sku: p.sku || `GA-${p.id.substring(0, 5)}`,
  }));
}

export async function updateStockQuantity(id: string, quantity: number) {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ stock_quantity: quantity })
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update_stock', 'product', id, { stock_quantity: quantity });
  revalidatePath('/admin/products');
  return { success: true };
}

export async function updateLowStockAlert(id: string, threshold: number) {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ low_stock_threshold: threshold })
    .eq('id', id);

  if (error) throw error;
  
  await createAuditLog('update_threshold', 'product', id, { low_stock_threshold: threshold });
  revalidatePath('/admin/inventory');
  return { success: true };
}

// -- Role Management --
export async function getAdminRoles(): Promise<AdminRole[]> {
  const { data, error } = await supabaseAdmin
    .from('admin_roles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createRole(role: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('admin_roles')
    .insert(role)
    .select()
    .single();

  if (error) throw error;
  
  await createAuditLog('create', 'admin_role', data.id, role);
  revalidatePath('/admin/settings/roles');
  return { success: true, id: data.id };
}

// -- Dashboard & Logs --
export async function getAdminNotifications() {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error fetching notifications:', error);
    return [];
  }
}

export async function getAdminAuditLogs() {
  try {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error fetching audit logs:', error);
    return [];
  }
}

export async function getAdminAIRecommendations() {
  try {
    const { data, error } = await supabaseAdmin
      .from('ai_recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Supabase error fetching AI recommendations:', error);
    return [];
  }
}