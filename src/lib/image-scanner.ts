import { Product, Category, Brand } from '@/types/product';
import { readdirSync, renameSync, existsSync } from 'fs';
import { join } from 'path';

const IMAGE_DIR = join(process.cwd(), 'public', 'images');

const BRAND_PATTERNS: Record<string, { id: string; name: string; keywords: string[] }> = {
  dotkey: { id: 'dot-key', name: 'Dot & Key', keywords: ['dotkey', 'dot-key', 'dot & key'] },
  plum: { id: 'plum', name: 'Plum', keywords: ['plum'] },
  mars: { id: 'mars', name: 'MARS', keywords: ['mars'] },
  cetaphil: { id: 'cetaphil', name: 'Cetaphil', keywords: ['cetaphil'] },
  dove: { id: 'dove', name: 'Dove', keywords: ['dove'] },
  foxtale: { id: 'foxtale', name: 'Foxtale', keywords: ['foxtale'] },
  wishcare: { id: 'wishcare', name: 'WishCare', keywords: ['wishcare'] },
  insight: { id: 'insight', name: 'Insight', keywords: ['insight'] },
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Skincare': ['serum', 'moisturizer', 'facewash', 'cleanser', 'sunscreen', 'toner', 'gel', 'mask', 'radiance'],
  'Makeup': ['lipstick', 'eyeliner', 'highlighter', 'blush', 'trio'],
  'Tools': ['roller', 'fan', 'bristles'],
  'Bath & Body': ['body', 'polish', 'wipes'],
};

const SKIN_TYPE_MAP: Record<string, string[]> = {
  'serum': ['All', 'Oily', 'Combination'],
  'moisturizer': ['All', 'Dry', 'Normal'],
  'facewash': ['All', 'Oily', 'Acne-prone'],
  'cleanser': ['All', 'Sensitive'],
  'sunscreen': ['All'],
  'toner': ['All', 'Combination'],
  'lipstick': ['All'],
  'eyeliner': ['All'],
  'highlighter': ['All'],
  'mask': ['All'],
  'body': ['All', 'Dry'],
  'wipes': ['All'],
  'roller': ['All'],
  'fan': ['All'],
  'bristles': ['All'],
};

const CONCERN_MAP: Record<string, string[]> = {
  'serum': ['Hydration', 'Anti-aging', 'Brightening'],
  'moisturizer': ['Dryness', 'Hydration'],
  'facewash': ['Acne', 'Oil Control'],
  'cleanser': ['Gentleness', 'Sensitivity'],
  'sunscreen': ['Sun Protection'],
  'toner': ['Pores', 'Hydration'],
  'lipstick': [],
  'eyeliner': [],
  'highlighter': [],
  'mask': ['Brightening', 'Hydration'],
  'body': ['Hydration', 'Exfoliation'],
  'wipes': ['Convenience'],
  'roller': ['Circulation', 'Puffiness'],
  'fan': ['Setting'],
  'bristles': ['Application'],
};

interface ScannedImage {
  filename: string;
  originalName: string;
  brandId?: string;
  brandName?: string;
  productName: string;
  category: string;
  isWhatsApp: boolean;
  suggestedName?: string;
}

function detectBrand(filename: string): { id: string; name: string } | null {
  const lower = filename.toLowerCase();
  for (const [key, brand] of Object.entries(BRAND_PATTERNS)) {
    if (lower.startsWith(key + '-') || lower.includes('-' + key + '-')) {
      return { id: brand.id, name: brand.name };
    }
  }
  return null;
}

function detectCategory(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category;
      }
    }
  }
  return 'Beauty';
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function capitalizeWords(str: string): string {
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function parseProductName(filename: string): string {
  let name = filename.replace(/\.[^/.]+$/, '');
  name = name.replace(/^WhatsApp Image \d{4}-\d{2}-\d{2} at \d{2}\.\d{2}\.\d{2} (?:AM|PM)(?: \(\d+\))?\)/, 'unknown-product');
  name = name.replace(/^(dotkey|plum|mars|cetaphil|dove|foxtale|wishcare|insight)-/, '');
  return name || 'unknown-product';
}

