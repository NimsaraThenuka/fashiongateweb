import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';
import { categories } from '../data/products';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { useReveal } from '../hooks/useReveal';

const SORT_OPTIONS = [
  { val: 'featured', label: 'Featured' },
  { val: 'price-asc', label: 'Price: Low to High' },
  { val: 'price-desc', label: 'Price: High to Low' },
  { val: 'rating', label: 'Top Rated' },
  { val: 'newest', label: 'New Arrivals' },
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under Rs. 15,000', min: 0, max: 15000 },
  { label: 'Rs. 15,000 – Rs. 30,000', min: 15000, max: 30000 },
  { label: 'Rs. 30,000 – Rs. 60,000', min: 30000, max: 60000 },
  { label: 'Over Rs. 60,000', min: 60000, max: Infinity },
];

/* ── Women's sub-filter config ── */
const WOMEN_OCCASIONS = [
  { id: 'new',     label: 'New In' },
  { id: 'work',    label: 'Work Wear' },
  { id: 'casual',  label: 'Casual Wear' },
  { id: 'evening', label: 'Evening Wear' },
  { id: 'active',  label: 'Active Wear' },
  { id: 'denim',   label: 'Denim' },
  { id: 'natural', label: 'Natural Blends' },
];
const WOMEN_CLOTHING = ['Dresses','Tops','Pants','Blazers','Jeans','Jumpsuits','Shorts'];

/* ── Men's sub-filter config ── */
const MEN_CLOTHING = ['T-Shirts','Shirts','Pants','Polo Shirts','Shorts','Jackets','Jeans'];

/* ── Kids' sub-filter config ── */
const KIDS_CLOTHING = ['Dresses', 'Shirts', 'Sets', 'Shorts'];
const KIDS_TAGS = [
  { id: 'new', label: 'New In' },
  { id: 'girls', label: "Girls" },
  { id: 'boys', label: "Boys" },
  { id: 'festive', label: 'Festive Wear' },
];

