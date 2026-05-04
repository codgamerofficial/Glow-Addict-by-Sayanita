-- ========================================
-- Glow Addict by Sayanita — Seed Data
-- Run this AFTER schema.sql
-- ========================================

-- Categories
INSERT INTO categories (id, name, slug, description, icon, product_count) VALUES
('cat-1', 'Skincare', 'skincare', 'Serums, moisturizers, sunscreens & more', '🧴', 45),
('cat-2', 'Makeup', 'makeup', 'Lipsticks, foundations, palettes & more', '💄', 38),
('cat-3', 'Hair Care', 'hair-care', 'Shampoos, masks, oils & treatments', '✨', 22),
('cat-4', 'Fragrances', 'fragrances', 'Perfumes, body mists & attars', '🌸', 18),
('cat-5', 'Bath & Body', 'bath-body', 'Body washes, lotions & scrubs', '🛁', 24),
('cat-6', 'Wellness', 'wellness', 'Supplements, teas & wellness essentials', '💊', 15)
ON CONFLICT (id) DO NOTHING;

-- Brands
INSERT INTO brands (id, name, slug, logo_url, description) VALUES
('brand-1', 'Glow Lab', 'glow-lab', '', 'Premium Korean-inspired skincare'),
('brand-2', 'Velvet Kiss', 'velvet-kiss', '', 'Luxury matte makeup'),
('brand-3', 'Luxe Skin', 'luxe-skin', '', 'Clinical-grade actives'),
('brand-4', 'AquaPure', 'aquapure', '', 'Hydration-focused skincare'),
('brand-5', 'SunShield', 'sunshield', '', 'Advanced sun protection'),
('brand-6', 'Aura Hair', 'aura-hair', '', 'Professional hair treatments'),
('brand-7', 'Flora Essence', 'flora-essence', '', 'Natural fragrance house'),
('brand-8', 'Petal Soft', 'petal-soft', '', 'Gentle body care')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, slug, description, short_desc, brand_id, category_id, price, sale_price, currency, images, skin_types, concerns, rating_avg, rating_count, is_bestseller, is_new, tags, weight_grams, stock_quantity, ingredients, how_to_use) VALUES
('p1', 'Vitamin C Brightening Serum', 'vitamin-c-brightening-serum',
  'A powerful 20% Vitamin C serum with Hyaluronic Acid and Ferulic Acid that visibly brightens, firms, and evens skin tone.',
  '20% Vitamin C + Hyaluronic Acid for radiant, even-toned skin',
  'brand-1', 'cat-1', 1299, 899, 'INR',
  ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'],
  ARRAY['Oily','Dry','Combination','Normal'], ARRAY['Dark Spots','Dullness','Aging'],
  4.6, 2847, true, false,
  ARRAY['bestseller','vitamin-c','brightening','serum'], 30, 150,
  'Ascorbic Acid (Vitamin C) 20%, Hyaluronic Acid, Ferulic Acid, Vitamin E, Aloe Vera Extract',
  'Apply 3-4 drops on clean, damp skin. Follow with moisturizer and SPF in the morning.'
),
('p2', 'Hydra Boost Gel Moisturizer', 'hydra-boost-gel-moisturizer',
  'An oil-free, water-based gel moisturizer that provides 72-hour hydration with Hyaluronic Acid complex.',
  '72-hour hydration gel with Hyaluronic Acid',
  'brand-4', 'cat-1', 799, 599, 'INR',
  ARRAY['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop'],
  ARRAY['Oily','Combination','Normal'], ARRAY['Dryness','Dullness'],
  4.4, 1923, true, false,
  ARRAY['moisturizer','hydration','gel','oil-free'], 50, 200, NULL, NULL
),
('p3', 'Matte Velvet Lipstick - Rose Nude', 'matte-velvet-lipstick-rose-nude',
  'A creamy matte lipstick with intense color payoff that lasts up to 12 hours.',
  'Long-lasting matte lipstick enriched with Vitamin E',
  'brand-2', 'cat-2', 599, 449, 'INR',
  ARRAY['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
  ARRAY['All'], ARRAY[],
  4.7, 3156, true, false,
  ARRAY['lipstick','matte','bestseller','lip'], 4, 300, NULL, NULL
),
('p4', 'Niacinamide 10% + Zinc', 'niacinamide-10-zinc',
  'A concentrated niacinamide serum that targets blemishes, congested pores, and uneven skin texture.',
  'Oil control + pore minimizer for clear skin',
  'brand-3', 'cat-1', 599, 449, 'INR',
  ARRAY['https://images.unsplash.com/photo-1570194065650-d99fb4a4b7e6?w=600&h=600&fit=crop'],
  ARRAY['Oily','Combination'], ARRAY['Acne','Pores','Oiliness'],
  4.8, 4201, true, false,
  ARRAY['niacinamide','pore-control','serum','acne'], 30, 180, NULL, NULL
),
('p5', 'Ultra-Light SPF 50+ Sunscreen', 'ultra-light-spf-50-sunscreen',
  'A weightless, invisible sunscreen that provides broad-spectrum SPF 50+ PA++++ protection.',
  'Zero white cast SPF 50+ for Indian skin',
  'brand-5', 'cat-1', 649, 499, 'INR',
  ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
  ARRAY['All','Oily','Normal','Combination','Dry','Sensitive'], ARRAY['Sun Damage','Aging'],
  4.9, 5872, true, false,
  ARRAY['sunscreen','spf','bestseller','daily-essential'], 50, 250, NULL, NULL
),
('p6', 'Retinol Night Repair Cream', 'retinol-night-repair-cream',
  'An advanced night cream with encapsulated Retinol 0.5% for anti-aging results without irritation.',
  'Anti-aging night cream with 0.5% Retinol',
  'brand-1', 'cat-1', 1499, 1099, 'INR',
  ARRAY['https://images.unsplash.com/photo-1617897903246-719242758050?w=600&h=600&fit=crop'],
  ARRAY['All','Combination','Normal','Dry'], ARRAY['Aging','Wrinkles','Dark Spots'],
  4.5, 1567, false, true,
  ARRAY['retinol','anti-aging','night-cream','new'], 50, 120, NULL, NULL
),
('p7', 'AHA BHA Exfoliating Toner', 'aha-bha-exfoliating-toner',
  'A chemical exfoliant with 7% Glycolic Acid + 2% Salicylic Acid for smooth, refined skin texture.',
  'Chemical exfoliant for smoother, brighter skin',
  'brand-3', 'cat-1', 699, NULL, 'INR',
  ARRAY['https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&h=600&fit=crop'],
  ARRAY['Oily','Combination','Normal'], ARRAY['Acne','Dullness','Uneven Texture'],
  4.3, 987, false, true,
  ARRAY['exfoliant','aha','bha','toner','new'], 200, 160, NULL, NULL
),
('p8', 'Keratin Hair Repair Mask', 'keratin-hair-repair-mask',
  'An intensive hair mask with Keratin + Argan Oil that repairs damage and restores silky smoothness.',
  'Deep repair mask for damaged, frizzy hair',
  'brand-6', 'cat-3', 899, 699, 'INR',
  ARRAY['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop'],
  ARRAY[], ARRAY[],
  4.4, 1234, false, false,
  ARRAY['hair-mask','keratin','repair','hair'], 200, 140, NULL, NULL
),
('p9', 'Rose Gold Highlighter', 'rose-gold-highlighter',
  'A buttery-soft highlighter that delivers a luminous, wet-look glow.',
  'Buildable rose gold shimmer highlighter',
  'brand-2', 'cat-2', 499, NULL, 'INR',
  ARRAY['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'],
  ARRAY['All'], ARRAY[],
  4.6, 2341, false, true,
  ARRAY['highlighter','shimmer','glow','makeup','new'], 8, 200, NULL, NULL
),
('p10', 'Jasmine & Oud Eau de Parfum', 'jasmine-oud-eau-de-parfum',
  'A luxurious blend of Indian Jasmine and Cambodian Oud.',
  'Oriental floral perfume lasting 8+ hours',
  'brand-7', 'cat-4', 1999, 1499, 'INR',
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop'],
  ARRAY[], ARRAY[],
  4.7, 876, false, true,
  ARRAY['perfume','oud','jasmine','luxury','new'], 50, 80, NULL, NULL
),
('p11', 'Coconut Milk Body Butter', 'coconut-milk-body-butter',
  'A rich, whipped body butter with Coconut Milk and Shea Butter for intense moisturization.',
  'Ultra-rich moisturizing body butter',
  'brand-8', 'cat-5', 549, 399, 'INR',
  ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'],
  ARRAY['Dry','Normal'], ARRAY['Dryness'],
  4.5, 1567, false, false,
  ARRAY['body-butter','moisturizer','coconut'], 200, 180, NULL, NULL
),
('p12', 'Volumizing Mascara - Jet Black', 'volumizing-mascara-jet-black',
  'A fiber-infused mascara that delivers dramatic volume and length without clumping.',
  '10X volume + length waterproof mascara',
  'brand-2', 'cat-2', 399, NULL, 'INR',
  ARRAY['https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop'],
  ARRAY['All'], ARRAY[],
  4.3, 2089, false, false,
  ARRAY['mascara','volume','eye-makeup','waterproof'], 10, 250, NULL, NULL
)
ON CONFLICT (id) DO NOTHING;

-- Reviews
INSERT INTO reviews (id, user_id, user_name, product_id, rating, title, body, is_verified, helpful_count, skin_type, created_at) VALUES
('r1', 'u1', 'Priya S.', 'p1', 5, 'Holy grail serum!', 'My dark spots faded within 3 weeks. Texture is so lightweight and absorbs quickly. Absolutely love it!', true, 45, 'Oily', '2026-04-15'),
('r2', 'u2', 'Ananya M.', 'p1', 4, 'Great but mild tingling', 'Works well for brightening. Felt a slight tingle first few uses but skin adjusted. Visible improvement in glow.', true, 23, 'Combination', '2026-04-10'),
('r3', 'u3', 'Kavya R.', 'p4', 5, 'Pores literally disappeared!', 'After 4 weeks my pores look so much smaller and my skin is less oily. Best niacinamide serum I have tried.', true, 67, 'Oily', '2026-04-08'),
('r4', 'u4', 'Diya P.', 'p5', 5, 'No white cast finally!', 'I have dark skin and this sunscreen leaves zero white cast. Light, not greasy, and works under makeup perfectly.', true, 89, 'Normal', '2026-04-01'),
('r5', 'u5', 'Shruti K.', 'p3', 5, 'Perfect nude shade', 'The shade Rose Nude is universally flattering. Creamy formula, no cracking, and lasts through meals!', true, 34, 'Dry', '2026-03-28'),
('r6', 'u6', 'Meera J.', 'p2', 4, 'Best gel moisturizer!', 'Perfect for Mumbai humidity. Lightweight, absorbs fast, and keeps skin hydrated without feeling heavy.', true, 29, 'Oily', '2026-03-20')
ON CONFLICT (id) DO NOTHING;
