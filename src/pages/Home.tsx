import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { useReveal } from '../hooks/useReveal';
import { LampContainer } from '../components/Lamp';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1779399147584-6c479647263b?w=1920&h=1080&fit=crop&auto=format',
    tag: 'Summer Collection ',
    title: 'The Art of\nElegance',
    sub: 'Discover pieces that define you',
    cta: 'Explore Women\'s',
    href: '/shop?cat=women',
  },
  {
    image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=1920&h=1080&fit=crop&auto=format',
    tag: 'Men\'s Tailoring',
    title: 'Crafted for\nthe Modern Man',
    sub: 'Precision tailoring, enduring style',
    cta: "Shop Men's",
    href: '/shop?cat=men',
  },
  {
    image: 'https://images.unsplash.com/photo-1776262145095-39d46d047537?w=1920&h=1080&fit=crop&auto=format',
    tag: 'New Arrivals',
    title: 'Colour that\nSpeaks',
    sub: 'Bold statements, timeless silhouettes',
    cta: 'Shop New Arrivals',
    href: '/shop?cat=new',
  },
];

const TESTIMONIALS = [
  { name: 'Sanduni Perera', role: 'Colombo', text: 'Fashion Gate has completely changed how I shop. The linen quality is unmatched, and I love that it supports local handloom weavers. Truly world-class island fashion.', rating: 5 },
  { name: 'Dinuka Fernando', role: 'Kandy', text: 'The tailoring on my linen blazer is absolutely perfect. It keeps me cool during outdoor client meetings in Colombo while looking incredibly sharp.', rating: 5 },
  { name: 'Anjali Silva', role: 'Galle', text: 'Every piece I\'ve ordered, from the batik wrap dresses to the handcrafted necklaces, feels unique and premium. This is what local slow fashion is all about.', rating: 5 },
  { name: 'Nuwan Bandara', role: 'Negombo', text: 'I ordered the handloom sarong for a family wedding, and it received so many compliments. The weave is extremely comfortable and feels luxurious. Highly recommended!', rating: 5 },
  { name: 'Dilini Jayawardena', role: 'Kurunegala', text: 'The woven cane tote is my absolute favorite accessory. The craftsmanship is beautiful, and the leather detailing is very high quality.', rating: 5 },
  { name: 'Kasun Perera', role: 'Jaffna', text: 'Extremely fast courier delivery to Jaffna! The linen mandarin collar shirt fits perfectly and has become a staple in my tropical wardrobe.', rating: 5 },
];

