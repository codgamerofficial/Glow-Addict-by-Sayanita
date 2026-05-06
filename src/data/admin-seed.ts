import { AdminDashboardStats, RevenueDataPoint, CategorySalesData, TopProduct, AdminOrder, AdminCustomer, AdminCoupon, AdminInfluencer, AdminNotification, AdminRecommendation, AuditLog, AdminProduct, AdminBanner } from '@/types/admin';

// ── Dashboard Stats ────────────────────────────────────────
export const dashboardStats: AdminDashboardStats = {
  totalRevenue: 2847560, revenueTrend: 18.3,
  totalOrders: 3842, ordersTrend: 8.7,
  totalCustomers: 12450, customersTrend: 15.2,
  conversionRate: 3.8, conversionTrend: 0.5,
  avgOrderValue: 741, aovTrend: -2.1,
  pendingOrders: 47, lowStockItems: 12, refundRequests: 8, repeatCustomerRate: 34.2,
};

// ── Revenue (30 days) ──────────────────────────────────────
export const revenueData: RevenueDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - 29 + i);
  return { date: d.toISOString().split('T')[0], revenue: 60000 + Math.floor(Math.random() * 80000), orders: 80 + Math.floor(Math.random() * 100) };
});

// ── Category Sales ─────────────────────────────────────────
export const categorySalesData: CategorySalesData[] = [
  { name: 'Skincare', value: 42, color: '#E91E8C' },
  { name: 'Makeup', value: 28, color: '#7C3AED' },
  { name: 'Hair Care', value: 12, color: '#F59E0B' },
  { name: 'Fragrances', value: 8, color: '#10B981' },
  { name: 'Bath & Body', value: 6, color: '#3B82F6' },
  { name: 'Tools', value: 4, color: '#EC4899' },
];

