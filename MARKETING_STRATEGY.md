# Glow Addict — Marketing Strategy & Product Catalog Guide

> **Version:** 1.0 | **Last Updated:** May 2026 | **Prepared for:** Design & Marketing Teams
> **Brand Owner:** Sayanita | **Platform:** Next.js 16 + Supabase (Vercel)

---

## Table of Contents

1. [Product Categories Overview](#1-product-categories-overview)
2. [Visual Merchandising Guide](#2-visual-merchandising-guide)
3. [Website Navigation Architecture](#3-website-navigation-architecture)
4. [Combo Products & Bundling Strategy](#4-combo-products--bundling-strategy)
5. [Free Scrunchies Promotion Strategy](#5-free-scrunchies-promotion-strategy)
6. [Content Pillars for Instagram & TikTok](#6-content-pillars-for-instagram--tiktok)
7. [Implementation Notes for the Development Team](#7-implementation-notes-for-the-development-team)

---

## 1. Product Categories Overview

### Complete Inventory Summary

Glow Addict carries **32 SKUs** across **5 top-level categories** and **13 brands**. All products are priced in INR and ship within India via COD (partial deposit) and manual UPI.

| # | Category | Slug | Icon | Product Count | Subcategories | Key Brands |
|---|----------|------|------|:---:|---------------|------------|
| 1 | **Skincare** | `skincare` | ✨ | 13 | Facewash, Sunscreen, Serum, Moisturizer, Toner, Night Cream, Lip Balm, Face Mask | Dot & Key, Aqualogica, Cetaphil, Plum, WishCare, Foxtale, Good Vibes |
| 2 | **Makeup** | `makeup` | 💄 | 4 | Lipstick, Eyeliner, Mascara, Lip Gloss | Mars Cosmetics, Insight |
| 3 | **Bodycare** | `bodycare` | 🛁 | 6 | Body Wash, Body Scrub, Body Mist | Chemist at Play, Dove, Mcaffeine, Good Vibes |
| 4 | **Haircare** | `haircare` | 💇‍♀️ | 4 | Shampoo, Conditioner, Hair Serum | WishCare, Alps Goodness, Foxtale, Dove |
| 5 | **Tools** | `tools` | 🪞 | 4 | Beauty Blender, Hair Brush, Face Roller, Ice Roller | Insight, Alps Goodness, WishCare, Mcaffeine |

### Full Product Catalog

#### SKINCARE (13 products)

| SKU | Product | Brand | Subcategory | Price (₹) | MRP | Discount | Rating | Badges |
|-----|---------|-------|-------------|:---------:|:---:|:--------:|:------:|--------|
| GA-DK-FW-001 | Vitamin C + E Brightening Face Wash | Dot & Key | Facewash | 349 | 449 | 22% | ⭐ 4.6 (2,840) | Trending, Recommended |
| GA-AQ-SP-002 | Glow+ Dewy Sunscreen SPF 50 PA++++ | Aqualogica | Sunscreen | 499 | 599 | 17% | ⭐ 4.8 (6,210) | Bestseller, Trending |
| GA-CE-FW-003 | Gentle Skin Cleanser | Cetaphil | Facewash | 439 | 529 | 17% | ⭐ 4.7 (5,012) | Recommended |
| GA-PL-SR-004 | 15% Vitamin C Serum | Plum | Serum | 649 | 799 | 19% | ⭐ 4.6 (3,180) | Bestseller, Trending |
| GA-WC-MO-005 | 2% Hyaluronic Acid Gel Moisturizer | WishCare | Moisturizer | 549 | 699 | 21% | ⭐ 4.5 (2,470) | Trending |
| GA-FO-TN-006 | Clarifying Toner Pads | Foxtale | Toner | 649 | 799 | 14% | ⭐ 4.4 (1,880) | New, Trending |
| GA-DK-NC-007 | Retinol + Ceramide Night Cream | Dot & Key | Night Cream | 849 | 999 | 15% | ⭐ 4.5 (1,765) | New Arrival, Recommended |
| GA-GV-LB-008 | SPF 30 Rose Lip Balm | Good Vibes | Lip Balm | 229 | 299 | 23% | ⭐ 4.3 (1,540) | Recommended |
| GA-PL-MK-009 | Overnight Glow Face Mask | Plum | Face Mask | 699 | 849 | 18% | ⭐ 4.4 (1,285) | New, Trending |
| — | *2 more skincare TBD from DB seed* | — | — | — | — | — | — | — |

#### MAKEUP (4 products)

| SKU | Product | Brand | Subcategory | Price (₹) | MRP | Discount | Rating | Badges |
|-----|---------|-------|-------------|:---------:|:---:|:--------:|:------:|--------|
| GA-MC-LI-010 | Velvet Matte Lipstick | Mars Cosmetics | Lipstick | 449 | 599 | 25% | ⭐ 4.5 (4,125) | Bestseller, Trending |
| GA-MC-EY-011 | Precision Liquid Eyeliner | Mars Cosmetics | Eyeliner | 279 | 349 | 20% | ⭐ 4.4 (1,980) | New Arrival |
| GA-IN-MS-012 | Volumizing Mascara | Insight | Mascara | 329 | 399 | 18% | ⭐ 4.2 (3,045) | Bestseller |
| — | *1 more makeup TBD from DB seed* | — | — | — | — | — | — | — |

#### BODYCARE (6 products)

| SKU | Product | Brand | Subcategory | Price (₹) | MRP | Discount | Rating | Badges |
|-----|---------|-------|-------------|:---------:|:---:|:--------:|:------:|--------|
| GA-CP-BW-013 | AHA Body Wash | Chemist at Play | Body Wash | 429 | 499 | 14% | ⭐ 4.5 (2,225) | Trending |
| GA-DV-BW-014 | Deep Moisture Body Wash | Dove | Body Wash | 379 | 449 | 16% | ⭐ 4.6 (4,820) | Bestseller |
| GA-MC-BS-015 | Coffee Body Scrub | Mcaffeine | Scrub | 469 | 549 | 15% | ⭐ 4.7 (3,965) | Bestseller, Trending |
| GA-GV-BM-016 | Rose Mist Body Spray | Good Vibes | Body Mist | 279 | 349 | 20% | ⭐ 4.2 (1,750) | New Arrival |
| — | *2 more bodycare TBD from DB seed* | — | — | — | — | — | — | — |

#### HAIRCARE (4 products)

| SKU | Product | Brand | Subcategory | Price (₹) | MRP | Discount | Rating | Badges |
|-----|---------|-------|-------------|:---------:|:---:|:--------:|:------:|--------|
| GA-WC-HS-017 | Hair Growth Serum | WishCare | Hair Serum | 649 | 799 | 19% | ⭐ 4.5 (3,320) | Bestseller |
| GA-AG-SH-018 | Rosemary Strengthening Shampoo | Alps Goodness | Shampoo | 379 | 449 | 16% | ⭐ 4.3 (2,140) | Recommended |
| GA-FO-CO-019 | Soft Repair Conditioner | Foxtale | Conditioner | 429 | 499 | 14% | ⭐ 4.4 (1,595) | New, Trending |
| GA-DV-SH-020 | Intensive Repair Shampoo | Dove | Shampoo | 379 | 449 | 15% | ⭐ 4.6 (4,740) | Bestseller |

#### TOOLS (4 products)

| SKU | Product | Brand | Subcategory | Price (₹) | MRP | Discount | Rating | Badges |
|-----|---------|-------|-------------|:---------:|:---:|:--------:|:------:|--------|
| GA-IN-TL-021 | Makeup Blender Sponge | Insight | Beauty Blender | 229 | 299 | 23% | ⭐ 4.4 (2,410) | Recommended |
| GA-AG-TL-022 | Detangling Hair Brush | Alps Goodness | Hair Brush | 329 | 399 | 18% | ⭐ 4.5 (980) | New Arrival |
| GA-WC-TL-023 | Rose Quartz Face Roller | WishCare | Face Roller | 549 | 649 | 15% | ⭐ 4.3 (720) | Recommended |
| GA-MC-TL-024 | Chill Ice Roller | Mcaffeine | Ice Roller | 649 | 799 | 15% | ⭐ 4.4 (650) | New, Trending |

#### COMBO PRODUCTS (3 combos)

| SKU | Combo Name | Price (₹) | MRP | Savings | Rating |
|-----|-----------|:---------:|:---:|:-------:|:------:|
| GA-COMBO-030 | Morning Glow Ritual (Face Wash + Serum + Moisturizer + Sunscreen) | 1,699 | 2,100 | ~19% | ⭐ 4.6 |
| GA-COMBO-031 | Self-Care Sunday Set (Face Mask + Face Scrub + Body Scrub + Body Mist) | 1,599 | 1,850 | ~25% | ⭐ 4.7 |
| GA-COMBO-032 | Complete Lip Love Kit (Lip Balm + Lip Gloss) | 499 | 598 | ~15% | ⭐ 4.5 |

### Brand Portfolio

| Brand | Slug | Positioning | Tier |
|-------|------|-------------|------|
| Dot & Key | `dot-and-key` | Playful skincare with high-performance actives | Premium |
| Aqualogica | `aqualogica` | Glow-first hydration and sunscreen formulas | Premium |
| Cetaphil | `cetaphil` | Dermatologist-trusted gentle skincare | Premium |
| Plum | `plum` | Clean beauty with vegan actives | Premium |
| WishCare | `wishcare` | Targeted care for skin and hair concerns | Premium |
| Foxtale | `foxtale` | Modern Indian skincare with smart textures | Premium |
| Dove | `dove` | Comforting care for skin and body | Premium |
| Mars Cosmetics | `mars-cosmetics` | Trend-led makeup with bold payoff | Premium |
| Chemist at Play | `chemist-at-play` | Science-backed bodycare essentials | Premium |
| Good Vibes | `good-vibes` | Affordable daily glow products | Value |
| Insight | `insight` | Fashion-forward makeup staples | Value |
| Alps Goodness | `alps-goodness` | Natural beauty and hair rituals | Value |
| Mcaffeine | `mcaffeine` | Coffee-powered body and hair care | Premium |

### Pricing Landscape

- **Price Range:** ₹229 – ₹849 (single products)
- **Sweet Spot:** ₹349 – ₹649 (highest volume)
- **Entry-Level:** Under ₹300 (Good Vibes, Insight tools)
- **Premium:** Over ₹699 (Dot & Key serums, night creams, combos)
- **Discount Depth:** 14%–25% off MRP across catalog

---

## 2. Visual Merchandising Guide

### Brand Aesthetic & Vibe

**Glow Addict** is positioned as a premium-yet-approachable Indian beauty destination. The visual identity blends:

- **Primary Palette:** Deep berry pink (`#F51F7B`), warm gold (`#FFD447`), purple (`#7A2CFF`)
- **Mood:** Confident, warm, radiant — "your skin, your glow"
- **Photography Style:** Bright, airy, warm-toned lifestyle imagery with dewy, natural-looking skin emphasis

### Photography Guidelines

#### Hero / Banner Imagery
- **Style:** Editorial, high-production lifestyle shots
- **Lighting:** Soft golden-hour or studio softbox; avoid harsh shadows
- **Color Grading:** Warm, slightly desaturated with lifted highlights (Instagram "K-beauty" filter aesthetic)
- **Models:** Diverse Indian skin tones (deep, wheatish, fair); focus on natural glow, minimal heavy makeup
- **Composition:** Close-up beauty shots (face, lips, hands applying product) + wide lifestyle context (bathroom vanity, morning routine)
- **Format:** 1200×400 banners, 600×600 product squares, 1:1 Instagram grid

#### Product Photography
- **Background:** Clean white or soft pastel gradient (matching site's blush-to-cream palette)
- **Angles:** Front face + 45° + texture/detail macro (especially for serums, scrubs)
- **Styling Props:** Fresh flowers, marble surfaces, golden spoons, cotton pads, water splashes
- **Consistency:** Every product must have at least 2 images; 600×600 minimum resolution

#### Social Media Photography
- **Instagram Feed:** Cohesive grid aesthetic — alternate between product close-ups, flatlays, and lifestyle/reel stills
- **Stories/Reels:** Raw, behind-the-scenes, "Get Ready With Me" (GRWM), before-after transitions
- **TikTok:** Trend-driven short-form — satisfying product application, ASMR textures, "day-in-my-life" routines

### Site Visual Language

| Element | Specification |
|---------|--------------|
| Glassmorphism | Semi-transparent cards with `backdrop-filter: blur()` — consistent across header, cards, modals |
| Border Style | 1px `var(--line)` — subtle warm-gray borders |
| Card Shadows | Soft elevation via `box-shadow: var(--shadow-card)` with pink-tinted purple shadows |
| Border Radius | Generous — 24–34px on cards, 999px on buttons and pills |
| Typography | Display font (bold headers) + body font — both from `next/font` Geist |
| Dark Mode | Purposefully supported — background shifts to deep purples/blacks with pink/gold accents |
| Hover States | `translateY(-5px)` lift on cards + border glow in pink |
| Motion | Framer Motion for page transitions, scroll reveals, and micro-interactions |

### Brand Assets Checklist

- [ ] Logo (wordmark: "GLOW" + "ADDICT" with signature dot accent)
- [ ] Favicon
- [ ] Instagram highlight covers (consistent with brand palette)
- [ ] WhatsApp business profile photo
- [ ] Product mockup templates (for easy future product launches)
- [ ] Email/notification template designs
- [ ] Packaging inserts / thank-you card design (for COD orders)

---

## 3. Website Navigation Architecture

### Information Architecture

```
/  (Home Page)
├── /products  (All Products — with filters, sorting)
│   ├── /products?category=skincare
│   ├── /products?category=makeup
│   ├── /products?category=bodycare
│   ├── /products?category=haircare
│   └── /products?category=tools
├── /products/:slug  (Individual Product Detail Page)
├── /ai-assistant  (AI Skin Analyzer / Routine Builder)
├── /cart  (Shopping Cart)
├── /wishlist  (Wishlist)
├── /checkout  (Checkout — COD / UPI)
├── /order/:id/confirmation  (Order Confirmation)
├── /track-order  (Order Tracking)
├── /profile  (User Profile — skin type, loyalty points)
├── /login  (Authentication)
├── /about  (Brand Story)
├── /contact  (Contact Form + WhatsApp link)
├── /help  (FAQ / Help Center)
├── /shipping  (Shipping Policy)
├── /returns  (Returns Policy)
├── /privacy  (Privacy Policy)
├── /terms  (Terms & Conditions)
├── /sustainability  (Brand Values)
├── /press  (Press / Media Kit)
├── /careers  (Careers Page)
├── /affiliate  (Affiliate Program)
└── /admin  (Admin Dashboard — CMS, Inventory, AI, Analytics)
    ├── /admin/inventory
    ├── /admin/cms  (Banners, Collections)
    ├── /admin/ai  (AI Recommendations Manager)
    ├── /admin/influencers
    ├── /admin/analytics
    └── /admin/settings
```

### Header Navigation (Desktop)

| Link | Route | Purpose |
|------|-------|---------|
| Skincare | `/products?category=skincare` | Largest category (13 products) |
| Makeup | `/products?category=makeup` | Lipstick, eyeliner, mascara |
| Body | `/products?category=bodycare` | Body wash, scrub, mist |
| Hair | `/products?category=haircare` | Shampoo, serum, conditioner |
| Tools | `/products?category=tools` | Brushes, rollers, sponges |
| Sale | `/products` | All products (filtered by sale) |
| Glow AI | `/ai-assistant` | AI-powered skin analysis |

### Header Navigation (Mobile)

- Hamburger menu → Grid layout with 2-column menu items
- Includes all desktop nav items + "Personalize my routine" CTA
- Quick access: Cart, Wishlist, Profile, Search

### Footer Navigation

**Shop:** Skincare | Makeup | Hair Care | Fragrance | Bath & Body
**Company:** About | Careers | Press | Sustainability | Affiliate
**Support:** Help Center | Shipping | Returns | Track Order | Contact

### Key UX Flows

1. **Discovery Path:** Homepage → Category Grid / Trending / Flash Deals → Product Grid → Filters/Sort → Product Card → Product Detail
2. **AI-Assisted Path:** Homepage "Find my routine" → AI Skin Analyzer → Personalized Product Recommendations → Add to Cart
3. **Re-order Path:** Profile → Order History → Re-order

---

## 4. Combo Products & Bundling Strategy

### Current Combos

| Combo ID | Name | Products Included | Bundle Price | MRP Total | Savings |
|----------|------|-------------------|:-----------:|:---------:|:-------:|
| GA-COMBO-030 | **Morning Glow Ritual** | p1 (Face Wash) + p4 (Vitamin C Serum) + p5 (Moisturizer) + p2 (Sunscreen) | ₹1,699 | ₹2,100 | ~19% |
| GA-COMBO-031 | **Self-Care Sunday Set** | p9 (Face Mask) + p25 (Face Scrub) + p15 (Body Scrub) + p16 (Body Mist) | ₹1,599 | ₹1,850 | ~25% |
| GA-COMBO-032 | **Complete Lip Love Kit** | p8 (Lip Balm) + p26 (Lip Gloss) | ₹499 | ₹598 | ~15% |

### Bundling Strategy Principles

1. **Routine-Based Bundles** — Group products that naturally belong in the same skincare step (AM/PM routines, weekly rituals)
2. **Category Cross-Sell** — Combine products from different categories (Skincare + Bodycare) to increase AOV
3. **"Free Gift" Badge** — Combos tagged with "Free Gift" to signal added value (see Free Scrunchies strategy below)
4. **Badge Hierarchy:** `Combo` → `Best Value` / `Weekend Essential` → `Recommended`
5. **Pricing Psychology:** Bundle pricing always shows MRP vs. bundle price with explicit discount percentage in the copy
6. **Limited Combinations** — Start with 3–5 combos; expand based on sales data and A/B testing

### Recommended New Bundles

| Proposed Name | Potential Products | Target Price | Rationale |
|---------------|-------------------|:-----------:|-----------|
| Night Repair Kit | Night Cream + Face Roller + Lip Balm | ₹1,199 | PM ritual upsell |
| Acne Fighter Duo | Niacinamide Serum + AHA Toner | ₹999 | Concern-based bundle |
| Bridal Glow Essentials | Vitamin C Serum + Moisturizer + Sunscreen + Face Mask | ₹1,899 | Wedding season |
| Starter Kit (Under 500) | Lip Balm + Mascara + Body Mist | ₹699 | New customer entry |

### Implementation Notes

- Combo products are flagged with `isCombo: true` and `comboIncludes: ComboItem[]` in the product data
- Each combo item has `productId`, `name`, and `quantity`
- The product detail page should render a "This combo includes" section listing all sub-items with thumbnails
- Combo products must have their own SKU pattern: `GA-COMBO-XXX`
- Inventory for combos: track as a single unit; if any component is out of stock, mark combo as low stock

---

## 5. Free Scrunchies Promotion Strategy

### Campaign Overview

**Mechanic:** Free scrunchies are included with every qualifying order as a surprise-and-delight tactic to build brand loyalty and encourage social sharing.

**Current Status:** Active — enabled in `catalog.ts`:
```typescript
export const freeGiftPromotion = {
  enabled: true,
  gift: 'Free Scrunchies with every order',
  minOrderValue: 0,  // No minimum — applies to all orders
};
```

### Promotion Rules

| Parameter | Value |
|-----------|-------|
| **Eligibility** | Every order (no minimum order value) |
| **Gift** | 1–2 branded scrunchies (fabric, matching brand palette) |
| **Visual Cue** | Tagged on product cards: "🧣 Free scrunchie included" |
| **Unboxing Moment** | Scrunchie packaged visibly on top of order items |
| **Social Proof** | Encourage customers to share unboxing on Instagram/TikTok with #GlowAddictScrunchie |

### Marketing Integration

1. **Product Page Badge:** "Free scrunchie included ✨" tag on all product cards
2. **Combo Bundle Tag:** Lip Love Kit combo already has `"Free scrunchies included"` badge
3. **Checkout Confirmation:** Include "Your free scrunchie is on its way!" in order confirmation email/message
4. **Instagram UGC Campaign:** Create branded hashtag `#GlowAddictScrunchie` — incentivize customers to post unboxing photos for a chance to be featured or win store credit
5. **WhatsApp Share:** When customers share orders via WhatsApp, scrunchie is mentioned as a freebie

### KPIs to Track

- Social mentions of `#GlowAddictScrunchie`
- Customer photos/reviews mentioning the scrunchie
- Repeat purchase rate (correlation with scrunchie surprise)
- Average order value impact (does free gift push customers to add more?)

### Design Asset Requirements

- [ ] Scrunchie design options (3–4 colorways matching brand palette)
- [ ] Packaging insert card design ("Thank you! Your free scrunchie 💛")
- [ ] Product photography with scrunchie styled alongside products
- [ ] Instagram/TikTok template for scrunchie unboxing content

---

## 6. Content Pillars for Instagram & TikTok

### Brand Voice

**Tone:** Warm, empowering, slightly playful. Not overly polished — "your bestie who happens to know skincare." First-person plural ("we," "our Glow fam"). Emoji-forward but not spammy.

**Hashtag Strategy:**
- Primary: `#GlowAddict` `#GlowAddictBySayanita`
- Campaign: `#GlowAddictScrunchie` `#GlowAddictRoutine`
- Community: `#IndianBeauty` `#CleanGirlAesthetic` `#KBeautyInspired`

---

### Instagram Content Pillars

| Pillar | Content Type | Frequency | Purpose |
|--------|-------------|:---------:|---------|
| **🔬 Product Deep-Dives** | Carousel posts: ingredients, before/after, how-to-use | 2x/week | Education + trust |
| **💄 Look of the Day** | Single-image makeup shots, styled looks | 3x/week | Aspiration + product showcase |
| **🌅 Morning/Night Routines** | Reels: GRWM, skincare routine timelapse | 2x/week | Relatability + product usage |
| **📣 Sale & Launch Alerts** | Stories + Feed: flash deals, new arrivals, restocks | As needed | Conversion + urgency |
| **💬 Community & UGC** | Reposts of customer reviews, unboxings, selfies | 2x/week | Social proof + loyalty |
| **🎓 Skincare Education** | Infographics, myth-busting carousels, dermatologist collabs | 1x/week | Authority building |
| **🎁 Behind the Scenes** | Warehouse packing, brand story, team moments | 1x/week | Authenticity + connection |
| **🤖 AI Routine Matches** | Showcase AI recommendations, "Glow AI picked for you" | 1x/week | Drive AI feature usage |

### TikTok Content Pillars

| Pillar | Content Type | Frequency | Purpose |
|--------|-------------|:---------:|---------|
| **ASMR Product Textures** | Close-up sounds: serum drops, scrub granules, mist sprays | 2x/week | Satisfying, high share rate |
| **"Get Ready With Me" (GRWM)** | Full routine using Glow Addict products | 2x/week | Tutorial + product placement |
| **Before → After** | Skin transformation timelapse (4–8 weeks) | 1x/week | Proof of efficacy |
| **Trend Participation** | Jump on trending sounds/formats with beauty twist | 3x/week | Discoverability |
| **Product Hacks** | Unexpected uses, layering tips, "3 ways to use X" | 1x/week | Value + shares |
| **Unboxing & Scrunchie Reveal** | COD unboxing ASMR with scrunchie surprise | 1x/week | UGC + promotion |
| **"Rate My Skin" / AI Challenge** | Use AI assistant on camera, react to recommendations | 1x/week | Viral potential + AI feature promo |

### Content Calendar Suggestion

```
Week Structure:
Mon — Instagram: Product Deep-Dive | TikTok: ASMR
Tue — Instagram: Look of the Day | TikTok: GRWM
Wed — Instagram: Skincare Education | TikTok: Trend Participation
Thu — Instagram: Community UGC | TikTok: Product Hack
Fri — Instagram: Morning Routine Reel | TikTok: Before/After
Sat — Instagram: Behind the Scenes | TikTok: GRWM
Sun — Instagram: Rest Day / Story poll | TikTok: Unboxing + Scrunchie
```

### Influencer Collaboration Framework

| Tier | Follower Range | Collaboration Type | Expected Reach |
|------|---------------|-------------------|----------------|
| Nano | 5K–20K | Product gifting + honest review | 5K–20K |
| Micro | 20K–100K | Paid post + stories + swipe-up | 20K–100K |
| Mid | 100K–500K | Campaign ambassador + exclusive codes | 100K–500K |
| Macro | 500K+ | Brand partnership + co-created collection | 500K+ |

**Platform:** `src/data/influencers` table tracks influencer metrics, commission rates, and sales attribution.

---

## 7. Implementation Notes for the Development Team

### Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + `@tailwindcss/postcss` |
| State Management | Zustand 5 (cart, wishlist, auth, theme) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (GitHub + email/password) |
| AI/ML | Google Generative AI (`@google/generative-ai`) + OpenAI SDK |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Charts | Recharts |
| Spreadsheet Export | XLSX |

### Data Structure

```
supabase/
├── schema.sql          # All table definitions (products, categories, brands, orders, etc.)
├── seed.sql            # Product + brand + category + review seed data
├── seed_cms.sql        # Banners, collections, settings
└── migrations/         # (Future migrations)
```

Key tables: `products`, `categories`, `brands`, `product_variants`, `reviews`, `orders`,
`order_items`, `customers`, `wishlists`, `coupons`, `influencers`, `ai_recommendations`,
`cms_banners`, `cms_collections`, `inventory_movements`, `upi_payments`, `profiles`.

### Current Seed Data Limitations

- **Product images** use Unsplash placeholders — replace with real product photography before launch
- **32 products** seeded; additional products should be added through the admin CMS
- **Review data** is minimal (6 reviews) — plan a review solicitation campaign post-launch
- **Combo products** p25 and p26 referenced in combos but not explicitly in the products seed array — ensure these are added or the combo data is updated to match real inventory

### Key Routes to Implement / Verify

| Route | Status | Notes |
|-------|--------|-------|
| `/` (Home) | ✅ Basic | Needs banner integration from CMS |
| `/products` | ✅ Complete | Filtering, sorting, category param |
| `/products/:slug` | ✅ Basic | Detail page |
| `/cart` | ✅ Complete | With WhatsApp share |
| `/checkout` | ✅ Complete | COD + manual UPI flow |
| `/ai-assistant` | ✅ Basic | Skin analyzer + chat |
| `/profile` | ✅ Basic | Skin type, loyalty points |
| `/wishlist` | ✅ Complete | |
| `/admin/inventory` | ✅ Complete | CRUD for products |
| `/admin/cms` | ✅ Complete | Banners + collections |
| `/admin/ai` | ✅ Basic | AI recommendation manager |
| `/admin/influencers` | ✅ Complete | Influencer CRM |
| `/admin/analytics` | ✅ Basic | Dashboard |
| `/admin/settings` | ✅ Complete | Store config |

### Environment Variables Required

```env
NEXT_PUBLIC_CONTACT_EMAIL=hello@glowaddict.com
NEXT_PUBLIC_WHATSAPP_NUMBER=8617897185
NEXT_PUBLIC_UPI_ID=sayanitapayra-1@okicici
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/glow_addict_by_sayanita
NEXT_PUBLIC_STORE_NAME=Glow Addict
```

### Marketing-Ready Features Checklist

- [x] Product cards with badges (Bestseller, New, Trending, Sale %)
- [x] Category grid with CMS-managed collections
- [x] Hero banner with CMS integration
- [x] Flash sale countdown timer
- [x] Free scrunchie gift messaging
- [x] WhatsApp share for products and cart
- [x] "Free shipping above ₹499" (top ribbon)
- [x] "Extra 20% off first order" (coupon: EXTRA20)
- [x] Loyalty banner with benefits
- [x] AI beauty match CTA
- [x] Instagram grid embed
- [x] Dark/light mode toggle
- [x] Top announcement marquee (Pink Summer Sale)

### Recommended Next Steps

1. **Replace all Unsplash images** with actual product photography
2. **Add real product count** beyond 32 SKUs (target: 50–70 by launch)
3. **Implement review collection flow** (post-purchase email/SMS)
4. **Set up Google Analytics / PostHog** for traffic analytics
5. **Configure push notification system** via web push API
6. **Add coupon system** for influencer codes and seasonal offers
7. **Build email marketing templates** (welcome series, order confirmation, restock alerts)
8. **Connect WhatsApp Business API** for order notifications (currently manual)
9. **SEO optimization** — generate sitemap, add structured data (Product schema), meta tags
10. **Performance audit** — Core Web Vitals, image optimization, lazy loading

---

## Quick Reference: Brand Contact Info

| Channel | Details |
|---------|---------|
| **Instagram** | [@glow_addict_by_sayanita](https://www.instagram.com/glow_addict_by_sayanita) |
| **WhatsApp** | +91 8617897185 |
| **Email** | hello@glowaddict.com |
| **UPI** | sayanitapayra-1@okicici |
| **Phone** | +91 98765 43210 |
| **Store Name** | Glow Addict by Sayanita |

---

*This document is the single source of truth for Glow Addict's marketing and product catalog strategy. Keep it updated as the catalog, promotions, and content strategy evolve.*