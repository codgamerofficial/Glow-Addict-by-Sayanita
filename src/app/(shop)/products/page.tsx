'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { brands } from '@/data/brands';
import { categories, skinConcerns, skinTypes } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types/product';

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
          const active = selected.includes(item);
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
  const queryParam = searchParams.get('q') || '';
  const initialCategory = categoryParam ? [categoryParam] : [];

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [serverProducts, setServerProducts] = useState<Product[]>(products);
  const [recoverySuggestions, setRecoverySuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const toggleFilter = (arr: string[], value: string, setter: (next: string[]) => void) => {
    setter(arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value]);
  };

  useEffect(() => {
    const controller = new AbortController();
    const runSearch = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const params = new URLSearchParams();
        params.set('mode', 'search');
        params.set('limit', '48');
        params.set('sort', sortBy);
        params.set('minPrice', String(priceRange[0]));
        params.set('maxPrice', String(priceRange[1]));
        if (queryParam.trim()) params.set('q', queryParam.trim());

        selectedCategories.forEach((category) => params.append('category', category));
        selectedBrands.forEach((brand) => params.append('brand', brand));
        selectedSkinTypes.forEach((skinType) => params.append('skinType', skinType));
        selectedConcerns.forEach((concern) => params.append('concern', concern));

        const response = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = await response.json();
        setServerProducts(Array.isArray(data.products) ? data.products : []);
        setRecoverySuggestions(Array.isArray(data.recoverySuggestions) ? data.recoverySuggestions : []);
        setDidYouMean(typeof data.didYouMean === 'string' ? data.didYouMean : null);
      } catch (error) {
        if (controller.signal.aborted) return;
        setFetchError('Search is temporarily unavailable. Showing available catalog items.');
        setServerProducts(products);
        setRecoverySuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void runSearch();

    return () => controller.abort();
  }, [queryParam, selectedCategories, selectedBrands, selectedSkinTypes, selectedConcerns, sortBy, priceRange]);

  const filtered = useMemo(() => serverProducts, [serverProducts]);

  const activeFilterCount = selectedCategories.length + selectedBrands.length + selectedSkinTypes.length + selectedConcerns.length;
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSkinTypes([]);
    setSelectedConcerns([]);
    setPriceRange([0, 3000]);
  };
  
  const categoryTitles: Record<string, string> = {
    'facewash': 'Facewash',
    'sunscreen': 'Sunscreen',
    'moisturizer': 'Moisturizer',
    'serum': 'Serum',
    'body-mist': 'Body Mist',
    'face-scrub': 'Face Scrub',
    'lip-balm': 'Lip Balm',
    'lip-gloss': 'Lip Gloss',
    'face-mask': 'Face Mask',
    'sheet-mask': 'Sheet Mask',
    'strobe-cream': 'Strobe Cream',
    'night-cream': 'Night Cream',
    'body-scrub': 'Body Scrub',
    'body-wash': 'Body Wash',
    'under-arm-roll-on': 'Under Arm Roll On',
    'nails': 'Nails',
    'combo': 'Combo',
  };
  
  const title = queryParam
    ? `Results for "${queryParam}"`
    : categoryParam
      ? categoryTitles[categoryParam.toLowerCase()] || categoryParam
      : 'All Products';

  return (
    <div className="products-page animate-fade-in">
      <section className="products-hero">
        <div className="container-main products-hero-inner">
          <div>
            <p><Sparkles size={17} /> Glow Addict</p>
            <h1>{title}</h1>
            {filtered.length > 0 && (
              <span>{filtered.length} {filtered.length === 1 ? 'product' : 'products'} available</span>
            )}
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

      {didYouMean && queryParam && didYouMean !== queryParam.toLowerCase() && (
        <section className="container-main" style={{ paddingBottom: '14px' }}>
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString());
              next.set('q', didYouMean);
              window.location.href = `/products?${next.toString()}`;
            }}
            className="btn-outline"
            style={{ minHeight: '42px', padding: '0 14px', color: 'var(--primary)' }}
          >
            Did you mean: {didYouMean}
          </button>
        </section>
      )}

      {fetchError && (
        <section className="container-main" style={{ paddingBottom: '14px' }}>
          <div className="glass-card" style={{ padding: '12px 14px', color: '#92400E', background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.32)' }}>
            {fetchError}
          </div>
        </section>
      )}

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
          <FilterSection title="Category" items={['Facewash', 'Sunscreen', 'Moisturizer', 'Serum', 'Body Mist', 'Face Scrub', 'Lip Balm', 'Lip Gloss', 'Face Mask', 'Sheet Mask', 'Strobe Cream', 'Night Cream', 'Body Scrub', 'Body Wash', 'Under Arm Roll On', 'Nails', 'Combo']} selected={selectedCategories} onToggle={(v) => toggleFilter(selectedCategories, v, setSelectedCategories)} />
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
          {isLoading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ width: '100%', height: 360, borderRadius: 24 }} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" stroke="url(#grad)" strokeWidth="2" strokeDasharray="6 4" fill="none"/>
                  <path d="M40 20C40 20 30 35 30 45C30 52 35 58 40 58C45 58 50 52 50 45C50 35 40 20 40 20Z" fill="url(#grad)" opacity="0.6"/>
                  <circle cx="36" cy="42" r="3" fill="white"/>
                  <circle cx="44" cy="42" r="3" fill="white"/>
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f472b6"/>
                      <stop offset="100%" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3>No products available right now</h3>
              <p>We are working on adding more products in this category. Check back soon!</p>
              <div className="empty-state-actions">
                <button type="button" onClick={clearFilters} className="btn-gradient">
                  <span>Explore all categories</span>
                </button>
                <a href="/products" className="btn-outline">
                  Browse all products
                </a>
              </div>
              {recoverySuggestions.length > 0 && (
                <div style={{ marginTop: '28px', textAlign: 'left', width: '100%' }}>
                  <h4 style={{ fontFamily: 'Outfit', fontSize: '20px', marginBottom: '10px', color: 'var(--text-secondary)' }}>Explore trending products</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Discover our most popular beauty picks while you wait.
                  </p>
                  <div className="product-grid">
                    {recoverySuggestions.slice(0, 6).map((product) => (
                      <ProductCard key={`recovery-${product.id}`} product={product} />
                    ))}
                  </div>
                </div>
              )}
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
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 400px;
          padding: 60px 34px;
          border: 1px solid var(--line);
          border-radius: 28px;
          text-align: center;
          background: linear-gradient(180deg, var(--bg-surface) 0%, rgba(253, 242, 248, 0.3) 100%);
          box-shadow: var(--shadow-card);
        }

        .empty-state-icon {
          margin-bottom: 24px;
          animation: float-gentle 3s ease-in-out infinite;
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .empty-state h3 {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .empty-state p {
          margin: 0 0 24px;
          color: var(--text-muted);
          font-size: 16px;
          max-width: 400px;
          line-height: 1.6;
        }

        .empty-state-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .empty-state button,
        .empty-state a {
          padding: 12px 24px;
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

          .sort-wrap {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