export default function Shop() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'all';
  const subParam = searchParams.get('sub') || 'all';
  const tagParam = searchParams.get('tag') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [grid, setGrid] = useState<2 | 4>(4);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useReveal();

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', catId);
    }
    newParams.delete('sub');
    newParams.delete('tag');
    setSearchParams(newParams);
  };

  const handleSubcategoryChange = (subId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (subId === 'all') {
      newParams.delete('sub');
    } else {
      newParams.set('sub', subId);
    }
    newParams.delete('tag');
    setSearchParams(newParams);
  };

  const handleTagChange = (tagId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (tagId === 'all') {
      newParams.delete('tag');
    } else {
      newParams.set('tag', tagId);
    }
    newParams.delete('sub');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange(0);
  };

  const hasActiveFilters = catParam !== 'all' || subParam !== 'all' || tagParam !== 'all' || priceRange !== 0;

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (catParam !== 'all') {
      result = result.filter(p => p.category === catParam);
    }

    if (subParam !== 'all') {
      result = result.filter(p => p.subcategory.toLowerCase() === subParam.toLowerCase());
    }

    if (tagParam !== 'all') {
      const tag = tagParam.toLowerCase();
      if (tag === 'new') {
        result = result.filter(p => p.badge === 'new' || p.badge === 'trending');
      } else if (tag === 'work') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('work') ||
          p.description.toLowerCase().includes('tailored') ||
          p.subcategory.toLowerCase().includes('blazers') ||
          p.subcategory.toLowerCase().includes('shirts')
        );
      } else if (tag === 'casual') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('casual') ||
          p.description.toLowerCase().includes('summer') ||
          p.subcategory.toLowerCase().includes('shirts') ||
          p.subcategory.toLowerCase().includes('shorts') ||
          p.subcategory.toLowerCase().includes('dresses')
        );
      } else if (tag === 'evening') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('evening') ||
          p.description.toLowerCase().includes('saree') ||
          p.description.toLowerCase().includes('luxe') ||
          p.description.toLowerCase().includes('kaftan')
        );
      } else if (tag === 'active') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('active') ||
          p.subcategory.toLowerCase().includes('shorts') ||
          p.subcategory.toLowerCase().includes('pants')
        );
      } else if (tag === 'denim') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('denim') ||
          p.subcategory.toLowerCase().includes('jeans')
        );
      } else if (tag === 'natural') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('linen') ||
          p.description.toLowerCase().includes('cotton') ||
          p.description.toLowerCase().includes('silk') ||
          p.description.toLowerCase().includes('handloom')
        );
      } else if (tag === 'girls') {
        result = result.filter(p =>
          p.name.toLowerCase().includes('girl') ||
          p.subcategory.toLowerCase().includes('dresses') ||
          p.description.toLowerCase().includes('girl') ||
          p.description.toLowerCase().includes('frock')
        );
      } else if (tag === 'boys') {
        result = result.filter(p =>
          p.name.toLowerCase().includes('boy') ||
          p.subcategory.toLowerCase().includes('shirts') ||
          p.description.toLowerCase().includes('boy') ||
          p.description.toLowerCase().includes('sarong')
        );
      } else if (tag === 'festive') {
        result = result.filter(p =>
          p.description.toLowerCase().includes('festive') ||
          p.description.toLowerCase().includes('celebration') ||
          p.subcategory.toLowerCase().includes('sets')
        );
      }
    }

    const pr = PRICE_RANGES[priceRange];
    result = result.filter(p => p.price >= pr.min && p.price <= pr.max);

    switch (sort) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'newest': return result.filter(p => p.badge === 'new').concat(result.filter(p => p.badge !== 'new'));
      default: return result;
    }
  }, [catParam, subParam, tagParam, sort, priceRange, searchParam]);

  const activeCategoryLabel = useMemo(() => {
    if (searchParam) return `Results for "${searchParam}"`;
    const catObj = categories.find(c => c.id === catParam);
    let label = catObj ? catObj.label : 'Shop All';
    if (subParam !== 'all') {
      label += ` — ${subParam.charAt(0).toUpperCase() + subParam.slice(1)}`;
    }
    if (tagParam !== 'all') {
      const tagObj = WOMEN_OCCASIONS.find(t => t.id === tagParam);
      label += ` — ${tagObj ? tagObj.label : tagParam.toUpperCase()}`;
    }
    return label;
  }, [catParam, subParam, tagParam, searchParam]);

  /* shared pill style */
  const pill = (active: boolean) =>
    `px-4 py-2 text-[10px] tracking-[0.08em] uppercase font-medium transition-all duration-200 cursor-pointer ${
      active
        ? 'bg-[#C4922A] text-white shadow-sm'
        : 'border border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A] bg-white'
    }`;

  const showSubFilters = catParam === 'women' || catParam === 'men' || catParam === 'kids';

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Header */}
      <div
        className="relative flex items-end pb-16 pt-12"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=400&fit=crop&auto=format)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#0A0A0A]/75" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2">Fashion Gate</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white">
            {activeCategoryLabel}
          </h1>
          <p className="text-white/50 mt-2 text-sm">{filtered.length} pieces</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {/* ─── Toolbar ─── */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6 pb-5 border-b border-[#E8E4DF]">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={pill(catParam === cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Price filter button */}
            <div className="relative">
              <button
                onClick={() => { setPriceOpen(!priceOpen); setSortOpen(false); }}
                className="flex items-center gap-2 text-xs tracking-[0.08em] uppercase font-medium text-[#4A4A4A] hover:text-[#C4922A] transition-colors border border-[#E8E4DF] px-4 py-2 hover:border-[#C4922A] cursor-pointer"
              >
                <SlidersHorizontal size={13} /> Price
                <ChevronDown size={12} className={`transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
              </button>
              {priceOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-md border border-[#E8E4DF]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] z-20 min-w-[200px] py-2 rounded-sm animate-dropdown">
                  {PRICE_RANGES.map((pr, i) => (
                    <button
                      key={i}
                      onClick={() => { setPriceRange(i); setPriceOpen(false); }}
                      className={`block w-full text-left px-5 py-2.5 text-[10px] tracking-[0.06em] uppercase hover:bg-[#FAFAF8] hover:text-[#C4922A] transition-all cursor-pointer ${priceRange === i ? 'text-[#C4922A] font-semibold' : 'text-[#4A4A4A]'}`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => { setSortOpen(!sortOpen); setPriceOpen(false); }}
                className="flex items-center gap-2 text-xs tracking-[0.08em] uppercase font-medium text-[#4A4A4A] hover:text-[#C4922A] transition-colors border border-[#E8E4DF] px-4 py-2 hover:border-[#C4922A] cursor-pointer"
              >
                Sort <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-md border border-[#E8E4DF]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] z-20 min-w-[180px] py-2 rounded-sm animate-dropdown">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => { setSort(opt.val); setSortOpen(false); }}
                      className={`block w-full text-left px-5 py-2.5 text-[10px] tracking-[0.06em] uppercase hover:bg-[#FAFAF8] hover:text-[#C4922A] transition-all cursor-pointer ${sort === opt.val ? 'text-[#C4922A] font-semibold' : 'text-[#4A4A4A]'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid toggle */}
            <div className="flex border border-[#E8E4DF]">
              <button
                onClick={() => setGrid(4)}
                className={`p-2 transition-colors cursor-pointer ${grid === 4 ? 'bg-[#C4922A] text-white' : 'text-[#4A4A4A] hover:text-[#C4922A]'}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setGrid(2)}
                className={`p-2 transition-colors cursor-pointer ${grid === 2 ? 'bg-[#C4922A] text-white' : 'text-[#4A4A4A] hover:text-[#C4922A]'}`}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Sub-filter strips (auto-visible for Women's / Men's) ─── */}
        {showSubFilters && (
          <div className="mb-8 space-y-4 animate-dropdown">
            {/* Women's filters */}
            {catParam === 'women' && (
              <>
                {/* Occasions & Edits row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#C4922A] mr-2 shrink-0">Occasions</span>
                  <button onClick={() => handleTagChange('all')} className={pill(tagParam === 'all')}>All</button>
                  {WOMEN_OCCASIONS.map(o => (
                    <button key={o.id} onClick={() => handleTagChange(o.id)} className={pill(tagParam === o.id)}>
                      {o.label}
                    </button>
                  ))}
                </div>
                {/* Clothing row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#C4922A] mr-2 shrink-0">Clothing</span>
                  <button onClick={() => handleSubcategoryChange('all')} className={pill(subParam === 'all')}>All</button>
                  {WOMEN_CLOTHING.map(c => (
                    <button key={c} onClick={() => handleSubcategoryChange(c.toLowerCase())} className={pill(subParam.toLowerCase() === c.toLowerCase())}>
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Men's filters */}
            {catParam === 'men' && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#C4922A] mr-2 shrink-0">Clothing</span>
                  <button onClick={() => handleSubcategoryChange('all')} className={pill(subParam === 'all')}>All</button>
                  {MEN_CLOTHING.map(c => (
                    <button key={c} onClick={() => handleSubcategoryChange(c.toLowerCase())} className={pill(subParam.toLowerCase() === c.toLowerCase())}>
                      {c}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#C4922A] mr-2 shrink-0">Filter</span>
                  <button onClick={() => handleTagChange('all')} className={pill(tagParam === 'all')}>All</button>
                  <button onClick={() => handleTagChange('new')} className={pill(tagParam === 'new')}>New In</button>
                </div>
              </>
            )}

            {/* Kids' filters */}
            {catParam === 'kids' && (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#C4922A] mr-2 shrink-0">Edits</span>
                  <button onClick={() => handleTagChange('all')} className={pill(tagParam === 'all')}>All</button>
                  {KIDS_TAGS.map(t => (
                    <button key={t.id} onClick={() => handleTagChange(t.id)} className={pill(tagParam === t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-[#C4922A] mr-2 shrink-0">Clothing</span>
                  <button onClick={() => handleSubcategoryChange('all')} className={pill(subParam === 'all')}>All</button>
                  {KIDS_CLOTHING.map(c => (
                    <button key={c} onClick={() => handleSubcategoryChange(c.toLowerCase())} className={pill(subParam.toLowerCase() === c.toLowerCase())}>
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Active filter badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] tracking-[0.12em] uppercase text-[#9E9E9E]">Active:</span>
            {catParam !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A0A0A] text-white text-[10px] tracking-[0.06em] uppercase rounded-sm">
                {categories.find(c => c.id === catParam)?.label}
                <X size={10} className="cursor-pointer hover:text-[#C4922A]" onClick={() => handleCategoryChange('all')} />
              </span>
            )}
            {subParam !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A0A0A] text-white text-[10px] tracking-[0.06em] uppercase rounded-sm">
                {subParam}
                <X size={10} className="cursor-pointer hover:text-[#C4922A]" onClick={() => handleSubcategoryChange('all')} />
              </span>
            )}
            {tagParam !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A0A0A] text-white text-[10px] tracking-[0.06em] uppercase rounded-sm">
                {WOMEN_OCCASIONS.find(t => t.id === tagParam)?.label || tagParam}
                <X size={10} className="cursor-pointer hover:text-[#C4922A]" onClick={() => handleTagChange('all')} />
              </span>
            )}
            {priceRange !== 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A0A0A] text-white text-[10px] tracking-[0.06em] uppercase rounded-sm">
                {PRICE_RANGES[priceRange].label}
                <X size={10} className="cursor-pointer hover:text-[#C4922A]" onClick={() => setPriceRange(0)} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[10px] tracking-[0.08em] uppercase text-[#C4922A] hover:underline cursor-pointer ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-[#0A0A0A] mb-3">No pieces found</p>
            <p className="text-[#9E9E9E] text-sm mb-8">Try adjusting your filters or search terms</p>
            <button
              onClick={clearAllFilters}
              className="btn-gold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 md:gap-6 ${grid === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
