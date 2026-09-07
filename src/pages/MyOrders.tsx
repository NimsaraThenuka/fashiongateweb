import { Link } from 'react-router-dom';
import {
  Calendar,
  Truck,
  Search,
  ShoppingBag,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useReveal } from '../hooks/useReveal';

export default function MyOrders() {
  useReveal();
  const { getMyOrders } = useOrders();
  const myOrders = getMyOrders();

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
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A0A0A]">
              My Orders ({myOrders.length})
            </h1>
            <Link
              to="/order-tracking"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A0A0A] hover:text-[#C4922A] transition-colors"
            >
              <Search size={14} /> Track Any Order by Reference
            </Link>
          </div>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white border border-[#E8E4DF] rounded-sm p-8 sm:p-12 text-center shadow-xs reveal">
            <ShoppingBag size={44} className="text-[#E8E4DF] mx-auto mb-4" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0A0A0A] mb-2">No Orders Placed Yet</h3>
            <p className="text-xs text-[#7A7A7A] max-w-sm mx-auto mb-6 leading-relaxed">
              You haven't placed any orders on this device yet. Explore our bespoke collections and discover timeless pieces.
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
