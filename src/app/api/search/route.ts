import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { products as fallbackProducts } from '@/data/products';
import { categories } from '@/data/categories';
import type { Product } from '@/types/product';

type SearchMode = 'search' | 'suggest' | 'trending';

type SearchIntent =
  | 'skincare'
  | 'makeup'
  | 'sunscreen'
  | 'haircare'
  | 'bodycare'
  | 'korean-beauty'
  | 'fragrance'
  | 'tools'
  | 'general';

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_desc: string | null;
  brand_id: string | null;
  brand_name: string;
  category_id: string | null;
  category_name: string;
  subcategory_name: string | null;
  price: number;
  sale_price: number | null;
  mrp: number | null;
  discount_percent: number | null;
  currency: string | null;
  images: string[] | null;
  sku: string | null;
  seo_title: string | null;
  seo_description: string | null;
  badges: string[] | null;
  gender: string | null;
  benefits: string[] | null;
  ingredients: string | null;
  how_to_use: string | null;
  skin_types: string[] | null;
  concerns: string[] | null;
  rating_avg: number | null;
  rating_count: number | null;
  is_bestseller: boolean | null;
  is_new: boolean | null;
  is_trending: boolean | null;
  is_recommended: boolean | null;
  tags: string[] | null;
  weight_grams: number | null;
  stock_quantity: number | null;
  inventory_count: number | null;
  gst_percent: number | null;
  created_at: string | null;
}

const SEARCH_SELECT = [
  'id',
  'name',
  'slug',
  'description',
  'short_desc',
  'brand_id',
  'brand_name',
  'category_id',
  'category_name',
  'subcategory_name',
  'price',
  'sale_price',
  'mrp',
  'discount_percent',
  'currency',
  'images',
  'sku',
  'seo_title',
  'seo_description',
  'badges',
  'gender',
  'benefits',
  'ingredients',
  'how_to_use',
  'skin_types',
  'concerns',
  'rating_avg',
  'rating_count',
  'is_bestseller',
  'is_new',
  'is_trending',
  'is_recommended',
  'tags',
  'weight_grams',
  'stock_quantity',
  'inventory_count',
  'gst_percent',
  'created_at',
].join(',');

const TYPO_CANDIDATES = Array.from(
  new Set(
    fallbackProducts.flatMap((product) => [
      product.name,
      product.brandName,
      product.categoryName,
      ...product.tags,
      ...product.concerns,
      ...product.skinTypes,
    ]),
  ),
).map((value) => value.toLowerCase());

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    shortDesc: row.short_desc || row.description || '',
    brandId: row.brand_id || row.brand_name.toLowerCase().replace(/\s+/g, '-'),
    brandName: row.brand_name,
    categoryId: row.category_id || row.category_name.toLowerCase().replace(/\s+/g, '-'),
    categoryName: row.category_name,
    subcategoryName: row.subcategory_name || undefined,
    price: Number(row.price || 0),
    salePrice: row.sale_price !== null ? Number(row.sale_price) : undefined,
    mrp: row.mrp !== null ? Number(row.mrp) : undefined,
    discountPercent: row.discount_percent !== null ? Number(row.discount_percent) : undefined,
    currency: row.currency || 'INR',
    images: row.images && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=900&fit=crop'],
    sku: row.sku || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    badges: row.badges || [],
    gender: row.gender || undefined,
    benefits: row.benefits || [],
    ingredients: row.ingredients || undefined,
    howToUse: row.how_to_use || undefined,
    skinTypes: row.skin_types || [],
    concerns: row.concerns || [],
    ratingAvg: Number(row.rating_avg || 0),
    ratingCount: Number(row.rating_count || 0),
    isBestseller: Boolean(row.is_bestseller),
    isNew: Boolean(row.is_new),
    isTrending: Boolean(row.is_trending),
    isRecommended: Boolean(row.is_recommended),
    tags: row.tags || [],
    weightGrams: row.weight_grams || undefined,
    stockQuantity: Number(row.stock_quantity || 0),
    inventoryCount: row.inventory_count || undefined,
    gstPercent: row.gst_percent || undefined,
  };
}

