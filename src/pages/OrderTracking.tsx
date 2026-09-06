import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useReveal } from '../hooks/useReveal';
import type { Order } from '../types/order';

export default function OrderTracking() {
  useReveal();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const { trackOrder, getOrderById } = useOrders();

  const [orderId, setOrderId] = useState(queryId);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryId) {
      setOrderId(queryId);
      const found = getOrderById(queryId);
      if (found) {
        setSearchedOrder(found);
        setHasSearched(true);
      }
    }
  }, [queryId, getOrderById]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const found = trackOrder(orderId, emailOrPhone);
      setSearchedOrder(found || null);
      setHasSearched(true);
      setLoading(false);
    }, 400);
  };

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
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 reveal">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold mb-2">
            Real-Time Courier Tracking
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-[#0A0A0A]">
            Track Your Order
          </h1>
          <p className="text-xs md:text-sm text-[#7A7A7A] mt-3 max-w-md mx-auto leading-relaxed">
            Enter your unique Order Key (e.g. <span className="font-mono font-semibold text-[#0A0A0A]">FG-2026-1042</span>) and optional phone/email to see live shipping status.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white border border-[#E8E4DF] p-6 md:p-8 rounded-sm shadow-xs mb-10 reveal">
          <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-1.5">
                Order Reference Key *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. FG-2026-8942"
                className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-4 py-3 text-xs text-[#0A0A0A] font-mono outline-none focus:border-[#C4922A] rounded-xs uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-1.5">
                Email or Phone (Optional)
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder="your@email.com or +94 77..."
                className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md"
            >
              {loading ? (
                <>Searching...</>
              ) : (
                <>
                  <Search size={14} /> Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {hasSearched && (
          <div className="reveal animate-scale-in">
            {searchedOrder ? (
              <div className="bg-white border border-[#E8E4DF] rounded-sm p-6 md:p-10 shadow-xs space-y-8">
                {/* Header Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E4DF] gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xl font-extrabold text-[#0A0A0A]">{searchedOrder.id}</span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 border rounded-xs ${getStatusBadge(
                          searchedOrder.status
                        )}`}
                      >
                        {searchedOrder.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A7A7A] flex items-center gap-1.5">
                      <Calendar size={13} /> Placed on{' '}
                      {new Date(searchedOrder.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="text-left sm:text-right bg-[#FAFAF8] sm:bg-transparent p-3 sm:p-0 rounded-xs border sm:border-0 border-[#E8E4DF]">
                    <p className="text-[10px] text-[#7A7A7A] uppercase font-semibold">Estimated Delivery</p>
                    <p className="text-sm font-bold text-[#C4922A] flex items-center gap-1.5 sm:justify-end">
                      <Clock size={14} /> {searchedOrder.estimatedDelivery || 'Within 2-3 Business Days'}
                    </p>
                    <p className="text-[10px] text-[#9E9E9E] mt-0.5">{searchedOrder.courierPartner}</p>
                  </div>
                </div>

                {/* Visual Step Timeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-6">
                    Courier Tracking Timeline
                  </h3>
                  <div className="relative pl-6 border-l-2 border-[#E8E4DF] ml-3 space-y-8">
                    {searchedOrder.trackingTimeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Status Marker Dot */}
                        <span
                          className={`absolute -left-[33px] top-0.5 w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                            step.done
                              ? 'bg-[#C4922A] shadow-[0_0_8px_rgba(196,146,42,0.6)]'
                              : 'bg-[#E8E4DF]'
                          }`}
                        >
                          {step.done && <CheckCircle2 size={10} className="text-white fill-white" />}
                        </span>

                        <div>
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4
                              className={`text-xs font-bold uppercase tracking-wider ${
                                step.done ? 'text-[#0A0A0A]' : 'text-[#9E9E9E]'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <span className="text-[10px] font-mono text-[#7A7A7A]">{step.time}</span>
                          </div>
                          <p className="text-xs text-[#4A4A4A] mt-0.5 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Information Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAFAF8] border border-[#E8E4DF] rounded-xs text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A7A7A] flex items-center gap-1.5 mb-1">
                      <MapPin size={12} className="text-[#C4922A]" /> Destination
                    </p>
                    <p className="font-semibold text-[#0A0A0A]">{searchedOrder.customer.fullName}</p>
                    <p className="text-[#4A4A4A]">{searchedOrder.customer.address}, {searchedOrder.customer.city}</p>
                    <p className="text-[#4A4A4A]">{searchedOrder.customer.province}</p>
                  </div>

                  <div className="sm:border-l sm:border-[#E8E4DF] sm:pl-4">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A7A7A] flex items-center gap-1.5 mb-1">
                      <Truck size={12} className="text-[#C4922A]" /> Payment &amp; Total
                    </p>
                    <p className="text-[#4A4A4A] uppercase">
                      Payment: <strong className="text-[#0A0A0A]">{searchedOrder.paymentMethod}</strong> ({searchedOrder.paymentStatus})
                    </p>
                    <p className="font-bold text-sm text-[#C4922A] mt-1">
                      Total: Rs. {searchedOrder.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items in this Order */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-3">
                    Items in Package ({searchedOrder.items.reduce((s, i) => s + i.quantity, 0)})
                  </h4>
                  <div className="divide-y divide-[#E8E4DF]">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-16 object-cover bg-[#F2F0ED] rounded-xs shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-xs text-[#0A0A0A]">{item.name}</p>
                            <p className="text-[10px] text-[#7A7A7A]">
                              Qty: {item.quantity} · Size: <span className="font-medium text-[#0A0A0A]">{item.selectedSize}</span>
                              {item.selectedColor && <> · {item.selectedColor}</>}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-[#0A0A0A]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <Link to="/my-orders" className="text-[#C4922A] font-semibold hover:underline">
                    View All My Orders
                  </Link>
                  <Link to="/contact" className="text-[#7A7A7A] hover:underline">
                    Need Help With This Order?
                  </Link>
                </div>
              </div>
            ) : (
              /* Not found banner */
              <div className="bg-white border border-red-200 p-8 rounded-sm text-center shadow-xs">
                <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
                <h3 className="font-display text-xl font-bold text-[#0A0A0A] mb-2">Order Not Found</h3>
                <p className="text-xs text-[#7A7A7A] max-w-sm mx-auto mb-6 leading-relaxed">
                  No order was found matching <span className="font-mono font-bold text-[#0A0A0A]">"{orderId}"</span>. Please double check the order key from your confirmation receipt.
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/my-orders" className="btn-gold text-xs">
                    Check My Orders
                  </Link>
                  <Link to="/contact" className="btn-outline-gold text-xs">
                    Contact Support
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
