import { Link } from 'react-router-dom';
import {
  Calendar,
  Truck,
  Search,
  ShoppingBag,
  CreditCard,
  FileText,
  User,
  LogIn,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useOrders } from '../context/OrderContext';
import { useReveal } from '../hooks/useReveal';

const GoogleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
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

export default function MyOrders() {
  useReveal();
  const { user, signInWithGoogle } = useCustomerAuth();
  const { getCustomerOrders } = useOrders();

  // Strictly get orders belonging to this authenticated user
  const myOrders = user ? getCustomerOrders(user.uid, user.email) : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'confirmed':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-20">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 reveal">
          <div className="flex items-center gap-2 text-xs text-[#9E9E9E] tracking-[0.08em] uppercase mb-2">
            <Link to="/" className="hover:text-[#C4922A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0A0A0A] font-semibold">My Orders</span>
          </div>
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold mb-1">
            Customer Portal
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A0A0A]">
                My Orders {user ? `(${myOrders.length})` : ''}
              </h1>
              {user && (
                <p className="text-xs text-[#7A7A7A] mt-1 flex items-center gap-1.5 font-mono">
                  <User size={12} className="text-[#C4922A]" />
                  <span>Logged in as: <strong className="text-[#0A0A0A]">{user.email}</strong></span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/order-tracking"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A0A0A] hover:text-[#C4922A] transition-colors"
              >
                <Search size={14} /> Track Any Order by Reference
              </Link>
            </div>
          </div>
        </div>

        {/* If user is NOT logged in: Show Google Sign In CTA */}
        {!user ? (
          <div className="bg-white border border-[#E8E4DF] rounded-sm p-8 sm:p-12 text-center shadow-xs reveal space-y-6 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-[#FAFAF8] border border-[#E8E4DF] rounded-full flex items-center justify-center mx-auto text-[#C4922A]">
              <LogIn size={26} />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-[#0A0A0A]">Sign In to View Your Orders</h3>
              <p className="text-xs text-[#7A7A7A] leading-relaxed">
                Connect your Google account to view your personal order history, live courier milestones, and invoices.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => signInWithGoogle()}
                className="w-full py-3 px-5 bg-white hover:bg-[#FAFAF8] text-[#0A0A0A] border border-[#D5D0C9] hover:border-[#0A0A0A] rounded-xs font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs"
              >
                <GoogleIcon className="w-4.5 h-4.5" />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-[#E8E4DF] flex-1" />
                <span className="text-[10px] text-[#9E9E9E] uppercase font-mono">or</span>
                <div className="h-px bg-[#E8E4DF] flex-1" />
              </div>

              <Link
                to="/order-tracking"
                className="w-full btn-outline-gold py-2.5 px-4 text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
              >
                <Search size={13} />
                <span>Track Single Order by ID</span>
              </Link>
            </div>
          </div>
        ) : myOrders.length === 0 ? (
          /* User is logged in but has 0 orders placed with this account */
          <div className="bg-white border border-[#E8E4DF] rounded-sm p-8 sm:p-12 text-center shadow-xs reveal">
            <ShoppingBag size={44} className="text-[#E8E4DF] mx-auto mb-4" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A0A0A] mb-2">No Orders Found for this Account</h3>
            <p className="text-xs text-[#7A7A7A] max-w-sm mx-auto mb-6 leading-relaxed">
              You haven't placed any orders with <strong>{user.email}</strong> yet. Explore our luxury collections and place your first booking!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="btn-gold text-xs py-2.5 px-5">
                Explore Collections
              </Link>
              <Link to="/order-tracking" className="btn-outline-gold text-xs py-2.5 px-5">
                Track by ID
              </Link>
            </div>
          </div>
        ) : (
          /* Display ONLY this user's orders */
          <div className="space-y-4 sm:space-y-6">
            {myOrders.map((order, idx) => (
              <div
                key={order.id}
                className="bg-white border border-[#E8E4DF] rounded-sm p-4 sm:p-6 md:p-8 shadow-xs hover:border-[#C4922A]/40 transition-all space-y-3.5 sm:space-y-4 reveal"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Top Header of Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8E4DF] gap-2.5 sm:gap-4">
                  {/* Left: Order ID & Date */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs sm:text-sm md:text-base font-extrabold text-[#0A0A0A] tracking-tight">
                        {order.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-[#7A7A7A]">
                      <Calendar size={12} className="text-[#C4922A] shrink-0" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status Badge & Total Amount */}
                  <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1 pt-1 sm:pt-0 border-t border-dashed border-[#E8E4DF] sm:border-0">
                    <span
                      className={`text-[8.5px] sm:text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 border rounded-xs ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <div className="text-right flex sm:block items-baseline gap-1.5">
                      <span className="text-[10px] text-[#7A7A7A] block sm:hidden uppercase font-semibold">Total:</span>
                      <span className="font-bold text-[#0A0A0A] text-xs sm:text-sm md:text-base font-mono whitespace-nowrap">
                        Rs. {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta Tags: Payment & Courier */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold text-[#555555] bg-[#FAFAF8] px-2.5 py-1 border border-[#E8E4DF] rounded-xs">
                    <CreditCard size={11} className="text-[#C4922A] shrink-0" />
                    <span>
                      {order.paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : order.paymentMethod === 'bank_transfer'
                        ? 'Direct Bank Deposit'
                        : 'Card Payment'}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold text-[#555555] bg-[#FAFAF8] px-2.5 py-1 border border-[#E8E4DF] rounded-xs">
                    <Truck size={11} className="text-[#C4922A] shrink-0" />
                    <span className="truncate">
                      To <strong className="text-[#0A0A0A]">{order.customer?.city || 'Sri Lanka'}</strong> ({order.courierPartner || 'Prompt Express'})
                    </span>
                  </span>
                </div>

                {/* Items in this Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {order.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center gap-3 bg-[#FAFAF8] p-2.5 sm:p-3 rounded-xs border border-[#E8E4DF] hover:border-[#D5D0C9] transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-16 sm:w-14 sm:h-18 object-cover bg-white rounded-xs border border-[#E8E4DF] shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="font-semibold text-xs text-[#0A0A0A] truncate leading-tight">{item.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] text-[#6B6B6B] flex-wrap">
                          <span className="bg-white px-1.5 py-0.5 rounded-2xs border border-[#E8E4DF] font-medium text-[#0A0A0A]">
                            Qty: {item.quantity}
                          </span>
                          <span className="bg-white px-1.5 py-0.5 rounded-2xs border border-[#E8E4DF]">
                            Size: <strong className="text-[#0A0A0A]">{item.selectedSize}</strong>
                          </span>
                          {item.selectedColor && (
                            <span className="bg-white px-1.5 py-0.5 rounded-2xs border border-[#E8E4DF]">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#C4922A] font-mono">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-2.5 sm:pt-3 border-t border-[#E8E4DF] grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 sm:gap-2.5 text-xs">
                  <Link
                    to={`/order-tracking?id=${order.id}`}
                    className="btn-gold py-2.5 px-3 sm:px-4 text-[10.5px] sm:text-xs font-bold flex items-center justify-center gap-1.5 text-center shadow-2xs"
                  >
                    <Search size={12} /> <span>Live Tracking</span>
                  </Link>
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="px-3 sm:px-4 py-2.5 border border-[#D5D0C9] hover:border-[#0A0A0A] bg-white hover:bg-[#FAFAF8] text-[10.5px] sm:text-xs font-bold text-[#0A0A0A] rounded-xs transition-colors text-center flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <FileText size={12} className="text-[#7A7A7A]" /> <span>View Receipt</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
