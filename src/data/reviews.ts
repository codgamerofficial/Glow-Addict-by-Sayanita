import { Review } from '@/types/product';

export const reviews: Review[] = [
  { id: 'r1', userId: 'u1', userName: 'Priya S.', productId: 'p1', rating: 5, title: 'Holy grail serum!', body: 'My dark spots faded within 3 weeks. Texture is so lightweight and absorbs quickly. Absolutely love it!', isVerified: true, helpfulCount: 45, skinType: 'Oily', createdAt: '2026-04-15' },
  { id: 'r2', userId: 'u2', userName: 'Ananya M.', productId: 'p1', rating: 4, title: 'Great but mild tingling', body: 'Works well for brightening. Felt a slight tingle first few uses but skin adjusted. Visible improvement in glow.', isVerified: true, helpfulCount: 23, skinType: 'Combination', createdAt: '2026-04-10' },
  { id: 'r3', userId: 'u3', userName: 'Kavya R.', productId: 'p4', rating: 5, title: 'Pores literally disappeared!', body: 'After 4 weeks my pores look so much smaller and my skin is less oily. Best niacinamide serum I have tried.', isVerified: true, helpfulCount: 67, skinType: 'Oily', createdAt: '2026-04-08' },
  { id: 'r4', userId: 'u4', userName: 'Diya P.', productId: 'p5', rating: 5, title: 'No white cast finally!', body: 'I have dark skin and this sunscreen leaves zero white cast. Light, not greasy, and works under makeup perfectly.', isVerified: true, helpfulCount: 89, skinType: 'Normal', createdAt: '2026-04-01' },
  { id: 'r5', userId: 'u5', userName: 'Shruti K.', productId: 'p3', rating: 5, title: 'Perfect nude shade', body: 'The shade Rose Nude is universally flattering. Creamy formula, no cracking, and lasts through meals!', isVerified: true, helpfulCount: 34, skinType: 'Dry', createdAt: '2026-03-28' },
  { id: 'r6', userId: 'u6', userName: 'Meera J.', productId: 'p2', rating: 4, title: 'Best gel moisturizer!', body: 'Perfect for Mumbai humidity. Lightweight, absorbs fast, and keeps skin hydrated without feeling heavy.', isVerified: true, helpfulCount: 29, skinType: 'Oily', createdAt: '2026-03-20' },
];