export default function Home() {
  const { products } = useProducts();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'women' | 'men' | 'kids' | 'accessories' | 'new'>('all');
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  useReveal();

  const checkTabsScroll = useCallback(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < maxScroll - 6);
  }, []);

  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    checkTabsScroll();
    el.addEventListener('scroll', checkTabsScroll, { passive: true });
    window.addEventListener('resize', checkTabsScroll);

    const timer = setTimeout(checkTabsScroll, 300);

    return () => {
      el.removeEventListener('scroll', checkTabsScroll);
      window.removeEventListener('resize', checkTabsScroll);
      clearTimeout(timer);
    };
  }, [checkTabsScroll, products]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -180 : 180,
        behavior: 'smooth'
      });
    }
  };

  const goToSlide = (idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(idx);
      setIsTransitioning(false);
    }, 300);
  };

  const [activeStory, setActiveStory] = useState(0);
  const [activeCampaignSlide, setActiveCampaignSlide] = useState(0);

  const CAMPAIGN_SLIDES = [
    {
      tag: "Summer Atelier 2025",
      title: "Isle of Dreams",
      desc: "Designed for balmy tropical nights. Pure organic silks, handloom embroidery, and relaxed resort wear silhouettes.",
      cta: "Explore Campaign",
      href: "/shop?cat=women"
    },
    {
      tag: "Artisan Heritage",
      title: "Hand-Crafted Batik",
      desc: "Every print is designed and hand-waxed by traditional Sri Lankan craft families, preserving local heritage.",
      cta: "View Collections",
      href: "/shop?cat=women&tag=natural"
    },
    {
      tag: "Tailored Authority",
      title: "Structured Blazers",
      desc: "Linen blazers cut for crisp authority, combining lightweight breathability with premium bespoke tailoring.",
      cta: "Shop Blazers",
      href: "/shop?cat=men&sub=blazers"
    }
  ];

  useEffect(() => {
    heroTimerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    const storyTimer = setInterval(() => {
      setActiveStory(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    const campaignTimer = setInterval(() => {
      setActiveCampaignSlide(prev => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 5500);

    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
      clearInterval(storyTimer);
      clearInterval(campaignTimer);
    };
  }, []);

  const prevSlide = () => goToSlide((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => goToSlide((activeSlide + 1) % HERO_SLIDES.length);

  // Dynamic Collections Grid: Auto-links latest image & product count from live products
  const dynamicCollections = useMemo(() => {
    const latestWomen = products.find(p => p.category === 'women');
    const latestMen = products.find(p => p.category === 'men');
    const latestKids = products.find(p => p.category === 'kids');
    const latestAcc = products.find(p => p.category === 'accessories');

    return [
      {
        label: "Women's",
        title: 'Femme Collection',
        desc: 'Fluid forms & rich fabrics',
        image: latestWomen?.image || 'https://images.unsplash.com/photo-1776262145093-ab3f69760686?w=700&h=900&fit=crop&auto=format',
        href: '/shop?cat=women',
        count: products.filter(p => p.category === 'women').length,
      },
      {
        label: "Men's",
        title: 'Homme Collection',
        desc: 'Sharp tailoring & modern fit',
        image: latestMen?.image || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&h=900&fit=crop&auto=format',
        href: '/shop?cat=men',
        count: products.filter(p => p.category === 'men').length,
      },
      {
        label: "Kids'",
        title: 'Petite Collection',
        desc: 'Pure comfort & joyful charm',
        image: latestKids?.image || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&h=900&fit=crop&auto=format',
        href: '/shop?cat=kids',
        count: products.filter(p => p.category === 'kids').length,
      },
      {
        label: 'Accessories',
        title: 'Atelier Collection',
        desc: 'Finishing touches & luxury craft',
        image: latestAcc?.image || 'https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=700&h=900&fit=crop&auto=format',
        href: '/shop?cat=accessories',
        count: products.filter(p => p.category === 'accessories').length,
      },
    ];
  }, [products]);

  // Dynamic New Arrivals: Prioritizes products marked as 'new' or category 'new' or latest created
  const newArrivals = useMemo(() => {
    let filtered = products;
    if (activeCategoryTab !== 'all') {
      if (activeCategoryTab === 'new') {
        filtered = products.filter(p => p.badge === 'new' || p.category === 'new');
      } else {
        filtered = products.filter(p => p.category === activeCategoryTab);
      }
    }

    const explicitlyNew = filtered.filter(p => p.badge === 'new' || p.category === 'new');
    const others = filtered.filter(p => !explicitlyNew.some(n => n.id === p.id));
    return [...explicitlyNew, ...others].slice(0, 8);
  }, [products, activeCategoryTab]);

  // Dynamic Trending: Prioritizes trending, limited, sale badges
  const featured = useMemo(() => {
    const trendingList = products.filter(p => p.badge === 'trending' || p.badge === 'limited' || p.badge === 'sale' || Boolean(p.originalPrice));
    const others = products.filter(p => !trendingList.some(t => t.id === p.id));
    return [...trendingList, ...others].slice(0, 8);
  }, [products]);

  // Dynamic Timeless in Motion marquee list: Includes ALL products from live database
  const marqueeProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (products.length < 5) {
      return [...products, ...products, ...products, ...products];
    }
    return [...products, ...products];
  }, [products]);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-full">

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background image */}
        <div
          key={activeSlide}
          className={`absolute inset-0 transition-opacity duration-1000 animate-kenburns ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div key={activeSlide} className="max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-16 md:pt-32 -translate-y-16 md:translate-y-0 z-10">
            <div>
              <p className="text-[#E8B84B] text-xs tracking-[0.25em] uppercase mb-5 flex items-center gap-3 opacity-0 animate-slide-up-fade">
                <span className="w-8 h-px bg-[#C4922A]" />
                {slide.tag}
              </p>
              <h1 className="font-display text-white font-bold leading-[1.05] mb-6 opacity-0 animate-slide-up-fade delay-100" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
                {slide.title.split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-10 max-w-md opacity-0 animate-slide-up-fade delay-200">{slide.sub}</p>
              <div className="flex flex-wrap gap-4 opacity-0 animate-slide-up-fade delay-300">
                <Link to={slide.href} className="btn-gold flex items-center gap-2">
                  {slide.cta} <ArrowRight size={14} />
                </Link>
                <Link to="/shop" className="btn-outline-gold">
                  <span>View All</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-20 md:bottom-10 left-6 md:left-10 flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8 z-20">
          <div className="flex gap-4">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className="group relative flex flex-col items-start pt-2 pb-1 focus:outline-none cursor-pointer"
                aria-label={`Slide ${i + 1}`}
              >
                <span className={`text-[10px] font-mono tracking-wider transition-colors duration-300 mb-1.5 ${i === activeSlide ? 'text-[#C4922A] font-bold' : 'text-white/40'}`}>
                  0{i + 1}
                </span>
                <div className="w-12 md:w-16 h-[2px] bg-white/20 relative overflow-hidden transition-all duration-300 group-hover:bg-white/40">
                  <div
                    key={activeSlide === i ? 'active' : 'inactive'}
                    className={`absolute inset-y-0 left-0 bg-[#C4922A] ${i === activeSlide
                      ? 'w-full animate-slide-progress'
                      : i < activeSlide ? 'w-full' : 'w-0'
                      }`}
                  />
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-0.5">
            <button onClick={prevSlide} className="w-9 h-9 border border-white/25 flex items-center justify-center text-white hover:border-[#C4922A] hover:text-[#C4922A] transition-all rounded-full bg-black/10 backdrop-blur-xs cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextSlide} className="w-9 h-9 border border-white/25 flex items-center justify-center text-white hover:border-[#C4922A] hover:text-[#C4922A] transition-all rounded-full bg-black/10 backdrop-blur-xs cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-20 md:bottom-10 right-6 md:right-10 flex flex-col items-center gap-2.5 text-white/90 font-medium z-20">
          <span className="text-[10px] tracking-[0.25em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <div className="w-[2px] h-8 md:h-14 bg-white/30 relative overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 right-0 w-full h-4 bg-[#C4922A] rounded-full animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* Announcement Marquee Bar */}
      <div className="bg-[#0A0A0A] text-white py-3 sm:py-3.5 text-[11px] sm:text-xs tracking-[0.16em] uppercase overflow-hidden border-b border-white/10 select-none relative">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {/* Half 1 */}
          <div className="flex items-center shrink-0">
            <span className="mx-4 sm:mx-8">Islandwide Delivery Flat Rs. 350</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">New Collection — Summer Luxe </span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">Complimentary Gift Wrapping Available</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">Handloom &amp; Artisanal Tailoring</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">Express Doorstep Dispatch</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
          </div>
          {/* Half 2 (Exact Clone for Infinite 100% Seamless Loop) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            <span className="mx-4 sm:mx-8">Islandwide Delivery Flat Rs. 350</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">New Collection — Summer Luxe </span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">Complimentary Gift Wrapping Available</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">Handloom &amp; Artisanal Tailoring</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
            <span className="mx-4 sm:mx-8">Express Doorstep Dispatch</span>
            <span className="text-[#C4922A] mx-3 sm:mx-4">✦</span>
          </div>
        </div>
      </div>

      {/* STATS BAND */}
      <section className="bg-[#0A0A0A] py-8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: `${products.length}+ Pieces`, label: 'Live Curations' },
            { val: 'Islandwide', label: 'Sri Lanka Delivery' },
            { val: 'Premium', label: 'Quality Curations' },
            { val: 'Dedicated', label: 'Customer Support' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <p className="shimmer-text font-display text-2xl md:text-3xl font-bold">{val}</p>
              <p className="text-white/40 text-xs tracking-[0.15em] uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS GRID */}
      <section className="pt-16 pb-10 md:pt-28 md:pb-12 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 w-full overflow-hidden">
        <div className="mb-10 md:mb-14 reveal">
          <LampContainer>
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2 sm:mb-3 flex items-center gap-3 justify-center">
              <span className="w-8 h-px bg-[#C4922A]" /> Our Collections <span className="w-8 h-px bg-[#C4922A]" />
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0A] text-center leading-tight">
              Curated for <em>Every Story</em>
            </h2>
          </LampContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full">
          {dynamicCollections.map((col) => (
            <Link
              key={col.label}
              to={col.href}
              className="group relative overflow-hidden rounded-xs sm:rounded-sm shadow-md w-full aspect-[3/4.2] sm:aspect-[3/4] reveal flex flex-col justify-end"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
              <div className="absolute inset-0 bg-[#C4922A]/0 group-hover:bg-[#C4922A]/10 transition-colors duration-500" />

              <div className="relative z-10 p-3 sm:p-4.5 md:p-6 lg:p-7 flex flex-col justify-end w-full">
                <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5 h-[14px]">
                  <p className="text-[8.5px] sm:text-[10px] text-[#E8B84B] font-mono font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                    {col.label}
                  </p>
                  {col.count > 0 && (
                    <span className="text-[8px] sm:text-[9px] text-white/70 font-mono">
                      {col.count} {col.count === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-[13px] sm:text-base md:text-xl lg:text-2xl font-bold text-white mb-1 leading-snug drop-shadow-sm min-h-[20px] sm:min-h-[26px] md:min-h-[30px] flex items-center">
                  {col.title}
                </h3>
                <p className="hidden sm:flex text-white/80 text-[10px] sm:text-xs md:text-sm line-clamp-2 leading-tight sm:leading-normal mb-2.5 sm:mb-3.5 drop-shadow-xs sm:min-h-[32px] md:min-h-[38px] items-start">
                  {col.desc}
                </p>
                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[9.5px] sm:text-xs tracking-[0.08em] sm:tracking-[0.1em] uppercase text-white font-bold group-hover:text-[#E8B84B] transition-colors whitespace-nowrap pt-0.5">
                  Shop Now <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12 reveal">
          <Link to="/shop" className="btn-outline-gold inline-block">
            <span>View All Collections</span>
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS & CATEGORY SHOWCASE */}
      <section className="pt-10 pb-20 md:pt-12 md:pb-28 bg-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="mb-8 md:mb-12 reveal">
            <LampContainer>
              <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2 sm:mb-3 flex items-center justify-center gap-2">
                <Sparkles size={13} /> Just In &amp; Latest Edits
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0A] text-center">New Arrivals</h2>
            </LampContainer>
          </div>

          {/* Interactive Category Filter Tabs on Home Page with Top Mobile Arrows */}
          <div className="w-full mb-8 md:mb-12 reveal">
            {/* Mobile Top Controls Bar with Clean Left/Right Arrow Buttons (Above tabs to prevent any text cropping) */}
            <div className="flex items-center justify-between mb-2.5 md:hidden px-0.5">
              <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#C4922A]" /> Filter Collections
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollTabs('left')}
                  disabled={!canScrollLeft}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${canScrollLeft
                      ? 'bg-white border-[#E8E4DF] text-[#0A0A0A] hover:border-[#C4922A] hover:text-[#C4922A] shadow-xs active:scale-90 cursor-pointer'
                      : 'bg-[#F2F0ED] border-transparent text-[#B5B0A8] cursor-not-allowed opacity-40'
                    }`}
                  aria-label="Previous categories"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTabs('right')}
                  disabled={!canScrollRight}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${canScrollRight
                      ? 'bg-[#0A0A0A] border-[#0A0A0A] text-[#E8B84B] shadow-xs active:scale-90 cursor-pointer'
                      : 'bg-[#F2F0ED] border-transparent text-[#B5B0A8] cursor-not-allowed opacity-40'
                    }`}
                  aria-label="Next categories"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Tabs scrollable row (Unoccluded, full width, zero text overlap) */}
            <div
              ref={tabsContainerRef}
              className="w-full overflow-x-auto pb-2.5 tabs-scrollbar-mini scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 w-max min-w-full px-1 sm:px-0">
                {[
                  { id: 'all', label: 'All Curations' },
                  { id: 'new', label: 'New Arrivals' },
                  { id: 'women', label: "Women's" },
                  { id: 'men', label: "Men's" },
                  { id: 'kids', label: "Kids'" },
                  { id: 'accessories', label: 'Accessories' },
                ].map((tab) => {
                  const count = tab.id === 'all'
                    ? products.length
                    : tab.id === 'new'
                      ? products.filter(p => p.badge === 'new' || p.category === 'new').length
                      : products.filter(p => p.category === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategoryTab(tab.id as any)}
                      className={`px-3.5 sm:px-5 py-2 text-[10.5px] sm:text-xs font-semibold tracking-wider uppercase rounded-xs transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 ${activeCategoryTab === tab.id
                          ? 'bg-[#0A0A0A] text-[#E8B84B] border-[#0A0A0A] shadow-sm'
                          : 'bg-white text-[#4A4A4A] border-[#E8E4DF] hover:border-[#C4922A] hover:text-[#0A0A0A]'
                        }`}
                    >
                      <span className="whitespace-nowrap">{tab.label}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-2xs font-mono font-bold ${activeCategoryTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#F2F0ED] text-[#7A7A7A]'
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#E8E4DF] rounded-xs">
              <p className="text-sm text-[#7A7A7A]">No pieces found in this category yet.</p>
              <Link to="/shop" className="btn-gold mt-4 inline-block">
                Explore Full Shop
              </Link>
            </div>
          )}

          <div className="text-center mt-12 reveal">
            <Link to={activeCategoryTab !== 'all' ? `/shop?cat=${activeCategoryTab}` : '/shop'} className="btn-outline-gold inline-block">
              <span>View All {activeCategoryTab !== 'all' ? activeCategoryTab : 'New Arrivals'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative overflow-hidden">
        <div
          className="min-h-[70vh] flex items-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1779154137940-a251f8c92b10?w=1920&h=1080&fit=crop&auto=format)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/30 to-black/80" />
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-16 sm:py-24">
            <div className="max-w-xl reveal">
              <p className="text-[#E8B84B] text-xs tracking-[0.25em] uppercase mb-3 sm:mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-[#C4922A]" /> Featured Look
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Power Dressing<br />
                <em>Reinvented</em>
              </h2>
              <p className="text-white/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 leading-relaxed">
                The Structured Velvet Blazer — a study in quiet authority. Command any room without saying a word.
              </p>
              <Link to="/shop?cat=women" className="btn-gold inline-flex items-center gap-2">
                Shop the Look <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="pt-14 pb-20 md:pt-16 md:pb-28 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-10 md:mb-14 reveal">
          <LampContainer>
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2 sm:mb-3">Most Wanted</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0A]">Trending Now</h2>
          </LampContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <div className="text-center mt-12 reveal">
          <Link to="/shop" className="btn-outline-gold inline-block">
            <span>View All Trending</span>
          </Link>
        </div>
      </section>

      {/* INFINITE PRODUCT SCROLLING CAROUSEL */}
      <section className="py-14 sm:py-20 bg-[#FAFAF8] overflow-hidden border-t border-[#E8E4DF]/60">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-10 md:mb-14 reveal">
          <LampContainer>
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2 sm:mb-3">Atelier Collections</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0A]">Timeless in Motion</h2>
          </LampContainer>
          <p className="text-center text-xs sm:text-sm text-[#4A4A4A] max-w-md mx-auto mt-3 sm:mt-4">
            Browse our signature edits in continuous cinematic motion. Hover over any piece to focus and inspect.
          </p>
        </div>

        {/* Marquee Card Wrapper */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Subtle overlay fades on sides for premium look */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FAFAF8] to-transparent z-25 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FAFAF8] to-transparent z-25 pointer-events-none" />

          <div className="flex w-max animate-product-marquee gap-6 px-6">
            {/* Render all live products in continuous infinite loop */}
            {marqueeProducts.map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="w-[220px] md:w-[280px] shrink-0 bg-white p-3 rounded-xs border border-[#E8E4DF]/40 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-10px_rgba(196,146,42,0.12)] transition-all">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Centered CTA Button */}
        <div className="text-center mt-12 reveal">
          <Link to="/shop" className="btn-outline-gold inline-block">
            <span>View All Collections</span>
          </Link>
        </div>
      </section>

      {/* PROMISE BAND */}
      <section className="border-y border-[#E8E4DF] py-14">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { icon: '✦', title: 'Islandwide Delivery', desc: 'Doorstep delivery across Sri Lanka' },
            { icon: '◈', title: 'Online Shopping', desc: 'Seamless 24/7 shopping experience' },
            { icon: '❋', title: 'Premium Fashion', desc: "Men's & Women's lifestyle" },
            { icon: '◇', title: 'Customer Support', desc: '+94 70 773 9962 support' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center reveal">
              <span className="text-[#C4922A] text-2xl block mb-3">{icon}</span>
              <h4 className="font-semibold text-sm text-[#0A0A0A] mb-1">{title}</h4>
              <p className="text-[#9E9E9E] text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="py-20 md:py-28 bg-[#0A0A0A] overflow-hidden relative"
        style={{
          backgroundImage: 'radial-gradient(rgba(196, 146, 42, 0.22) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Soft background dark overlay removed to allow dots to shine clearly */}

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 z-10">
          <div className="text-center mb-10 md:mb-14 reveal">
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2 sm:mb-3">Customer Reviews</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white">What Our Customers Say</h2>
          </div>

          <div className="max-w-4xl mx-auto relative px-6 sm:px-8 md:px-16 flex items-center justify-center min-h-[280px] md:min-h-[220px]">
            {/* Prev Button */}
            <button
              onClick={() => setActiveStory(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="absolute left-0 w-8 h-8 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center text-white hover:border-[#C4922A] hover:text-[#C4922A] hover:bg-white/5 transition-all rounded-full cursor-pointer z-20 focus:outline-none"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="w-full relative min-h-[240px] md:min-h-[180px]">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className={`transition-all duration-1000 absolute inset-x-0 top-0 flex flex-col items-center justify-center ${i === activeStory
                    ? 'opacity-100 translate-y-0 relative z-10 pointer-events-auto'
                    : 'opacity-0 translate-y-6 absolute z-0 pointer-events-none'
                    }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="flex justify-center mb-4 sm:mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={13} className="fill-[#C4922A] text-[#C4922A] mx-0.5" />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 italic font-display max-w-xl px-2 sm:px-4 text-center">
                    "{t.text}"
                  </p>
                  <div className="text-center">
                    <p className="text-white font-semibold text-xs sm:text-sm tracking-wide">{t.name}</p>
                    <p className="text-[#C4922A] text-[11px] sm:text-xs tracking-[0.1em] uppercase mt-0.5 sm:mt-1">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setActiveStory(prev => (prev + 1) % TESTIMONIALS.length)}
              className="absolute right-0 w-8 h-8 sm:w-10 sm:h-10 border border-white/10 flex items-center justify-center text-white hover:border-[#C4922A] hover:text-[#C4922A] hover:bg-white/5 transition-all rounded-full cursor-pointer z-20 focus:outline-none"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2.5 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStory(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeStory ? 'bg-[#C4922A] w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                aria-label={`Story ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-16 md:py-28 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative reveal-left">
            <div
              className="aspect-square rounded-sm overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=800&fit=crop&auto=format)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute -bottom-6 -right-6 bg-[#0A0A0A] border-l-4 border-[#C4922A] p-6 text-white hidden md:block shadow-xl">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C4922A] mb-1">Tagline</p>
              <p className="font-display text-xl font-bold">Elevate Your Style</p>
            </div>
          </div>
          <div className="reveal-right text-center md:text-left flex flex-col items-center md:items-start">
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3 sm:mb-4 flex items-center justify-center md:justify-start gap-3">
              <span className="w-8 h-px bg-[#C4922A]" /> Welcome to Fashion Gate
            </p>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mb-4 sm:mb-6">
              Where True Style <span className="hidden md:inline"><br /></span>is <em>Timeless</em>
            </h2>
            <p className="text-[#4A4A4A] text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 text-center md:text-left">
              At Fashion Gate, we believe that true style is timeless. Our brand is dedicated to offering elegant, high-quality fashion that empowers women to express their confidence with grace.
            </p>
            <p className="text-[#4A4A4A] text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 text-center md:text-left">
              Every collection is carefully selected to blend comfort, sophistication, and modern trends, ensuring every piece reflects effortless elegance. From everyday essentials to statement outfits, Fashion Gate brings fashion that complements every lifestyle.
            </p>
            <Link to="/about" className="btn-gold inline-flex items-center justify-center gap-2 mx-auto md:mx-0 w-full sm:w-auto">
              Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      {/* ATELIER GALLERY GATEWAY SECTION */}
      <section className="py-16 md:py-28 bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {/* Glowing Golden Header */}
          <div className="mb-10 md:mb-16 reveal">
            <LampContainer>
              <p className="text-xs text-[#C4922A] tracking-[0.25em] uppercase mb-3 sm:mb-4 flex items-center justify-center gap-3">
                <span className="w-8 h-px bg-[#C4922A]" /> Visual Stories <span className="w-8 h-px bg-[#C4922A]" />
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center leading-tight">
                The Atelier <em>Gallery</em>
              </h2>
            </LampContainer>
          </div>

          {/* Interactive Lookbook Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {[
              {
                title: "Silk & Sarees",
                tag: "Bespoke Elegance",
                image: "https://images.unsplash.com/photo-1776262145095-39d46d047537?w=600&h=800&fit=crop&auto=format",
                href: "/gallery?album=sarees"
              },
              {
                title: "Modern Linen",
                tag: "Bespoke Tailoring",
                image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&h=800&fit=crop&auto=format",
                href: "/gallery?album=tailoring"
              },
              {
                title: "Artisan Craft",
                tag: "Handcrafted Details",
                image: "https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=600&h=800&fit=crop&auto=format",
                href: "/gallery?album=crafts"
              }
            ].map((item, idx) => (
              <Link
                key={idx}
                to="/gallery"
                className={`group relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl reveal ${idx === 0 ? 'reveal-left' : idx === 1 ? 'reveal-zoom' : 'reveal-right'
                  }`}
              >
                {/* Background image with Ken Burns zoom */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out scale-100 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:from-black/95 transition-all duration-500" />

                {/* Sliding Gold Border Overlay */}
                <div className="absolute inset-5 border border-[#C4922A]/0 group-hover:border-[#C4922A]/70 transition-all duration-500 rounded-xs pointer-events-none" />

                {/* Text Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#E8B84B] mb-2 opacity-80">{item.tag}</p>
                  <h3 className="font-display text-2xl font-bold text-white mb-4 uppercase tracking-wider">{item.title}</h3>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-white/0 group-hover:text-[#C4922A] transition-all duration-300 font-semibold flex items-center gap-1.5 border-b border-transparent group-hover:border-[#C4922A]/50 pb-0.5">
                    View In Gallery <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Centered Gateway Button */}
          <div className="text-center reveal">
            <Link to="/gallery" className="btn-gold inline-flex items-center gap-3 py-3 px-8 text-xs tracking-[0.15em] uppercase font-bold group-hover:scale-102 transition-transform">
              Enter The Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE EDITORIAL CAMPAIGN SECTION */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:relative md:h-[560px] w-full overflow-hidden rounded-sm group shadow-xl bg-[#0A0A0A] reveal">
          {/* Banner image background - stacks as a perfectly scaled header on mobile */}
          <div
            className="w-full aspect-[16/10] md:absolute md:inset-0 md:aspect-auto md:h-full bg-cover bg-center transition-transform duration-[4000ms] ease-out scale-102 group-hover:scale-100"
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dyp247eoh/image/upload/v1784785793/134523_zuxslb.png)`,
            }}
          >
            {/* Elegant dark overlay - only active on desktop overlay view */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/40 to-transparent" />
          </div>

          {/* Slider Content Card - sits below image on mobile, overlays on desktop */}
          <div className="w-full p-8 md:p-0 md:absolute md:inset-0 flex items-center bg-[#0A0A0A] md:bg-transparent">
            <div className="w-full max-w-xl md:pl-16 z-10">
              <div className="relative min-h-[250px] sm:min-h-[220px] flex flex-col justify-center">
                {CAMPAIGN_SLIDES.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`transition-all duration-1000 absolute inset-0 flex flex-col justify-center ${idx === activeCampaignSlide
                      ? 'opacity-100 translate-x-0 relative pointer-events-auto'
                      : 'opacity-0 translate-x-12 absolute pointer-events-none'
                      }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    <p className="text-[#E8B84B] text-[10px] tracking-[0.2em] uppercase font-bold mb-3 flex items-center gap-2">
                      <span className="w-6 h-px bg-[#C4922A]" /> {slide.tag}
                    </p>
                    <h2 className="font-display text-2xl md:text-5xl font-bold text-white mb-4 leading-[1.1] uppercase tracking-wide">
                      {slide.title}
                    </h2>
                    <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-6 max-w-md">
                      {slide.desc}
                    </p>
                    <div>
                      <Link to={slide.href} className="btn-gold inline-flex items-center gap-2 py-2 px-5 text-xs">
                        {slide.cta} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Dots & Custom Controls */}
              <div className="flex items-center gap-6 mt-8 border-t border-white/10 pt-6">
                <div className="flex gap-2">
                  {CAMPAIGN_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCampaignSlide(idx)}
                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${idx === activeCampaignSlide ? 'bg-[#C4922A] w-6' : 'bg-white/20 hover:bg-white/40'
                        }`}
                      style={{ width: idx === activeCampaignSlide ? '24px' : '8px' }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2 text-white/50 text-[10px] tracking-widest font-mono">
                  <span>0{activeCampaignSlide + 1}</span>
                  <span>/</span>
                  <span>0{CAMPAIGN_SLIDES.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM STRIP */}
      <section className="pb-20 md:pb-28 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-10 reveal">
          <a
            href="https://www.instagram.com/fashiongate56?igsh=MXV0eDJ4c3gxdmowdQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-[#C4922A] hover:text-[#0A0A0A] tracking-[0.2em] uppercase mb-2 font-mono font-bold transition-colors"
          >
            @fashiongate56
          </a>
          <h2 className="font-display text-3xl font-bold text-[#0A0A0A]">Follow Our World</h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 reveal">
          {[
            'photo-1779399147584-6c479647263b',
            'photo-1776262145095-39d46d047537',
            'photo-1617127365659-c47fa864d8bc',
            'photo-1589363358751-ab05797e5629',
            'photo-1779154137940-a251f8c92b10',
            'photo-1705909237050-7a7625b47fac',
          ].map(id => (
            <a
              key={id}
              href="https://www.instagram.com/fashiongate56?igsh=MXV0eDJ4c3gxdmowdQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden aspect-square bg-[#F2F0ED]"
              title="View on Instagram @fashiongate56"
            >
              <img
                src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`}
                alt="Fashion Gate Instagram"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#C4922A]/0 group-hover:bg-[#C4922A]/30 transition-all duration-300 flex items-center justify-center">
                <Play size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
