import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { brands, categories, products } from '@/data/products';
import { adminOrders, adminInfluencers, adminCoupons, adminNotifications, adminAIRecommendations, adminBanners } from '@/data/admin-seed';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, MANUAL_PAYMENT_NOTE, STORE_NAME, UPI_ID, WHATSAPP_NUMBER } from '@/lib/commerce';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    // Initialize a Supabase client with the service role key to bypass RLS for seeding
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // 1. Seed Categories
    const { error: categoryError } = await supabaseAdmin
      .from('categories')
      .upsert(
        categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.imageUrl,
          icon: category.icon,
          parent_id: category.parentId,
          product_count: category.productCount,
        })),
        { onConflict: 'id' }
      );

    if (categoryError) throw new Error(`Category Seeding Failed: ${categoryError.message}`);

    // 2. Seed Brands
    const { error: brandError } = await supabaseAdmin
      .from('brands')
      .upsert(
        brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logo_url: brand.logoUrl || null,
          description: brand.description,
          is_premium: brand.isPremium,
        })),
        { onConflict: 'id' }
      );

    if (brandError) throw new Error(`Brand Seeding Failed: ${brandError.message}`);

    // 3. Seed Products (upsert to avoid duplicates if run multiple times)
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
      subcategory_name: p.subcategoryName,
      price: p.price,
      mrp: p.mrp ?? p.price,
      sale_price: p.salePrice,
      discount_percent: p.discountPercent ?? (p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0),
      currency: p.currency,
      images: p.images,
      sku: p.sku,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      badges: p.badges || [],
      gender: p.gender,
      benefits: p.benefits || [],
      ingredients: p.ingredients,
      how_to_use: p.howToUse,
      skin_types: p.skinTypes,
      concerns: p.concerns,
      rating_avg: p.ratingAvg,
      rating_count: p.ratingCount,
      is_bestseller: p.isBestseller,
      is_new: p.isNew,
      is_trending: p.isTrending || false,
      is_recommended: p.isRecommended || false,
      tags: p.tags,
      stock_quantity: p.stockQuantity || Math.floor(Math.random() * 100),
      inventory_count: p.inventoryCount ?? p.stockQuantity,
      gst_percent: p.gstPercent ?? 18,
    }));

    const { error: prodError } = await supabaseAdmin
      .from('products')
      .upsert(formattedProducts, { onConflict: 'id' });

    if (prodError) throw new Error(`Product Seeding Failed: ${prodError.message}`);

    // 4. Seed Orders
    const formattedOrders = adminOrders.map((o) => ({
      id: o.id,
      order_number: o.orderNumber,
      user_id: o.customerId, // assuming customerId maps to user_id
      status: o.status,
      subtotal: o.total * 0.9,
      total: o.total,
      payment_method: o.paymentMethod,
      payment_status: o.paymentStatus,
      cod_deposit_amount: o.codDepositAmount || null,
      transaction_id: o.transactionId || null,
      screenshot_url: o.screenshotUrl || null,
      customer_name: o.customerName || null,
      customer_email: o.customerEmail || null,
      customer_phone: o.customerPhone || null,
      shipping_address: o.shippingAddress || null,
      created_at: o.createdAt,
    }));

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .upsert(formattedOrders, { onConflict: 'id' });

    if (orderError) throw new Error(`Order Seeding Failed: ${orderError.message}`);

    // 5. Seed Influencers
    const { error: infError } = await supabaseAdmin.from('influencers').upsert(
      adminInfluencers.map(i => ({
        id: i.id,
        name: i.name,
        handle: i.handle,
        platform: i.platform === 'multiple' ? 'other' : i.platform,
        status: i.status,
        followers: i.followers,
        engagement_rate: i.engagementRate,
        commission_rate: i.commissionRate,
        total_sales: i.totalSales,
        total_earnings: i.totalEarnings,
        created_at: i.joinedAt || new Date().toISOString()
      })), { onConflict: 'id' }
    );
    if (infError) throw new Error(`Influencer Seeding Failed: ${infError.message}`);

    // 6. Seed Coupons
    const { error: coupError } = await supabaseAdmin.from('coupons').upsert(
      adminCoupons.map(c => ({
        id: c.id,
        code: c.code,
        description: c.description,
        type: c.type === 'bogo' ? 'fixed' : c.type, // Map bogo to fixed for now or update schema
        value: c.value,
        min_order_amount: c.minOrderAmount,
        usage_limit: c.usageLimit,
        used_count: c.usedCount,
        starts_at: c.startsAt ? new Date(c.startsAt).toISOString() : null,
        expires_at: c.expiresAt ? new Date(c.expiresAt).toISOString() : null,
        is_active: c.isActive,
        created_at: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString()
      })), { onConflict: 'id' }
    );
    if (coupError) throw new Error(`Coupon Seeding Failed: ${coupError.message}`);

    // 7. Seed Notifications
    const { error: notifError } = await supabaseAdmin.from('notifications').upsert(
      adminNotifications.map(n => ({
        id: n.id,
        title: n.title,
        body: n.body,
        target_segment: n.targetSegment || n.target || 'all',
        status: n.status,
        scheduled_at: n.scheduledAt,
        sent_at: n.sentAt,
        open_rate: n.openRate || 0,
        click_rate: n.clickRate || 0,
        created_at: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString()
      })), { onConflict: 'id' }
    );
    if (notifError) throw new Error(`Notification Seeding Failed: ${notifError.message}`);

    // 8. Seed AI Recommendations
    const { error: aiError } = await supabaseAdmin.from('ai_recommendations').upsert(
      adminAIRecommendations.map(r => ({
        id: r.id,
        product_id: r.productId,
        routine_type: r.routineType,
        skin_types: r.skinTypes,
        confidence: r.confidence,
        status: r.status,
        created_at: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
      })), { onConflict: 'id' }
    );
    if (aiError) throw new Error(`AI Recommendation Seeding Failed: ${aiError.message}`);

    // 9. Seed Banners
    const banners = adminBanners.map(b => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      image_url: b.imageUrl,
      link_url: b.linkUrl,
      display_order: b.position,
      is_active: b.isActive
    }));
    await supabaseAdmin.from('cms_banners').upsert(banners, { onConflict: 'id' });

    // 10. Seed Collections
    const collections = [
      { name: 'Summer Essentials', slug: 'summer-essentials', description: 'Lightweight hydrators.', display_order: 1 },
      { name: 'K-Beauty Picks', slug: 'k-beauty-picks', description: 'Curated secrets.', display_order: 2 },
    ];
    await supabaseAdmin.from('cms_collections').upsert(collections, { onConflict: 'slug' });

    // 11. Seed Settings
    await supabaseAdmin.from('settings').upsert({
      id: 'global',
      store_name: STORE_NAME,
      store_description: MANUAL_PAYMENT_NOTE,
      contact_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sayanitapayra@gmail.com',
      contact_phone: WHATSAPP_NUMBER,
      social_links: {
        instagram: INSTAGRAM_URL,
        whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
        instagramHandle: INSTAGRAM_HANDLE,
      },
    });

    return NextResponse.json({ success: true, message: 'Database successfully seeded with the full Glow Addict ecosystem!' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during seeding';
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
