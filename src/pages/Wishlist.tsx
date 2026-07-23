import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { useReveal } from '../hooks/useReveal';

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  useReveal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6 py-20">
          <Heart size={48} className="text-[#E8E4DF] mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-[#0A0A0A] mb-3">Your wishlist is empty</h2>
          <p className="text-[#9E9E9E] text-sm mb-8">Save the pieces you love and revisit them whenever you're ready.</p>
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Discover Collections <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <div className="mb-12 reveal">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Your Selections</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">
            Wishlist <span className="text-[#C4922A]">({items.length})</span>
          </h1>
        </div>

        {/* Wishlist grid with remove/add actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {items.map((product, i) => (
            <div key={product.id} className="group reveal">
              <div className="relative">
                <ProductCard product={product} index={i} hideMobileActions={true} />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                    className="flex-1 bg-[#C4922A] hover:bg-[#96700A] text-white font-semibold text-[10px] uppercase tracking-wider py-2.5 px-1.5 text-center rounded-xs transition-colors cursor-pointer"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="w-10 h-10 border border-[#E8E4DF] hover:border-red-400 hover:text-red-400 flex items-center justify-center text-[#9E9E9E] transition-all rounded-xs cursor-pointer shrink-0"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center reveal">
          <Link to="/shop" className="btn-outline-gold inline-block">
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
