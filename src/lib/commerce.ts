export const STORE_NAME = 'Glow Addict';
export const INSTAGRAM_HANDLE = '@GLOW_ADDICT_BY_SAYANITA';
export const INSTAGRAM_URL = 'https://www.instagram.com/glow_addict_by_sayanita';
export const WHATSAPP_NUMBER = '8617897185';
export const WHATSAPP_MESSAGE = 'Hi Glow Addict, I want to order this product.';
export const UPI_ID = 'sayanitapayra-1@okicici';
export const UPI_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(UPI_ID)}`;
export const MANUAL_PAYMENT_NOTE = 'Manual UPI and QR only. No payment gateway integrations are used.';
export const COD_PARTIAL_RATE = 0.2;
export const COD_MIN_DEPOSIT = 199;

export const COD_SERVICEABLE_PINCODE_PREFIXES = [
  '110',
  '121',
  '122',
  '201',
  '208',
  '226',
  '302',
  '400',
  '401',
  '410',
  '421',
  '500',
  '560',
  '600',
  '700',
  '711',
  '712',
  '713',
  '721',
  '743',
  '781',
  '800',
];

export function isPincodeServiceable(pincode: string) {
  const normalized = pincode.trim();
  if (!/^\d{6}$/.test(normalized)) {
    return false;
  }

  return COD_SERVICEABLE_PINCODE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function getPartialCodDeposit(total: number) {
  return Math.max(COD_MIN_DEPOSIT, Math.round(total * COD_PARTIAL_RATE));
}

export function buildWhatsAppMessage(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
