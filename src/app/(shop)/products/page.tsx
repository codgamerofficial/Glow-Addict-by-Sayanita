'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products } from '@/data/products';
import { categories, skinTypes, skinConcerns } from '@/data/categories';
import { brands } from '@/data/brands';
import ProductCard from '@/components/product/ProductCard';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

const FilterSection = ({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (v: string) => void }) => (
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items.map(item => {
        const active = selected.includes(item);
        return (
          <button key={item} onClick={() => onToggle(item)} style={{
            padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid',
            background: active ? 'rgba(233,30,140,0.15)' : 'transparent',
            borderColor: active ? 'var(--primary)' : 'var(--border-glass)',
            color: active ? 'var(--primary)' : 'var(--text-secondary)',
          }}>{item}</button>
        );
      })}
    </div>
  </div>
);

export default function ProductsPageWrapper() {
  return <Suspense fallback={<div className="container-main" style={{ padding: '40px', textAlign: 'center' }}><div className="skeleton" style={{ width: '100%', height: '400px' }} /></div>}><ProductsPage /></Suspense>;
}

function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);

  const toggleFilter = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length) result = result.filter(p => selectedCategories.includes(p.categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')));
    if (selectedBrands.length) result = result.filter(p => selectedBrands.includes(p.brandName));
    if (selectedSkinTypes.length) result = result.filter(p => p.skinTypes.some(st => selectedSkinTypes.includes(st)));
    if (selectedConcerns.length) result = result.filter(p => p.concerns.some(c => selectedConcerns.includes(c)));
    result = result.filter(p => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case 'price-desc': result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case 'rating': result.sort((a, b) => b.ratingAvg - a.ratingAvg); break;
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return result;
  }, [selectedCategories, selectedBrands, selectedSkinTypes, selectedConcerns, sortBy, priceRange]);

  const activeFilterCount = selectedCategories.length + selectedBrands.length + selectedSkinTypes.length + selectedConcerns.length;


  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
            {categoryParam ? categories.find(c => c.slug === categoryParam)?.name || 'Products' : 'All Products'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{filtered.length} products found</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>}
          </button>
          <div style={{ position: 'relative' }}>
            <select aria-label="Sort products" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-glass" style={{ paddingRight: '32px', fontSize: '13px', cursor: 'pointer', appearance: 'none', minWidth: '160px' }}>
              {sortOptions.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--bg-surface)' }}>{o.label}</option>)}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Filter sidebar */}
        {filtersOpen && (
          <div className="glass-card" style={{ width: '260px', padding: '20px', flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: '110px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600 }}>Filters</h3>
              <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSelectedSkinTypes([]); setSelectedConcerns([]); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>Clear All</button>
            </div>
            <FilterSection title="Category" items={categories.map(c => c.slug)} selected={selectedCategories} onToggle={(v) => toggleFilter(selectedCategories, v, setSelectedCategories)} />
            <FilterSection title="Brand" items={brands.map(b => b.name)} selected={selectedBrands} onToggle={(v) => toggleFilter(selectedBrands, v, setSelectedBrands)} />
            <FilterSection title="Skin Type" items={skinTypes} selected={selectedSkinTypes} onToggle={(v) => toggleFilter(selectedSkinTypes, v, setSelectedSkinTypes)} />
            <FilterSection title="Concern" items={skinConcerns.slice(0, 8)} selected={selectedConcerns} onToggle={(v) => toggleFilter(selectedConcerns, v, setSelectedConcerns)} />
          </div>
        )}

        {/* Product grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>😢</p>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Try adjusting your filters</p>
              <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSelectedSkinTypes([]); setSelectedConcerns([]); }}
                className="btn-outline" style={{ padding: '10px 24px' }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
