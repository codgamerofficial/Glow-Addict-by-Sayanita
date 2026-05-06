import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { products } from '@/data/products';
import { adminOrders } from '@/data/admin-seed';

// Initialize a Supabase client with the service role key to bypass RLS for seeding
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST() {
  try {
    // 1. Seed Products (upsert to avoid duplicates if run multiple times)
    const formattedProducts = products.map((p) => ({
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
      currency: p.currency,
      images: p.images,
      ingredients: p.ingredients,
      how_to_use: p.howToUse,
      skin_types: p.skinTypes,
      concerns: p.concerns,
      rating_avg: p.ratingAvg,
      rating_count: p.ratingCount,
      is_bestseller: p.isBestseller,
      is_new: p.isNew,
      tags: p.tags,
      stock_quantity: p.stockQuantity || Math.floor(Math.random() * 100),
    }));

    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(formattedProducts, { onConflict: 'id' });

    if (prodError) throw new Error(`Product Seeding Failed: ${prodError.message}`);

    // 2. Seed Orders
    const formattedOrders = adminOrders.map((o) => ({
      id: o.id,
      order_number: o.orderNumber,
      user_id: o.customerId, // assuming customerId maps to user_id
      status: o.status,
      subtotal: o.total * 0.9,
      total: o.total,
      payment_method: o.paymentMethod,
      payment_status: o.paymentStatus,
      created_at: o.createdAt,
    }));

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .upsert(formattedOrders, { onConflict: 'id' });

    if (orderError) throw new Error(`Order Seeding Failed: ${orderError.message}`);

    // 3. Seed Banners
    const banners = [
      { title: 'Your Skin. Your Glow.', subtitle: 'Personalized AI beauty routines.', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=1200&h=400&fit=crop', link_url: '/products', display_order: 1 },
      { title: 'K-Beauty Essentials', subtitle: 'Discover the secret to glass skin.', image_url: 'https://images.unsplash.com/photo-1556228578-00c1443685e1?w=1200&h=400&fit=crop', link_url: '/products?category=skincare', display_order: 2 },
    ];
    await supabaseAdmin.from('cms_banners').upsert(banners);

    // 4. Seed Collections
    const collections = [
      { name: 'Summer Essentials', slug: 'summer-essentials', description: 'Lightweight hydrators.', display_order: 1 },
      { name: 'K-Beauty Picks', slug: 'k-beauty-picks', description: 'Curated secrets.', display_order: 2 },
    ];
    await supabaseAdmin.from('cms_collections').upsert(collections, { onConflict: 'slug' });

    // 5. Seed Settings
    await supabaseAdmin.from('settings').upsert({ id: 'global', store_name: 'Glow Addict', contact_email: 'hello@glowaddict.com' });

    return NextResponse.json({ success: true, message: 'Database successfully seeded with Products, Orders, and CMS content!' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during seeding';
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