export function scanImages(): {
  images: ScannedImage[];
  products: Product[];
  categories: Category[];
  brands: Brand[];
} {
  const files = readdirSync(IMAGE_DIR).filter(f => f.match(/\.(jpeg|jpg|png|webp)$/i));
  
  const images: ScannedImage[] = [];
  const products: Product[] = [];
  const categoriesMap = new Map<string, Category>();
  const brandsMap = new Map<string, Brand>();

  for (const file of files) {
    const isWhatsApp = file.startsWith('WhatsApp Image');
    const brand = detectBrand(file);
    const productName = parseProductName(file);
    const category = detectCategory(productName);

    let suggestedName = file;
    if (isWhatsApp) {
      const sequentialNum = images.filter(i => i.isWhatsApp).length + 1;
      suggestedName = `product-${sequentialNum}.jpeg`;
    }

    images.push({
      filename: file,
      originalName: file,
      brandId: brand?.id,
      brandName: brand?.name,
      productName,
      category,
      isWhatsApp,
      suggestedName,
    });

    if (brand && !brandsMap.has(brand.id)) {
      brandsMap.set(brand.id, {
        id: brand.id,
        name: brand.name,
        slug: generateSlug(brand.name),
        isPremium: false,
      });
    }

    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, {
        id: generateSlug(category),
        name: category,
        slug: generateSlug(category),
        imageUrl: `/images/category-${generateSlug(category)}.jpeg`,
        icon: category.charAt(0).toUpperCase(),
        productCount: 0,
      });
    }
  }

  for (const img of images) {
    if (!img.brandId) continue;

    const category = categoriesMap.get(img.category);
    const brand = brandsMap.get(img.brandId);
    if (!category || !brand) continue;

    const isBestseller = Math.random() > 0.7;
    const product: Product = {
      id: generateSlug(img.productName),
      name: capitalizeWords(img.productName),
      slug: generateSlug(img.productName),
      description: `${img.brandName} ${capitalizeWords(img.productName)} - Premium beauty product for your skincare and makeup needs.`,
      shortDesc: capitalizeWords(img.productName),
      brandId: brand.id,
      brandName: brand.name,
      categoryId: category.id,
      categoryName: category.name,
      price: Math.floor(Math.random() * 1000) + 200,
      currency: 'INR',
      images: [`/images/${img.filename}`],
      skinTypes: SKIN_TYPE_MAP[img.productName.split('-')[0]] || ['All'],
      concerns: CONCERN_MAP[img.productName.split('-')[0]] || [],
      ratingAvg: 4.0 + Math.random() * 1.0,
      ratingCount: Math.floor(Math.random() * 200) + 50,
      isBestseller,
      isNew: Math.random() > 0.8,
      badges: isBestseller ? ['Bestseller'] : [],
      tags: [img.category.toLowerCase(), img.brandName?.toLowerCase() || '', img.productName.split('-')[0]],
      stockQuantity: Math.floor(Math.random() * 100) + 20,
    };

    products.push(product);
  }

  const categories = Array.from(categoriesMap.values());
  const brands = Array.from(brandsMap.values());

  categories.forEach(c => {
    c.productCount = products.filter(p => p.categoryId === c.id).length;
  });

  return { images, products, categories, brands };
}

export function renameWhatsAppImages(dryRun: boolean = true): { renamed: string[]; skipped: string[] } {
  const files = readdirSync(IMAGE_DIR).filter(f => f.startsWith('WhatsApp Image'));
  const renamed: string[] = [];
  const skipped: string[] = [];
  let counter = 1;

  for (const file of files) {
    const newName = `whatsapp-product-${counter}.jpeg`;
    const oldPath = join(IMAGE_DIR, file);
    const newPath = join(IMAGE_DIR, newName);

    if (existsSync(newPath)) {
      skipped.push(file);
      continue;
    }

    if (!dryRun) {
      renameSync(oldPath, newPath);
    }
    renamed.push(`${file} -> ${newName}`);
    counter++;
  }

  return { renamed, skipped };
}

export function generateProductsJson(): string {
  const { products, categories, brands } = scanImages();
  return JSON.stringify({ products, categories, brands }, null, 2);
}