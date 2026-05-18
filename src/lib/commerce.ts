export const STORE_NAME = 'Glow Addict';
export const INSTAGRAM_HANDLE = '@GLOW_ADDICT_BY_SAYANITA';
export const INSTAGRAM_URL = 'https://www.instagram.com/glow_addict_by_sayanita';
export const WHATSAPP_NUMBER = '918509326600';
export const WHATSAPP_MESSAGE = 'Hi Glow Addict by Sayanita, I want to place an order.';
export const UPI_ID = 'sayanitapayra-1@okicici';
export const UPI_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(UPI_ID)}`;
export const SUPPORT_PHONE = '+91 85093 26600';
export const SUPPORT_EMAIL = 'sayanitapayra@gmail.com';
export const PAYMENT_POLICY = 'Online prepaid payments only. No COD. No EMI.';
export const MANUAL_PAYMENT_NOTE = 'Pay directly via UPI or QR. Razorpay UPI can be added as a gateway later.';

export const SHIPPING_FREE_THRESHOLD = 799;
export const SHIPPING_FLAT_FEE = 45;
export const DELIVERY_WINDOW_DAYS = '4-15 days';

export const FREEBIES = [
  { minOrder: 0, label: 'Free scrunchies with every order' },
  { minOrder: 999, label: 'Free Lakme Peach Milk Moisturiser' },
  { minOrder: 1299, label: 'Free lipstick' },
  { minOrder: 1499, label: 'Free samples or crochet items' },
] as const;

export function getShippingFee(subtotal: number) {
  return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT_FEE;
}

export function getRemainingForFreeShipping(subtotal: number) {
  return Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);
}

export function getEligibleFreebies(subtotal: number) {
  return FREEBIES.filter((freebie) => subtotal >= freebie.minOrder).map((freebie) => freebie.label);
}

export function buildWhatsAppMessage(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
