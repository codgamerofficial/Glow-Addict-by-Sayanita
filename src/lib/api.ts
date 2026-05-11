import { supabase } from './supabase';
import { products as mockProducts } from '@/data/products';
import { categories as mockCategories } from '@/data/categories';
import { brands as mockBrands } from '@/data/brands';
import { reviews as mockReviews } from '@/data/reviews';
import type { Product, Category, Brand, Review } from '@/types/product';

/* ============================================================
   Data Fetching Layer — Supabase with Fallback to Mock Data
   ============================================================ */

/** Fetch all products, optionally filtered */
export async function getProducts(filters?: {
  category?: string;
  brand?: string;
  skinType?: string;
  concern?: string;
  search?: string;
  sortBy?: string;
  limit?: number;
}): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');

    if (filters?.category) {
      query = query.eq('category_name', filters.category);
    }
    if (filters?.brand) {
      query = query.eq('brand_name', filters.brand);
    }
    if (filters?.skinType) {
      query = query.contains('skin_types', [filters.skinType]);
    }
    if (filters?.concern) {
      query = query.contains('concerns', [filters.concern]);
    }

    // Sort mapping
    switch (filters?.sortBy) {
      case 'price-asc': query = query.order('price', { ascending: true }); break;
      case 'price-desc': query = query.order('price', { ascending: false }); break;
      case 'rating': query = query.order('rating_avg', { ascending: false }); break;
      case 'newest': query = query.order('created_at', { ascending: false }); break;
      default: query = query.order('rating_count', { ascending: false }); break;
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return mockProducts;

    return data.map(p => ({
      ...p,
      shortDesc: p.short_desc,
      brandId: p.brand_id,
      brandName: p.brand_name,
      categoryId: p.category_id,
      categoryName: p.category_name,
      salePrice: p.sale_price,
      ratingAvg: p.rating_avg,
      ratingCount: p.rating_count,
      isBestseller: p.is_bestseller,
      isNew: p.is_new,
      stockQuantity: p.stock_quantity
    })) as Product[];
  } catch (e) {
    console.warn('Supabase fetch failed, using mock data:', e);
    return mockProducts;
  }
}

/** Fetch a single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return mockProducts.find(p => p.slug === slug) || null;
    }

    return {
      ...data,
      shortDesc: data.short_desc,
      brandId: data.brand_id,
      brandName: data.brand_name,
      categoryId: data.category_id,
      categoryName: data.category_name,
      salePrice: data.sale_price,
      ratingAvg: data.rating_avg,
      ratingCount: data.rating_count,
      isBestseller: data.is_bestseller,
      isNew: data.is_new,
      stockQuantity: data.stock_quantity
    } as Product;
  } catch (e) {
    console.warn('Supabase fetch failed, using mock data:', e);
    return mockProducts.find(p => p.slug === slug) || null;
  }
}

/** Fetch reviews for a product */
export async function getReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockReviews.filter(r => r.productId === productId);
    }

    return data as Review[];
  } catch (e) {
    console.warn('Supabase fetch failed, using mock data:', e);
    return mockReviews.filter(r => r.productId === productId);
  }
}

/** Fetch all categories */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('product_count', { ascending: false });

    if (error || !data || data.length === 0) return mockCategories;

    return data.map(c => ({
      ...c,
      imageUrl: c.image_url,
      productCount: c.product_count
    })) as Category[];
  } catch {
    return mockCategories;
  }
}

/** Fetch all brands */
export async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) return mockBrands;

    return data.map(b => ({
      ...b,
      logoUrl: b.logo_url,
      isPremium: b.is_premium
    })) as Brand[];
  } catch {
    return mockBrands;
  }
}
