-- ========================================
-- Glow Addict — CMS Seed Data
-- ========================================

-- CMS Banners
INSERT INTO cms_banners (title, subtitle, image_url, link_url, display_order) VALUES
('Your Skin. Your Glow.', 'Personalized AI beauty routines for your unique skin.', 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=1200&h=400&fit=crop', '/products', 1),
('K-Beauty Essentials', 'Discover the secret to glass skin with our curated collection.', 'https://images.unsplash.com/photo-1556228578-00c1443685e1?w=1200&h=400&fit=crop', '/products?category=skincare', 2),
('Summer Glow Sale', 'Up to 40% off on all sunscreens and hydrators.', 'https://images.unsplash.com/photo-1526045612212-70caf35c11bc?w=1200&h=400&fit=crop', '/products', 3)
ON CONFLICT DO NOTHING;

-- CMS Collections
INSERT INTO cms_collections (name, slug, description, display_order) VALUES
('Summer Essentials', 'summer-essentials', 'Lightweight hydrators and SPF favorites.', 1),
('K-Beauty Picks', 'k-beauty-picks', 'Curated secrets from the heart of Seoul.', 2),
('Budget Friendly Under ₹499', 'budget-friendly', 'Quality beauty that doesn''t break the bank.', 3),
('Bridal Glow Kit', 'bridal-glow', 'Everything you need for your special day.', 4)
ON CONFLICT (slug) DO NOTHING;

-- Initial Settings
-- Note: contact_email should match NEXT_PUBLIC_CONTACT_EMAIL environment variable
INSERT INTO settings (id, store_name, contact_email, contact_phone) VALUES
('global', 'Glow Addict', 'hello@glowaddict.com', '+91 98765 43210')
ON CONFLICT (id) DO NOTHING;