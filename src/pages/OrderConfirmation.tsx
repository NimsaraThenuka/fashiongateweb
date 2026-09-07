import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  Search,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
  Building2,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { getLocalStoredOrders } from '../services/orderService';
import type { Order } from '../types/order';

const LOGO_URL = 'https://res.cloudinary.com/dyp247eoh/image/upload/v1784785679/Fashion_Gate_JPG_02.jpg-removebg-preview_epbtzx.png';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById, orders } = useOrders();

  const cleanId = (orderId || '').trim().toUpperCase();

  // 1. Resolve order synchronously from Router State, Context memory, or LocalStorage
  const stateOrder = (location.state as { order?: Order } | null)?.order;

  let order: Order | undefined = undefined;

  if (stateOrder && (!cleanId || stateOrder.id?.toUpperCase() === cleanId)) {
    order = stateOrder;
  }

  if (!order && cleanId) {
    // Check context getOrderById
    order = getOrderById(cleanId);
  }

  if (!order && cleanId) {
    // Check active orders array directly
    order = orders.find(
      o => o?.id?.toUpperCase() === cleanId ||
           (o?.trackingNumber && o.trackingNumber.toUpperCase() === cleanId)
    );
  }

  if (!order && cleanId) {
    // Direct localStorage fallback
    const stored = getLocalStoredOrders();
    if (Array.isArray(stored)) {
      order = stored.find(
        o => o?.id?.toUpperCase() === cleanId ||
             (o?.trackingNumber && o.trackingNumber.toUpperCase() === cleanId)
      );
    }
  }

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If order is not found
  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-28 md:pt-36 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Package size={48} className="text-[#E8E4DF] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A] mb-2">Order Not Found</h2>
          <p className="text-xs text-[#9E9E9E] mb-6">
            We couldn't locate order #{orderId}. Please check your order reference key or contact our boutique hotline.
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

  const itemsList = Array.isArray(order.items) ? order.items : [];
  const totalItemsCount = itemsList.reduce((s, i) => s + (Number(i?.quantity) || 1), 0);

  // Format creation date safely
  let formattedDate = 'Recent';
  if (order.createdAt) {
    try {
      formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      formattedDate = 'Recent';
    }
  }

  const customerName = order.customer?.fullName || 'Valued Patron';
  const customerAddress = [order.customer?.address, order.customer?.city].filter(Boolean).join(', ');
  const customerProvince = order.customer?.province || '';
  const customerPhone = order.customer?.phone || '';
  const subtotal = Number(order.subtotal) || 0;
  const shipping = order.shipping !== undefined ? Number(order.shipping) : 350;
  const total = Number(order.total) || subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 md:pt-28 pb-20 print:p-0 print:m-0 print:bg-white">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 print:p-0 print:m-0 print:max-w-full">
        {/* Top Navigation Row: Back Button + Breadcrumbs (Screen Only) */}
        <div className="no-print flex items-center justify-between gap-3 mb-4 sm:mb-6">
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
            <Link to="/account?tab=orders" className="hover:text-[#C4922A] transition-colors shrink-0">Orders</Link>
            <span className="text-[#C5C0B8]">/</span>
            <span className="text-[#0A0A0A] font-semibold truncate max-w-[140px] sm:max-w-[200px]">{order.id}</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 1. SCREEN-ONLY CELEBRATION HEADER CARD                           */}
        {/* ================================================================= */}
        <div className="no-print bg-white border border-[#E8E4DF] p-5 sm:p-8 md:p-12 text-center rounded-sm shadow-xs mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3.5 sm:mb-4 text-emerald-600 shadow-sm animate-scale-in">
            <CheckCircle2 size={32} className="sm:w-9 sm:h-9 stroke-[2.5]" />
          </div>

          <p className="text-[10px] sm:text-[11px] text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold mb-1">
            Order Confirmed &amp; Received
          </p>
          <h1 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-[#0A0A0A] mb-2 sm:mb-3">
            Thank You, {customerName}!
          </h1>
          <p className="text-[11px] sm:text-xs text-[#7A7A7A] max-w-md mx-auto leading-relaxed">
            Your exclusive pieces have been reserved and our team is preparing them for dispatch. A confirmation has been logged with reference number:
          </p>

          {/* Unique Order Tracking Key Box */}
          <div className="mt-5 sm:mt-6 inline-flex flex-col items-center bg-[#FAFAF8] border-2 border-[#C4922A]/40 px-5 sm:px-6 py-3 sm:py-3.5 rounded-sm max-w-full shadow-xs">
            <span className="text-[8.5px] sm:text-[9px] text-[#7A7A7A] tracking-[0.15em] uppercase font-mono">Unique Tracking Key</span>
            <span className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold text-[#0A0A0A] tracking-wider mt-0.5 break-all">
              {order.id}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8">
            <Link
              to={`/order-tracking?id=${order.id}`}
              className="btn-gold py-3 px-6 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 text-center shadow-xs"
            >
              <Search size={14} /> Track Order Status
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-outline-gold py-3 px-6 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Printer size={14} /> Print Receipt
            </button>
            <Link
              to="/account?tab=orders"
              className="px-5 py-3 border border-[#E8E4DF] text-xs font-semibold text-[#0A0A0A] hover:border-[#C4922A] rounded-xs transition-colors text-center"
            >
              My Orders &amp; Portal
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. OFFICIAL ORDER DETAILS & PRINTABLE INVOICE CARD               */}
        {/* ================================================================= */}
        <div className="bg-white border border-[#E8E4DF] p-5 sm:p-7 md:p-8 rounded-sm shadow-xs space-y-5 sm:space-y-6 print:border-none print:shadow-none print:p-2 print:space-y-4">
          {/* Official Boutique Header with Real Logo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 pb-4 sm:pb-5 border-b border-[#E8E4DF]">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <img
                src={LOGO_URL}
                alt="Fashion Gate"
                className="h-11 sm:h-13 w-auto object-contain shrink-0"
              />
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0A0A0A] tracking-wider uppercase">
                  FASHION GATE
                </h2>
                <p className="text-[10px] text-[#7A7A7A] tracking-wider uppercase font-medium">
                  Official Boutique Order Invoice
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right text-[10.5px] text-[#7A7A7A] space-y-0.5">
              <p className="font-mono text-[#0A0A0A] font-semibold">Hotline: +94 70 773 9962</p>
              <p>Colombo 07, Sri Lanka • www.fashiongate.lk</p>
              <p className="font-mono text-[10px]">
                Date: {formattedDate}
              </p>
            </div>
          </div>

          {/* Order Reference & Delivery Date Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4DF] gap-2">
            <div>
              <p className="text-[10px] text-[#9E9E9E] uppercase tracking-wider font-semibold">ORDER REFERENCE</p>
              <h3 className="font-mono text-base sm:text-lg font-bold text-[#0A0A0A]">{order.id}</h3>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] text-[#9E9E9E] uppercase tracking-wider font-semibold">ESTIMATED DELIVERY</p>
              <p className="text-xs font-bold text-[#C4922A] flex items-center gap-1 sm:justify-end">
                <Clock size={13} /> {order.estimatedDelivery || 'Within 2 - 3 Business Days'}
              </p>
            </div>
          </div>

          {/* Delivery & Payment Details Card Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAFAF8] rounded-xs border border-[#E8E4DF] text-xs print:bg-white print:border-black/20">
            <div className="space-y-1">
              <p className="text-[10px] text-[#C4922A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-[#C4922A]" /> DELIVERY DESTINATION
              </p>
              <p className="font-bold text-[#0A0A0A] text-sm">{customerName}</p>
              {customerAddress && <p className="text-[#4A4A4A] leading-relaxed">{customerAddress}</p>}
              {customerProvince && <p className="text-[#4A4A4A]">{customerProvince}</p>}
              {customerPhone && <p className="text-[#4A4A4A] font-mono">{customerPhone}</p>}
            </div>

            <div className="space-y-1 sm:border-l sm:border-[#E8E4DF] sm:pl-4 print:border-l print:border-black/20">
              <p className="text-[10px] text-[#C4922A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                {order.paymentMethod === 'card' ? (
                  <CreditCard size={13} className="text-[#C4922A]" />
                ) : order.paymentMethod === 'bank_transfer' ? (
                  <Building2 size={13} className="text-[#C4922A]" />
                ) : (
                  <Truck size={13} className="text-[#C4922A]" />
                )}
                PAYMENT DETAILS
              </p>
              <p className="font-bold text-[#0A0A0A] uppercase">
                {order.paymentMethod === 'cod'
                  ? 'CASH ON DELIVERY (COD)'
                  : order.paymentMethod === 'card'
                    ? 'ONLINE CARD PAYMENT'
                    : 'DIRECT BANK TRANSFER'}
              </p>
              {order.paymentMethod === 'bank_transfer' && order.bankReceipt && (
                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={11} /> Transfer Slip Attached &amp; Under Verification
                </p>
              )}
              <p className="text-[11px] text-[#7A7A7A]">
                Courier: <span className="text-[#0A0A0A] font-medium">{order.courierPartner || 'Prompt Express (Islandwide Delivery)'}</span>
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-3">
              ITEMS ORDERED ({totalItemsCount})
            </h4>
            <div className="divide-y divide-[#E8E4DF]">
              {itemsList.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover bg-[#F2F0ED] rounded-xs shrink-0 border border-[#E8E4DF]"
                    />
                    <div>
                      <h5 className="font-semibold text-xs sm:text-sm text-[#0A0A0A]">{item.name}</h5>
                      <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                        Qty: {item.quantity} · Size: <span className="font-bold text-[#0A0A0A]">{item.selectedSize}</span>
                        {item.selectedColor && <> · <span className="text-[#0A0A0A]">{item.selectedColor}</span></>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-[#0A0A0A]">
                      Rs. {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#9E9E9E]">Rs. {(Number(item.price) || 0).toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown Calculation */}
          <div className="pt-4 border-t border-[#E8E4DF] space-y-2 text-xs">
            <div className="flex justify-between text-[#7A7A7A]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#0A0A0A]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#7A7A7A]">
              <span>Delivery / Shipping</span>
              <span className="font-semibold text-[#0A0A0A]">
                {shipping === 0 ? 'Rs. 350' : `Rs. ${shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2.5 border-t border-[#E8E4DF]">
              <span className="font-bold uppercase tracking-wider text-[#0A0A0A] text-xs sm:text-sm">TOTAL AMOUNT</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-[#C4922A]">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Screen-Only Navigation Links */}
          <div className="no-print pt-4 sm:pt-5 border-t border-[#E8E4DF] flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-xs">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-1.5 text-[#C4922A] font-bold uppercase tracking-wider hover:underline w-full sm:w-auto text-center py-1 sm:py-0"
            >
              <span>Continue Shopping</span> <ArrowRight size={13} />
            </Link>
            <p className="text-[11px] sm:text-xs text-[#7A7A7A] flex items-center justify-center gap-1.5 flex-wrap text-center sm:text-right">
              <span>Need assistance? Contact</span>
              <a
                href="tel:+94707739962"
                className="text-[#0A0A0A] font-bold hover:text-[#C4922A] transition-colors underline decoration-dotted"
              >
                +94 70 773 9962
              </a>
            </p>
          </div>

          {/* Print-Only Official Footer Note */}
          <div className="hidden print:block pt-3 border-t border-black/20 text-center text-[9px] text-[#555] space-y-0.5">
            <p className="font-semibold text-black">
              Thank you for shopping with Fashion Gate. Quote Order Key #{order.id} for any courier or exchange inquiries.
            </p>
            <p>
              Colombo 07, Sri Lanka • Hotline: +94 70 773 9962 • www.fashiongate.lk
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
