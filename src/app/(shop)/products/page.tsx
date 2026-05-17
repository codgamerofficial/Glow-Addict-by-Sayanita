'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { brands } from '@/data/brands';
import { categories, skinConcerns, skinTypes } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

function FilterSection({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="filter-section">
      <h4>{title}</h4>
      <div>
        {items.map((item) => {
          const active = selected.includes(item?.toString().trim().toLowerCase().replace(/ & /g, '-').replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, ''));
          return (
            <button key={item} type="button" onClick={() => onToggle(item)} className={active ? 'filter-chip active' : 'filter-chip'}>
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="container-main" style={{ padding: '40px 18px' }}>
          <div className="skeleton" style={{ width: '100%', height: 420 }} />
        </div>
      }
    >
      <ProductsPage />
    </Suspense>
  );
}

function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const normalizedCategoryParam = categoryParam ? categoryParam.trim().toLowerCase() : null;
  const initialCategory = normalizedCategoryParam ? [normalizedCategoryParam] : [];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const brandParam = searchParams.get('brand');
  const initialBrands = brandParam ? brandParam.split(',').map((b) => b.trim().toLowerCase()) : [];

  const maxPriceParam = searchParams.get('maxPrice');
  const initialMaxPrice = maxPriceParam ? Number(maxPriceParam) : 3000;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, initialMaxPrice]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ensure we don't show empty state before initial "fetch" (hydration)
    const t = setTimeout(() => setLoading(false), 80);
    return () => clearTimeout(t);
  }, []);

  // sync filters to URL for deep linking
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length) params.set('category', selectedCategories[0]);
    if (selectedBrands.length) params.set('brand', selectedBrands.map((b) => slugify(b)).join(','));
    if (priceRange[1] !== 3000) params.set('maxPrice', String(priceRange[1]));
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    // replace without history entry
    router.replace(url);
  }, [selectedCategories, selectedBrands, priceRange, pathname, router]);

  const slugify = (input: string | undefined | null) =>
    (input || '').toString().trim().toLowerCase().replace(/ & /g, '-').replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');

  const toggleFilter = (arr: string[], value: string, setter: (next: string[]) => void) => {
    const v = slugify(value);
    setter(arr.includes(v) ? arr.filter((item) => item !== v) : [...arr, v]);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length) {
      result = result.filter((product) => selectedCategories.includes(slugify(product.categoryName)));
    }
    if (selectedBrands.length) result = result.filter((product) => selectedBrands.map((b) => slugify(b)).includes(slugify(product.brandName)));
    if (selectedSkinTypes.length) result = result.filter((product) => product.skinTypes.some((type: string) => selectedSkinTypes.map(slugify).includes(slugify(type))));
    if (selectedConcerns.length) result = result.filter((product) => product.concerns.some((concern: string) => selectedConcerns.map(slugify).includes(slugify(concern))));
    result = result.filter((product) => {
      const price = product.salePrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case 'newest':
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
    }

    return result;
  }, [selectedCategories, selectedBrands, selectedSkinTypes, selectedConcerns, sortBy, priceRange]);

  const activeFilterCount = selectedCategories.length + selectedBrands.length + selectedSkinTypes.length + selectedConcerns.length;
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSkinTypes([]);
    setSelectedConcerns([]);
    setPriceRange([0, 3000]);
  };
  const title = normalizedCategoryParam ? (categories.find((c) => c.slug === normalizedCategoryParam)?.name || 'Products') : 'All Beauty';

  return (
    <div className="products-page animate-fade-in">
      <section className="products-hero">
        <div className="container-main products-hero-inner">
          <div>
            <p><Sparkles size={17} /> Glow Addict catalog</p>
            <h1>{title}</h1>
            <span>{filtered.length} premium products found</span>
          </div>
          <div className="products-hero-offer">
            <strong>EXTRA20</strong>
            <span>First order code</span>
          </div>
        </div>
      </section>

      <section className="container-main products-toolbar">
        <button type="button" onClick={() => setFiltersOpen((open) => !open)} className="btn-outline filter-toggle">
          {filtersOpen ? <X size={17} /> : <SlidersHorizontal size={17} />} Filters
          {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
        </button>

        <div className="sort-wrap">
          <select aria-label="Sort products" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input-glass">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={17} />
        </div>
      </section>

      <section className={`container-main products-layout ${filtersOpen ? 'products-layout-with-filters' : ''}`}>
        <motion.aside
          className={`filter-sidebar ${filtersOpen ? 'filter-sidebar-open' : ''}`}
          initial={false}
          animate={{ opacity: filtersOpen ? 1 : 0.98 }}
        >
          <div className="filter-header">
            <h3>Refine shelf</h3>
            <button type="button" onClick={clearFilters}>
              Clear all
            </button>
          </div>
          <FilterSection title="Category" items={categories.map((c) => c.slug)} selected={selectedCategories} onToggle={(v) => toggleFilter(selectedCategories, v, setSelectedCategories)} />
          <FilterSection title="Brand" items={brands.map((b) => b.name)} selected={selectedBrands} onToggle={(v) => toggleFilter(selectedBrands, v, setSelectedBrands)} />
          <FilterSection title="Skin Type" items={skinTypes} selected={selectedSkinTypes} onToggle={(v) => toggleFilter(selectedSkinTypes, v, setSelectedSkinTypes)} />
          <FilterSection title="Concern" items={skinConcerns.slice(0, 8)} selected={selectedConcerns} onToggle={(v) => toggleFilter(selectedConcerns, v, setSelectedConcerns)} />
          <div className="filter-section">
            <h4>Max price</h4>
            <input
              type="range"
              min="300"
              max="3000"
              step="100"
              value={priceRange[1]}
              onChange={(event) => setPriceRange([0, Number(event.target.value)])}
            />
            <p>Under &#8377;{priceRange[1].toLocaleString()}</p>
          </div>
        </motion.aside>

        <div className="products-results">
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                // lightweight shimmer placeholders
                <div key={i} className="product-skeleton">
                  <div className="skeleton image" />
                  <div className="skeleton line" />
                  <div className="skeleton line short" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="premium-empty">
              <div className="empty-illustration">
                <img src="/images/freebies-alert.jpeg" alt="No products" />
              </div>
              <div className="empty-copy">
                <h3>Nothing here yet — curated picks incoming</h3>
                <p>We couldn't find products matching your filters. Try clearing filters or explore our recommended picks below.</p>
                <div className="empty-actions">
                  <button type="button" onClick={clearFilters} className="btn-outline">Clear filters</button>
                  <a href="/products" className="btn-gradient">Continue shopping</a>
                </div>
                <h4>Recommended for you</h4>
                <div className="recommended-grid">
                  {products
                    .filter((p) => p.isBestseller || p.isTrending)
                    .slice(0, 6)
                    .map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .products-page {
          padding-bottom: 70px;
        }

        .products-hero {
          padding: 44px 0 36px;
          background:
            radial-gradient(circle at 88% 12%, rgba(255, 212, 71, 0.48), transparent 25%),
            linear-gradient(135deg, #fff8fd, #ffe1f0 54%, #eaffd6);
        }

        [data-theme="dark"] .products-hero {
          background:
            radial-gradient(circle at 88% 12%, rgba(255, 212, 71, 0.2), transparent 25%),
            linear-gradient(135deg, #140816, #28102c 58%, #132014);
        }

        .products-hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .products-hero p {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 12px;
          color: var(--primary);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 900;
        }

        .products-hero h1 {
          color: var(--text-primary);
          font-size: clamp(44px, 8vw, 86px);
          font-weight: 900;
          line-height: 0.9;
        }

        .products-hero div > span {
          display: block;
          margin-top: 14px;
          color: var(--text-secondary);
          font-size: 16px;
          font-weight: 700;
        }

        .products-hero-offer {
          min-width: 184px;
          padding: 22px;
          border-radius: 26px;
          color: #fff;
          text-align: center;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          box-shadow: var(--shadow-glow);
          transform: rotate(3deg);
        }

        .products-hero-offer strong {
          display: block;
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 900;
        }

        .products-hero-offer span {
          color: rgba(255, 255, 255, 0.82);
          font-size: 13px;
          font-weight: 800;
        }

        .products-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 24px;
          padding-bottom: 20px;
        }

        .filter-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 18px;
        }

        .filter-toggle span {
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          color: #fff;
          background: var(--primary);
          font-size: 11px;
        }

        .sort-wrap {
          position: relative;
          min-width: 220px;
        }

        .sort-wrap select {
          padding-right: 42px;
          cursor: pointer;
          appearance: none;
        }

        .sort-wrap svg {
          position: absolute;
          top: 50%;
          right: 16px;
          color: var(--text-muted);
          pointer-events: none;
          transform: translateY(-50%);
        }

        .products-layout {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .product-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(5, 1fr);
        }

        @media (max-width: 1200px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .product-skeleton {
          border-radius: 12px;
          padding: 12px;
          background: linear-gradient(180deg, var(--bg-surface), rgba(255,255,255,0.02));
          box-shadow: var(--shadow-card);
        }

        .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 37%, #f0f0f0 63%); background-size: 400% 100%; animation: shimmer 1.2s linear infinite; }
        .skeleton.image { height: 160px; border-radius: 10px; margin-bottom: 10px; }
        .skeleton.line { height: 14px; border-radius: 8px; margin-bottom: 8px; }
        .skeleton.line.short { width: 60%; }

        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

        .premium-empty { display: grid; grid-template-columns: 360px 1fr; gap: 28px; align-items: start; }
        .empty-illustration img { width: 100%; border-radius: 18px; box-shadow: var(--shadow-card); }
        .empty-copy h3 { font-size: 28px; font-weight: 900; margin-bottom: 8px; }
        .empty-actions { display: flex; gap: 12px; margin: 14px 0 18px; }
        .recommended-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }


        .filter-sidebar {
          position: sticky;
          top: 126px;
          display: none;
          padding: 20px;
          border: 1px solid var(--line);
          border-radius: 26px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-card);
        }

        .filter-sidebar-open {
          display: block;
        }

        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .filter-header h3 {
          font-size: 19px;
          font-weight: 900;
        }

        .filter-header button {
          border: 0;
          color: var(--primary);
          background: transparent;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .filter-section {
          margin-bottom: 22px;
        }

        .filter-section h4 {
          margin-bottom: 10px;
          color: var(--text-primary);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .filter-section > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .filter-chip {
          min-height: 34px;
          padding: 8px 11px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--text-secondary);
          background: transparent;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s var(--spring);
        }

        .filter-chip:hover,
        .filter-chip.active {
          color: #fff;
          border-color: transparent;
          background: var(--primary);
        }

        .filter-section input[type="range"] {
          width: 100%;
          accent-color: var(--primary);
        }

        .filter-section p {
          margin-top: 8px;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 800;
        }

        .products-results {
          min-width: 0;
        }

        .empty-state {
          display: grid;
          place-items: center;
          min-height: 340px;
          padding: 34px;
          border: 1px solid var(--line);
          border-radius: 28px;
          text-align: center;
          background: var(--bg-surface);
          box-shadow: var(--shadow-card);
        }

        .empty-state h3 {
          font-size: 28px;
          font-weight: 900;
        }

        .empty-state p {
          margin: 10px 0 18px;
          color: var(--text-muted);
        }

        .empty-state button {
          padding: 0 22px;
        }

        @media (max-width: 980px) {
          .products-layout {
            grid-template-columns: 1fr;
          }

          .filter-sidebar {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 640px) {
          .products-hero-inner,
          .products-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .products-hero-offer {
            width: 100%;
            transform: none;
          }

          .sort-wrap {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
