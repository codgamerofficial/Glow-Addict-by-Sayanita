import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'public', 'images');
const outPath = path.join(rootDir, 'src', 'data', 'generated-catalog.json');

const BRAND_MAP = [
  { key: 'dotkey', name: 'Dot & Key', id: 'brand-dot-and-key' },
  { key: 'cetaphil', name: 'Cetaphil', id: 'brand-cetaphil' },
  { key: 'plum', name: 'Plum', id: 'brand-plum' },
  { key: 'mars', name: 'MARS', id: 'brand-mars' },
  { key: 'dove', name: 'Dove', id: 'brand-dove' },
  { key: 'foxtale', name: 'Foxtale', id: 'brand-foxtale' },
  { key: 'wishcare', name: 'WishCare', id: 'brand-wishcare' },
  { key: 'insight', name: 'Insight', id: 'brand-insight' },
  { key: 'alps', name: 'ALPS', id: 'brand-alps' },
  { key: 'derma', name: 'Derma Co', id: 'brand-derma-co' },
  { key: 'aqulogica', name: 'Aqulogica', id: 'brand-aqulogica' },
];

const REQUIRED_CATEGORIES = [
  'Face Wash',
  'Cleanser',
  'Serum',
  'Sunscreen',
  'Moisturizer',
  'Toner',
  'Lip Care',
  'Lipstick',
  'Face Mask',
  'Body Care',
  'Roll On',
  'Nail Extensions',
  'Makeup',
  'Beauty Tools',
  'Body Mist',
  'Combos',
  'Offers',
  'Best Sellers',
  'Trending',
  'New Arrivals'
];

const CATEGORY_RULES = [
  { category: 'Face Wash', terms: ['facewash', 'face-wash'] },
  { category: 'Cleanser', terms: ['cleanser', 'wash'] },
  { category: 'Serum', terms: ['serum'] },
  { category: 'Sunscreen', terms: ['sunscreen', 'spf'] },
  { category: 'Moisturizer', terms: ['moisturizer', 'moisture', 'gel-cream', 'cream', 'hydrating'] },
  { category: 'Toner', terms: ['toner'] },
  { category: 'Lip Care', terms: ['lip-balm', 'lip-care'] },
  { category: 'Lipstick', terms: ['lipstick', 'lip-color'] },
  { category: 'Face Mask', terms: ['mask', 'sheet-mask'] },
  { category: 'Body Care', terms: ['body', 'polish', 'lotion'] },
  { category: 'Roll On', terms: ['roll-on', 'rollon'] },
  { category: 'Nail Extensions', terms: ['nail', 'extension'] },
  { category: 'Makeup', terms: ['eyeliner', 'highlighter', 'blush', 'trio', 'makeup'] },
  { category: 'Beauty Tools', terms: ['roller', 'fan', 'bristles', 'brush', 'tool'] },
  { category: 'Body Mist', terms: ['mist', 'fragrance'] },
  { category: 'Combos', terms: ['combo', 'kit', 'bundle'] },
];

const INGREDIENT_BY_TERM = [
  { terms: ['vitamin-c'], value: 'Vitamin C, Kakadu Plum, Ferulic Acid' },
  { terms: ['niacinamide'], value: 'Niacinamide, Zinc PCA, Green Tea' },
  { terms: ['watermelon'], value: 'Watermelon Extract, Hyaluronic Acid, Aloe Vera' },
  { terms: ['cica'], value: 'Cica, Panthenol, Allantoin' },
  { terms: ['blueberry'], value: 'Blueberry Extract, Ceramides, Squalane' },
  { terms: ['cleanser', 'facewash'], value: 'Mild Surfactants, Glycerin, Panthenol' },
  { terms: ['sunscreen', 'spf'], value: 'UVA/UVB Filters, Vitamin E, Hydrators' },
  { terms: ['moisture', 'moisturizer'], value: 'Ceramides, Hyaluronic Acid, Shea Butter' },
  { terms: ['lipstick'], value: 'Color Pigments, Emollients, Vitamin E' },
  { terms: ['eyeliner'], value: 'Carbon Black Pigments, Film Formers' },
  { terms: ['mask'], value: 'Kaolin, Fruit Extracts, Humectants' },
];

