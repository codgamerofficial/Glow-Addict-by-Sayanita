import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { 
  adminOrders, 
  adminCoupons, 
  adminInfluencers, 
  adminNotifications, 
  adminAIRecommendations, 
  adminBanners 
} from '@/data/admin-seed';

export async function POST() {
  try {
    // 1. Products (Map camelCase to snake_case)
    const productsData = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      short_desc: p.shortDesc,
      brand_id: p.brandId,
      brand_name: p.brandName,
      category_id: p.categoryId,
      category_name: p.categoryName,
      price: p.price,
      sale_price: p.salePrice,
      images: p.images,
      skin_types: p.skinTypes,
      concerns: p.concerns,
      rating_avg: p.ratingAvg,
      rating_count: p.ratingCount,
      is_bestseller: p.isBestseller,
      is_new: p.isNew,
      tags: p.tags,
      weight_grams: p.weightGrams,
      stock_quantity: p.stockQuantity,
    }));

    // 2. Categories
    const categoriesData = categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.imageUrl,
      icon: c.icon,
      product_count: c.productCount,
    }));

    // Perform bulk inserts
    await Promise.all([
      supabaseAdmin.from('products').upsert(productsData),
      supabaseAdmin.from('categories').upsert(categoriesData),
      supabaseAdmin.from('orders').upsert(adminOrders.map(o => ({
        id: o.id,
        order_number: o.id,
        user_id: o.user_id || o.customerId,
        status: o.status,
        total: o.total,
        subtotal: o.total,
        created_at: o.createdAt
      }))),
      supabaseAdmin.from('coupons').upsert(adminCoupons.map(c => ({
        id: c.id,
        code: c.code,
        type: c.type,
        value: c.value,
        is_active: c.is_active ?? c.isActive ?? true,
        created_at: c.created_at || c.createdAt
      }))),
      supabaseAdmin.from('influencers').upsert(adminInfluencers.map(i => ({
        id: i.id,
        name: i.name,
        handle: i.handle,
        platform: i.platform.toLowerCase(),
        status: i.status.toLowerCase(),
        followers: i.followers,
        created_at: i.joinedAt
      }))),
      supabaseAdmin.from('cms_banners').upsert(adminBanners.map(b => ({
        id: b.id,
        title: b.title,
        image_url: b.image_url || b.imageUrl,
        link_url: b.link || b.linkUrl,
        is_active: b.is_active ?? b.isActive ?? true
      }))),
      supabaseAdmin.from('ai_recommendations').upsert(adminAIRecommendations.map(r => ({
        id: r.id,
        product_id: r.productId || r.product_id,
        routine_type: r.routineType || r.routine_type,
        skin_types: r.skinTypes || r.skin_types,
        confidence: r.confidence,
        status: r.status,
        created_at: r.createdAt
      })))
    ]);

    return NextResponse.json({ success: true, message: 'Supabase database seeded successfully' });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
