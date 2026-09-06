import { useState, useEffect, useCallback } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-[#0A0A0A] text-white',
  sale: 'bg-[#C4922A] text-white',
  trending: 'bg-white text-[#0A0A0A] border border-[#0A0A0A]',
  limited: 'bg-[#96700A] text-white',
};

interface Props {
  product: Product;
  index?: number;
  hideMobileActions?: boolean;
}

export default function ProductCard({ product, index = 0, hideMobileActions = false }: Props) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [hoveredImgIdx, setHoveredImgIdx] = useState(0);
  const [heartParticles, setHeartParticles] = useState<{ id: number; x: number; y: number; rot: number; scale: number }[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product.images || product.images.length <= 1) return;

    // Use phase-shifted interval speeds (e.g. 3.8s, 4.4s, 5.0s, etc.) so rotations naturally stagger
    const intervalSpeed = 3800 + (product.id % 4) * 600;

    const interval = setInterval(() => {
      setHoveredImgIdx(prev => (prev + 1) % product.images.length);
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [product.images, product.id]);

  const handleMouseEnter = () => {
    // Optional hover focus effect could go here
  };

  const handleMouseLeave = () => {
    // Left empty to allow continuous rotation when mouse leaves
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding || added) return;
    setIsAdding(true);

    // Dispatch cart insertion
    addToCart(product, product.sizes[0], product.colors[0]);

    // Simulate luxury loader transition
    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }, 700);
  };

  const spawnHeartParticles = useCallback(() => {
    const particles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -(Math.random() * 50 + 20),
      rot: (Math.random() - 0.5) * 60,
      scale: 0.5 + Math.random() * 0.7,
    }));
    setHeartParticles(particles);
    setTimeout(() => setHeartParticles([]), 900);
  }, []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const adding = !isWishlisted(product.id);
    toggleWishlist(product);
    if (adding) {
      spawnHeartParticles();
      setToastMsg('Added to Wishlist');
    } else {
      setToastMsg('Removed from Wishlist');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const delay = `${index * 80}ms`;

  return (
    <div
      className="product-card group reveal"
      style={{ animationDelay: delay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden bg-[#F2F0ED] aspect-[3/4]">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                className={`product-img absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out ${i === hoveredImgIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
              />
            ))
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="product-img w-full h-full object-cover"
            />
          )}

          {/* Image Navigation Dots (Always Visible) */}
          {product.images && product.images.length > 1 && (
            <div className="product-dots absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 transition-opacity duration-300 opacity-100">
              {product.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 shadow-[0_1.5px_4px_rgba(0,0,0,0.65)] border border-black/15 ${idx === hoveredImgIdx ? 'bg-[#C4922A] w-4.5 border-[#C4922A]/20' : 'bg-white/95'
                    }`}
                />
              ))}
            </div>
          )}

          {/* Out of Stock Overlay on Image */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[25%] pointer-events-none z-10 flex items-center justify-center">
              <span className="bg-black/90 backdrop-blur-md text-white border border-white/20 uppercase tracking-[0.2em] text-[9px] md:text-[11px] font-bold px-3 py-1.5 shadow-2xl rounded-xs">
                Sold Out
              </span>
            </div>
          )}

          {/* Badges: Out of Stock takes high priority */}
          {!product.inStock ? (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 text-[7px] md:text-[10px] tracking-[0.12em] uppercase font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 bg-black/90 text-white border border-red-500/50 shadow-md z-20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" /> Out of Stock
            </span>
          ) : product.badge ? (
            <span className={`absolute top-2 left-2 md:top-3 md:left-3 text-[7px] md:text-[10px] tracking-[0.12em] uppercase font-semibold px-1.5 py-0.5 md:px-2.5 md:py-1 ${BADGE_STYLES[product.badge]} z-10`}>
              {product.badge}
            </span>
          ) : null}

          {/* Wishlist button + particles */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
            {/* Floating heart particles */}
            {heartParticles.map(p => (
              <span
                key={p.id}
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  animation: 'heart-float 0.8s ease-out forwards',
                  '--hx': `${p.x}px`,
                  '--hy': `${p.y}px`,
                  '--hr': `${p.rot}deg`,
                  '--hs': p.scale,
                } as React.CSSProperties}
              >
                <Heart size={10} className="fill-[#C4922A] text-[#C4922A]" />
              </span>
            ))}

            <button
              onClick={handleWishlist}
              className={`wishlist-btn w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center backdrop-blur-sm border cursor-pointer ${isWishlisted(product.id)
                  ? 'wishlisted bg-[#C4922A] border-[#C4922A] shadow-[0_2px_12px_rgba(196,146,42,0.4)]'
                  : 'bg-white/80 border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]'
                }`}
              aria-label="Add to wishlist"
            >
              <Heart
                size={13}
                className={`md:w-[15px] md:h-[15px] transition-all duration-300 ${isWishlisted(product.id)
                    ? 'fill-white text-white drop-shadow-sm'
                    : 'text-[#0A0A0A]/70 hover:text-[#C4922A]'
                  }`}
              />
            </button>

            {/* Mini toast */}
            {showToast && (
              <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-[#0A0A0A] text-white text-[9px] md:text-[10px] tracking-[0.06em] uppercase font-medium px-3 py-1.5 rounded-sm shadow-lg animate-dropdown pointer-events-none">
                {toastMsg}
              </div>
            )}
          </div>

          {/* Overlay actions (Desktop Only) */}
          <div className="product-overlay hidden md:flex gap-1.5 md:gap-2 z-20">
            {product.inStock ? (
              <button
                onClick={handleQuickAdd}
                disabled={isAdding || added}
                className={`flex-1 flex items-center justify-center gap-1 md:gap-2 text-white text-[8px] md:text-[10px] tracking-[0.1em] uppercase font-semibold py-1.5 md:py-2.5 transition-all cursor-pointer ${added
                    ? 'bg-[#2E7D32] hover:bg-[#1B5E20]'
                    : isAdding
                      ? 'bg-[#96700A] cursor-wait animate-pulse'
                      : 'bg-[#C4922A] hover:bg-[#96700A]'
                  }`}
              >
                {isAdding ? (
                  <span>Adding...</span>
                ) : added ? (
                  <span>✓ Added</span>
                ) : (
                  <>
                    <ShoppingBag size={10} className="md:w-3 md:h-3" /> Quick Add
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-[#1F1F1F] text-white/50 border border-white/10 text-[8px] md:text-[10px] tracking-[0.1em] uppercase font-semibold py-1.5 md:py-2.5 cursor-not-allowed select-none"
              >
                Out of Stock
              </button>
            )}
            <Link
              to={`/product/${product.id}`}
              className="w-7 md:w-10 flex items-center justify-center bg-white text-[#0A0A0A] hover:bg-[#F2F0ED] transition-colors shrink-0"
            >
              <Eye size={11} className="md:w-3.5 md:h-3.5" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="pt-2.5 md:pt-4 pb-2 px-0.5">
          <div className="flex items-center justify-between gap-1 mb-0.5 md:mb-1">
            <p className="text-[8px] md:text-[10px] text-[#9E9E9E] tracking-[0.1em] uppercase">{product.subcategory}</p>
            {!product.inStock && (
              <span className="text-[8px] md:text-[9px] uppercase tracking-wider font-bold text-red-600">
                Out of Stock
              </span>
            )}
          </div>
          <h3 className="font-display text-[#0A0A0A] font-semibold text-xs md:text-base leading-snug mb-1 md:mb-2 group-hover:text-[#C4922A] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#0A0A0A] font-semibold text-xs md:text-sm">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-[#9E9E9E] text-[10px] md:text-sm line-through">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          {/* Stars */}
          <div className="flex items-center gap-1 md:gap-1.5 mt-1 md:mt-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-2 h-2 md:w-2.5 md:h-2.5" viewBox="0 0 10 10">
                  <polygon
                    points="5,1 6.18,3.64 9.05,3.64 6.91,5.36 7.7,8.09 5,6.5 2.3,8.09 3.09,5.36 0.95,3.64 3.82,3.64"
                    fill={i < Math.floor(product.rating) ? '#C4922A' : '#E8E4DF'}
                  />
                </svg>
              ))}
            </div>
            <span className="text-[8px] md:text-[10px] text-[#9E9E9E]">({product.reviews})</span>
          </div>

          {/* Mobile Actions Row (Visible only on mobile viewports) */}
          {!hideMobileActions && (
            <div className="flex md:hidden gap-1.5 mt-3 w-full">
              {product.inStock ? (
                <button
                  onClick={handleQuickAdd}
                  disabled={isAdding || added}
                  className={`flex-1 flex items-center justify-center gap-1 text-white text-[9px] tracking-[0.08em] uppercase font-bold py-2 transition-all cursor-pointer rounded-xs ${added
                      ? 'bg-[#2E7D32]'
                      : isAdding
                        ? 'bg-[#96700A] cursor-wait animate-pulse'
                        : 'bg-[#C4922A] hover:bg-[#96700A]'
                    }`}
                >
                  {isAdding ? (
                    <span>Adding...</span>
                  ) : added ? (
                    <span>✓ Added</span>
                  ) : (
                    <>
                      <ShoppingBag size={10} /> Quick Add
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-1 bg-[#222222] text-[#888888] text-[9px] tracking-[0.08em] uppercase font-bold py-2 border border-white/10 cursor-not-allowed rounded-xs select-none"
                >
                  Out of Stock
                </button>
              )}
              <Link
                to={`/product/${product.id}`}
                className="w-8 flex items-center justify-center bg-white text-[#0A0A0A] border border-[#E8E4DF] hover:bg-[#F2F0ED] transition-colors shrink-0 rounded-xs"
              >
                <Eye size={12} />
              </Link>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