const BENEFITS_BY_CATEGORY = {
  'Face Wash': ['Deep cleanse', 'Removes excess oil', 'Fresh glow'],
  'Cleanser': ['Gentle cleanse', 'Barrier friendly', 'Hydration support'],
  'Serum': ['Targeted treatment', 'Improves texture', 'Visible radiance'],
  'Sunscreen': ['UVA/UVB protection', 'Prevents tanning', 'Daily defense'],
  'Moisturizer': ['Long hydration', 'Soft skin finish', 'Barrier support'],
  'Toner': ['Refines pores', 'Balances skin', 'Boosts absorption'],
  'Lip Care': ['Smooth lips', 'Nourishes', 'Soft finish'],
  'Lipstick': ['Rich pigment', 'Comfort wear', 'Soft matte finish'],
  'Face Mask': ['Instant glow', 'Quick refresh', 'Skin comfort'],
  'Body Care': ['Smooth texture', 'Hydrates body skin', 'Healthy sheen'],
  'Roll On': ['Long-lasting freshness', 'Odor control', 'Quick dry'],
  'Nail Extensions': ['Salon-ready look', 'Long wear', 'Easy styling'],
  'Makeup': ['Buildable payoff', 'Blendable texture', 'Event-ready look'],
  'Beauty Tools': ['Easy application', 'Better precision', 'Reusable utility'],
  'Body Mist': ['Fresh scent', 'Lightwear fragrance', 'Everyday use'],
  'Combos': ['Value savings', 'Routine-ready', 'Curated picks'],
  'Offers': ['Special pricing', 'Limited drops', 'High value'],
  'Best Sellers': ['Top rated', 'Most loved', 'Verified demand'],
  'Trending': ['Viral picks', 'Current favorites', 'Fast moving'],
  'New Arrivals': ['Latest drop', 'Fresh launches', 'Just added'],
};

const SKIN_TYPE_BY_CATEGORY = {
  'Face Wash': ['Oily', 'Combination', 'Normal'],
  'Cleanser': ['Sensitive', 'Dry', 'Normal'],
  'Serum': ['All', 'Combination', 'Dry'],
  'Sunscreen': ['All'],
  'Moisturizer': ['Dry', 'Normal', 'Combination'],
  'Toner': ['Combination', 'Oily', 'Normal'],
  'Lip Care': ['All'],
  'Lipstick': ['All'],
  'Face Mask': ['All', 'Dry', 'Combination'],
  'Body Care': ['All', 'Dry'],
  'Roll On': ['All'],
  'Nail Extensions': ['All'],
  'Makeup': ['All'],
  'Beauty Tools': ['All'],
  'Body Mist': ['All'],
  'Combos': ['All'],
  'Offers': ['All'],
  'Best Sellers': ['All'],
  'Trending': ['All'],
  'New Arrivals': ['All'],
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toTitleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
    .replace('Spf', 'SPF');
}

function hashString(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function detectBrand(fileName) {
  const base = fileName.toLowerCase();
  for (const brand of BRAND_MAP) {
    if (base.startsWith(`${brand.key}-`) || base.includes(`-${brand.key}-`) || base.includes(`${brand.key}`)) {
      return brand;
    }
  }
  return null;
}

function detectCategory(baseName) {
  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((term) => baseName.includes(term))) {
      return rule.category;
    }
  }
  return 'Makeup';
}

