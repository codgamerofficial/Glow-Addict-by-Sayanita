export interface AdminBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  image_url?: string;
  isActive?: boolean;
  is_active?: boolean;
  link?: string;
  linkUrl?: string;
  display_order?: number;
  position?: number;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
  count?: number; // Calculated field
  createdAt?: string;
  created_at?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  status: 'sent' | 'scheduled' | 'draft';
  targetSegment?: string;
  target?: string;
  scheduledAt?: string;
  scheduled_at?: string;
  sentAt?: string;
  sent_at?: string;
  createdAt?: string;
  created_at?: string;
  openRate?: number;
  open_rate?: number;
  clickRate?: number;
  click_rate?: number;
  type?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  country?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerId?: string;
  user_id?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  status: string;
  createdAt: string;
  paymentStatus?: string;
  paymentMethod?: string;
  codDepositAmount?: number | null;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
  isCOD?: boolean;
  internalNotes?: string[];
  statusHistory?: { status: string; timestamp: string }[];
  packedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  refundStatus?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  status: string;
  sku?: string;
  approvalStatus?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  images?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isAIRecommended?: boolean;
  barcode?: string;
  taxPercent?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  warehouseLocation?: string;
  lowStockAlert?: number;
  benefits?: string[];
  aiSkinMatchTags?: string[];
  aiRecommendedSkinTypes?: string[];
  aiRoutineMapping?: string;
  spf?: number;
  gender?: string;
}

export interface AdminSetting {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, unknown> | null;
  description?: string;
}

export interface AuditLog {
  id: string;
  adminId?: string;
  adminName: string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  timestamp: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'fixed' | 'free_shipping' | 'bogo';
  value: number;
  isActive?: boolean;
  is_active?: boolean;
  minOrderAmount?: number;
  min_order_amount?: number;
  usedCount?: number;
  used_count?: number;
  usageLimit?: number;
  usage_limit?: number;
  expiresAt?: string;
  expires_at?: string;
  createdAt?: string;
  created_at?: string;
  maxDiscount?: number;
  max_discount?: number;
  perUserLimit?: number;
  per_user_limit?: number;
  isFirstTimeOnly?: boolean;
  is_first_time_only?: boolean;
  startsAt?: string;
  starts_at?: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVIP?: boolean;
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  wishlistCount?: number;
  skinType?: string;
  skinConcerns?: string[];
  lastOrderDate?: string;
  joinedAt?: string;
  created_at?: string;
  tags?: string[];
  notes?: string[];
  supportTickets?: string[];
}

export interface AdminInfluencer {
  id: string;
  name: string;
  handle: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | string;
  followers: number;
  engagementRate?: number;
  engagement_rate?: number;
  totalSales?: number;
  total_sales?: number;
  commissionRate?: number;
  commission_rate?: number;
  totalEarnings?: number;
  total_earnings?: number;
  avatarUrl?: string;
  avatar_url?: string;
  status: string;
  campaigns?: string[];
  joinedAt?: string;
  email?: string;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySalesData {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
  trend: number;
}

export interface AdminDashboardStats {
  totalRevenue: number;
  revenueTrend: number;
  totalOrders: number;
  ordersTrend: number;
  totalCustomers: number;
  customersTrend: number;
  conversionRate: number;
  conversionTrend: number;
  avgOrderValue: number;
  aovTrend: number;
  repeatCustomerRate: number;
  pendingOrders: number;
  lowStockItems: number;
  refundRequests: number;
}

export interface AdminRecommendation {
  id: string;
  userId?: string;
  user_id?: string;
  productId?: string;
  product_id?: string;
  productName?: string;
  type?: string;
  status: 'approved' | 'pending' | 'rejected' | string;
  confidence: number;
  products?: string[];
  explanation?: string;
  skin_types?: string[];
  skinTypes?: string[];
  routine_type?: string;
  routineType?: string;
  created_at?: string;
  createdAt?: string;
  timestamp?: string;
  tags?: string[];
}

export interface AdminInventoryItem {
  id: string;
  name: string;
  brandName: string;
  categoryName: string;
  images: string[];
  stockQuantity: number;
  lowStockThreshold?: number;
  sku: string;
}

export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
  created_at?: string;
}

export interface AdminUserWithRole {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  role: AdminRole | null;
  created_at?: string;
}
