import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronDown, Truck, RotateCcw, Shield, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReveal } from '../hooks/useReveal';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  useReveal();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

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
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor || product.colors[0]);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const ACCORDIONS = [
    { key: 'details', label: 'Product Details', content: product.description },
    { key: 'sizing', label: 'Size & Fit', content: 'This piece runs true to size. We recommend ordering your usual size. For detailed measurements, please refer to our size guide. The model is 5\'10" and wearing a size S.' },
    { key: 'shipping', label: 'Shipping & Returns', content: 'Complimentary shipping on all orders over Rs. 25,000. Orders are dispatched within 1-2 business days. Free returns within 30 days of delivery. Items must be unworn with all tags attached.' },
    { key: 'care', label: 'Care Instructions', content: 'Dry clean recommended. If hand washing, use cold water and a gentle detergent. Lay flat to dry away from direct sunlight. Store in the provided garment bag.' },
  ];

  const savings = product.originalPrice ? product.originalPrice - product.price : null;

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9E9E9E] tracking-[0.08em] uppercase mb-10 reveal">
          <Link to="/" className="hover:text-[#C4922A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C4922A] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#0A0A0A]">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="reveal">
            <div className="relative overflow-hidden bg-[#F2F0ED] aspect-[3/4] mb-3 group">
              <img
                src={allImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(prev => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-[#C4922A] hover:text-white text-[#0A0A0A] flex items-center justify-center rounded-full transition-all duration-300 shadow-md opacity-0 group-hover:opacity-100 cursor-pointer focus:outline-none"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImg(prev => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-[#C4922A] hover:text-white text-[#0A0A0A] flex items-center justify-center rounded-full transition-all duration-300 shadow-md opacity-0 group-hover:opacity-100 cursor-pointer focus:outline-none"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {product.badge && (
                <span className={`absolute top-4 left-4 text-[10px] tracking-[0.12em] uppercase font-semibold px-3 py-1 ${
                  product.badge === 'sale' ? 'bg-[#C4922A] text-white' :
                  product.badge === 'limited' ? 'bg-[#96700A] text-white' :
                  product.badge === 'trending' ? 'bg-white text-[#0A0A0A] border border-[#0A0A0A]' :
                  'bg-[#0A0A0A] text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 aspect-[3/4] overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#C4922A]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="reveal delay-200">
            <p className="text-xs text-[#C4922A] tracking-[0.15em] uppercase mb-2">{product.subcategory}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={`${i < Math.floor(product.rating) ? 'fill-[#C4922A] text-[#C4922A]' : 'text-[#E8E4DF]'}`} />
                ))}
              </div>
              <span className="text-sm text-[#9E9E9E]">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-3xl font-bold text-[#0A0A0A]">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-[#9E9E9E] text-lg line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  <span className="text-xs bg-[#C4922A] text-white px-2 py-0.5 font-medium">Save Rs. {savings?.toLocaleString()}</span>
                </>
              )}
            </div>

            {/* Color selection */}
            <div className="mb-6">
              <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-3">
                Colour: <span className="text-[#C4922A]">{selectedColor || 'Select a colour'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 text-xs tracking-[0.06em] transition-all border ${
                      selectedColor === c
                        ? 'border-[#C4922A] bg-[#C4922A] text-white'
                        : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs tracking-[0.1em] uppercase font-semibold ${sizeError ? 'text-red-500' : 'text-[#0A0A0A]'}`}>
                  Size: {sizeError ? 'Please select a size' : selectedSize || 'Select a size'}
                </p>
                <button className="text-xs text-[#C4922A] underline tracking-[0.06em]">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                    className={`min-w-[48px] px-3 py-2 text-xs tracking-[0.06em] text-center transition-all border font-medium ${
                      selectedSize === s
                        ? 'border-[#C4922A] bg-[#C4922A] text-white'
                        : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-[0.1em] uppercase font-semibold transition-all duration-300 ${
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
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-14 flex items-center justify-center border transition-all ${
                  isWishlisted(product.id)
                    ? 'border-[#C4922A] bg-[#C4922A] text-white'
                    : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} className={isWishlisted(product.id) ? 'fill-white' : ''} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-[#E8E4DF]">
              {[
                { Icon: Truck, label: 'Free Shipping', sub: 'On orders over Rs. 25,000' },
                { Icon: RotateCcw, label: '30-Day Returns', sub: 'Hassle-free' },
                { Icon: Shield, label: 'Authentic', sub: '100% genuine' },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon size={18} className="text-[#C4922A] mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-[#0A0A0A] tracking-[0.06em] uppercase">{label}</p>
                  <p className="text-[9px] text-[#9E9E9E]">{sub}</p>
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
