import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Music, Truck, User, LogOut, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const GoogleIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

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
    label: "Kids'",
    href: '/shop?cat=kids',
    isMegamenu: false,
    sub: [
      { label: 'New In', href: '/shop?cat=kids&tag=new' },
      { label: "Girls' Dresses", href: '/shop?cat=kids&sub=dresses' },
      { label: "Boys' Shirts", href: '/shop?cat=kids&sub=shirts' },
      { label: 'Sets & Festive Wear', href: '/shop?cat=kids&sub=sets' },
      { label: 'Shorts & Casuals', href: '/shop?cat=kids&sub=shorts' },
      { label: 'All Kids', href: '/shop?cat=kids' },
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();
  const { user, isLoggedIn, signOut } = useCustomerAuth();
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
        <nav className="max-w-[1440px] xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between h-20 md:h-24 relative w-full">
          {/* Reusable Nav Link Renderer */}
          {(() => {
            const renderLink = (link: typeof navLinks[0]) => {
              const isActive = link.href === '/'
                ? location.pathname === '/'
                : location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
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
                    className={`relative flex items-center gap-1 text-[10.5px] lg:text-[11px] xl:text-[11.5px] tracking-[0.12em] lg:tracking-[0.15em] uppercase font-semibold transition-colors duration-300 ${isActive ? 'text-[#C4922A]' : textColor
                      } hover:text-[#C4922A] pb-1.5 whitespace-nowrap`}
                  >
                    {link.label}
                    {hasSub && <ChevronDown size={11} className="transition-transform group-hover:rotate-180 duration-300 shrink-0" />}
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
                {/* Desktop Left Nav Links (5 links: Home, Women's, Men's, Kids', Collections) */}
                <div className="hidden md:flex items-center justify-end gap-3.5 lg:gap-5 xl:gap-7 pr-6 lg:pr-9 xl:pr-12 z-10">
                  {navLinks.slice(0, 5).map(link => renderLink(link))}
                </div>

                {/* Logo Center */}
                <Link to="/" className="flex items-center justify-center shrink-0 z-20 mx-auto md:mx-0 -translate-y-1 md:-translate-y-2">
                  <img
                    src={LOGO_URL}
                    alt="Fashion Gate"
                    className="h-[74px] sm:h-[84px] md:h-28 lg:h-32 xl:h-36 w-auto object-contain transition-all duration-300 py-0.5"
                    style={{ filter: scrolled || !isHome ? 'none' : 'brightness(0) invert(1)' }}
                  />
                </Link>

                {/* Desktop Right Section (3 Links: Gallery, About, Contact + Action Icons) */}
                <div className="hidden md:flex items-center justify-between pl-6 lg:pl-9 xl:pl-12 gap-3 lg:gap-5 z-10 w-full">
                  {/* Desktop Nav Links (Right block: Gallery, About, Contact) */}
                  <div className="flex items-center gap-3.5 lg:gap-5 xl:gap-7 shrink-0">
                    {navLinks.slice(5).map(link => renderLink(link))}
                  </div>

                  {/* Right Side Icons */}
                  <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4 ml-auto shrink-0 z-20">
                    <button
                      onClick={() => setSearchOpen(true)}
                      className={`${textColor} hover:text-[#C4922A] transition-colors p-1.5 cursor-pointer`}
                      aria-label="Search"
                    >
                      <Search size={19} />
                    </button>

                    {/* Order Tracking Quick Link */}
                    <Link
                      to="/order-tracking"
                      className={`relative ${textColor} hover:text-[#C4922A] transition-colors p-1.5 flex items-center`}
                      title="Track Your Order"
                      aria-label="Track Order"
                    >
                      <Truck size={19} />
                    </Link>

                    <Link
                      to="/wishlist"
                      className={`relative ${textColor} hover:text-[#C4922A] transition-colors p-1.5 flex`}
                      aria-label="Wishlist"
                    >
                      <Heart size={19} />
                      {wishlistTotal > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#C4922A] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                          {wishlistTotal}
                        </span>
                      )}
                    </Link>

                    {/* User Account / Sign In Dropdown (Desktop) */}
                    <div className="relative">
                      {isLoggedIn && user ? (
                        <button
                          type="button"
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          className={`flex items-center gap-1.5 p-0.5 rounded-full border transition-all cursor-pointer ${userMenuOpen ? 'border-[#C4922A] ring-2 ring-[#C4922A]/20' : 'border-transparent hover:border-[#C4922A]'
                            }`}
                          title={`Account: ${user.displayName || user.email || 'Patron'}`}
                        >
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || 'Patron'}
                              className="w-7 h-7 rounded-full object-cover border border-[#C4922A]"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#0A0A0A] text-[#C4922A] flex items-center justify-center font-bold text-xs">
                              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </button>
                      ) : (
                        <Link
                          to="/account"
                          className={`relative ${textColor} hover:text-[#C4922A] transition-colors p-1.5 flex items-center`}
                          title="Sign In / Register with Google"
                          aria-label="Account"
                        >
                          <User size={19} />
                        </Link>
                      )}

                      {/* User Dropdown Menu */}
                      {isLoggedIn && user && userMenuOpen && (
                        <div
                          className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-md border border-[#E8E4DF] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] rounded-xs py-3 animate-dropdown z-50 text-left"
                          onMouseLeave={() => setUserMenuOpen(false)}
                        >
                          <div className="px-4 pb-3 border-b border-[#E8E4DF]">
                            <p className="text-xs font-bold text-[#0A0A0A] truncate">{user.displayName || user.email?.split('@')[0] || 'Patron'}</p>
                            <p className="text-[10px] text-[#7A7A7A] truncate font-mono mt-0.5">{user.email}</p>
                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-2xs font-bold uppercase">
                              <CheckCircle2 size={10} /> Google Verified
                            </span>
                          </div>

                          <div className="py-1">
                            <Link
                              to="/account?tab=profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors uppercase font-medium tracking-wider"
                            >
                              <User size={14} className="text-[#C4922A]" />
                              <span>My Profile Details</span>
                            </Link>

                            <Link
                              to="/account?tab=orders"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors uppercase font-medium tracking-wider"
                            >
                              <ShoppingBag size={14} className="text-[#C4922A]" />
                              <span>My Orders &amp; Records</span>
                            </Link>

                            <Link
                              to="/account?tab=address"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors uppercase font-medium tracking-wider"
                            >
                              <MapPin size={14} className="text-[#C4922A]" />
                              <span>Delivery Addresses</span>
                            </Link>

                            <Link
                              to="/account?tab=wishlist"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors uppercase font-medium tracking-wider"
                            >
                              <Heart size={14} className="text-[#C4922A]" />
                              <span>Saved Wishlist</span>
                            </Link>

                            <Link
                              to="/order-tracking"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors uppercase font-medium tracking-wider"
                            >
                              <Truck size={14} className="text-[#C4922A]" />
                              <span>Live Order Tracking</span>
                            </Link>
                          </div>

                          <div className="pt-2 border-t border-[#E8E4DF] px-2">
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                signOut();
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-2xs transition-colors uppercase font-bold tracking-wider cursor-pointer"
                            >
                              <LogOut size={13} />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

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
                  </div>
                </div>
              </>
            );
          })()}

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3 ml-auto shrink-0 z-20">
            <button
              onClick={() => setSearchOpen(true)}
              className={`${textColor} hover:text-[#C4922A] transition-colors p-1.5 cursor-pointer`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Music Toggle Button (Mobile) */}
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
                <Music size={20} />
              )}
            </button>

            <Link
              to="/cart"
              className={`relative ${textColor} hover:text-[#C4922A] transition-all p-1.5 ${pulseCart ? 'animate-bounce-pulse text-[#C4922A]' : ''}`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} className={pulseCart ? 'stroke-[2.5px]' : ''} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C4922A] text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              className={`${textColor} hover:text-[#C4922A] transition-colors p-1.5 cursor-pointer`}
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-0 bg-white z-[100] h-20 md:h-24 flex items-center px-4 sm:px-6 md:px-10 border-b border-[#E8E4DF] shadow-md animate-scale-in">
            <form onSubmit={handleSearch} className="flex items-center gap-3 md:gap-4 w-full max-w-2xl mx-auto">
              <button
                type="submit"
                className="text-[#C4922A] hover:text-[#0A0A0A] p-1 transition-colors cursor-pointer shrink-0"
                aria-label="Submit search"
              >
                <Search size={20} />
              </button>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sarees, dresses, menswear, collections..."
                className="flex-1 text-sm md:text-base text-[#0A0A0A] placeholder-[#8A8A8A] outline-none bg-transparent font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A8A] hover:text-[#0A0A0A] px-2 py-1 transition-colors shrink-0"
                  title="Clear search"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors cursor-pointer shrink-0"
                title="Close search (Esc)"
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
          <nav className="relative flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 z-10">
            {/* Mobile User Profile / Sign-in Card */}
            {isLoggedIn && user ? (
              <div className="p-3.5 bg-white border border-[#E8E4DF] rounded-xs shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'Patron'} className="w-10 h-10 rounded-full object-cover border border-[#C4922A] shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0A0A0A] text-[#C4922A] flex items-center justify-center font-bold text-sm shrink-0">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#0A0A0A] truncate">{user.displayName || user.email?.split('@')[0] || 'Patron'}</p>
                    <p className="text-[10px] text-[#7A7A7A] truncate font-mono">{user.email}</p>
                    <span className="inline-flex items-center gap-1 text-[8px] text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded-2xs font-bold uppercase mt-0.5">
                      ✓ Google Verified
                    </span>
                  </div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="text-[10px] text-[#C4922A] font-bold uppercase tracking-wider bg-[#FAFAF8] px-2.5 py-1.5 border border-[#E8E4DF] rounded-xs shrink-0"
                >
                  Portal
                </Link>
              </div>
            ) : (
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="p-3 bg-white hover:bg-[#FAFAF8] border border-[#D5D0C9] rounded-xs shadow-2xs flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FAFAF8] border border-[#E8E4DF] flex items-center justify-center shrink-0">
                    <GoogleIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider">Sign in with Google</p>
                    <p className="text-[10px] text-[#7A7A7A]">Track orders &amp; express checkout</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#C4922A] font-bold uppercase tracking-wider">
                  Log In →
                </span>
              </Link>
            )}

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
                <div key={link.label} className="border-b border-[#E8E4DF]/50 pb-3">
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

            {/* Direct Mobile Links for Tracking & My Orders */}
            <div className="border-t border-[#E8E4DF]/60 pt-3 flex flex-col gap-2.5">
              <Link
                to="/account?tab=orders"
                className="flex items-center gap-2.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#C4922A] py-1 uppercase tracking-wider"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBag size={15} className="text-[#C4922A]" />
                <span>My Orders &amp; Records</span>
              </Link>
              <Link
                to="/order-tracking"
                className="flex items-center gap-2.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#C4922A] py-1 uppercase tracking-wider"
                onClick={() => setMenuOpen(false)}
              >
                <Truck size={15} className="text-[#C4922A]" />
                <span>Live Order Tracking</span>
              </Link>
              <Link
                to="/account?tab=address"
                className="flex items-center gap-2.5 text-xs font-semibold text-[#0A0A0A] hover:text-[#C4922A] py-1 uppercase tracking-wider"
                onClick={() => setMenuOpen(false)}
              >
                <MapPin size={15} className="text-[#C4922A]" />
                <span>Saved Delivery Addresses</span>
              </Link>
              <button
                type="button"
                onClick={toggleMusic}
                className="flex items-center justify-between w-full text-xs font-semibold text-[#0A0A0A] hover:text-[#C4922A] py-1 uppercase tracking-wider cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Music size={15} className="text-[#C4922A]" />
                  <span>Ambient Relaxing Music</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-2xs font-bold uppercase ${
                  musicPlaying ? 'bg-[#C4922A]/15 text-[#C4922A] border border-[#C4922A]/30' : 'bg-black/5 text-neutral-500'
                }`}>
                  {musicPlaying ? 'Playing ♪' : 'Play Music'}
                </span>
              </button>
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-2.5 text-xs font-bold text-red-600 hover:text-red-700 py-1 uppercase tracking-wider text-left cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
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
