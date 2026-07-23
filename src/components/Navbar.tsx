import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Music } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const LOGO_URL = 'https://res.cloudinary.com/dyp247eoh/image/upload/v1784785679/Fashion_Gate_JPG_02.jpg-removebg-preview_epbtzx.png';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: "Women's",
    href: '/shop?cat=women',
    isMegamenu: true,
    columns: [
      {
        title: 'Occasions & Edits',
        items: [
          { label: 'New In', href: '/shop?cat=women&tag=new' },
          { label: 'Work Wear', href: '/shop?cat=women&tag=work' },
          { label: 'Casual Wear', href: '/shop?cat=women&tag=casual' },
          { label: 'Evening Wear', href: '/shop?cat=women&tag=evening' },
          { label: 'Active Wear', href: '/shop?cat=women&tag=active' },
          { label: 'Denim', href: '/shop?cat=women&tag=denim' },
          { label: 'Natural Blends', href: '/shop?cat=women&tag=natural' },
        ]
      },
      {
        title: 'Clothing',
        items: [
          { label: 'Dresses', href: '/shop?cat=women&sub=dresses' },
          { label: 'Tops', href: '/shop?cat=women&sub=tops' },
          { label: 'Pants', href: '/shop?cat=women&sub=pants' },
          { label: 'Blazers', href: '/shop?cat=women&sub=blazers' },
          { label: 'Jeans', href: '/shop?cat=women&sub=jeans' },
          { label: 'Jumpsuits', href: '/shop?cat=women&sub=jumpsuits' },
          { label: 'Shorts', href: '/shop?cat=women&sub=shorts' },
        ]
      }
    ]
  },
  {
    label: "Men's",
    href: '/shop?cat=men',
    isMegamenu: false,
    sub: [
      { label: 'New In', href: '/shop?cat=men&tag=new' },
      { label: 'T-Shirts', href: '/shop?cat=men&sub=t-shirts' },
      { label: 'Shirts', href: '/shop?cat=men&sub=shirts' },
      { label: 'Pants', href: '/shop?cat=men&sub=pants' },
      { label: 'Polo Shirts', href: '/shop?cat=men&sub=polo-shirts' },
      { label: 'Shorts', href: '/shop?cat=men&sub=shorts' },
      { label: 'Jackets', href: '/shop?cat=men&sub=jackets' },
      { label: 'Jeans', href: '/shop?cat=men&sub=jeans' },
    ]
  },
  {
    label: 'Collections',
    href: '/shop',
    sub: [
      { label: 'All Collection', href: '/shop' },
      { label: 'Accessories', href: '/shop?cat=accessories' },
    ]
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = 'https://res.cloudinary.com/dyp247eoh/video/upload/v1784800873/massobeats_-_gingersweet_freetouse.com_udtfah.mp3';
    audio.loop = true;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log('Audio playback blocked:', err));
      setMusicPlaying(true);
    }
  };

  const [pulseCart, setPulseCart] = useState(false);
  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      setPulseCart(true);
      const timer = setTimeout(() => setPulseCart(false), 800);
      return () => clearTimeout(timer);
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md border-b border-[#E8E4DF] shadow-sm'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? 'text-[#0A0A0A]' : 'text-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <nav className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center h-20 md:h-24 relative w-full">
          {/* Reusable Nav Link Renderer */}
          {(() => {
            const renderLink = (link: typeof navLinks[0]) => {
              const isActive = link.href === '/'
                ? location.pathname === '/'
                : location.pathname === link.href || location.pathname.startsWith(link.href);
              const hasSub = link.sub || link.columns;

              return (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => hasSub && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={`relative flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-semibold transition-colors duration-300 ${isActive ? 'text-[#C4922A]' : textColor
                      } hover:text-[#C4922A] pb-1.5`}
                  >
                    {link.label}
                    {hasSub && <ChevronDown size={11} className="transition-transform group-hover:rotate-180 duration-300" />}
                    <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C4922A] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                  </Link>

                  {/* Megamenu dropdown */}
                  {link.isMegamenu && link.columns && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 pt-3 z-50" style={{ width: 'max(480px, 36vw)' }}>
                      <div className="bg-white/95 backdrop-blur-md border border-[#E8E4DF]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] py-10 rounded-sm animate-dropdown">
                        <div className="flex gap-16 justify-center px-12">
                          {link.columns.map((col, cIdx) => (
                            <div key={cIdx} className="flex flex-col min-w-[170px]">
                              <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#C4922A] mb-5 border-b border-[#E8E4DF] pb-2.5 uppercase">
                                {col.title}
                              </h4>
                              <div className="flex flex-col gap-3">
                                {col.items.map((item, iIdx) => (
                                  <Link
                                    key={iIdx}
                                    to={item.href}
                                    className="text-[11px] tracking-[0.12em] font-medium text-[#4A4A4A] hover:text-[#C4922A] hover:translate-x-1.5 transition-all duration-300 uppercase block"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard dropdown */}
                  {!link.isMegamenu && link.sub && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 pt-3 z-50">
                      <div className="bg-white/95 backdrop-blur-md border border-[#E8E4DF]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] min-w-[200px] py-3 rounded-sm animate-dropdown">
                        {link.sub.map(sub => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            className="block px-6 py-2.5 text-[10px] tracking-[0.12em] uppercase font-medium text-[#4A4A4A] hover:text-[#C4922A] hover:translate-x-1.5 hover:bg-[#FAFAF8]/50 transition-all duration-300"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            };

            return (
              <>
                {/* Desktop Nav Links (Left block - first 4 links) */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10">
                  {navLinks.slice(0, 4).map(link => renderLink(link))}
                </div>

                {/* Logo Center */}
                <Link to="/" className="absolute left-5 md:left-1/2 md:-translate-x-1/2 flex items-center z-20">
                  <img
                    src={LOGO_URL}
                    alt="Fashion Gate"
                    className="h-20 md:h-40 w-auto object-contain transition-all duration-300 py-0.5"
                    style={{ filter: scrolled || !isHome ? 'none' : 'brightness(0) invert(1)' }}
                  />
                </Link>

                {/* Desktop Nav Links (Right block - remaining links) */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10 ml-auto mr-4 lg:mr-6">
                  {navLinks.slice(4).map(link => renderLink(link))}
                </div>
              </>
            );
          })()}

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 md:gap-5 ml-auto md:ml-0 shrink-0 z-20">
            <button
              onClick={() => setSearchOpen(true)}
              className={`${textColor} hover:text-[#C4922A] transition-colors p-1.5 cursor-pointer`}
              aria-label="Search"
            >
              <Search size={19} />
            </button>
            <Link
              to="/wishlist"
              className={`relative ${textColor} hover:text-[#C4922A] transition-colors p-1.5 hidden md:flex`}
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlistTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C4922A] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlistTotal}
                </span>
              )}
            </Link>

            {/* Music Toggle Button */}
            <button
              onClick={toggleMusic}
              className={`relative flex items-center justify-center ${textColor} hover:text-[#C4922A] transition-colors p-1.5 cursor-pointer`}
              title={musicPlaying ? "Pause relaxing music" : "Play relaxing music"}
              aria-label="Relaxing Music"
            >
              {musicPlaying ? (
                <div className="soundwave-container text-[#C4922A] self-center">
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                </div>
              ) : (
                <Music size={19} />
              )}
            </button>

            <Link
              to="/cart"
              className={`relative ${textColor} hover:text-[#C4922A] transition-all p-1.5 ${pulseCart ? 'animate-bounce-pulse text-[#C4922A]' : ''}`}
              aria-label="Cart"
            >
              <ShoppingBag size={19} className={pulseCart ? 'stroke-[2.5px]' : ''} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C4922A] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className={`md:hidden ${textColor} hover:text-[#C4922A] transition-colors p-1.5 cursor-pointer`}
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-0 bg-white/98 backdrop-blur-md z-10 h-20 md:h-24 flex items-center px-6 md:px-10 border-b border-[#E8E4DF] animate-scale-in">
            <form onSubmit={handleSearch} className="flex items-center gap-4 w-full max-w-2xl mx-auto">
              <Search size={20} className="text-[#C4922A] shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for styles, designers, collections..."
                className="flex-1 text-sm text-[#0A0A0A] placeholder-[#9E9E9E] outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F6] to-[#F5EFE4] flex flex-col overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C4922A]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#E8B84B]/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#E8E4DF]/65 z-10">
            <img src={LOGO_URL} alt="Fashion Gate" className="h-[74px] w-auto object-contain" />
            <button onClick={() => setMenuOpen(false)} className="text-[#0A0A0A] p-2 hover:text-[#C4922A] transition-colors">
              <X size={26} />
            </button>
          </div>
          <nav className="relative flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 z-10">
            {navLinks.map(link => {
              let mobileSublinks: { label: string; href: string }[] = [];
              if (link.sub) {
                mobileSublinks = link.sub;
              } else if (link.columns) {
                link.columns.forEach(col => {
                  mobileSublinks = mobileSublinks.concat(col.items);
                });
              }

              const hasSub = mobileSublinks.length > 0;
              const isExpanded = expandedMobileMenu === link.label;

              return (
                <div key={link.label} className="border-b border-[#E8E4DF]/50 pb-4">
                  {hasSub ? (
                    <button
                      onClick={() => setExpandedMobileMenu(isExpanded ? null : link.label)}
                      className="w-full flex items-center justify-between text-left text-base font-display font-bold text-[#0A0A0A] mb-1 focus:outline-none cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#C4922A]' : 'text-neutral-400'}`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="block text-base font-display font-bold text-[#0A0A0A] mb-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                  {hasSub && isExpanded && (
                    <div className="grid grid-cols-2 gap-2 mt-3 w-full animate-scale-in">
                      {mobileSublinks.map(sub => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          className="text-[11px] text-[#4A4A4A] hover:text-[#C4922A] hover:border-[#C4922A] transition-all font-semibold uppercase tracking-wider py-2.5 px-3 bg-[#FAFAF8] rounded-xs text-center border border-[#E8E4DF]"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="px-6 py-8 border-t border-[#E8E4DF] flex flex-col gap-3">
            <Link to="/cart" className="btn-gold text-center">
              View Cart ({totalItems})
            </Link>
            <Link to="/wishlist" className="btn-outline-gold text-center block">
              <span>Wishlist ({wishlistTotal})</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
