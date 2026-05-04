import { supabase, isSupabaseConfigured } from './supabase';
import { products as mockProducts } from '@/data/products';
import { categories as mockCategories } from '@/data/categories';
import { brands as mockBrands } from '@/data/brands';
import { reviews as mockReviews } from '@/data/reviews';
import type { Product, Category, Brand, Review } from '@/types/product';

/* ============================================================
   Data Fetching Layer — Supabase with Fallback to Mock Data
   ============================================================ */

// Helper: map Supabase snake_case row to our camelCase Product type
function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || '',
    shortDesc: (row.short_desc as string) || '',
    brandId: (row.brand_id as string) || '',
    brandName: (row.brand_name as string) || '',
    categoryId: (row.category_id as string) || '',
    categoryName: (row.category_name as string) || '',
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    currency: (row.currency as string) || 'INR',
    images: (row.images as string[]) || [],
    ingredients: row.ingredients as string | undefined,
    howToUse: row.how_to_use as string | undefined,
    skinTypes: (row.skin_types as string[]) || [],
    concerns: (row.concerns as string[]) || [],
    ratingAvg: Number(row.rating_avg) || 0,
    ratingCount: Number(row.rating_count) || 0,
    isBestseller: Boolean(row.is_bestseller),
    isNew: Boolean(row.is_new),
    tags: (row.tags as string[]) || [],
    weightGrams: row.weight_grams ? Number(row.weight_grams) : undefined,
    stockQuantity: Number(row.stock_quantity) || 0,
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    userAvatar: row.user_avatar as string | undefined,
    productId: row.product_id as string,
    rating: Number(row.rating),
    title: row.title as string,
    body: row.body as string,
    images: row.images as string[] | undefined,
    isVerified: Boolean(row.is_verified),
    helpfulCount: Number(row.helpful_count) || 0,
    skinType: row.skin_type as string | undefined,
    createdAt: row.created_at as string,
  };
}

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
  if (!isSupabaseConfigured()) return mockProducts;

  try {
    let query = supabase.from('products').select('*');

    if (filters?.category) {
      query = query.ilike('category_name', `%${filters.category}%`);
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
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,tags.cs.{${filters.search.toLowerCase()}}`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    switch (filters?.sortBy) {
      case 'price-asc': query = query.order('price', { ascending: true }); break;
      case 'price-desc': query = query.order('price', { ascending: false }); break;
      case 'rating': query = query.order('rating_avg', { ascending: false }); break;
      case 'newest': query = query.order('created_at', { ascending: false }); break;
      default: query = query.order('rating_count', { ascending: false }); break;
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (e) {
    console.warn('Supabase fetch failed, using mock data:', e);
    return mockProducts;
  }
}

/** Fetch a single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return mockProducts.find(p => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data ? mapProduct(data) : null;
  } catch (e) {
    console.warn('Supabase fetch failed, using mock data:', e);
    return mockProducts.find(p => p.slug === slug) || null;
  }
}

/** Fetch reviews for a product */
export async function getReviews(productId: string): Promise<Review[]> {
  if (!isSupabaseConfigured()) {
    return mockReviews.filter(r => r.productId === productId);
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapReview);
  } catch (e) {
    console.warn('Supabase fetch failed, using mock data:', e);
    return mockReviews.filter(r => r.productId === productId);
  }
}

/** Fetch all categories */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return mockCategories;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('product_count', { ascending: false });

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id, name: row.name, slug: row.slug,
      description: row.description, imageUrl: row.image_url,
      icon: row.icon, parentId: row.parent_id, productCount: row.product_count,
    }));
  } catch {
    return mockCategories;
  }
}

/** Fetch all brands */
export async function getBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured()) return mockBrands;

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id, name: row.name, slug: row.slug,
      logoUrl: row.logo_url, description: row.description,
      isPremium: row.is_premium,
    }));
  } catch {
    return mockBrands;
  }
}
