export interface Order {
  id: string;
  orderNumber: string;
  userId?: string; // null for guest
  status: 'pending' | 'pending_payment' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'verified' | 'failed';
  paymentMethod: 'upi';
  transactionId?: string;
  screenshotUrl?: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  items: CartItemWithProduct[];
  createdAt: string;
  // Customer details for guest/checkout
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface CartItemWithProduct {
  id: string;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
    salePrice?: number;
  };
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: CartItemWithProduct[];
  subtotal: number;
  total: number;
  shippingFee: number;
  paymentMethod: 'upi';
  transactionId?: string;
  screenshotUrl?: string;
  shippingAddress: ShippingAddress;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  error?: string;
}