function scoreProduct(product: Product, query: string) {
  if (!query) return 0;

  const q = query.toLowerCase();
  const name = product.name.toLowerCase();
  const brand = product.brandName.toLowerCase();
  const category = product.categoryName.toLowerCase();
  const tags = product.tags.join(' ').toLowerCase();
  const concerns = product.concerns.join(' ').toLowerCase();
  const ingredients = (product.ingredients || '').toLowerCase();

  let score = 0;
  if (name === q) score += 120;
  if (name.startsWith(q)) score += 80;
  if (name.includes(q)) score += 60;
  if (brand.startsWith(q)) score += 40;
  if (brand.includes(q)) score += 30;
  if (category.includes(q)) score += 24;
  if (tags.includes(q)) score += 18;
  if (concerns.includes(q)) score += 18;
  if (ingredients.includes(q)) score += 12;
  if (product.isBestseller) score += 8;
  if (product.isTrending) score += 8;
  if (product.isNew) score += 4;
  score += Math.min(10, Math.round(product.ratingAvg));

  return score;
}

const INTENT_KEYWORDS: Record<SearchIntent, string[]> = {
  skincare: ['serum', 'moisturizer', 'face wash', 'cleanser', 'toner', 'niacinamide', 'retinol', 'vitamin c', 'skincare'],
  makeup: ['lipstick', 'blush', 'foundation', 'concealer', 'eyeliner', 'mascara', 'makeup', 'compact'],
  sunscreen: ['sunscreen', 'spf', 'sun', 'uv'],
  haircare: ['hair', 'shampoo', 'conditioner', 'hair mask', 'hair serum'],
  bodycare: ['body mist', 'body wash', 'body lotion', 'body butter', 'body care'],
  'korean-beauty': ['korean', 'k-beauty', 'glass skin', 'snail mucin'],
  fragrance: ['perfume', 'fragrance', 'mist', 'deo'],
  tools: ['tool', 'brush', 'beauty blender', 'nail', 'trimmer'],
  general: [],
};

function detectIntents(query: string): SearchIntent[] {
  const normalized = query.toLowerCase();
  const intents = (Object.entries(INTENT_KEYWORDS) as Array<[SearchIntent, string[]]>)
    .filter(([intent, keywords]) => intent !== 'general' && keywords.some((keyword) => normalized.includes(keyword)))
    .map(([intent]) => intent);

  return intents.length > 0 ? intents : ['general'];
}

function getIntentMatchScore(product: Product, intents: SearchIntent[]) {
  if (intents.includes('general')) return 0;

  const category = `${product.categoryName} ${product.subcategoryName || ''}`.toLowerCase();
  const tags = product.tags.join(' ').toLowerCase();
  const concerns = product.concerns.join(' ').toLowerCase();
  const haystack = `${category} ${tags} ${concerns} ${(product.description || '').toLowerCase()}`;

  let score = 0;
  intents.forEach((intent) => {
    const keywords = INTENT_KEYWORDS[intent];
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      score += 26;
    }
  });

  return score;
}

function getCommercialSignalScore(product: Product) {
  const discount = product.salePrice && product.price > 0
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  let score = 0;
  if (product.stockQuantity > 0) score += 12;
  if (product.stockQuantity > 5) score += 6;
  if (product.isBestseller) score += 12;
  if (product.isRecommended) score += 8;
  if (product.ratingAvg >= 4.3) score += 10;
  if (discount >= 15) score += 7;

  return score;
}

function scoreProductSmart(product: Product, query: string) {
  const base = scoreProduct(product, query);
  const intents = detectIntents(query);
  const intentScore = getIntentMatchScore(product, intents);
  const commercialScore = getCommercialSignalScore(product);
  const combinedScore = base + intentScore + commercialScore;

  return {
    score: combinedScore,
    intents,
  };
}

