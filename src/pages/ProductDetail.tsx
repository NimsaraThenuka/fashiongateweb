import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronDown, Truck, RotateCcw, Shield, Check, ChevronLeft, ChevronRight, AlertCircle, ArrowLeft, Maximize2, ZoomIn } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import ImageLightbox from '../components/common/ImageLightbox';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReveal } from '../hooks/useReveal';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getProductById } = useProducts();
  const product = getProductById(Number(id)) || products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  useReveal();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="font-display text-3xl mb-4">Product not found</h2>
          <Link to="/shop" className="btn-gold">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const allImages = product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setColorError(true);
      return;
    }
    addToCart(product, selectedSize || 'One Size', selectedColor || 'Default');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleWhatsAppOrder = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setColorError(true);
      return;
    }
    const message = `🌟 *FASHION GATE BOUTIQUE - NEW ORDER INQUIRY* 🌟\n\n` +
      `Hello Fashion Gate Concierge! I would like to place an order for the following item:\n\n` +
      `▪ *Product:* ${product.name}\n` +
      `▪ *Price:* Rs. ${product.price.toLocaleString()}\n` +
      `▪ *Size:* ${selectedSize || 'One Size'}\n` +
      `▪ *Color:* ${selectedColor || 'Default'}\n` +
      `▪ *Item Code:* FG-${product.id}\n\n` +
      `Please provide delivery details and confirm availability. Thank you!`;
    window.open(`https://wa.me/94775439401?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  };

  const ACCORDIONS = [
    { key: 'details', label: 'Product Details', content: product.description },
    { key: 'sizing', label: 'Size & Fit', content: product.sizeFit || 'This piece runs true to size. We recommend ordering your usual size. For detailed measurements, please refer to our size guide. The model is 5\'10" and wearing a size S.' },
    { key: 'shipping', label: 'Shipping & Returns', content: 'Standard islandwide delivery is Rs. 350 for all orders. Orders are dispatched within 1-2 business days with real-time tracking. Free returns within 30 days of delivery. Items must be unworn with all tags attached.' },
    { key: 'care', label: 'Care Instructions', content: 'Dry clean recommended. If hand washing, use cold water and a gentle detergent. Lay flat to dry away from direct sunlight. Store in the provided garment bag.' },
  ];

  const savings = product.originalPrice ? product.originalPrice - product.price : null;
  const currentStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock ? 10 : 0);
  const isOutOfStock = !product.inStock || currentStock <= 0;
  const isLowStock = !isOutOfStock && currentStock <= 5;

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {isLightboxOpen && (
        <ImageLightbox
          images={allImages}
          initialIndex={activeImg}
          isOpen={isLightboxOpen}
          productName={product.name}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-5 md:py-10 overflow-x-hidden">
        {/* Top Navigation Row: Easy Back Button + Breadcrumbs */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 reveal">
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 py-2 px-3.5 sm:px-4 bg-[#0A0A0A] hover:bg-[#C4922A] text-white text-[11px] sm:text-xs font-semibold tracking-[0.1em] uppercase transition-all rounded-xs cursor-pointer group shadow-xs shrink-0 active:scale-95"
            title="Go back to previous page"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#7A7A7A] tracking-[0.06em] uppercase overflow-hidden truncate">
            <Link to="/" className="hover:text-[#C4922A] transition-colors shrink-0">Home</Link>
            <span className="text-[#C5C0B8]">/</span>
            <Link to="/shop" className="hover:text-[#C4922A] transition-colors shrink-0">Shop</Link>
            <span className="text-[#C5C0B8] hidden sm:inline">/</span>
            <span className="text-[#0A0A0A] font-semibold truncate max-w-[140px] sm:max-w-[280px] hidden sm:inline">{product.name}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-20">
          {/* Images */}
          <div className="reveal">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative overflow-hidden bg-[#F2F0ED] aspect-[3/4] mb-3 group rounded-2xs cursor-zoom-in shadow-xs"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGoBack();
                }}
                className="sm:hidden absolute top-3 left-3 z-20 w-9 h-9 bg-white/90 hover:bg-white text-[#0A0A0A] hover:text-[#C4922A] rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-90 border border-black/5"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Enlarge / Fullscreen Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-[#C4922A] text-white px-2.5 sm:px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase opacity-90 group-hover:opacity-100 transition-all cursor-pointer shadow-md active:scale-95 border border-white/20"
                title="Click to view full screen high-res image"
              >
                <Maximize2 size={13} />
                <span className="hidden sm:inline">Zoom View</span>
              </button>

              {/* Product Image */}
              <img
                src={allImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-103"
              />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg(prev => (prev - 1 + allImages.length) % allImages.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 bg-white/85 hover:bg-[#C4922A] hover:text-white text-[#0A0A0A] flex items-center justify-center rounded-full transition-all duration-300 shadow-md cursor-pointer focus:outline-none z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg(prev => (prev + 1) % allImages.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 bg-white/85 hover:bg-[#C4922A] hover:text-white text-[#0A0A0A] flex items-center justify-center rounded-full transition-all duration-300 shadow-md cursor-pointer focus:outline-none z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Subtle hover tooltip bar on PC */}
              <div className="absolute bottom-2.5 inset-x-3 py-1.5 px-3 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-center rounded-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 pointer-events-none">
                <ZoomIn size={13} className="text-[#E8B84B]" />
                <span>Click image to open high-resolution gallery</span>
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-16 sm:w-20 aspect-square shrink-0 overflow-hidden rounded-2xs border-2 transition-all cursor-pointer ${
                      activeImg === i
                        ? 'border-[#C4922A] shadow-xs scale-102 ring-1 ring-[#C4922A]/40'
                        : 'border-[#E8E4DF] opacity-70 hover:opacity-100 hover:border-[#C4922A]/60'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="reveal delay-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs text-[#C4922A] tracking-[0.15em] uppercase font-semibold truncate">{product.subcategory}</p>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-red-50 text-red-700 border border-red-200 rounded-xs shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Out of Stock (0 Available)
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-300 rounded-xs shrink-0 whitespace-nowrap animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Only {currentStock} left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xs shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In Stock ({currentStock} available)
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-3 md:mb-4 leading-tight break-words">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={`${i < Math.floor(product.rating) ? 'fill-[#C4922A] text-[#C4922A]' : 'text-[#E8E4DF]'}`} />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-[#9E9E9E]">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-4 md:mb-5">
              <span className="font-display text-2xl sm:text-3xl font-bold text-[#0A0A0A] whitespace-nowrap">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#9E9E9E] text-base sm:text-lg line-through whitespace-nowrap">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] sm:text-xs bg-[#C4922A] text-white px-2 py-0.5 font-semibold whitespace-nowrap rounded-2xs shadow-2xs">
                    Save Rs. {savings?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Low Stock Urgency Banner */}
            {isLowStock && (
              <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xs flex items-center gap-2.5 text-amber-900 shadow-2xs">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <p className="text-xs leading-snug">
                  <strong className="font-bold text-amber-950">Low Stock Alert:</strong> Only <span className="font-bold text-amber-800 underline decoration-amber-400">{currentStock} {currentStock === 1 ? 'piece' : 'pieces'}</span> remaining in inventory. Order now to secure yours!
                </p>
              </div>
            )}

            {/* Out of Stock Alert Banner */}
            {isOutOfStock && (
              <div className="mb-6 p-4 bg-amber-50/70 border border-amber-200/80 rounded-sm">
                <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Currently Unavailable
                </p>
                <p className="text-xs text-amber-800/80 leading-relaxed">
                  This exclusive piece is currently sold out in all sizes. You may inquire with our boutique styling team on WhatsApp for restock dates or custom pre-orders.
                </p>
              </div>
            )}

            {/* Color selection */}
            <div className="mb-5 md:mb-6">
              <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                <p className={`text-xs tracking-[0.1em] uppercase font-semibold transition-colors ${colorError ? 'text-red-600' : 'text-[#0A0A0A]'}`}>
                  Colour: {colorError ? (
                    <span className="text-red-500 font-bold ml-1">Please select a colour</span>
                  ) : (
                    <span className="text-[#C4922A] ml-1">{selectedColor || <span className="text-[#9E9E9E] font-normal normal-case italic">Select a colour</span>}</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      setColorError(false);
                    }}
                    className={`px-3.5 py-2 text-xs tracking-[0.06em] transition-all border font-medium cursor-pointer rounded-2xs ${
                      selectedColor === c
                        ? 'border-[#C4922A] bg-[#C4922A] text-white shadow-xs'
                        : colorError
                          ? 'border-red-300 bg-red-50/20 text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                          : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {colorError && (
                <p className="text-[11px] text-red-500 font-medium mt-1.5 flex items-center gap-1 animate-fade-in">
                  <AlertCircle size={12} className="shrink-0" /> Please choose a colour to proceed.
                </p>
              )}
            </div>

            {/* Size selection */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className={`text-xs tracking-[0.1em] uppercase font-semibold transition-colors ${sizeError ? 'text-red-600' : 'text-[#0A0A0A]'}`}>
                  Size: {sizeError ? (
                    <span className="text-red-500 font-bold ml-1">Please select a size</span>
                  ) : (
                    <span className="text-[#C4922A] ml-1">{selectedSize || <span className="text-[#9E9E9E] font-normal normal-case italic">Select a size</span>}</span>
                  )}
                </p>
                <button className="text-xs text-[#C4922A] underline tracking-[0.06em] cursor-pointer shrink-0 whitespace-nowrap">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError(false);
                    }}
                    className={`min-w-[44px] sm:min-w-[48px] px-3 py-2 text-xs tracking-[0.06em] text-center transition-all border font-medium cursor-pointer rounded-2xs ${
                      selectedSize === s
                        ? 'border-[#C4922A] bg-[#C4922A] text-white shadow-xs'
                        : sizeError
                          ? 'border-red-300 bg-red-50/20 text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                          : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-[11px] text-red-500 font-medium mt-1.5 flex items-center gap-1 animate-fade-in">
                  <AlertCircle size={12} className="shrink-0" /> Please choose a size to proceed.
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 mb-8">
              <div className="flex gap-2.5 sm:gap-3">
                {!isOutOfStock ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-xs tracking-[0.08em] uppercase font-semibold transition-all duration-300 cursor-pointer rounded-2xs ${
                      addedToCart
                        ? 'bg-green-600 text-white'
                        : 'btn-gold'
                    }`}
                  >
                    {addedToCart ? (
                      <><Check size={14} /> Added to Cart</>
                    ) : (
                      <><ShoppingBag size={14} /> Add to Bag</>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-xs tracking-[0.08em] uppercase font-bold bg-[#E8E4DF] text-[#888888] border border-[#D5D0CA] cursor-not-allowed select-none rounded-2xs"
                  >
                    Sold Out / Out of Stock
                  </button>
                )}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 sm:w-14 shrink-0 flex items-center justify-center border transition-all cursor-pointer rounded-2xs ${
                    isWishlisted(product.id)
                      ? 'border-[#C4922A] bg-[#C4922A] text-white'
                      : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={16} className={isWishlisted(product.id) ? 'fill-white' : ''} />
                </button>
              </div>

              {/* Elegant OR Divider */}
              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-[#E8E4DF] w-full" />
                <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#9E9E9E] tracking-[0.18em]">
                  or
                </span>
                <div className="border-t border-[#E8E4DF] w-full" />
              </div>

              {/* Instant WhatsApp Order Button */}
              {!isOutOfStock ? (
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white text-xs tracking-[0.06em] uppercase font-semibold rounded-2xs transition-all shadow-xs hover:shadow-sm cursor-pointer group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Order via WhatsApp</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#142A1E] hover:bg-[#1B3828] text-emerald-300 text-xs tracking-[0.06em] uppercase font-semibold rounded-2xs border border-emerald-500/30 transition-all cursor-pointer group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Inquire Restock via WhatsApp</span>
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 py-5 sm:py-6 border-y border-[#E8E4DF]">
              {[
                { Icon: Truck, label: 'Islandwide Delivery', sub: 'Flat Rs. 350' },
                { Icon: RotateCcw, label: '30-Day Returns', sub: 'Hassle-free' },
                { Icon: Shield, label: 'Authentic', sub: '100% genuine' },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="text-center px-1">
                  <Icon size={18} className="text-[#C4922A] mx-auto mb-1 shrink-0" />
                  <p className="text-[9px] sm:text-[10px] font-semibold text-[#0A0A0A] tracking-[0.04em] uppercase leading-tight">{label}</p>
                  <p className="text-[8px] sm:text-[9px] text-[#9E9E9E] mt-0.5 leading-tight">{sub}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="flex flex-col gap-0 border-t border-[#E8E4DF]">
              {ACCORDIONS.map(({ key, label, content }) => (
                <div key={key} className="border-b border-[#E8E4DF]">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                    className="flex items-center justify-between w-full py-4 text-xs tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] hover:text-[#C4922A] transition-colors"
                  >
                    {label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openAccordion === key ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordion === key && (
                    <div className="pb-4 text-sm text-[#4A4A4A] leading-relaxed animate-scale-in">
                      {content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Back to Collection Link */}
            <div className="mt-8 pt-6 border-t border-[#E8E4DF] flex items-center justify-between">
              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] hover:text-[#C4922A] transition-colors group cursor-pointer"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#C4922A]" />
                <span>Back to All Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="text-center mb-12 reveal">
              <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-2">You May Also Like</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0A0A0A]">Complete Your Look</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
