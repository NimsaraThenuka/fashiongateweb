import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  Search,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
  Building2,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = orderId ? getOrderById(orderId) : undefined;

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Package size={48} className="text-[#E8E4DF] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A] mb-2">Order Not Found</h2>
          <p className="text-xs text-[#9E9E9E] mb-6">
            We couldn't locate order #{orderId}. Please check your order reference key or contact our boutique.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/order-tracking" className="btn-gold text-xs">
              Track an Order
            </Link>
            <Link to="/shop" className="btn-outline-gold text-xs">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 md:pt-32 pb-20">
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        {/* Celebration Header Card */}
        <div className="bg-white border border-[#E8E4DF] p-8 md:p-12 text-center rounded-sm shadow-xs mb-8">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm animate-scale-in">
            <CheckCircle2 size={36} className="stroke-[2.5]" />
          </div>

          <p className="text-[11px] text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold mb-1">
            Order Confirmed &amp; Received
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-3">
            Thank You, {order.customer.fullName}!
          </h1>
          <p className="text-xs text-[#7A7A7A] max-w-md mx-auto leading-relaxed">
            Your exclusive pieces have been reserved and our team is preparing them for delivery. A confirmation has been logged with reference number:
          </p>

          {/* Unique Order Tracking Key Box */}
          <div className="mt-6 inline-flex flex-col items-center bg-[#FAFAF8] border-2 border-[#C4922A]/40 px-6 py-3.5 rounded-sm">
            <span className="text-[9px] text-[#7A7A7A] tracking-[0.15em] uppercase font-mono">Unique Tracking Key</span>
            <span className="text-2xl md:text-3xl font-mono font-extrabold text-[#0A0A0A] tracking-wider mt-0.5">
              {order.id}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to={`/order-tracking?id=${order.id}`}
              className="btn-gold py-3 px-6 text-xs font-bold tracking-wider uppercase flex items-center gap-2"
            >
              <Search size={14} /> Track Order Status
            </Link>
            <button
              onClick={handlePrint}
              className="btn-outline-gold py-3 px-6 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Printer size={14} /> Print Receipt
            </button>
            <Link
              to="/my-orders"
              className="px-5 py-3 border border-[#E8E4DF] text-xs font-semibold text-[#0A0A0A] hover:border-[#C4922A] rounded-xs transition-colors"
            >
              My Orders
            </Link>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white border border-[#E8E4DF] p-6 md:p-8 rounded-sm shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4DF] gap-2">
            <div>
              <p className="text-[10px] text-[#9E9E9E] uppercase tracking-wider">Order Reference</p>
              <h3 className="font-mono text-base font-bold text-[#0A0A0A]">{order.id}</h3>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] text-[#9E9E9E] uppercase tracking-wider">Estimated Delivery</p>
              <p className="text-xs font-bold text-[#C4922A] flex items-center gap-1 sm:justify-end">
                <Clock size={13} /> {order.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Delivery & Payment Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAFAF8] rounded-xs border border-[#E8E4DF] text-xs">
            <div className="space-y-1">
              <p className="text-[10px] text-[#7A7A7A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <MapPin size={12} className="text-[#C4922A]" /> Delivery Destination
              </p>
              <p className="font-semibold text-[#0A0A0A]">{order.customer.fullName}</p>
              <p className="text-[#4A4A4A]">{order.customer.address}, {order.customer.city}</p>
              <p className="text-[#4A4A4A]">{order.customer.province}</p>
              <p className="text-[#4A4A4A] font-mono">{order.customer.phone}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-[#E8E4DF] sm:pl-4">
              <p className="text-[10px] text-[#7A7A7A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                {order.paymentMethod === 'card' ? (
                  <CreditCard size={12} className="text-[#C4922A]" />
                ) : order.paymentMethod === 'bank_transfer' ? (
                  <Building2 size={12} className="text-[#C4922A]" />
                ) : (
                  <Truck size={12} className="text-[#C4922A]" />
                )}
                Payment Details
              </p>
              <p className="font-semibold text-[#0A0A0A] uppercase">
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery (COD)'
                  : order.paymentMethod === 'card'
                  ? 'Online Card Payment'
                  : 'Direct Bank Transfer'}
              </p>
              <p className="text-[11px] text-[#7A7A7A]">
                Status:{' '}
                <span
                  className={`font-bold uppercase ${
                    order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p className="text-[11px] text-[#7A7A7A]">
                Courier: <span className="text-[#0A0A0A] font-medium">{order.courierPartner}</span>
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-3">
              Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h4>
            <div className="divide-y divide-[#E8E4DF]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover bg-[#F2F0ED] rounded-xs shrink-0"
                    />
                    <div>
                      <h5 className="font-semibold text-xs text-[#0A0A0A]">{item.name}</h5>
                      <p className="text-[10px] text-[#7A7A7A] mt-0.5">
                        Qty: {item.quantity} · Size: <span className="font-medium text-[#0A0A0A]">{item.selectedSize}</span>
                        {item.selectedColor && <> · {item.selectedColor}</>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#0A0A0A]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#9E9E9E]">Rs. {item.price.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Calculation */}
          <div className="pt-4 border-t border-[#E8E4DF] space-y-2 text-xs">
            <div className="flex justify-between text-[#7A7A7A]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#0A0A0A]">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#7A7A7A]">
              <span>Delivery / Shipping</span>
              <span className="font-semibold text-[#0A0A0A]">
                {order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-[#7A7A7A]">
              <span>Tax</span>
              <span className="font-semibold text-[#0A0A0A]">Rs. {order.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E4DF]">
              <span className="font-bold uppercase tracking-wider text-[#0A0A0A]">Total Amount</span>
              <span className="font-display text-xl font-bold text-[#C4922A]">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center text-xs">
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-[#C4922A] font-semibold hover:underline">
              Continue Shopping <ArrowRight size={13} />
            </Link>
            <span className="text-[10px] text-[#9E9E9E]">Need assistance? Contact +94 70 773 9962</span>
          </div>
        </div>
      </div>
    </div>
  );
}