function getRecoverySuggestions(query: string, limit = 6) {
  if (!query.trim()) {
    return fallbackProducts
      .slice()
      .sort((a, b) => getCommercialSignalScore(b) - getCommercialSignalScore(a))
      .slice(0, limit);
  }

  const intents = detectIntents(query);
  return fallbackProducts
    .map((product) => ({ product, score: scoreProductSmart(product, query).score + getIntentMatchScore(product, intents) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: b.length + 1 }, () => new Array<number>(a.length + 1).fill(0));

  for (let i = 0; i <= b.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }

  return matrix[b.length][a.length];
}

function suggestQuery(query: string) {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return null;

  let best: { term: string; distance: number } | null = null;
  for (const candidate of TYPO_CANDIDATES) {
    if (Math.abs(candidate.length - q.length) > 3) continue;
    const distance = levenshtein(q, candidate);
    if (!best || distance < best.distance) {
      best = { term: candidate, distance };
    }
  }

  if (!best || best.distance > 2 || best.term === q) return null;
  return best.term;
}

function parseList(searchParams: URLSearchParams, key: string) {
  return searchParams
    .getAll(key)
    .map((value) => value.trim())
    .filter(Boolean);
}

const KNOWN_SUBCATEGORIES = [
  'facewash', 'sunscreen', 'moisturizer', 'serum', 'body-mist', 'face-scrub',
  'lip-balm', 'lip-gloss', 'face-mask', 'sheet-mask', 'strobe-cream', 'night-cream',
  'body-scrub', 'body-wash', 'under-arm-roll-on', 'nails', 'combo'
];

function normalizeCategoryFilter(values: string[]) {
  if (values.length === 0) return [];

  return values.map((value) => {
    const lowerValue = value.toLowerCase();
    if (KNOWN_SUBCATEGORIES.includes(lowerValue)) {
      return lowerValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return value;
  });
}

function extractSubcategoryFilter(values: string[]) {
  return values.filter((v) => {
    const lower = v.toLowerCase();
    return KNOWN_SUBCATEGORIES.includes(lower) || KNOWN_SUBCATEGORIES.some(k => lower.includes(k));
  });
}

function applyFallbackFilters(source: Product[], params: {
  q: string;
  brands: string[];
  categoriesFilter: string[];
  subcategoryFilter: string[];
  skinTypes: string[];
  concerns: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  sortBy: string;
  limit: number;
}) {
  let result = [...source];

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter((product) => {
      const text = [
        product.name,
        product.brandName,
        product.categoryName,
        product.shortDesc,
        product.description,
        product.tags.join(' '),
        product.concerns.join(' '),
        product.ingredients || '',
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(q);
    });

    result.sort((a, b) => scoreProduct(b, params.q) - scoreProduct(a, params.q));
  }

  if (params.brands.length > 0) {
    result = result.filter((product) => params.brands.includes(product.brandName));
  }

  if (params.categoriesFilter.length > 0) {
    result = result.filter((product) => params.categoriesFilter.includes(product.categoryName));
  }

  if (params.subcategoryFilter.length > 0) {
    const normalized = params.subcategoryFilter.map(s => s.toLowerCase().replace(/\s+/g, '-'));
    result = result.filter((product) => {
      const productSub = (product.subcategoryName || '').toLowerCase().replace(/\s+/g, '-');
      return normalized.some(n => productSub.includes(n) || n.includes(productSub));
    });
  }

  if (params.skinTypes.length > 0) {
    result = result.filter((product) => product.skinTypes.some((skinType) => params.skinTypes.includes(skinType)));
  }

  if (params.concerns.length > 0) {
    result = result.filter((product) => product.concerns.some((concern) => params.concerns.includes(concern)));
  }

  result = result.filter((product) => {
    const price = product.salePrice || product.price;
    if (price < params.minPrice || price > params.maxPrice) return false;
    if (params.inStockOnly && product.stockQuantity <= 0) return false;
    if (product.ratingAvg < params.minRating) return false;
    return true;
  });

  switch (params.sortBy) {
    case 'price-asc':
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      break;
    case 'price-desc':
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      break;
    case 'rating':
      result.sort((a, b) => b.ratingAvg - a.ratingAvg);
      break;
    case 'newest':
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    default:
      break;
  }

  return result.slice(0, params.limit);
}

async function getTrendingFromSupabase() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('search_trends')
      .select('query')
      .order('search_count', { ascending: false })
      .limit(8);

    if (!data || data.length === 0) {
      return ['Sunscreen', 'Niacinamide', 'Lip care', 'Korean skincare', 'Body mist', 'Serums'];
    }

    return data.map((row: { query: string }) => row.query);
  } catch {
    return ['Sunscreen', 'Niacinamide', 'Lip care', 'Korean skincare', 'Body mist', 'Serums'];
  }
}