function inferSubcategory(baseName, category) {
  if (baseName.includes('vitamin-c')) return 'Vitamin C';
  if (baseName.includes('niacinamide')) return 'Niacinamide';
  if (baseName.includes('watermelon')) return 'Watermelon';
  if (baseName.includes('cica')) return 'Cica Care';
  if (baseName.includes('blueberry')) return 'Barrier Care';
  if (category === 'Makeup') return 'Color Cosmetics';
  if (category === 'Beauty Tools') return 'Accessories';
  return category;
}

function detectIngredients(baseName, category) {
  for (const row of INGREDIENT_BY_TERM) {
    if (row.terms.some((term) => baseName.includes(term))) {
      return row.value;
    }
  }
  return BENEFITS_BY_CATEGORY[category]?.join(', ') || 'Active beauty ingredients';
}

function inferShades(baseName, category) {
  if (category !== 'Lipstick' && category !== 'Makeup') return [];
  if (baseName.includes('matte')) return ['Rose Nude', 'Deep Berry', 'Coral Pink'];
  if (baseName.includes('highlighter')) return ['Champagne Glow', 'Rose Gold'];
  return ['Classic', 'Natural'];
}

function inferHowToUse(category) {
  const map = {
    'Face Wash': 'Apply on damp face, massage for 30 seconds, and rinse thoroughly.',
    'Cleanser': 'Massage on skin, wipe or rinse gently, then pat dry.',
    'Serum': 'Apply 2-3 drops on clean skin and follow with moisturizer.',
    'Sunscreen': 'Apply generously 15 minutes before sun exposure and reapply every 3-4 hours.',
    'Moisturizer': 'Apply after serum on face and neck using upward strokes.',
    'Toner': 'Pat onto cleansed skin with palms or cotton pad.',
    'Lip Care': 'Apply evenly on lips whenever required through the day.',
    'Lipstick': 'Outline lips and fill with even strokes.',
    'Face Mask': 'Apply evenly, leave for 10-15 minutes, then rinse.',
    'Body Care': 'Apply on damp skin and massage until absorbed.',
    'Roll On': 'Apply directly to underarms on clean, dry skin.',
    'Nail Extensions': 'Prep nails, apply adhesive tabs, and press extension firmly.',
    'Makeup': 'Apply over primed skin and blend as needed.',
    'Beauty Tools': 'Use with clean skin and sanitize after every use.',
    'Body Mist': 'Spritz from 6-8 inches on pulse points and body.',
    'Combos': 'Use the products in sequence for a complete routine.',
    'Offers': 'Add to cart and apply available offer at checkout.',
    'Best Sellers': 'Follow product-specific instructions for best results.',
    'Trending': 'Follow product-specific instructions for best results.',
    'New Arrivals': 'Follow product-specific instructions for best results.',
  };
  return map[category] || 'Use as directed on product packaging.';
}

function normalizeBaseName(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function buildProductName(baseName, brandName, fallbackIndex) {
  const isWhatsapp = baseName.startsWith('whatsapp-image');
  if (isWhatsapp) {
    return `Beauty Essential ${String(fallbackIndex).padStart(2, '0')}`;
  }

  let clean = baseName;
  const detectedBrand = BRAND_MAP.find((brand) => clean.startsWith(`${brand.key}-`));
  if (detectedBrand) {
    clean = clean.slice(detectedBrand.key.length + 1);
  }

  const title = toTitleCase(clean.replace(/-/g, ' '));
  if (!brandName || title.toLowerCase().startsWith(brandName.toLowerCase())) {
    return title;
  }
  return `${brandName} ${title}`;
}

function createPricing(seed, category) {
  const base = 299 + (seed % 11) * 60;
  const categoryBoost = category === 'Serum' ? 180 : category === 'Sunscreen' ? 120 : category === 'Makeup' ? 80 : 0;
  const originalPrice = Math.min(1699, base + categoryBoost);
  const discountPercent = 18 + (seed % 30);
  const offerPrice = Math.max(199, Math.round(originalPrice * (100 - discountPercent) / 100));
  return { originalPrice, offerPrice, discountPercent };
}

function createSeoKeywords(title, brandName, category) {
  const base = title.toLowerCase();
  return [
    `${base} online india`,
    `${brandName.toLowerCase()} ${category.toLowerCase()}`,
    `best ${category.toLowerCase()} for glowing skin`,
    `${brandName.toLowerCase()} beauty products`,
    `${base} offer price`
  ];
}

function makeCanonical(pathname) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://glowaddictbysayanita.vercel.app';
  return `${site.replace(/\/$/, '')}${pathname}`;
}

