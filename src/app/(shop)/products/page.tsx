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
  <div className="mb-5">
    <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-2.5 uppercase tracking-wider">{title}</h4>
    <div className="flex flex-wrap gap-1.5">
      {items.map(item => {
        const active = selected.includes(item);
        return (
          <button key={item} onClick={() => onToggle(item)} className={`
            p-1.5 px-3 rounded-full text-[12px] font-medium cursor-pointer transition-all duration-200 border
            ${active ? 'bg-[rgba(233,30,140,0.15)] border-[var(--primary)] text-[var(--primary)]' : 'bg-transparent border-[var(--border-glass)] text-[var(--text-secondary)]'}
          `}>{item}</button>
        );
      })}
    </div>
  </div>
);

export default function ProductsPageWrapper() {
  return <Suspense fallback={<div className="container-main p-10 text-center"><div className="skeleton w-full h-[400px]" /></div>}><ProductsPage /></Suspense>;
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
    <div className="container-main animate-fade-in py-6 px-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-outfit text-[28px] font-bold mb-1">
            {categoryParam ? categories.find(c => c.slug === categoryParam)?.name || 'Products' : 'All Products'}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">{filtered.length} products found</p>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-outline p-2 px-4 text-[13px] flex items-center gap-1.5">
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && <span className="bg-[var(--primary)] text-white rounded-full w-[18px] h-[18px] text-[10px] flex items-center justify-center">{activeFilterCount}</span>}
          </button>
          <div className="relative">
            <select aria-label="Sort products" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-glass pr-8 text-[13px] cursor-pointer appearance-none min-w-[160px]">
              {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-[var(--bg-surface)]">{o.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        {filtersOpen && (
          <div className="glass-card w-[260px] p-5 shrink-0 self-start sticky top-[110px]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-outfit text-base font-semibold">Filters</h3>
              <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSelectedSkinTypes([]); setSelectedConcerns([]); }}
                className="bg-none border-none text-[var(--primary)] text-[12px] cursor-pointer font-medium">Clear All</button>
            </div>
            <FilterSection title="Category" items={categories.map(c => c.slug)} selected={selectedCategories} onToggle={(v) => toggleFilter(selectedCategories, v, setSelectedCategories)} />
            <FilterSection title="Brand" items={brands.map(b => b.name)} selected={selectedBrands} onToggle={(v) => toggleFilter(selectedBrands, v, setSelectedBrands)} />
            <FilterSection title="Skin Type" items={skinTypes} selected={selectedSkinTypes} onToggle={(v) => toggleFilter(selectedSkinTypes, v, setSelectedSkinTypes)} />
            <FilterSection title="Concern" items={skinConcerns.slice(0, 8)} selected={selectedConcerns} onToggle={(v) => toggleFilter(selectedConcerns, v, setSelectedConcerns)} />
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-[60px] px-5">
              <p className="text-[48px] mb-4">😢</p>
              <h3 className="font-outfit text-xl mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] mb-5">Try adjusting your filters</p>
              <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSelectedSkinTypes([]); setSelectedConcerns([]); }}
                className="btn-outline p-2.5 px-6">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