async function trackTrend(query: string, resultsCount: number, topProductId?: string, intents: SearchIntent[] = ['general']) {
  if (!query) return;

  try {
    const supabase = await createClient();
    const normalized = query.trim().toLowerCase();
    const primaryIntent = intents[0] || 'general';
    const { data: existing } = await supabase
      .from('search_trends')
      .select('id,search_count')
      .eq('query', normalized)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('search_trends')
        .update({
          search_count: Number(existing.search_count || 0) + 1,
          last_results_count: resultsCount,
          top_product_id: topProductId || null,
          intent: primaryIntent,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('search_trends')
        .insert({
          query: normalized,
          search_count: 1,
          last_results_count: resultsCount,
          top_product_id: topProductId || null,
          intent: primaryIntent,
        });
    }
  } catch {
    // Ignore analytics write failures.
  }
}

async function upsertRecoveryTask(query: string, intent: SearchIntent, resultsCount: number, suggestions: Product[]) {
  if (!query.trim()) return;

  try {
    const supabase = await createClient();
    const normalized = query.trim().toLowerCase();

    const { data: existing } = await supabase
      .from('search_recovery_tasks')
      .select('id,demand_hits,status')
      .eq('query', normalized)
      .maybeSingle();

    const suggestedProductIds = suggestions.map((item) => item.id).slice(0, 6);

    if (existing) {
      await supabase
        .from('search_recovery_tasks')
        .update({
          demand_hits: Number(existing.demand_hits || 0) + 1,
          intent,
          last_results_count: resultsCount,
          suggested_product_ids: suggestedProductIds,
          status: existing.status === 'resolved' ? 'resolved' : 'open',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('search_recovery_tasks')
        .insert({
          query: normalized,
          intent,
          demand_hits: 1,
          last_results_count: resultsCount,
          suggested_product_ids: suggestedProductIds,
          status: 'open',
        });
    }
  } catch {
    // Ignore task queue failures.
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const mode = (searchParams.get('mode') || 'search') as SearchMode;
  const q = (searchParams.get('q') || '').trim();
  const brands = parseList(searchParams, 'brand');
  const categoriesFilter = normalizeCategoryFilter(parseList(searchParams, 'category'));
  const skinTypes = parseList(searchParams, 'skinType');
  const concerns = parseList(searchParams, 'concern');
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 100000);
  const minRating = Number(searchParams.get('minRating') || 0);
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'relevance';
  const limit = Math.min(48, Math.max(1, Number(searchParams.get('limit') || (mode === 'suggest' ? 8 : 24))));

  if (mode === 'trending') {
    const trending = await getTrendingFromSupabase();
    return NextResponse.json({ products: [], total: 0, suggestions: [], recoverySuggestions: [], trending, didYouMean: null, source: 'trending' });
  }

  const fallback = () => {
    const subcategoryFilter = extractSubcategoryFilter(parseList(url.searchParams, 'category'));
    const filtered = applyFallbackFilters(fallbackProducts, {
      q,
      brands,
      categoriesFilter,
      subcategoryFilter,
      skinTypes,
      concerns,
      minPrice,
      maxPrice,
      inStockOnly,
      minRating,
      sortBy,
      limit,
    });

    const suggestions = Array.from(new Set(filtered.slice(0, 6).flatMap((product) => [product.name, product.brandName])));

    return {
      products: filtered,
      total: filtered.length,
      didYouMean: suggestQuery(q),
      suggestions,
      recoverySuggestions: filtered.length > 0 ? [] : getRecoverySuggestions(q),
      source: 'fallback',
    };
  };

  try {
    const supabase = await createClient();

    const subcategoryFilter = extractSubcategoryFilter(parseList(url.searchParams, 'category'));

    let queryBuilder = supabase.from('products').select(SEARCH_SELECT, { count: 'exact' });

    if (brands.length > 0) queryBuilder = queryBuilder.in('brand_name', brands);
    if (categoriesFilter.length > 0) queryBuilder = queryBuilder.in('category_name', categoriesFilter);
    
    if (subcategoryFilter.length > 0) {
      const normalizedSubcats = subcategoryFilter.map(s => s.toLowerCase().replace(/-/g, ' '));
      const orConditions = normalizedSubcats.map(cat => `subcategory_name.ilike.%${cat}%`).join(',');
      queryBuilder = queryBuilder.or(orConditions);
    }
    
    if (skinTypes.length > 0) queryBuilder = queryBuilder.overlaps('skin_types', skinTypes);
    if (concerns.length > 0) queryBuilder = queryBuilder.overlaps('concerns', concerns);
    if (minPrice > 0) queryBuilder = queryBuilder.gte('sale_price', minPrice);
    if (maxPrice > 0) queryBuilder = queryBuilder.lte('sale_price', maxPrice);
    if (inStockOnly) queryBuilder = queryBuilder.gt('stock_quantity', 0);
    if (minRating > 0) queryBuilder = queryBuilder.gte('rating_avg', minRating);

    if (q) {
      const tsQuery = q
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map((term) => `${term}:*`)
        .join(' & ');

      if (tsQuery) {
        queryBuilder = (queryBuilder as unknown as { textSearch: (col: string, q: string, opts: { type: string; config: string }) => typeof queryBuilder }).textSearch('search_vector', tsQuery, { type: 'raw', config: 'simple' });
      }
    }

    if (sortBy === 'price-asc') queryBuilder = queryBuilder.order('sale_price', { ascending: true });
    if (sortBy === 'price-desc') queryBuilder = queryBuilder.order('sale_price', { ascending: false });
    if (sortBy === 'rating') queryBuilder = queryBuilder.order('rating_avg', { ascending: false });
    if (sortBy === 'newest') queryBuilder = queryBuilder.order('created_at', { ascending: false });

    queryBuilder = queryBuilder.limit(limit);

    let { data, error, count } = await queryBuilder;

    if (error && q) {
      // Fallback for instances where search_vector is not set up yet.
      let ilikeQuery = supabase.from('products').select(SEARCH_SELECT, { count: 'exact' });
      const like = `%${q}%`;
      ilikeQuery = ilikeQuery.or(`name.ilike.${like},brand_name.ilike.${like},category_name.ilike.${like},description.ilike.${like},ingredients.ilike.${like}`);

      if (brands.length > 0) ilikeQuery = ilikeQuery.in('brand_name', brands);
      if (categoriesFilter.length > 0) ilikeQuery = ilikeQuery.in('category_name', categoriesFilter);
      if (subcategoryFilter.length > 0) {
        const normalizedSubcats = subcategoryFilter.map(s => s.toLowerCase().replace(/-/g, ' '));
        const orConditions = normalizedSubcats.map(cat => `subcategory_name.ilike.%${cat}%`).join(',');
        ilikeQuery = ilikeQuery.or(orConditions);
      }
      if (skinTypes.length > 0) ilikeQuery = ilikeQuery.overlaps('skin_types', skinTypes);
      if (concerns.length > 0) ilikeQuery = ilikeQuery.overlaps('concerns', concerns);
      if (minPrice > 0) ilikeQuery = ilikeQuery.gte('sale_price', minPrice);
      if (maxPrice > 0) ilikeQuery = ilikeQuery.lte('sale_price', maxPrice);
      if (inStockOnly) ilikeQuery = ilikeQuery.gt('stock_quantity', 0);
      if (minRating > 0) ilikeQuery = ilikeQuery.gte('rating_avg', minRating);

      ilikeQuery = ilikeQuery.limit(limit);

      const ilikeResult = await ilikeQuery;
      data = ilikeResult.data;
      error = ilikeResult.error;
      count = ilikeResult.count;
    }

    if (error || !data) {
      const fallbackData = fallback();
      const trending = await getTrendingFromSupabase();
      return NextResponse.json({ ...fallbackData, trending });
    }

    let mapped = (data as unknown as ProductRow[]).map(mapRowToProduct);
    const intents = detectIntents(q);

    if (q && sortBy === 'relevance') {
      mapped = mapped.sort((a, b) => scoreProductSmart(b, q).score - scoreProductSmart(a, q).score);
    }

    const suggestions = Array.from(new Set(mapped.slice(0, 8).flatMap((product) => [product.name, product.brandName, product.categoryName])));
    const didYouMean = suggestQuery(q);
    const trending = await getTrendingFromSupabase();
    const recoverySuggestions = mapped.length > 0 ? [] : getRecoverySuggestions(q);

    void trackTrend(q, mapped.length, mapped[0]?.id, intents);
    if (q && mapped.length === 0) {
      void upsertRecoveryTask(q, intents[0] || 'general', mapped.length, recoverySuggestions);
    }

    return NextResponse.json({
      products: mapped,
      total: count || mapped.length,
      suggestions,
      recoverySuggestions,
      didYouMean,
      trending,
      source: 'supabase',
    });
  } catch {
    const fallbackData = fallback();
    const trending = await getTrendingFromSupabase();
    return NextResponse.json({ ...fallbackData, trending });
  }
}
