import { Link } from 'react-router-dom';
import {
  Calendar,
  Truck,
  Search,
  ShoppingBag,
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
        <div className="mb-10 reveal">
          <div className="flex items-center gap-2 text-xs text-[#9E9E9E] tracking-[0.08em] uppercase mb-2">
            <Link to="/" className="hover:text-[#C4922A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0A0A0A] font-semibold">My Orders</span>
          </div>
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold mb-1">
            Customer Portal
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0A0A0A]">
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
          <div className="bg-white border border-[#E8E4DF] rounded-sm p-12 text-center shadow-xs reveal">
            <ShoppingBag size={48} className="text-[#E8E4DF] mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-[#0A0A0A] mb-2">No Orders Placed Yet</h3>
            <p className="text-xs text-[#7A7A7A] max-w-sm mx-auto mb-6">
              You haven't placed any orders on this device yet. Explore our bespoke collections and discover timeless pieces.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/shop" className="btn-gold text-xs">
                Explore Collections
              </Link>
              <Link to="/order-tracking" className="btn-outline-gold text-xs">
                Track by ID
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order, idx) => (
              <div
                key={order.id}
                className="bg-white border border-[#E8E4DF] rounded-sm p-6 md:p-8 shadow-xs hover:border-[#C4922A]/50 transition-all reveal"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Top Header of Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4DF] gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-[#0A0A0A]">{order.id}</span>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 border rounded-xs ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#7A7A7A]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span className="font-bold text-[#0A0A0A]">Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-3 bg-[#FAFAF8] p-3 rounded-xs border border-[#E8E4DF]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-16 object-cover bg-white rounded-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs text-[#0A0A0A] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#7A7A7A] mt-0.5">
                          Qty: {item.quantity} · Size: <span className="text-[#0A0A0A]">{item.selectedSize}</span>
                          {item.selectedColor && <> · {item.selectedColor}</>}
                        </p>
                        <p className="text-xs font-bold text-[#C4922A] mt-1">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer Actions */}
                <div className="pt-4 border-t border-[#E8E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-[#7A7A7A] flex items-center gap-1.5 text-[11px]">
                    <Truck size={13} className="text-[#C4922A]" /> Delivered to{' '}
                    <strong className="text-[#0A0A0A]">{order.customer.city}</strong> via {order.courierPartner}
                  </p>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/order-tracking?id=${order.id}`}
                      className="btn-gold py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Search size={13} /> Live Tracking
                    </Link>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="px-4 py-2 border border-[#E8E4DF] hover:border-[#C4922A] text-xs font-semibold text-[#0A0A0A] rounded-xs transition-colors"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