function readImageFiles() {
  return readdirSync(imagesDir)
    .filter((entry) => /\.(jpeg|jpg|png|webp)$/i.test(entry))
    .sort((a, b) => a.localeCompare(b));
}

function main() {
  const files = readImageFiles();
  const logoImage = files.find((f) => /logo/i.test(f)) || null;
  const freebiesImage = files.find((f) => /freebie/i.test(f)) || null;
  const comboImage = files.find((f) => /combo/i.test(f)) || null;

  const productFiles = files.filter((file) => {
    const lower = file.toLowerCase();
    return !lower.includes('logo') && !lower.includes('freebie') && !lower.includes('combo');
  });

  const products = [];
  const brandsById = new Map();
  const categoryCounts = new Map(REQUIRED_CATEGORIES.map((category) => [category, 0]));

  productFiles.forEach((fileName, index) => {
    const baseName = normalizeBaseName(fileName);
    const seed = hashString(baseName + String(index));
    const brand = detectBrand(baseName);
    const category = detectCategory(baseName);
    const subcategory = inferSubcategory(baseName, category);
    const brandName = brand?.name || 'Glow Addict';
    const title = buildProductName(baseName, brandName, index + 1);

    const slug = slugify(`${brandName}-${title}`);
    const { originalPrice, offerPrice, discountPercent } = createPricing(seed, category);
    const tags = Array.from(new Set([
      slugify(category),
      slugify(subcategory),
      slugify(brandName),
      baseName.includes('spf') || baseName.includes('sunscreen') ? 'spf50' : null,
      baseName.includes('vitamin-c') ? 'vitamin-c' : null,
      baseName.includes('niacinamide') ? 'niacinamide' : null,
      (seed % 4 === 0) ? 'best-seller' : null,
      (seed % 5 === 0) ? 'trending' : null,
    ].filter(Boolean)));

    const product = {
      id: slug,
      title,
      brand: brandName,
      category,
      subcategory,
      originalPrice,
      offerPrice,
      discount: discountPercent,
      image: `/images/${encodeURIComponent(fileName)}`,
      tags,
      skinType: SKIN_TYPE_BY_CATEGORY[category] || ['All'],
      ingredients: detectIngredients(baseName, category),
      benefits: BENEFITS_BY_CATEGORY[category] || ['Premium quality', 'Visible results', 'Everyday glow'],
      shades: inferShades(baseName, category),
      usageInstructions: inferHowToUse(category),
      seoKeywords: createSeoKeywords(title, brandName, category),
      seo: {
        seoTitle: `${title} | Glow Addict by Sayanita`,
        metaDescription: `Buy ${title} at Glow Addict by Sayanita. Authentic ${brandName} ${category.toLowerCase()} with premium offers and fast delivery across India.`,
        slug,
        canonicalUrl: makeCanonical(`/products/${slug}`),
        openGraphImage: `/images/${encodeURIComponent(fileName)}`,
        twitterCard: 'summary_large_image',
        schemaType: 'Product',
      },
      ratingAvg: Number((4 + (seed % 10) / 10).toFixed(1)),
      ratingCount: 40 + (seed % 500),
      isBestSeller: seed % 4 === 0,
      isTrending: seed % 5 === 0,
      isNewArrival: index < 16,
      stockQuantity: 8 + (seed % 80),
      sku: `GA-${String(index + 1).padStart(4, '0')}`,
    };

    products.push(product);
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);

    if (brand) {
      brandsById.set(brand.id, {
        id: brand.id,
        name: brand.name,
        slug: slugify(brand.name),
        isPremium: true,
        logoUrl: logoImage ? `/images/${encodeURIComponent(logoImage)}` : '/images/logo.png',
        description: `${brand.name} beauty products curated by Glow Addict by Sayanita`,
      });
    }
  });

  for (const brand of BRAND_MAP) {
    if (!brandsById.has(brand.id)) {
      brandsById.set(brand.id, {
        id: brand.id,
        name: brand.name,
        slug: slugify(brand.name),
        isPremium: true,
        logoUrl: logoImage ? `/images/${encodeURIComponent(logoImage)}` : '/images/logo.png',
        description: `${brand.name} beauty products curated by Glow Addict by Sayanita`,
      });
    }
  }

  const categories = REQUIRED_CATEGORIES.map((name, index) => ({
    id: `cat-${String(index + 1).padStart(3, '0')}`,
    name,
    slug: slugify(name),
    imageUrl: products.find((product) => product.category === name)?.image || '/images/logo.png',
    icon: name.slice(0, 1),
    description: `${name} collection by Glow Addict by Sayanita`,
    productCount: categoryCounts.get(name) || 0,
  }));

  const comboCandidates = products.filter((product) => ['Face Wash', 'Serum', 'Sunscreen', 'Moisturizer'].includes(product.category));
  const comboBundles = [
    {
      id: 'combo-glow-ritual',
      title: 'Glow Ritual Combo',
      productIds: comboCandidates.slice(0, 3).map((item) => item.id),
      discountPercent: 18,
      image: comboImage ? `/images/${encodeURIComponent(comboImage)}` : (comboCandidates[0]?.image || '/images/logo.png'),
    },
    {
      id: 'combo-daily-defense',
      title: 'Daily Defense Combo',
      productIds: comboCandidates.slice(3, 6).map((item) => item.id),
      discountPercent: 22,
      image: comboImage ? `/images/${encodeURIComponent(comboImage)}` : (comboCandidates[1]?.image || '/images/logo.png'),
    },
    {
      id: 'combo-weekend-radiance',
      title: 'Weekend Radiance Combo',
      productIds: comboCandidates.slice(6, 9).map((item) => item.id),
      discountPercent: 25,
      image: comboImage ? `/images/${encodeURIComponent(comboImage)}` : (comboCandidates[2]?.image || '/images/logo.png'),
    }
  ];

  const data = {
    generatedAt: new Date().toISOString(),
    siteName: 'Glow Addict by Sayanita',
    media: {
      logo: logoImage ? `/images/${encodeURIComponent(logoImage)}` : '/images/logo.png',
      freebies: freebiesImage ? `/images/${encodeURIComponent(freebiesImage)}` : '/images/freebies-alert.jpeg',
      combo: comboImage ? `/images/${encodeURIComponent(comboImage)}` : '/images/logo.png',
    },
    stats: {
      totalImageFiles: files.length,
      totalProductImages: productFiles.length,
      totalProducts: products.length,
      totalBrands: brandsById.size,
      totalCategories: categories.length,
    },
    businessRules: {
      noReturn: true,
      noReplacement: true,
      freeDeliveryAbove: 799,
      shippingChargeBelow: 45,
      codAvailable: false,
    },
    contact: {
      email: 'support@glowaddict.in',
      phone: '+91 98765 43210',
      instagram: 'https://www.instagram.com/glow_addict_by_sayanita',
      whatsapp: 'https://wa.me/919876543210',
    },
    products,
    categories,
    brands: Array.from(brandsById.values()),
    comboBundles,
  };

  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`Generated ${data.products.length} products from ${data.stats.totalProductImages} images.`);
}

main();
