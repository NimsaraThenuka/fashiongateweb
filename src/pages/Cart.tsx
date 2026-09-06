import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  const shipping = totalPrice >= 25000 ? 0 : 2500;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6 py-20">
          <ShoppingBag size={48} className="text-[#E8E4DF] mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold text-[#0A0A0A] mb-3">Your bag is empty</h2>
          <p className="text-[#9E9E9E] text-sm mb-8">Discover our curated collections and find your next favourite piece.</p>
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Explore Collections <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-8 md:mb-12">
          <Link to="/shop" className="flex items-center gap-2 text-xs tracking-[0.08em] uppercase text-[#9E9E9E] hover:text-[#C4922A] transition-colors">
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
          <span className="hidden sm:block text-[#E8E4DF]">/</span>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-[#0A0A0A]">
            Shopping Bag <span className="text-[#C4922A]">({totalItems})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 md:gap-12">
          {/* Items */}
          <div className="flex flex-col gap-0">
            {/* Desktop table header */}
            <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 pb-3 border-b border-[#E8E4DF] text-[10px] tracking-[0.12em] uppercase text-[#9E9E9E]">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
            </div>

            {items.map(item => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                {/* ─── Desktop layout ─── */}
                <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-4 py-6 border-b border-[#E8E4DF] items-center">
                  <div className="flex gap-4">
                    <Link to={`/product/${item.id}`} className="w-24 aspect-[3/4] bg-[#F2F0ED] overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-[#9E9E9E] tracking-[0.1em] uppercase mb-1">{item.subcategory}</p>
                      <h3 className="font-display font-semibold text-base text-[#0A0A0A] mb-2 leading-snug">{item.name}</h3>
                      <p className="text-xs text-[#9E9E9E]">
                        Size: <span className="text-[#4A4A4A]">{item.selectedSize}</span>
                        {item.selectedColor && <> · Colour: <span className="text-[#4A4A4A]">{item.selectedColor}</span></>}
                      </p>
                      <p className="text-sm font-semibold text-[#C4922A] mt-2">Rs. {item.price.toLocaleString()}</p>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="text-[9px] tracking-[0.08em] uppercase text-[#9E9E9E] hover:text-[#C4922A] transition-colors mt-2 flex items-center gap-1 cursor-pointer"
                      >
                        <X size={10} /> Remove
                      </button>
                    </div>
                  </div>
                  {/* Qty */}
                  <div className="flex items-center border border-[#E8E4DF]">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:text-[#C4922A] hover:bg-[#FAFAF8] transition-colors cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  {/* Total */}
                  <div className="text-right">
                    <span className="font-semibold text-sm text-[#0A0A0A]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>

                {/* ─── Mobile layout ─── */}
                <div className="flex md:hidden gap-3 py-5 border-b border-[#E8E4DF]">
                  {/* Product image */}
                  <Link to={`/product/${item.id}`} className="w-[90px] aspect-[3/4] bg-[#F2F0ED] overflow-hidden shrink-0 rounded-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  {/* Product info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-[8px] text-[#9E9E9E] tracking-[0.1em] uppercase">{item.subcategory}</p>
                    <h3 className="font-display font-semibold text-sm text-[#0A0A0A] leading-snug mt-0.5 truncate">{item.name}</h3>
                    <p className="text-[10px] text-[#9E9E9E] mt-1">
                      Size: <span className="text-[#4A4A4A]">{item.selectedSize}</span>
                      {item.selectedColor && <> · {item.selectedColor}</>}
                    </p>
                    <p className="text-sm font-bold text-[#C4922A] mt-1.5">Rs. {item.price.toLocaleString()}</p>

                    {/* Qty & remove row */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center border border-[#E8E4DF] rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#4A4A4A] hover:text-[#C4922A] transition-colors cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#4A4A4A] hover:text-[#C4922A] transition-colors cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-[#0A0A0A]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="text-[#9E9E9E] hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#FAFAF8] p-6 md:p-8 h-fit md:sticky md:top-32 rounded-sm">
            <h2 className="font-display text-lg md:text-xl font-bold text-[#0A0A0A] mb-5 md:mb-6">Order Summary</h2>
            <div className="flex flex-col gap-3 pb-5 border-b border-[#E8E4DF]">
              <div className="flex justify-between text-sm">
                <span className="text-[#4A4A4A]">Subtotal ({totalItems} items)</span>
                <span className="font-medium text-[#0A0A0A]">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4A4A4A]">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-[#0A0A0A]'}>
                  {shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#4A4A4A]">Tax (8%)</span>
                <span className="font-medium text-[#0A0A0A]">Rs. {tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-5 border-b border-[#E8E4DF]">
              <span className="font-semibold text-[#0A0A0A]">Total</span>
              <span className="font-display text-lg md:text-xl font-bold text-[#0A0A0A]">Rs. {grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-[#9E9E9E] py-3 text-center">
                Add <span className="text-[#C4922A] font-medium">Rs. {(25000 - totalPrice).toLocaleString()}</span> more for free shipping
              </p>
            )}
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 cursor-pointer text-center">
                <span>Proceed to Checkout</span> <ArrowRight size={14} />
              </Link>
              <Link to="/shop" className="btn-outline-gold text-center block">
                <span>Continue Shopping</span>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-5 text-[#9E9E9E]">
              <Lock size={11} />
              <span className="text-[10px] tracking-[0.06em]">Secure, encrypted checkout</span>
            </div>
            {/* Payment methods */}
            <div className="flex items-center justify-center gap-3 mt-4 opacity-40">
              {['VISA', 'MC', 'AMEX', 'PayPal'].map(m => (
                <span key={m} className="text-[9px] tracking-widest border border-current px-1.5 py-0.5 font-bold">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
