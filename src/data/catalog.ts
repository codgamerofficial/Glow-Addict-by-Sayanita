import generatedCatalog from './generated-catalog.json';
import type { Brand, Category, Product } from '@/types/product';

type GeneratedProduct = {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  originalPrice: number;
  offerPrice: number;
  discount: number;
  image: string;
  tags: string[];
  skinType: string[];
  ingredients: string;
  benefits: string[];
  shades: string[];
  usageInstructions: string;
  seoKeywords: string[];
  seo: {
    seoTitle: string;
    metaDescription: string;
    slug: string;
    canonicalUrl: string;
    openGraphImage: string;
    twitterCard: string;
    schemaType: string;
  };
  ratingAvg: number;
  ratingCount: number;
  isBestSeller: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  stockQuantity: number;
  sku: string;
};

type GeneratedCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  icon: string;
  description: string;
  productCount: number;
};

type GeneratedBrand = {
  id: string;
  name: string;
  slug: string;
  isPremium: boolean;
  logoUrl: string;
  description: string;
};

type GeneratedCatalog = {
  media: {
    logo: string;
    freebies: string;
    combo: string;
  };
  businessRules: {
    noReturn: boolean;
    noReplacement: boolean;
    freeDeliveryAbove: number;
    shippingChargeBelow: number;
    codAvailable: boolean;
  };
  contact: {
    email: string;
    phone: string;
    instagram: string;
    whatsapp: string;
  };
  comboBundles: Array<{
    id: string;
    title: string;
    productIds: string[];
    discountPercent: number;
    image: string;
  }>;
  products: GeneratedProduct[];
  categories: GeneratedCategory[];
  brands: GeneratedBrand[];
};

const source = generatedCatalog as GeneratedCatalog;

const categoryByName = new Map(source.categories.map((category) => [category.name, category]));
const brandByName = new Map(source.brands.map((brand) => [brand.name, brand]));

export const categories: Category[] = source.categories.map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  imageUrl: category.imageUrl,
  icon: category.icon,
  productCount: category.productCount,
}));

export const brands: Brand[] = source.brands.map((brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
  isPremium: brand.isPremium,
  logoUrl: brand.logoUrl,
  description: brand.description,
}));

export const catalog: Product[] = source.products.map((product) => {
  const safeSlug = (product.seo && product.seo.slug) || (product as any).slug || product.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')?.replace(/(^-|-$)/g, '');
  const safeSeoTitle = product.seo?.seoTitle || `${product.title} | Glow Addict`;
  const safeSeoDescription = product.seo?.metaDescription || `${product.title} by ${product.brand} — premium beauty product.`;
  const mappedCategory = categoryByName.get(product.category);
  const mappedBrand = brandByName.get(product.brand);
  const concerns = product.tags
    .filter((tag) => !['best-seller', 'trending'].includes(tag))
    .map((tag) => tag.replace(/-/g, ' '))
    .slice(0, 5);

  return {
    id: product.id,
    name: product.title,
    slug: safeSlug,
    description: `${product.title} by ${product.brand}. Premium, authentic beauty essential curated by Glow Addict by Sayanita.`,
    shortDesc: product.subcategory,
    brandId: mappedBrand?.id || `brand-${product.brand.toLowerCase().replace(/\s+/g, '-')}`,
    brandName: product.brand,
    categoryId: mappedCategory?.id || `cat-${product.category.toLowerCase().replace(/\s+/g, '-')}`,
    categoryName: product.category,
    subcategoryName: product.subcategory,
    price: product.originalPrice,
    salePrice: product.offerPrice,
    mrp: product.originalPrice,
    discountPercent: product.discount,
    currency: 'INR',
    images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []),
    sku: product.sku,
    seoTitle: safeSeoTitle,
    seoDescription: safeSeoDescription,
    badges: [
      ...(product.isBestSeller ? ['Bestseller'] : []),
      ...(product.isNewArrival ? ['New Arrival'] : []),
      ...(product.isTrending ? ['Trending'] : []),
    ],
    benefits: product.benefits,
    ingredients: product.ingredients,
    howToUse: product.usageInstructions,
    skinTypes: product.skinType,
    concerns,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    isBestseller: product.isBestSeller,
    isNew: product.isNewArrival,
    isTrending: product.isTrending,
    tags: [...(product.tags || []), ...(product.seoKeywords || [])],
    stockQuantity: product.stockQuantity,
    inventoryCount: product.stockQuantity,
    gstPercent: 18,
    gender: 'Unisex',
  };
});

export const catalogMedia = source.media;
export const businessRules = source.businessRules;
export const contactDetails = source.contact;
export const comboBundles = source.comboBundles;

export { catalog as products };
export default catalog;
