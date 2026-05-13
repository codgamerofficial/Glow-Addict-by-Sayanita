export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  subcategoryName?: string;
  price: number;
  salePrice?: number;
  mrp?: number;
  discountPercent?: number;
  currency: string;
  images: string[];
  sku?: string;
  seoTitle?: string;
  seoDescription?: string;
  badges?: string[];
  gender?: string;
  benefits?: string[];
  ingredients?: string;
  howToUse?: string;
  skinTypes: string[];
  concerns: string[];
  ratingAvg: number;
  ratingCount: number;
  isBestseller: boolean;
  isNew: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  tags: string[];
  weightGrams?: number;
  variants?: ProductVariant[];
  stockQuantity: number;
  inventoryCount?: number;
  gstPercent?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  salePrice?: number;
  stockQuantity: number;
  colorHex?: string;
  size?: string;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  icon: string;
  parentId?: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  isPremium: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  skinType?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variantId?: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  skinType?: string;
  skinConcerns?: string[];
  loyaltyPoints: number;
  dateOfBirth?: string;
  gender?: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  skinTypes: string[];
  concerns: string[];
  priceRange: [number, number];
  rating: number;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  search: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  products?: Product[];
}



