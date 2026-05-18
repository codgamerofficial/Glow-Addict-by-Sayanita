-- ============================================================
-- Glow Addict by Sayanita — Fixed Production Schema
-- ============================================================
-- Run this in Supabase SQL Editor to set up the complete database
-- Replace YOUR_PROJECT_ID with your actual Supabase project ID
-- ============================================================

-- ============================================================
-- STEP 1: Drop existing tables (for clean setup - optional)
-- ============================================================
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS search_recovery_tasks CASCADE;
DROP TABLE IF EXISTS search_trends CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS admin_banners CASCADE;
DROP TABLE IF EXISTS admin_collections CASCADE;

-- ============================================================
-- STEP 2: Create Tables
-- ============================================================

-- Brands
CREATE TABLE brands (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  parent_id TEXT REFERENCES categories(id),
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products (Fixed schema without problematic generated columns)
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_desc TEXT,
  brand_id TEXT REFERENCES brands(id),
  brand_name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  category_name TEXT NOT NULL,
  subcategory_name TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  mrp NUMERIC,
  sale_price NUMERIC,
  discount_percent INT DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  images TEXT[] DEFAULT '{}',
  sku TEXT UNIQUE,
  seo_title TEXT,
  seo_description TEXT,
  badges TEXT[] DEFAULT '{}',
  gender TEXT,
  benefits TEXT[] DEFAULT '{}',
  ingredients TEXT,
  how_to_use TEXT,
  skin_types TEXT[] DEFAULT '{}',
  concerns TEXT[] DEFAULT '{}',
  rating_avg NUMERIC DEFAULT 0,
  rating_count INT DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  weight_grams INT,
  stock_quantity INT DEFAULT 0,
  inventory_count INT DEFAULT 0,
  gst_percent NUMERIC DEFAULT 18,
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product Variants
CREATE TABLE product_variants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC,
  sale_price NUMERIC,
  stock_quantity INT DEFAULT 0,
  color_hex TEXT,
  size TEXT,
  image_url TEXT,
  sku TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  helpful_count INT DEFAULT 0,
  skin_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles
CREATE TABLE profiles (
  id TEXT PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  skin_type TEXT,
  skin_concerns TEXT[] DEFAULT '{}',
  loyalty_points INT DEFAULT 0,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES profiles(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'upi' CHECK (payment_method IN ('upi', 'cod', 'card')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'confirmed' CHECK (order_status IN ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  tracking_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cart Items
CREATE TABLE cart_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  variant_id TEXT REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wishlist Items
CREATE TABLE wishlist_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Banners
CREATE TABLE admin_banners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Collections
CREATE TABLE admin_collections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Search Trends
CREATE TABLE search_trends (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  query TEXT UNIQUE NOT NULL,
  search_count INT DEFAULT 0,
  last_results_count INT DEFAULT 0,
  intent TEXT DEFAULT 'general',
  top_product_id TEXT REFERENCES products(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Search Recovery Tasks
CREATE TABLE search_recovery_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  query TEXT UNIQUE NOT NULL,
  intent TEXT DEFAULT 'general',
  demand_hits INT DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'ignored')),
  last_results_count INT DEFAULT 0,
  suggested_product_ids TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'order')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- STEP 3: Create Indexes (Fixed - no problematic generated columns)
-- ============================================================
CREATE INDEX idx_products_category ON products(category_name);
CREATE INDEX idx_products_subcategory ON products(subcategory_name);
CREATE INDEX idx_products_brand ON products(brand_name);
CREATE INDEX idx_products_price ON products(sale_price);
CREATE INDEX idx_products_rating ON products(rating_avg DESC);
CREATE INDEX idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_stock ON products(stock_quantity) WHERE stock_quantity > 0;
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

-- Full text search index on text columns (no generated column)
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('simple', 
  COALESCE(name, '') || ' ' || 
  COALESCE(brand_name, '') || ' ' || 
  COALESCE(category_name, '') || ' ' || 
  COALESCE(subcategory_name, '') || ' ' ||
  COALESCE(description, '') || ' ' ||
  COALESCE(array_to_string(tags, ' '), '')
));

-- ============================================================
-- STEP 4: Create Functions
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STEP 5: Enable RLS on All Tables
-- ============================================================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_recovery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 6: Create RLS Policies
-- ============================================================

-- Public read for products, brands, categories (for all visitors)
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Public can view brands"
  ON brands FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can view banners"
  ON admin_banners FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Public can view collections"
  ON admin_collections FOR SELECT
  TO anon
  USING (is_active = true);

-- Product variants
CREATE POLICY "Public can view product variants"
  ON product_variants FOR SELECT
  TO anon
  USING (true);

-- Authenticated users can manage their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Orders - users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Cart - users can manage their own cart
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlist
CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items"
  ON wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items"
  ON wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Reviews
CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin policies (for service role - used by API routes)
CREATE POLICY "Service role can view all products"
  ON products FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert products"
  ON products FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update products"
  ON products FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete products"
  ON products FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage all orders"
  ON orders FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage all order items"
  ON order_items FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage banners"
  ON admin_banners FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage collections"
  ON admin_collections FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage search data"
  ON search_trends FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage search recovery"
  ON search_recovery_tasks FOR ALL
  TO service_role
  USING (true);

-- ============================================================
-- STEP 7: Create Storage Bucket & Policies
-- ============================================================
-- Run these in Supabase Dashboard > Storage or via SQL:

-- Note: Create bucket "Glow Addict Product Images" manually in Supabase Dashboard
-- Then run these policies:

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'Glow Addict Product Images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Service role can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ============================================================
-- STEP 8: Insert Sample Data
-- ============================================================

-- Insert Brands
INSERT INTO brands (id, name, slug, description, is_premium) VALUES
('brand-1', 'Dot & Key', 'dot-and-key', 'Playful skincare with high-performance actives', true),
('brand-2', 'Aqualogica', 'aqualogica', 'Glow-first hydration and sunscreen formulas', true),
('brand-3', 'Cetaphil', 'cetaphil', 'Dermatologist-trusted gentle skincare', true),
('brand-4', 'Plum', 'plum', 'Clean beauty with vegan actives', true),
('brand-5', 'WishCare', 'wishcare', 'Targeted care for skin and hair concerns', true),
('brand-6', 'Foxtale', 'foxtale', 'Modern Indian skincare with smart textures', true),
('brand-7', 'Dove', 'dove', 'Comforting care for skin and body', true),
('brand-8', 'Mars Cosmetics', 'mars-cosmetics', 'Trend-led makeup with bold payoff', true),
('brand-9', 'Chemist at Play', 'chemist-at-play', 'Science-backed bodycare essentials', true),
('brand-10', 'Good Vibes', 'good-vibes', 'Affordable daily glow products', false),
('brand-11', 'Insight', 'insight', 'Fashion-forward makeup staples', false),
('brand-12', 'Alps Goodness', 'alps-goodness', 'Natural beauty and hair rituals', false),
('brand-13', 'Mcaffeine', 'mcaffeine', 'Coffee-powered body and hair care', true),
('brand-14', 'Minimalist', 'minimalist', 'Science-backed skincare simplified', true),
('brand-15', 'Derma Co', 'derma-co', 'Dermatologist-formulated solutions', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
('cat-1', 'Facewash', 'facewash', 'Daily cleansers for fresh skin', '✨'),
('cat-2', 'Sunscreen', 'sunscreen', 'UV protection for all skin types', '☀️'),
('cat-3', 'Moisturizer', 'moisturizer', 'Hydration and skin barrier care', '💧'),
('cat-4', 'Serum', 'serum', 'Targeted treatments for skin concerns', '⚡'),
('cat-5', 'Body Mist', 'body-mist', 'Fresh fragrances for body', '🌸'),
('cat-6', 'Face Scrub', 'face-scrub', 'Exfoliation for smooth skin', '🌿'),
('cat-7', 'Lip Balm', 'lip-balm', 'Soft and nourished lips', '💋'),
('cat-8', 'Lip Gloss', 'lip-gloss', 'Glossy lip finishes', '✨'),
('cat-9', 'Face Mask', 'face-mask', 'Intensive skin treatments', '🎭'),
('cat-10', 'Sheet Mask', 'sheet-mask', 'Convenient sheet treatments', '📋'),
('cat-11', 'Strobe Cream', 'strobe-cream', 'Highlight and glow products', '💫'),
('cat-12', 'Night Cream', 'night-cream', 'Overnight skin recovery', '🌙'),
('cat-13', 'Body Scrub', 'body-scrub', 'Body exfoliation and smoothing', '🧽'),
('cat-14', 'Body Wash', 'body-wash', 'Cleansing for body', '🛁'),
('cat-15', 'Under Arm Roll On', 'under-arm-roll-on', 'Underarm care products', '💪'),
('cat-16', 'Nails', 'nails', 'Nail art and care', '💅'),
('cat-17', 'Combo', 'combo', 'Value sets and bundles', '🎁')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- COMPLETE PRODUCT INSERT STATEMENTS
-- Replace YOUR_BUCKET_URL with your actual Supabase storage URL
-- Format: https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/Glow%20Addict%20Product%20Images/
-- ============================================================

-- Delete existing products first
DELETE FROM products WHERE true;

-- Insert Products with Real Image URLs
INSERT INTO products (id, name, slug, description, short_desc, brand_id, brand_name, category_id, category_name, subcategory_name, price, mrp, sale_price, discount_percent, images, sku, badges, gender, benefits, ingredients, how_to_use, skin_types, concerns, rating_avg, rating_count, is_bestseller, is_new, is_trending, is_recommended, tags, stock_quantity, weight_grams) VALUES

-- FACEWASH PRODUCTS
('p1', 'Dot & Key Vitamin C + E Brightening Face Wash', 'dot-and-key-vitamin-c-e-brightening-face-wash',
'A brightening daily face wash with Vitamin C, Vitamin E and Kakadu Plum that gently removes impurities, supports a radiant complexion and keeps skin feeling fresh without stripping moisture.',
'Brightening daily cleanser with Vitamin C and E', 'brand-1', 'Dot & Key', 'cat-1', 'Facewash', 'Facewash',
349, 449, 349, 22,
ARRAY['https://YOUR_BUCKET_URL/dot-key-facewash.jpeg', 'https://YOUR_BUCKET_URL/dot-key-facewash-2.jpeg'],
'GA-DK-FW-001', ARRAY['Trending', 'Recommended'], 'unisex',
ARRAY['Supports brighter-looking skin', 'Cleanses without over-drying', 'Helps reduce dullness'],
'Vitamin C, Vitamin E, Kakadu Plum, Niacinamide, Glycerin',
'Massage on damp skin for 30-60 seconds, rinse well and follow with serum and moisturizer.',
ARRAY['Oily', 'Combination', 'Normal'], ARRAY['Dullness', 'Oiliness'],
4.6, 2840, true, false, true, true,
ARRAY['facewash', 'vitamin-c', 'brightening', 'cleanser'], 185, 100),

('p2', 'Aqualogica Glow+ Dewy Sunscreen SPF 50 PA++++', 'aqualogica-glow-plus-dewy-sunscreen-spf-50',
'A lightweight glow sunscreen with SPF 50 PA++++, hyaluronic hydration and no-white-cast finish designed for daily Indian weather and makeup layering.',
'Dewy broad-spectrum sunscreen with no white cast', 'brand-2', 'Aqualogica', 'cat-2', 'Sunscreen', 'Sunscreen',
499, 599, 499, 17,
ARRAY['https://YOUR_BUCKET_URL/aqualogica-sunscreen.jpeg', 'https://YOUR_BUCKET_URL/aqualogica-sunscreen-2.jpeg'],
'GA-AQ-SP-002', ARRAY['Bestseller', 'Trending'], 'unisex',
ARRAY['Broad-spectrum SPF protection', 'Leaves a dewy finish', 'Supports daily UV defence'],
'Sun filters, Hyaluronic Acid, Papaya Extract, Niacinamide',
'Apply liberally on face and neck 15 minutes before sun exposure and reapply every 2-3 hours.',
ARRAY['Dry', 'Combination', 'Normal'], ARRAY['Sun Damage', 'Dullness'],
4.8, 6210, true, false, true, true,
ARRAY['sunscreen', 'spf50', 'dewy', 'daily-essential'], 240, 50),

('p3', 'Cetaphil Gentle Skin Cleanser', 'cetaphil-gentle-skin-cleanser',
'A dermatologist-trusted gentle cleanser that removes dirt and makeup without disrupting the skin barrier. Ideal for sensitive and dry skin routines.',
'Ultra-gentle cleanser for sensitive skin', 'brand-3', 'Cetaphil', 'cat-1', 'Facewash', 'Facewash',
439, 529, 439, 17,
ARRAY['https://YOUR_BUCKET_URL/cetaphil-cleanser.jpeg', 'https://YOUR_BUCKET_URL/cetaphil-cleanser-2.jpeg'],
'GA-CE-FW-003', ARRAY['Recommended'], 'unisex',
ARRAY['Supports the skin barrier', 'Non-foaming and gentle', 'Great for daily cleansing'],
'Glycerin, Niacinamide, Panthenol, Purified Water',
'Use morning and night on damp skin, massage lightly and wipe or rinse off.',
ARRAY['Sensitive', 'Dry', 'Normal'], ARRAY['Redness', 'Dryness'],
4.7, 5012, true, false, false, true,
ARRAY['cleanser', 'gentle', 'sensitive-skin'], 150, 125),

('p4', 'Plum 15% Vitamin C Serum', 'plum-15-percent-vitamin-c-serum',
'A glow serum with 15% Vitamin C, ferulic acid and mandarin extract to help improve brightness, reduce the look of pigmentation and support a healthier-looking skin tone.',
'Glow serum with 15% Vitamin C and ferulic acid', 'brand-4', 'Plum', 'cat-4', 'Serum', 'Serum',
649, 799, 649, 19,
ARRAY['https://YOUR_BUCKET_URL/plum-vitamin-c-serum.jpeg', 'https://YOUR_BUCKET_URL/plum-vitamin-c-serum-2.jpeg'],
'GA-PL-SR-004', ARRAY['Bestseller', 'Trending'], 'unisex',
ARRAY['Supports visible glow', 'Helps fade dullness', 'Antioxidant support'],
'Vitamin C, Ferulic Acid, Mandarin Extract, Vitamin E',
'Apply 3-4 drops after cleansing and before moisturizer. Use SPF in the daytime.',
ARRAY['Oily', 'Combination', 'Normal'], ARRAY['Dullness', 'Pigmentation', 'Dark Spots'],
4.6, 3180, true, false, true, true,
ARRAY['serum', 'vitamin-c', 'brightening', 'antioxidant'], 210, 30),

('p5', 'WishCare 2% Hyaluronic Acid Gel Moisturizer', 'wishcare-2-percent-hyaluronic-acid-gel-moisturizer',
'A water-light gel moisturizer with 2% Hyaluronic Acid, ceramides and beta glucan that hydrates deeply while keeping the finish clean and breathable.',
'Gel moisturizer for weightless hydration', 'brand-5', 'WishCare', 'cat-3', 'Moisturizer', 'Moisturizer',
549, 699, 549, 21,
ARRAY['https://YOUR_BUCKET_URL/wishcare-hydra-moisturizer.jpeg', 'https://YOUR_BUCKET_URL/wishcare-hydra-moisturizer-2.jpeg'],
'GA-WC-MO-005', ARRAY['Recommended'], 'unisex',
ARRAY['Locks in hydration', 'Lightweight on oily skin', 'Supports the barrier'],
'Hyaluronic Acid, Ceramides, Beta Glucan, Panthenol',
'Apply after serum on slightly damp skin morning and night.',
ARRAY['Oily', 'Combination', 'Normal'], ARRAY['Dryness', 'Dehydration'],
4.5, 2470, false, false, true, true,
ARRAY['moisturizer', 'hydra', 'gel', 'daily-care'], 190, 50),

('p6', 'Foxtale Clarifying Toner Pads', 'foxtale-clarifying-toner-pads',
'A soothing clarifying toner formula with PHA, Niacinamide and green tea extract to refine texture, support pore care and prep the skin for actives.',
'Clarifying toner with gentle resurfacing acids', 'brand-6', 'Foxtale', 'cat-1', 'Facewash', 'Facewash',
649, 799, 649, 19,
ARRAY['https://YOUR_BUCKET_URL/foxtale-toner-pads.jpeg', 'https://YOUR_BUCKET_URL/foxtale-toner-pads-2.jpeg'],
'GA-FO-TN-006', ARRAY['Trending'], 'unisex',
ARRAY['Refines skin texture', 'Supports clearer-looking pores', 'Preps skin for serums'],
'PHA, Niacinamide, Green Tea Extract, Aloe Vera',
'Swipe after cleansing or pat on with cotton. Follow with serum and moisturizer.',
ARRAY['Oily', 'Combination', 'Normal'], ARRAY['Pores', 'Dullness', 'Uneven Texture'],
4.4, 1880, false, true, true, false,
ARRAY['toner', 'pha', 'clarifying', 'texture-care'], 145, 100),

('p7', 'Dot & Key Retinol + Ceramide Night Cream', 'dot-and-key-retinol-ceramide-night-cream',
'An overnight cream with encapsulated retinol and ceramides for a cushioned, luxe finish that supports renewal, barrier comfort and a smoother-looking complexion.',
'Barrier-first night cream with retinol', 'brand-1', 'Dot & Key', 'cat-12', 'Night Cream', 'Night Cream',
849, 999, 849, 15,
ARRAY['https://YOUR_BUCKET_URL/dot-key-night-cream.jpeg', 'https://YOUR_BUCKET_URL/dot-key-night-cream-2.jpeg'],
'GA-DK-NC-007', ARRAY['New Arrival', 'Recommended'], 'unisex',
ARRAY['Supports skin renewal', 'Helps smooth texture', 'Comforts the barrier overnight'],
'Encapsulated Retinol, Ceramides, Squalane, Shea Butter',
'Apply a pea-sized amount at night after cleansing. Start 2-3 times a week.',
ARRAY['Dry', 'Combination', 'Normal'], ARRAY['Aging', 'Dark Spots', 'Uneven Texture'],
4.5, 1765, false, true, true, true,
ARRAY['night-cream', 'retinol', 'ceramide', 'overnight'], 110, 50),

('p8', 'Good Vibes SPF 30 Rose Lip Balm', 'good-vibes-spf-30-rose-lip-balm',
'A softening lip balm with SPF 30, rose oil and shea butter that keeps lips comfortable, subtly tinted and protected throughout the day.',
'Tinted lip balm with SPF protection', 'brand-10', 'Good Vibes', 'cat-7', 'Lip Balm', 'Lip Balm',
229, 299, 229, 23,
ARRAY['https://YOUR_BUCKET_URL/good-vibes-lip-balm.jpeg', 'https://YOUR_BUCKET_URL/good-vibes-lip-balm-2.jpeg'],
'GA-GV-LB-008', ARRAY['Recommended'], 'unisex',
ARRAY['Softens dry lips', 'Adds a healthy tint', 'Supports sun protection'],
'Shea Butter, Rose Oil, Beeswax, Vitamin E',
'Swipe on lips whenever they feel dry or before stepping outdoors.',
ARRAY['Sensitive', 'Dry', 'Normal'], ARRAY['Dryness', 'Pigmentation'],
4.3, 1540, false, false, false, true,
ARRAY['lip-balm', 'spf', 'rose', 'lip-care'], 290, 10),

('p9', 'Plum Overnight Glow Face Mask', 'plum-overnight-glow-face-mask',
'A leave-on glow mask with ceramides, hyaluronic acid and enzyme exfoliation that cushions the skin with moisture while supporting a more even-looking tone.',
'Overnight mask for glow and barrier comfort', 'brand-4', 'Plum', 'cat-9', 'Face Mask', 'Face Mask',
699, 849, 699, 18,
ARRAY['https://YOUR_BUCKET_URL/plum-overnight-mask.jpeg', 'https://YOUR_BUCKET_URL/plum-overnight-mask-2.jpeg'],
'GA-PL-MK-009', ARRAY['Trending'], 'unisex',
ARRAY['Helps skin feel cushioned', 'Supports glow overnight', 'Comforts dry patches'],
'Ceramides, Hyaluronic Acid, Enzyme Complex, Squalane',
'Apply a thin layer at night as the final step in your routine. Rinse in the morning if needed.',
ARRAY['Dry', 'Normal', 'Combination'], ARRAY['Dullness', 'Dryness'],
4.4, 1285, false, true, true, false,
ARRAY['face-mask', 'overnight', 'glow', 'hydration'], 125, 75),

('p10', 'Mars Cosmetics Velvet Matte Lipstick', 'mars-cosmetics-velvet-matte-lipstick',
'A pigment-rich matte lipstick with a smooth glide, soft-focus finish and comfortable wear for Indian occasions, errands and evening looks.',
'High-pigment matte lipstick with luxe finish', 'brand-8', 'Mars Cosmetics', 'cat-8', 'Lip Gloss', 'Lip Gloss',
449, 599, 449, 25,
ARRAY['https://YOUR_BUCKET_URL/mars-lipstick.jpeg', 'https://YOUR_BUCKET_URL/mars-lipstick-2.jpeg'],
'GA-MC-LI-010', ARRAY['Bestseller', 'Trending'], 'women',
ARRAY['Bold one-swipe payoff', 'Comfortable matte finish', 'Smooth creamy glide'],
'Jojoba Oil, Vitamin E, Color Pigments, Shea Butter',
'Apply from center to corners. For a soft look, blur with fingertip.',
ARRAY['All'], ARRAY[],
4.5, 4125, true, false, true, true,
ARRAY['lipstick', 'matte', 'pigmented', 'makeup'], 320, 4),

('p11', 'Mars Cosmetics Precision Liquid Eyeliner', 'mars-cosmetics-precision-liquid-eyeliner',
'A quick-dry precision eyeliner with a fine tip, intense black payoff and a long-lasting finish for sharp wings and everyday definition.',
'Precision eyeliner with intense black payoff', 'brand-8', 'Mars Cosmetics', 'cat-16', 'Nails', 'Nails',
279, 349, 279, 20,
ARRAY['https://YOUR_BUCKET_URL/mars-eyeliner.jpeg', 'https://YOUR_BUCKET_URL/mars-eyeliner-2.jpeg'],
'GA-MC-EY-011', ARRAY['New Arrival'], 'women',
ARRAY['Sharp controlled lines', 'Quick-drying formula', 'Long-wearing finish'],
'Water, Carbon Black Pigments, Film Formers',
'Draw along the lash line and build thickness as desired.',
ARRAY['All'], ARRAY[],
4.4, 1980, false, true, true, false,
ARRAY['eyeliner', 'liquid', 'black', 'eye-makeup'], 360, 8),

('p12', 'Insight Volumizing Mascara', 'insight-volumizing-mascara',
'A volumizing mascara that coats lashes from root to tip, helping deliver a fuller, lifted look without clumps for day-to-night eye makeup.',
'Clump-free mascara for fuller lashes', 'brand-11', 'Insight', 'cat-16', 'Nails', 'Nails',
329, 399, 329, 18,
ARRAY['https://YOUR_BUCKET_URL/insight-mascara.jpeg', 'https://YOUR_BUCKET_URL/insight-mascara-2.jpeg'],
'GA-IN-MS-012', ARRAY['Bestseller'], 'women',
ARRAY['Buildable volume', 'Lifts the lash look', 'Easy everyday wear'],
'Water, Waxes, Volumizing Polymers, Carbon Black',
'Wiggle the brush from roots to tips and layer for more volume.',
ARRAY['All'], ARRAY[],
4.2, 3045, true, false, false, true,
ARRAY['mascara', 'volume', 'eye-makeup', 'lashes'], 280, 10),

('p13', 'Chemist at Play AHA Body Wash', 'chemist-at-play-aha-body-wash',
'A resurfacing body wash with AHAs and hydrating agents that cleanses the body while helping the skin feel smoother and more polished after showers.',
'Resurfacing body wash with AHAs', 'brand-9', 'Chemist at Play', 'cat-14', 'Body Wash', 'Body Wash',
429, 499, 429, 14,
ARRAY['https://YOUR_BUCKET_URL/chemist-body-wash.jpeg', 'https://YOUR_BUCKET_URL/chemist-body-wash-2.jpeg'],
'GA-CP-BW-013', ARRAY['Trending'], 'unisex',
ARRAY['Cleanses the body gently', 'Helps smoother-feeling skin', 'Supports a fresh shower finish'],
'AHA Blend, Glycerin, Aloe Vera, Panthenol',
'Massage onto wet skin in the shower, lather and rinse off.',
ARRAY['All'], ARRAY['Roughness', 'Dullness'],
4.5, 2225, false, false, true, true,
ARRAY['body-wash', 'aha', 'bodycare', 'shower'], 205, 250),

('p14', 'Dove Deep Moisture Body Wash', 'dove-deep-moisture-body-wash',
'A creamy shower wash with Dove''s comforting moisture care that leaves the skin feeling clean, soft and cushioned after every bath.',
'Creamy body wash for daily moisture care', 'brand-7', 'Dove', 'cat-14', 'Body Wash', 'Body Wash',
379, 449, 379, 16,
ARRAY['https://YOUR_BUCKET_URL/dove-body-wash.jpeg', 'https://YOUR_BUCKET_URL/dove-body-wash-2.jpeg'],
'GA-DV-BW-014', ARRAY['Recommended'], 'unisex',
ARRAY['Leaves skin feeling soft', 'Comforting creamy lather', 'Good for daily showers'],
'Moisture Serum, Glycerin, Cleansing Agents, Fragrance',
'Apply on wet skin with hands or loofah and rinse thoroughly.',
ARRAY['Dry', 'Normal'], ARRAY['Dryness'],
4.6, 4820, true, false, false, true,
ARRAY['body-wash', 'moisture', 'daily-care'], 260, 250),

('p15', 'Mcaffeine Coffee Body Scrub', 'mcaffeine-coffee-body-scrub',
'A caffeine-rich body scrub with coffee granules and nourishing oils that helps smooth rough patches and support a refreshed post-shower feel.',
'Coffee scrub for smoother-feeling skin', 'brand-13', 'Mcaffeine', 'cat-13', 'Body Scrub', 'Body Scrub',
469, 549, 469, 15,
ARRAY['https://YOUR_BUCKET_URL/mcaffeine-scrub.jpeg', 'https://YOUR_BUCKET_URL/mcaffeine-scrub-2.jpeg'],
'GA-MC-BS-015', ARRAY['Bestseller', 'Trending'], 'unisex',
ARRAY['Supports smoother texture', 'Coffee-driven exfoliation', 'Leaves a refreshed feel'],
'Coffee Arabica, Walnut Shell Powder, Coconut Oil, Vitamin E',
'Massage onto damp skin 2-3 times a week and rinse well.',
ARRAY['All'], ARRAY['Roughness', 'Dullness'],
4.7, 3965, true, false, true, true,
ARRAY['scrub', 'coffee', 'bodycare', 'exfoliation'], 220, 200),

('p16', 'Good Vibes Rose Mist Body Spray', 'good-vibes-rose-mist-body-spray',
'A light floral body mist with rose and musk notes for daily layering, quick refreshes and a soft feminine scent profile.',
'Fresh floral mist for everyday layering', 'brand-10', 'Good Vibes', 'cat-5', 'Body Mist', 'Body Mist',
279, 349, 279, 20,
ARRAY['https://YOUR_BUCKET_URL/good-vibes-body-mist.jpeg', 'https://YOUR_BUCKET_URL/good-vibes-body-mist-2.jpeg'],
'GA-GV-BM-016', ARRAY['New Arrival'], 'women',
ARRAY['Light scent layering', 'Freshens up fast', 'Easy to wear daily'],
'Rose Accord, Musk Notes, Alcohol Denat., Aqua',
'Spray on pulse points or over clothes from a short distance.',
ARRAY['All'], ARRAY[],
4.2, 1750, false, true, true, false,
ARRAY['body-mist', 'perfume', 'rose', 'fresh'], 195, 100),

('p17', 'WishCare Hair Growth Serum', 'wishcare-hair-growth-serum',
'A scalp-focused serum with peptides, rosemary and caffeine designed to support a healthy-feeling scalp environment and stronger-looking strands.',
'Scalp serum for stronger-looking hair', 'brand-5', 'WishCare', 'cat-4', 'Serum', 'Serum',
649, 799, 649, 19,
ARRAY['https://YOUR_BUCKET_URL/wishcare-hair-serum.jpeg', 'https://YOUR_BUCKET_URL/wishcare-hair-serum-2.jpeg'],
'GA-WC-HS-017', ARRAY['Bestseller', 'Recommended'], 'unisex',
ARRAY['Supports scalp care', 'Lightweight and non-greasy', 'Designed for regular use'],
'Rosemary Extract, Caffeine, Peptides, Niacinamide',
'Apply directly to the scalp, massage in and leave overnight or for a few hours.',
ARRAY[], ARRAY['Hair Fall', 'Thinning'],
4.5, 3320, true, false, true, true,
ARRAY['hair-serum', 'growth', 'scalp-care'], 165, 30),

('p18', 'Alps Goodness Rosemary Strengthening Shampoo', 'alps-goodness-rosemary-strengthening-shampoo',
'A strengthening shampoo with rosemary, biotin and amino acids for a fresh cleanse that keeps hair feeling clean, light and easy to style.',
'Strengthening shampoo with rosemary', 'brand-12', 'Alps Goodness', 'cat-1', 'Facewash', 'Facewash',
379, 449, 379, 16,
ARRAY['https://YOUR_BUCKET_URL/alps-shampoo.jpeg', 'https://YOUR_BUCKET_URL/alps-shampoo-2.jpeg'],
'GA-AG-SH-018', ARRAY['Recommended'], 'unisex',
ARRAY['Cleanses the scalp', 'Supports stronger-looking hair', 'Fresh daily wash'],
'Rosemary, Biotin, Amino Acids, Mild Cleansers',
'Massage into scalp and lengths, rinse thoroughly and repeat if needed.',
ARRAY[], ARRAY['Hair Fall', 'Oiliness'],
4.3, 2140, false, false, false, true,
ARRAY['shampoo', 'rosemary', 'haircare'], 175, 250),

('p19', 'Foxtale Soft Repair Conditioner', 'foxtale-soft-repair-conditioner',
'A smoothing conditioner with nourishing lipids and proteins to help soften dry lengths, reduce tangles and support a shinier finish.',
'Smoothing conditioner for soft lengths', 'brand-6', 'Foxtale', 'cat-3', 'Moisturizer', 'Moisturizer',
429, 499, 429, 14,
ARRAY['https://YOUR_BUCKET_URL/foxtale-conditioner.jpeg', 'https://YOUR_BUCKET_URL/foxtale-conditioner-2.jpeg'],
'GA-FO-CO-019', ARRAY['Trending'], 'unisex',
ARRAY['Detangles easily', 'Adds softness', 'Helps reduce frizz'],
'Hydrolyzed Protein, Lipids, Shea Butter, Glycerin',
'Use after shampoo on mid-lengths and ends. Leave for a few minutes and rinse.',
ARRAY[], ARRAY['Frizz', 'Dryness'],
4.4, 1595, false, true, true, false,
ARRAY['conditioner', 'smoothing', 'haircare'], 140, 250),

('p20', 'Dove Intensive Repair Shampoo', 'dove-intensive-repair-shampoo',
'A creamy repair shampoo designed to clean gently while helping hair feel smoother, softer and easier to manage after each wash.',
'Repair shampoo for smoother hair', 'brand-7', 'Dove', 'cat-1', 'Facewash', 'Facewash',
379, 449, 379, 16,
ARRAY['https://YOUR_BUCKET_URL/dove-shampoo.jpeg', 'https://YOUR_BUCKET_URL/dove-shampoo-2.jpeg'],
'GA-DV-SH-020', ARRAY['Bestseller'], 'unisex',
ARRAY['Gently cleanses', 'Supports smoothness', 'Works for daily washing'],
'Nutri-Serum, Glycerin, Mild Surfactants, Fragrance',
'Massage into scalp and rinse clean. Use with conditioner for best results.',
ARRAY[], ARRAY['Dryness', 'Damage'],
4.6, 4740, true, false, false, true,
ARRAY['shampoo', 'repair', 'daily-care'], 250, 340),

('p21', 'Insight Makeup Blender Sponge', 'insight-makeup-blender-sponge',
'A soft, bouncy makeup blender sponge that helps press in foundation, concealer and cream products for a smoother blended finish.',
'Soft sponge for seamless blending', 'brand-11', 'Insight', 'cat-16', 'Nails', 'Nails',
229, 299, 229, 23,
ARRAY['https://YOUR_BUCKET_URL/insight-blender-sponge.jpeg', 'https://YOUR_BUCKET_URL/insight-blender-sponge-2.jpeg'],
'GA-IN-TL-021', ARRAY['Recommended'], 'women',
ARRAY['Blends cream and liquid makeup', 'Helps a skin-like finish', 'Easy to clean and reuse'],
NULL,
'Dampen the sponge and bounce product onto the face for even application.',
ARRAY['All'], ARRAY[],
4.4, 2410, false, false, false, true,
ARRAY['tool', 'sponge', 'beauty-blender', 'makeup'], 340, 25),

('p22', 'Alps Goodness Detangling Hair Brush', 'alps-goodness-detangling-hair-brush',
'A cushioned detangling brush that glides through knots with less tugging, making it a practical daily tool for blow-dry or air-dry routines.',
'Detangling brush for smooth brushing', 'brand-12', 'Alps Goodness', 'cat-16', 'Nails', 'Nails',
329, 399, 329, 18,
ARRAY['https://YOUR_BUCKET_URL/alps-hair-brush.jpeg', 'https://YOUR_BUCKET_URL/alps-hair-brush-2.jpeg'],
'GA-AG-TL-022', ARRAY['New Arrival'], 'unisex',
ARRAY['Glides through knots', 'Suitable for everyday brushing', 'Comfortable cushioned base'],
NULL,
'Brush gently from ends upward and work through tangles in sections.',
ARRAY[], ARRAY[],
4.5, 980, false, true, true, false,
ARRAY['tool', 'hair-brush', 'detangling'], 210, 80),

('p23', 'WishCare Rose Quartz Face Roller', 'wishcare-rose-quartz-face-roller',
'A cooling face roller designed to be used on clean skin or over sheet masks for a calm spa-like ritual that fits beautifully into a daily skincare routine.',
'Cooling face roller for spa-style rituals', 'brand-5', 'WishCare', 'cat-16', 'Nails', 'Nails',
549, 649, 549, 15,
ARRAY['https://YOUR_BUCKET_URL/wishcare-face-roller.jpeg', 'https://YOUR_BUCKET_URL/wishcare-face-roller-2.jpeg'],
'GA-WC-TL-023', ARRAY['Recommended'], 'unisex',
ARRAY['Makes skincare feel spa-like', 'Useful for gentle massage', 'Great alongside masks and serums'],
NULL,
'Roll gently from the center of the face outward after applying serum or moisturizer.',
ARRAY['All'], ARRAY[],
4.3, 720, false, false, false, true,
ARRAY['tool', 'face-roller', 'spa', 'cooling'], 135, 120),

('p24', 'Mcaffeine Chill Ice Roller', 'mcaffeine-chill-ice-roller',
'An ice roller built for a refreshing morning ritual. Keep it chilled and glide it over clean skin for an energizing, cool-touch beauty step.',
'Ice roller for a refreshed morning ritual', 'brand-13', 'Mcaffeine', 'cat-16', 'Nails', 'Nails',
649, 799, 649, 19,
ARRAY['https://YOUR_BUCKET_URL/mcaffeine-ice-roller.jpeg', 'https://YOUR_BUCKET_URL/mcaffeine-ice-roller-2.jpeg'],
'GA-MC-TL-024', ARRAY['Trending'], 'unisex',
ARRAY['Cools and refreshes', 'Supports a spa-style routine', 'Easy daily tool'],
NULL,
'Store in the fridge and glide gently over clean skin when needed.',
ARRAY['All'], ARRAY[],
4.4, 650, false, true, true, false,
ARRAY['tool', 'ice-roller', 'cooling', 'spa'], 120, 140)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  short_desc = EXCLUDED.short_desc,
  brand_id = EXCLUDED.brand_id,
  brand_name = EXCLUDED.brand_name,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  subcategory_name = EXCLUDED.subcategory_name,
  price = EXCLUDED.price,
  mrp = EXCLUDED.mrp,
  sale_price = EXCLUDED.sale_price,
  discount_percent = EXCLUDED.discount_percent,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  badges = EXCLUDED.badges,
  gender = EXCLUDED.gender,
  benefits = EXCLUDED.benefits,
  ingredients = EXCLUDED.ingredients,
  how_to_use = EXCLUDED.how_to_use,
  skin_types = EXCLUDED.skin_types,
  concerns = EXCLUDED.concerns,
  rating_avg = EXCLUDED.rating_avg,
  rating_count = EXCLUDED.rating_count,
  is_bestseller = EXCLUDED.is_bestseller,
  is_new = EXCLUDED.is_new,
  is_trending = EXCLUDED.is_trending,
  is_recommended = EXCLUDED.is_recommended,
  tags = EXCLUDED.tags,
  stock_quantity = EXCLUDED.stock_quantity,
  weight_grams = EXCLUDED.weight_grams,
  updated_at = now();

-- ============================================================
-- STEP 9: Insert Admin Banners (No fake offers)
-- ============================================================
DELETE FROM admin_banners WHERE true;

INSERT INTO admin_banners (id, title, subtitle, image_url, link_url, is_active, sort_order) VALUES
('banner-1', 'Glow Addict Beauty', 'Premium Beauty Essentials', 'https://YOUR_BUCKET_URL/hero-banner-1.jpeg', '/products', true, 1),
('banner-2', 'Skincare Essentials', 'Curated for Indian Skin', 'https://YOUR_BUCKET_URL/hero-banner-2.jpeg', '/products?category=sunscreen', true, 2),
('banner-3', 'Makeup Collection', 'Trend-Led Beauty', 'https://YOUR_BUCKET_URL/hero-banner-3.jpeg', '/products?category=lip-gloss', true, 3),
('banner-4', 'Body Care', 'Daily Rituals', 'https://YOUR_BUCKET_URL/hero-banner-4.jpeg', '/products?category=body-wash', true, 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 10: Insert Admin Collections
-- ============================================================
DELETE FROM admin_collections WHERE true;

INSERT INTO admin_collections (id, name, slug, description, is_active, count) VALUES
('col-1', 'Bestsellers', 'bestsellers', 'Top-rated products loved by customers', true, 8),
('col-2', 'New Arrivals', 'new-arrivals', 'Fresh launches and latest drops', true, 5),
('col-3', 'Trending', 'trending', 'What everyone is talking about', true, 6),
('col-4', 'Under 500', 'under-500', 'Budget-friendly picks under Rs.500', true, 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check products count
-- SELECT count(*) FROM products;

-- Check categories
-- SELECT * FROM categories ORDER BY name;

-- Check products by subcategory
-- SELECT subcategory_name, count(*) FROM products GROUP BY subcategory_name ORDER BY count(*) DESC;

-- Check products with images
-- SELECT name, images FROM products WHERE array_length(images, 1) > 0 LIMIT 10;

-- ============================================================
-- NOTES FOR USER:
-- ============================================================
-- 1. Replace YOUR_BUCKET_URL with your actual Supabase storage URL
-- 2. Format: https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/Glow%20Addict%20Product%20Images/
-- 3. Make sure your images are uploaded to the "Glow Addict Product Images" bucket
-- 4. Images should be public (or service role can access them)
-- 5. Run this entire script in Supabase SQL Editor
-- ============================================================