// ── Top Products ───────────────────────────────────────────
export const topProducts: TopProduct[] = [
  { id: 'p1', name: 'Vitamin C Brightening Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop', unitsSold: 2847, revenue: 2558553, trend: 15.3 },
  { id: 'p5', name: 'Sunscreen SPF 50+ PA++++', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop', unitsSold: 2340, revenue: 1284660, trend: 22.1 },
  { id: 'p4', name: 'Niacinamide 10% + Zinc Serum', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38030?w=80&h=80&fit=crop', unitsSold: 1890, revenue: 847710, trend: 8.7 },
  { id: 'p3', name: 'Matte Velvet Lipstick - Rose Nude', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=80&h=80&fit=crop', unitsSold: 1650, revenue: 1153500, trend: -3.2 },
  { id: 'p8', name: 'Salicylic Acid Face Wash', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop', unitsSold: 1420, revenue: 424580, trend: 11.4 },
];

// ── Orders ─────────────────────────────────────────────────
const statuses: AdminOrder['status'][] = ['pending','processing','packed','shipped','delivered','cancelled','returned'];
const names = ['Priya Sharma','Ananya Gupta','Riya Patel','Sneha Reddy','Kavya Nair','Aisha Khan','Meera Joshi','Divya Singh','Pooja Verma','Tanvi Mehta','Sakshi Rao','Neha Kapoor','Ishita Das','Ritika Bose','Sana Mirza','Aditi Chopra','Nisha Iyer','Shreya Menon','Pallavi Kumar','Tara Malhotra'];

export const adminOrders: AdminOrder[] = Array.from({ length: 50 }, (_, i) => {
  const status = statuses[i % 7];
  const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 30));
  const subtotal = 500 + Math.floor(Math.random() * 4000);
  const name = names[i % names.length];
  return {
    id: `ord-${1000 + i}`, orderNumber: `GA-${10000 + i}`, status,
    items: [{ id: `oi-${i}`, productId: `p${(i % 24) + 1}`, productName: 'Product', productImage: '', quantity: 1 + (i % 3), price: subtotal, total: subtotal }],
    subtotal, discount: Math.floor(subtotal * 0.1), shippingFee: subtotal > 999 ? 0 : 49, tax: Math.floor(subtotal * 0.05), total: Math.floor(subtotal * 0.95),
    paymentMethod: i % 3 === 0 ? 'COD' : i % 3 === 1 ? 'UPI' : 'Card', paymentStatus: status === 'cancelled' ? 'refunded' : 'paid',
    shippingAddress: { fullName: name, phone: '9876543210', line1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India' },
    createdAt: d.toISOString(), customerEmail: `${name.split(' ')[0].toLowerCase()}@email.com`, customerName: name,
    isCOD: i % 3 === 0, internalNotes: [], statusHistory: [{ status, timestamp: d.toISOString() }],
    packedAt: ['packed','shipped','delivered'].includes(status) ? d.toISOString() : undefined,
    shippedAt: ['shipped','delivered'].includes(status) ? d.toISOString() : undefined,
    deliveredAt: status === 'delivered' ? d.toISOString() : undefined,
    trackingNumber: ['shipped','delivered'].includes(status) ? `TRK${100000 + i}` : undefined,
    refundStatus: status === 'returned' ? 'processing' : 'none',
  };
});

// ── Customers ──────────────────────────────────────────────
export const adminCustomers: AdminCustomer[] = names.map((name, i) => ({
  id: `cust-${i}`, email: `${name.split(' ')[0].toLowerCase()}@email.com`, name,
  phone: `98765${43210 + i}`, loyaltyPoints: Math.floor(Math.random() * 5000),
  skinType: ['Oily','Dry','Combination','Sensitive','Normal'][i % 5],
  skinConcerns: ['Acne','Dark Spots','Aging','Dullness'].slice(0, (i % 3) + 1),
  totalOrders: 1 + Math.floor(Math.random() * 20), totalSpent: 1000 + Math.floor(Math.random() * 50000),
  lastOrderDate: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  tags: i % 3 === 0 ? ['VIP'] : [], notes: [], supportTickets: [],
  wishlistCount: Math.floor(Math.random() * 15), isVIP: i % 5 === 0,
  joinedAt: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString(),
}));

// ── Coupons ────────────────────────────────────────────────
export const adminCoupons: AdminCoupon[] = [
  { id: 'c1', code: 'GLOW20', type: 'percentage', value: 20, description: '20% off on all skincare', minOrderAmount: 599, maxDiscount: 500, applicableCategories: ['Skincare'], applicableProducts: [], usageLimit: 1000, usedCount: 347, perUserLimit: 2, isFirstTimeOnly: false, startsAt: '2026-05-01', expiresAt: '2026-05-31', isActive: true, createdAt: '2026-04-28' },
  { id: 'c2', code: 'FIRST100', type: 'fixed', value: 100, description: '₹100 off for new users', minOrderAmount: 499, applicableCategories: [], applicableProducts: [], usageLimit: 5000, usedCount: 1203, perUserLimit: 1, isFirstTimeOnly: true, startsAt: '2026-01-01', expiresAt: '2026-12-31', isActive: true, createdAt: '2026-01-01' },
  { id: 'c3', code: 'FREESHIP', type: 'free_shipping', value: 0, description: 'Free shipping on orders above ₹299', minOrderAmount: 299, applicableCategories: [], applicableProducts: [], usageLimit: 10000, usedCount: 4521, perUserLimit: 5, isFirstTimeOnly: false, startsAt: '2026-04-01', expiresAt: '2026-06-30', isActive: true, createdAt: '2026-03-28' },
  { id: 'c4', code: 'BOGO50', type: 'bogo', value: 50, description: 'Buy 1 Get 1 at 50% off on lipsticks', applicableCategories: ['Makeup'], applicableProducts: [], usageLimit: 500, usedCount: 89, perUserLimit: 1, isFirstTimeOnly: false, startsAt: '2026-05-01', expiresAt: '2026-05-15', isActive: true, createdAt: '2026-04-28' },
  { id: 'c5', code: 'SUMMER30', type: 'percentage', value: 30, description: 'Summer sale 30% off sunscreens', minOrderAmount: 399, maxDiscount: 300, applicableCategories: ['Skincare'], applicableProducts: [], usageLimit: 2000, usedCount: 0, perUserLimit: 1, isFirstTimeOnly: false, startsAt: '2026-06-01', expiresAt: '2026-06-30', isActive: false, createdAt: '2026-05-01' },
];

// ── Influencers ────────────────────────────────────────────
export const adminInfluencers: AdminInfluencer[] = [
  { id: 'inf1', name: 'Kritika Khurana', email: 'kritika@email.com', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', platform: 'instagram', handle: '@thatbohogirl', followers: 1800000, engagementRate: 4.2, commissionRate: 12, totalSales: 234, totalEarnings: 45600, status: 'active', campaigns: [], joinedAt: '2025-06-15' },
  { id: 'inf2', name: 'Shreya Jain', email: 'shreya@email.com', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', platform: 'youtube', handle: '@ShreyaJain', followers: 2400000, engagementRate: 5.8, commissionRate: 15, totalSales: 567, totalEarnings: 123400, status: 'active', campaigns: [], joinedAt: '2025-03-10' },
  { id: 'inf3', name: 'Malvika Sitlani', email: 'malvika@email.com', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', platform: 'multiple', handle: '@malvikasitlani', followers: 950000, engagementRate: 3.9, commissionRate: 10, totalSales: 189, totalEarnings: 28500, status: 'active', campaigns: [], joinedAt: '2025-08-22' },
  { id: 'inf4', name: 'Debasree Banerjee', email: 'debasree@email.com', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop', platform: 'youtube', handle: '@DebasreeBanerjee', followers: 1200000, engagementRate: 6.1, commissionRate: 12, totalSales: 312, totalEarnings: 67800, status: 'active', campaigns: [], joinedAt: '2025-04-05' },
  { id: 'inf5', name: 'Ankita Ghosh', email: 'ankita@email.com', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop', platform: 'instagram', handle: '@ankita.beauty', followers: 380000, engagementRate: 7.3, commissionRate: 8, totalSales: 78, totalEarnings: 9800, status: 'pending', campaigns: [], joinedAt: '2026-04-01' },
];

// ── Notifications ──────────────────────────────────────────
export const adminNotifications: AdminNotification[] = [
  { id: 'n1', title: '🌟 Flash Sale Live!', body: 'Up to 50% off on premium skincare. Ends in 24 hours!', type: 'offer', target: 'all', status: 'sent', sentAt: '2026-05-05T10:00:00Z', openRate: 28.5, clickRate: 12.3, createdAt: '2026-05-04' },
  { id: 'n2', title: '📦 Your order is on its way!', body: 'Track your order GA-10042 in real-time', type: 'order_update', target: 'individual', status: 'sent', sentAt: '2026-05-05T14:30:00Z', openRate: 72.1, clickRate: 45.6, createdAt: '2026-05-05' },
  { id: 'n3', title: '🔥 Back in Stock!', body: 'Vitamin C Serum is back! Grab yours before it sells out again.', type: 'restock', target: 'segment', targetSegment: 'wishlist_vitamin_c', status: 'scheduled', scheduledAt: '2026-05-07T09:00:00Z', createdAt: '2026-05-06' },
  { id: 'n4', title: '✨ Personalized for you', body: 'Based on your skin type, we recommend these 3 products', type: 'recommendation', target: 'segment', targetSegment: 'oily_skin', status: 'draft', createdAt: '2026-05-06' },
];

// ── AI Recommendations ─────────────────────────────────────
export const adminAIRecommendations: AdminRecommendation[] = [
  { id: 'ai1', productId: 'p1', productName: 'Vitamin C Brightening Serum', skinTypes: ['Oily','Combination'], routineType: 'morning', tags: ['brightening','antioxidant'], confidence: 0.94, status: 'approved', createdAt: '2026-05-01' },
  { id: 'ai2', productId: 'p4', productName: 'Niacinamide 10% + Zinc Serum', skinTypes: ['Oily'], routineType: 'both', tags: ['oil-control','pore-minimizing'], confidence: 0.91, status: 'approved', createdAt: '2026-05-01' },
  { id: 'ai3', productId: 'p6', productName: 'Retinol Night Cream 0.5%', skinTypes: ['Dry','Normal'], routineType: 'evening', tags: ['anti-aging','renewal'], confidence: 0.87, status: 'pending', createdAt: '2026-05-03' },
  { id: 'ai4', productId: 'p5', productName: 'Sunscreen SPF 50+ PA++++', skinTypes: ['Oily','Dry','Combination','Sensitive','Normal'], routineType: 'morning', tags: ['sun-protection','daily-essential'], confidence: 0.98, status: 'approved', createdAt: '2026-05-01' },
  { id: 'ai5', productId: 'p17', productName: 'Tea Tree Anti-Acne Serum', skinTypes: ['Oily','Combination'], routineType: 'evening', tags: ['acne-treatment','spot-care'], confidence: 0.82, status: 'pending', createdAt: '2026-05-05' },
];

// ── Audit Logs ─────────────────────────────────────────────
export const adminAuditLogs: AuditLog[] = [
  { id: 'al1', adminId: 'admin1', adminName: 'Sayanita', action: 'update', entity: 'product', entityId: 'p1', changes: { salePrice: { old: 999, new: 899 } }, timestamp: '2026-05-06T10:30:00Z' },
  { id: 'al2', adminId: 'admin1', adminName: 'Sayanita', action: 'create', entity: 'coupon', entityId: 'c5', timestamp: '2026-05-06T09:15:00Z' },
  { id: 'al3', adminId: 'admin2', adminName: 'Riya', action: 'update', entity: 'order', entityId: 'ord-1005', changes: { status: { old: 'processing', new: 'shipped' } }, timestamp: '2026-05-06T08:45:00Z' },
  { id: 'al4', adminId: 'admin1', adminName: 'Sayanita', action: 'login', entity: 'auth', timestamp: '2026-05-06T08:00:00Z' },
  { id: 'al5', adminId: 'admin3', adminName: 'Priya', action: 'export', entity: 'customers', timestamp: '2026-05-05T16:30:00Z' },
];

// ── Banners ────────────────────────────────────────────────
export const adminBanners: AdminBanner[] = [
  { id: 'b1', title: 'Summer Glow Sale', subtitle: 'Up to 50% off on sunscreens', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=400&fit=crop', linkUrl: '/products?category=skincare', position: 1, isActive: true },
  { id: 'b2', title: 'New Arrivals', subtitle: 'Check out the latest in K-Beauty', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop', linkUrl: '/products?sort=newest', position: 2, isActive: true },
  { id: 'b3', title: 'Lipstick Festival', subtitle: 'Buy 2 Get 1 Free', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&h=400&fit=crop', linkUrl: '/products?category=makeup', position: 3, isActive: false },
];

// ── Admin Products (extended from existing) ────────────────
export const adminProductExtensions: Partial<AdminProduct>[] = [
  { id: 'p1', sku: 'GA-SK-001', barcode: '8901234567890', taxPercent: 12, metaTitle: 'Best Vitamin C Serum in India', metaDescription: 'Shop Glow Lab Vitamin C Brightening Serum with 20% Ascorbic Acid', keywords: ['vitamin c serum','brightening serum','glow serum'], approvalStatus: 'approved', warehouseLocation: 'WH-MUM-01', lowStockAlert: 20, isFeatured: true, isTrending: true, isAIRecommended: true, gender: 'unisex', benefits: ['Brightens skin','Reduces dark spots','Anti-aging'], aiSkinMatchTags: ['brightening','antioxidant'], aiRecommendedSkinTypes: ['Oily','Combination','Normal'], aiRoutineMapping: 'morning' },
  { id: 'p4', sku: 'GA-SK-004', taxPercent: 12, approvalStatus: 'approved', warehouseLocation: 'WH-MUM-01', lowStockAlert: 25, isFeatured: true, isTrending: false, isAIRecommended: true, gender: 'unisex', benefits: ['Controls oil','Minimizes pores','Smooths texture'], aiSkinMatchTags: ['oil-control','pore-care'], aiRecommendedSkinTypes: ['Oily','Combination'], aiRoutineMapping: 'both', keywords: [] },
  { id: 'p5', sku: 'GA-SK-005', taxPercent: 12, approvalStatus: 'approved', warehouseLocation: 'WH-MUM-01', lowStockAlert: 30, isFeatured: true, isTrending: true, isAIRecommended: true, gender: 'unisex', spf: 50, benefits: ['SPF 50+ protection','No white cast','Lightweight'], aiSkinMatchTags: ['sun-protection'], aiRecommendedSkinTypes: ['Oily','Dry','Combination','Sensitive','Normal'], aiRoutineMapping: 'morning', keywords: [] },
];
