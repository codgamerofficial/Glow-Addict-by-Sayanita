import fs from 'fs/promises';
import path from 'path';

const repoRoot = process.cwd();
const imagesDir = path.join(repoRoot, 'public', 'images');
const generatedPath = path.join(repoRoot, 'src', 'data', 'generated-catalog.json');

function normalize(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function run() {
  try {
    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter(f => /\.(jpe?g|png|webp|gif|avif)$/i.test(f));
    const names = imageFiles.map(f => ({
      file: f,
      key: normalize(f),
      raw: f,
    }));

    const raw = await fs.readFile(generatedPath, 'utf8');
    const json = JSON.parse(raw);
    const products = json.products || [];

    let updated = 0;
    let mappedImageCount = 0;

    for (const p of products) {
      const candidates = [];
      const keysToTry = new Set();
      if (p.slug) keysToTry.add(normalize(p.slug));
      if (p.seo && p.seo.slug) keysToTry.add(normalize(p.seo.slug));
      if (p.title) keysToTry.add(normalize(p.title));
      if (p.id) keysToTry.add(normalize(p.id));

      // try exact matches first
      for (const k of keysToTry) {
        for (const img of names) {
          if (img.key === k) candidates.push(img.file);
        }
      }

      // try contains matches
      if (candidates.length === 0) {
        for (const k of keysToTry) {
          for (const img of names) {
            if (img.key.includes(k) || k.includes(img.key)) candidates.push(img.file);
          }
        }
      }

      // filter out logo/freebies
      const filtered = candidates.filter(f => !/logo|freebies|whatsapp/i.test(f));

      if (filtered.length > 0) {
        const mapped = Array.from(new Set(filtered)).map(f => `/images/${f}`);
        p.images = mapped;
        if (!p.image || p.image === '' || p.image === '/images/logo.png') p.image = mapped[0];
        updated++;
        mappedImageCount += mapped.length;
      }
    }

    // update stats
    if (!json.stats) json.stats = {};
    json.stats.totalProductImages = mappedImageCount;
    json.stats.totalProducts = products.length;

    await fs.writeFile(generatedPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Image mapping complete — products updated: ${updated}, images mapped: ${mappedImageCount}`);
  } catch (err) {
    console.error('Image mapping failed:', err.message);
    process.exitCode = 2;
  }
}

run();
