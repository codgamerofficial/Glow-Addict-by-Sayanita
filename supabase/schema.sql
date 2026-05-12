-- ============================================================
-- Glow Addict by Sayanita — Supabase Schema
-- ============================================================

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  is_premium BOOLEAN DEFAULT false
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  icon TEXT NOT NULL,
  parent_id TEXT REFERENCES categories(id),
  product_count INT DEFAULT 0
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_desc TEXT,
  brand_id TEXT REFERENCES brands(id),
  brand_name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  category_name TEXT NOT NULL,
  subcategory_name TEXT,
  price NUMERIC NOT NULL,
  mrp NUMERIC,
  sale_price NUMERIC,
  discount_percent INT DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  images TEXT[] NOT NULL DEFAULT '{}',
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
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
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
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
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

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled','processing','packed','returned','cod_pending','pending_payment')),
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('upi', 'cod')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
  cod_deposit_amount NUMERIC DEFAULT 0,
  transaction_id TEXT,
  screenshot_url TEXT,
  tracking_number TEXT,
  shipping_address JSONB,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  gender TEXT,
  skin_type TEXT,
  pincode TEXT,
  total_orders INT DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  marketing_opt_in BOOLEAN DEFAULT true,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Manual UPI payment records
CREATE TABLE IF NOT EXISTS upi_payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  upi_id TEXT NOT NULL,
  transaction_id TEXT,
  screenshot_url TEXT,
  payment_reference TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Uploaded payment screenshots
CREATE TABLE IF NOT EXISTS payment_screenshots (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  file_size INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory movements
CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('stock_in', 'stock_out', 'adjustment', 'reserved', 'release')),
  quantity INT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL,
  price NUMERIC NOT NULL,
  total NUMERIC NOT NULL
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_upi_payments_order ON upi_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_movements(product_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read brands" ON brands;
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read reviews" ON reviews;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- ============================================================
-- Admin Specific Tables
-- ============================================================

-- Admin Roles
CREATE TABLE IF NOT EXISTS admin_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  role_id TEXT REFERENCES admin_roles(id),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value NUMERIC NOT NULL,
  min_order_amount NUMERIC,
  usage_limit INT,
  used_count INT DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Influencers
CREATE TABLE IF NOT EXISTS influencers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('instagram', 'youtube', 'other')),
  status TEXT DEFAULT 'active',
  followers INT DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  commission_rate NUMERIC DEFAULT 0,
  total_sales INT DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT REFERENCES products(id),
  routine_type TEXT,
  skin_types TEXT[] DEFAULT '{}',
  confidence NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  admin_id TEXT REFERENCES admin_users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- CMS Banners
CREATE TABLE IF NOT EXISTS cms_banners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CMS Collections
CREATE TABLE IF NOT EXISTS cms_collections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications (Push/Email Campaigns)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_segment TEXT DEFAULT 'all',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  open_rate NUMERIC DEFAULT 0,
  click_rate NUMERIC DEFAULT 0,
  created_by TEXT REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Store Settings
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  store_name TEXT DEFAULT 'Glow Addict',
  store_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  currency TEXT DEFAULT 'INR',
  logo_url TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for CMS & Settings
ALTER TABLE cms_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read for CMS (needed for homepage)
DROP POLICY IF EXISTS "Public read banners" ON cms_banners;
CREATE POLICY "Public read banners" ON cms_banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read collections" ON cms_collections;
CREATE POLICY "Public read collections" ON cms_collections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  skin_type TEXT,
  loyalty_points INT DEFAULT 0,
  skin_concerns TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
