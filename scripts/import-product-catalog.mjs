import fs from 'fs/promises';
import path from 'path';

const generatedPath = path.join(process.cwd(), 'src', 'data', 'generated-catalog.json');

const rows = [
  { title: 'Open Pores Perfume', brand: 'MARS', category: 'Perfume', mrp: '₹199', price: '₹149', details: 'Long-lasting perfume' },
  { title: 'Lustre Eyeshadow Palette', brand: 'Swiss Beauty', category: 'Makeup', mrp: '₹229', price: '₹185', details: 'Nude shimmer palette' },
  { title: 'Zero Pore Perfection Primer', brand: 'MARS', category: 'Primer', mrp: '₹249', price: '₹199', details: 'Long-lasting & mattifying' },
  { title: 'Plum Green Tea Night Gel + Niacinamide Moisturizer Combo', brand: 'Plum', category: 'Skincare Combo', mrp: '₹1100+', price: '₹925', details: 'Includes free lipstick' },
  { title: 'Queen of Mattes Lipstick Set', brand: 'MARS', category: 'Lipstick', mrp: '₹499', price: '₹389', details: 'Matte lipstick combo' },
  { title: 'Rosemary Water Hair Growth Spray', brand: 'Alps Goodness', category: 'Haircare', mrp: '₹299', price: '₹199', details: 'Hair growth expert' },
  { title: 'Wonder Ceramide Mochi Toner', brand: 'TonyMoly', category: 'Toner', mrp: '₹500', price: '₹400', details: 'Ceramides + Hyaluronic Acid' },
  { title: 'Dual Mascara + Lash Combo', brand: 'MARS', category: 'Eye Makeup', mrp: '₹299', price: '₹249', details: 'Volume & curl' },
  { title: 'Gluta-Hya Sunscreen SPF50', brand: 'Vaseline', category: 'Sunscreen', mrp: '₹699', price: '₹370', details: 'UV protection' },
  { title: 'Lip & Cheek Tint', brand: 'MARS', category: 'Tint', mrp: '₹299', price: '₹229', details: 'Shades: Ruby Red/Cinnamon Glow' },
  { title: 'Glow Up Routine Combo', brand: 'Dot & Key', category: 'Combo', mrp: '₹2034', price: '₹1499', details: 'Facewash + Serum + Moisturizer + Sunscreen' },
  { title: '5 in 1 Face Palette', brand: 'Insight', category: 'Makeup', mrp: '₹255', price: '₹219', details: 'Contour/highlight/blush' },
  { title: 'Face Roller', brand: 'Generic', category: 'Beauty Tool', mrp: '₹999', price: '₹799', details: 'Gold facial roller' },
  { title: 'Power Black Kajal', brand: 'Swiss Beauty', category: 'Kajal', mrp: '₹189', price: '₹149', details: 'Waterproof' },
  { title: 'Freebies Alert Pack', brand: 'Glow Addict', category: 'Offer', mrp: '', price: '', details: 'Free scrunchies/lipstick/keychain' },
  { title: '5 in 1 Pressed Highlighter + Blush', brand: 'Insight', category: 'Makeup', mrp: '₹220', price: '₹179', details: 'Multi-shade blush' },
  { title: 'Glow Addict Logo', brand: 'Glow Addict', category: 'Branding', mrp: '', price: '', details: 'Store logo' },
  { title: 'Daily Exfoliating Body Wash', brand: 'Chemist at Play', category: 'Body Wash', mrp: '₹399', price: '₹339', details: 'AHA body wash' },
  { title: 'Plum Body Mist (Hawaiian Rumba)', brand: 'Plum', category: 'Body Mist', mrp: '₹399', price: '₹289', details: 'Long-lasting fragrance' },
  { title: 'MARS Trio Treat Set', brand: 'MARS', category: 'Makeup Combo', mrp: '₹999', price: '₹799', details: 'Makeup kit' },
  { title: 'Mini Fan', brand: 'Generic', category: 'Accessories', mrp: '₹199', price: '₹149', details: 'Portable fan' },
  { title: 'Makeup Fixer Spray', brand: 'Swiss Beauty', category: 'Setting Spray', mrp: '₹380', price: '₹229', details: 'Aloe vera + Vitamin E' },
  { title: 'Niacinamide Body Mist', brand: 'Alps Goodness', category: 'Body Mist', mrp: '₹299', price: '₹199', details: 'Hydrating mist' },
  { title: 'WishCare Underarm Roll On Serum', brand: 'WishCare', category: 'Bodycare', mrp: '₹399', price: '₹269', details: 'Reduces odor/darkness' },
  { title: 'Soft Nylon Bristle Hair Brushes', brand: 'Generic', category: 'Accessories', mrp: '₹299', price: '₹129', details: 'Soft scalp brushes' },
  { title: 'Caffeine Body Scrub', brand: 'mCaffeine', category: 'Body Scrub', mrp: '₹449', price: '₹315', details: 'Coffee body scrub' },
  { title: 'Plum Green Tea Moisturizer', brand: 'Plum', category: 'Moisturizer', mrp: '₹575', price: '₹499', details: 'Oil-free hydration' },
  { title: 'Dot & Key Strawberry Dew Strobe Cream', brand: 'Dot & Key', category: 'Strobe Cream', mrp: '₹345', price: '₹249', details: 'Pearl pink glow' },
  { title: 'Insight Strobe Cream', brand: 'Insight', category: 'Makeup', mrp: '₹399', price: '₹315', details: 'Dewy glow finish' },
  { title: 'Collagen Glass Skin Overnight Mask', brand: 'Foxtale', category: 'Face Mask', mrp: '₹549', price: '₹329', details: 'Korean glass skin effect' },
  { title: 'Swiss Beauty Strobe Cream', brand: 'Swiss Beauty', category: 'Illuminator', mrp: '₹329', price: '₹239', details: 'Radiance booster' },
  { title: 'Summer Skin Revival Sheet Masks', brand: 'Mixed', category: 'Sheet Mask', mrp: '', price: '', details: 'Hydrating masks' },
  { title: 'Foxtale Skin Radiance Cream', brand: 'Foxtale', category: 'Moisturizer', mrp: '₹551', price: '₹445', details: 'Deep hydration' },
  { title: 'Dot & Key Lip Balm', brand: 'Dot & Key', category: 'Lip Care', mrp: '₹249', price: '₹159', details: 'Cocoa mint flavor' },
  { title: 'MARS Lip Liner', brand: 'MARS', category: 'Lip Makeup', mrp: '₹199', price: '₹149', details: 'Waterproof liner' },
  { title: 'Dot & Key SPF50 Lip Balm', brand: 'Dot & Key', category: 'Lip Care', mrp: '₹249', price: '₹199', details: 'Kojic berry crumble' },
  { title: 'mCaffeine Face Scrub', brand: 'mCaffeine', category: 'Face Scrub', mrp: '₹249', price: '₹199', details: 'Coffee face scrub' },
  { title: 'Plum BodyLovin Citrus Body Mist', brand: 'Plum', category: 'Body Mist', mrp: '₹550', price: '₹420', details: 'Citrus fragrance' },
  { title: 'Aqualogica Body Mist Pink Variant', brand: 'Aqualogica', category: 'Body Mist', mrp: '₹449', price: '₹320', details: 'Floral perfume mist' },
  { title: 'Aqualogica Ocean Breeze Perfume Mist', brand: 'Aqualogica', category: 'Body Mist', mrp: '₹449', price: '₹320', details: 'Fresh aqua fragrance' },
  { title: 'Aqualogica Cherry Blossom Perfume Mist', brand: 'Aqualogica', category: 'Body Mist', mrp: '₹449', price: '₹320', details: 'Sweet floral scent' },
  { title: 'Aqualogica Midnight Perfume Mist', brand: 'Aqualogica', category: 'Body Mist', mrp: '₹499', price: '₹320', details: 'Night fragrance' },
  { title: 'Aqualogica Vanilla Perfume Mist', brand: 'Aqualogica', category: 'Body Mist', mrp: '₹499', price: '₹320', details: 'Vanilla fragrance' },
  { title: 'Derma Co Pore Minimizing Kit', brand: 'The Derma Co', category: 'Acne Care', mrp: '₹499', price: '₹389', details: 'Fights acne' },
  { title: 'Dot & Key Strawberry Brightening Serum', brand: 'Dot & Key', category: 'Serum', mrp: '₹599', price: '₹449', details: 'Fades dark spots' },
  { title: 'Dot & Key Vitamin C Face Serum', brand: 'Dot & Key', category: 'Serum', mrp: '₹449', price: '₹379', details: 'Brightening' },
  { title: 'Cetaphil Bright Healthy Radiance Toner', brand: 'Cetaphil', category: 'Toner', mrp: '₹999', price: '₹719', details: 'Brightening toner' },
  { title: 'Dot & Key Blueberry Hydrate Serum', brand: 'Dot & Key', category: 'Serum', mrp: '₹449', price: '₹339', details: 'Barrier repair' },
  { title: 'Aqualogica Papaya Sunscreen', brand: 'Aqualogica', category: 'Sunscreen', mrp: '₹599', price: '₹439', details: 'Photostable protection' },
  { title: 'Aqualogica Tomato Sunscreen', brand: 'Aqualogica', category: 'Sunscreen', mrp: '₹599', price: '₹439', details: 'SPF50' },
  { title: 'Aqualogica Watermelon Sunscreen', brand: 'Aqualogica', category: 'Sunscreen', mrp: '₹599', price: '₹439', details: 'Hydration sunscreen' },
  { title: 'Cetaphil Moisturising Lotion', brand: 'Cetaphil', category: 'Moisturizer', mrp: '₹789', price: '₹689', details: 'Sensitive skin' },
  { title: 'Dot & Key 72hr Hydrating Gel', brand: 'Dot & Key', category: 'Moisturizer', mrp: '₹495', price: '₹385', details: 'Probiotic gel' },
  { title: 'Plum Rice Water Gel Cream', brand: 'Plum', category: 'Moisturizer', mrp: '₹525', price: '₹425', details: 'Rice water hydration' },
  { title: 'Dot & Key Watermelon Cooling Gel', brand: 'Dot & Key', category: 'Moisturizer', mrp: '₹495', price: '₹385', details: 'Cooling moisturizer' },
  { title: 'Minimalist SPF50 Sunscreen', brand: 'Minimalist', category: 'Sunscreen', mrp: '₹399', price: '₹349', details: 'Niacinamide sunscreen' },
  { title: 'WishCare Invisible Gel Sunscreen', brand: 'WishCare', category: 'Sunscreen', mrp: '₹499', price: '₹379', details: 'No white cast' },
  { title: 'Derma Co Hyaluronic Sunscreen', brand: 'The Derma Co', category: 'Sunscreen', mrp: '₹499', price: '₹399', details: 'Aqua gel' },
  { title: 'Dot & Key Strawberry Sunscreen', brand: 'Dot & Key', category: 'Sunscreen', mrp: '₹549', price: '₹479', details: 'Dewy finish' },
  { title: 'Dot & Key Watermelon Cooling Sunscreen', brand: 'Dot & Key', category: 'Sunscreen', mrp: '₹595', price: '₹445', details: 'Cooling SPF50' },
  { title: 'Dot & Key Vitamin C Sunscreen', brand: 'Dot & Key', category: 'Sunscreen', mrp: '₹595', price: '₹445', details: 'Vitamin C SPF' },
  { title: 'Dot & Key Dragon Fruit Sunscreen', brand: 'Dot & Key', category: 'Sunscreen', mrp: '₹495', price: '₹345', details: 'SPF50' },
  { title: 'Dot & Key Blueberry Sunscreen', brand: 'Dot & Key', category: 'Sunscreen', mrp: '₹445', price: '₹345', details: 'Barrier repair sunscreen' },
  { title: 'Aqualogica Sunscreen Duo', brand: 'Aqualogica', category: 'Combo', mrp: '₹249', price: '₹199', details: 'Mini sunscreen pack' },
  { title: 'Dot & Key Strawberry Face Wash', brand: 'Dot & Key', category: 'Facewash', mrp: '₹249', price: '₹189', details: 'Brightening' },
  { title: 'Dot & Key Barrier Repair Face Wash', brand: 'Dot & Key', category: 'Facewash', mrp: '₹249', price: '₹189', details: 'Ceramide repair' },
  { title: 'Dot & Key Vitamin C Moisturizer', brand: 'Dot & Key', category: 'Moisturizer', mrp: '₹749', price: '₹189?', details: 'Vitamin C glow cream' },
  { title: 'Dot & Key Cica Face Wash', brand: 'Dot & Key', category: 'Facewash', mrp: '₹249', price: '₹199', details: 'Acne soothing' },
  { title: 'Dot & Key Vitamin C Face Wash', brand: 'Dot & Key', category: 'Facewash', mrp: '₹249', price: '₹199', details: 'Brightening cleanser' },
  { title: 'Cetaphil Gentle Cleanser', brand: 'Cetaphil', category: 'Facewash', mrp: '₹199', price: '₹149', details: 'Sensitive skin cleanser' },
  { title: 'Cetaphil Radiance Serum', brand: 'Cetaphil', category: 'Serum', mrp: '₹299', price: '₹229', details: 'Glow serum' },
  { title: 'WishCare Fluid Sunscreen', brand: 'WishCare', category: 'Sunscreen', mrp: '₹399', price: '₹299', details: 'Lightweight SPF' },
  // Nail products collection
  { title: 'Ruby Red Luxury Press-On Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹799', price: '₹499', details: 'Glossy deep red almond nails with gold charms' },
  { title: 'Nude Floral Premium Press-On Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹799', price: '₹499', details: 'Nude beige nails with floral art' },
  { title: 'Midnight Chrome Cat Eye Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹899', price: '₹499', details: 'Black-purple magnetic chrome finish' },
  { title: 'Galaxy Purple Aura Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹899', price: '₹499', details: 'Purple gradient reflective nail set' },
  { title: 'Champagne Gold Glitter Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹849', price: '₹499', details: 'Nude gold glitter luxury set' },
  { title: 'Wine Velvet Gloss Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹799', price: '₹499', details: 'Dark red glossy reusable nails' },
  { title: 'Korean Nude Bridal Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹899', price: '₹499', details: 'Elegant wedding-style press-ons' },
  { title: 'Luxury Gold Charm Nail Set', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹999', price: '₹499', details: 'Premium metallic charm design' },
  { title: 'Aura Cat Eye Nail Set', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹899', price: '₹499', details: 'Trendy Korean aura effect nails' },
  { title: 'Floral Pearl Nude Nails', brand: 'Glow Addict', category: 'Press-On Nails', mrp: '₹849', price: '₹499', details: 'Floral minimal premium design' },
];

function parsePrice(s) {
  if (!s) return null;
  const cleaned = String(s).replace(/[₹,+?~\s]/g, '').replace(/[^0-9.]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function run() {
  try {
    const raw = await fs.readFile(generatedPath, 'utf8');
    const json = JSON.parse(raw);
    const existing = Array.isArray(json.products) ? json.products : (json.products = []);

    let added = 0, updated = 0;
    for (const r of rows) {
      const price = parsePrice(r.price);
      const mrp = parsePrice(r.mrp);
      const slug = slugify(r.title);
      const match = existing.find(p => (p.title && p.title.toLowerCase() === r.title.toLowerCase()) || p.slug === slug);
      const newObj = {
        id: `import-${slug}`,
        slug,
        title: r.title,
        brand: r.brand || 'Generic',
        category: r.category || 'Uncategorized',
        mrp: mrp || null,
        price: price || null,
        description: r.details || '',
        images: [],
        tags: [],
        stock: 999,
      };

      if (match) {
        Object.assign(match, newObj);
        updated++;
      } else {
        existing.push(newObj);
        added++;
      }
    }

    if (json.stats && typeof json.stats.totalProducts === 'number') {
      json.stats.totalProducts = Array.isArray(json.products) ? json.products.length : json.stats.totalProducts;
    }

    await fs.writeFile(generatedPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Import complete — added: ${added}, updated: ${updated}, totalProducts: ${json.products.length}`);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exitCode = 2;
  }
}

run();
