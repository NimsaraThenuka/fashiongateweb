import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  Building2,
  ShieldCheck,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { PaymentMethod } from '../types/order';

const SRI_LANKA_PROVINCES = [
  'Western Province (Colombo, Gampaha, Kalutara)',
  'Central Province (Kandy, Matale, Nuwara Eliya)',
  'Southern Province (Galle, Matara, Hambantota)',
  'North Western Province (Kurunegala, Puttalam)',
  'Western Province - Colombo Suburbs',
  'Sabaragamuwa Province (Ratnapura, Kegalle)',
  'Eastern Province (Trincomalee, Batticaloa, Ampara)',
  'North Central Province (Anuradhapura, Polonnaruwa)',
  'Northern Province (Jaffna, Kilinochchi, Mannar)',
  'Uva Province (Badulla, Monaragala)',
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState(SRI_LANKA_PROVINCES[0]);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Card Payment Interface Fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = totalPrice >= 25000 ? 0 : 2500;
  const tax = Math.round(totalPrice * 0.08);
  const grandTotal = totalPrice + shipping + tax;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  // Format Expiry (MM/YY)
  const handleCardExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) err.fullName = 'Full Name is required';
    if (!email.trim() || !email.includes('@')) err.email = 'Valid email address is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) err.phone = 'Valid phone number is required';
    if (!address.trim()) err.address = 'Delivery address is required';
    if (!city.trim()) err.city = 'City / Town is required';

    if (paymentMethod === 'card') {
      if (!cardName.trim()) err.cardName = 'Cardholder name is required';
      if (cardNumber.replace(/\s/g, '').length < 15) err.cardNumber = 'Valid 16-digit card number is required';
      if (cardExpiry.length < 5) err.cardExpiry = 'Valid MM/YY expiry is required';
      if (cardCvv.length < 3) err.cardCvv = 'Valid CVV is required';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim() || undefined,
          province,
          deliveryNotes: deliveryNotes.trim() || undefined,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.image,
          subcategory: item.subcategory,
        })),
        subtotal: totalPrice,
        shipping,
        tax,
        total: grandTotal,
        paymentMethod,
        notes: paymentMethod === 'card' ? `Paid online via Card (${cardNumber.slice(-4)})` : undefined,
      };

      const createdOrder = await placeOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (err) {
      console.error('Error placing order:', err);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-28 md:pt-36 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6 py-16">
          <ShoppingBag size={48} className="text-[#E8E4DF] mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-3">Your bag is empty</h2>
          <p className="text-xs text-[#9E9E9E] mb-6">Please add pieces to your bag before proceeding to checkout.</p>
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 md:pt-32 pb-20">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9E9E9E] tracking-[0.08em] uppercase mb-8">
          <Link to="/" className="hover:text-[#C4922A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-[#C4922A] transition-colors">Bag</Link>
          <span>/</span>
          <span className="text-[#0A0A0A] font-semibold">Checkout</span>
        </div>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E4DF]">
          <div>
            <p className="text-[10px] text-[#C4922A] tracking-[0.2em] uppercase font-mono">Secure Ordering</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0A0A0A]">Checkout &amp; Delivery</h1>
          </div>
          <Link
            to="/cart"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#C4922A] transition-colors"
          >
            <ArrowLeft size={14} /> Return to Bag
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 md:gap-12 items-start">
            {/* Left Column: Customer & Delivery Details + Payment */}
            <div className="space-y-8">
              {/* 1. CONTACT & DELIVERY INFORMATION */}
              <div className="bg-white p-6 md:p-8 rounded-sm border border-[#E8E4DF] shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8E4DF]">
                  <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-xs font-bold font-mono">
                    1
                  </span>
                  <h2 className="font-display text-lg font-bold text-[#0A0A0A] uppercase tracking-wider">
                    Customer &amp; Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className={`w-full bg-[#FAFAF8] border ${errors.fullName ? 'border-red-500' : 'border-[#E8E4DF]'} px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Email Address * (For Receipt &amp; Tracking)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. kasun.perera@gmail.com"
                      className={`w-full bg-[#FAFAF8] border ${errors.email ? 'border-red-500' : 'border-[#E8E4DF]'} px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Phone Number * (For Courier SMS &amp; Delivery)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +94 77 123 4567"
                      className={`w-full bg-[#FAFAF8] border ${errors.phone ? 'border-red-500' : 'border-[#E8E4DF]'} px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. No. 45/A, Thalawathugoda Road"
                      className={`w-full bg-[#FAFAF8] border ${errors.address ? 'border-red-500' : 'border-[#E8E4DF]'} px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Kotte, Nugegoda, Colombo"
                      className={`w-full bg-[#FAFAF8] border ${errors.city ? 'border-red-500' : 'border-[#E8E4DF]'} px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="e.g. 10100"
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs"
                    />
                  </div>

                  {/* Province / Region */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Province / Region
                    </label>
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-4 py-3 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs cursor-pointer"
                    >
                      {SRI_LANKA_PROVINCES.map(p => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1.5">
                      Special Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={e => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Leave with security, call upon reaching gate..."
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-4 py-2.5 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PAYMENT METHOD SELECTION */}
              <div className="bg-white p-6 md:p-8 rounded-sm border border-[#E8E4DF] shadow-xs space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8E4DF]">
                  <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-xs font-bold font-mono">
                    2
                  </span>
                  <h2 className="font-display text-lg font-bold text-[#0A0A0A] uppercase tracking-wider">
                    Select Payment Method
                  </h2>
                </div>

                {/* Option 1: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`border rounded-sm p-4.5 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#C4922A] bg-[#C4922A]/5 ring-1 ring-[#C4922A]'
                      : 'border-[#E8E4DF] hover:border-[#C4922A]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'border-[#C4922A] bg-[#C4922A]' : 'border-[#9E9E9E]'
                        }`}
                      >
                        {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                          <Truck size={15} className="text-[#C4922A]" /> Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                          Pay securely with cash or card upon courier delivery at your doorstep across Sri Lanka.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
                      Popular
                    </span>
                  </div>
                </div>

                {/* Option 2: Online Card Payment Interface */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`border rounded-sm p-4.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#C4922A] bg-[#C4922A]/5 ring-1 ring-[#C4922A]'
                      : 'border-[#E8E4DF] hover:border-[#C4922A]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-[#C4922A] bg-[#C4922A]' : 'border-[#9E9E9E]'
                        }`}
                      >
                        {paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                          <CreditCard size={15} className="text-[#C4922A]" /> Credit / Debit Card (Online Payment)
                        </p>
                        <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                          Secure instant payment via Visa, MasterCard, AMEX with 256-bit SSL encryption.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <span className="text-[9px] font-bold border border-[#0A0A0A]/20 px-1 py-0.5 rounded-xs">VISA</span>
                      <span className="text-[9px] font-bold border border-[#0A0A0A]/20 px-1 py-0.5 rounded-xs">MC</span>
                      <span className="text-[9px] font-bold border border-[#0A0A0A]/20 px-1 py-0.5 rounded-xs">AMEX</span>
                    </div>
                  </div>

                  {/* Card Entry Form fields (Visible when card selected) */}
                  {paymentMethod === 'card' && (
                    <div className="mt-5 pt-4 border-t border-[#C4922A]/20 space-y-4" onClick={e => e.stopPropagation()}>
                      <div>
                        <label className="block text-[10px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="Name as printed on card"
                          className={`w-full bg-white border ${errors.cardName ? 'border-red-500' : 'border-[#E8E4DF]'} px-3 py-2.5 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs`}
                        />
                        {errors.cardName && <p className="text-red-500 text-[10px] mt-1">{errors.cardName}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => handleCardNumberChange(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className={`w-full bg-white border ${errors.cardNumber ? 'border-red-500' : 'border-[#E8E4DF]'} px-3 py-2.5 text-xs text-[#0A0A0A] font-mono tracking-wider outline-none focus:border-[#C4922A] rounded-xs`}
                          />
                          <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                        </div>
                        {errors.cardNumber && <p className="text-red-500 text-[10px] mt-1">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1">
                            Expiry Date (MM/YY) *
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => handleCardExpiryChange(e.target.value)}
                            placeholder="12/28"
                            className={`w-full bg-white border ${errors.cardExpiry ? 'border-red-500' : 'border-[#E8E4DF]'} px-3 py-2.5 text-xs text-[#0A0A0A] font-mono outline-none focus:border-[#C4922A] rounded-xs`}
                          />
                          {errors.cardExpiry && <p className="text-red-500 text-[10px] mt-1">{errors.cardExpiry}</p>}
                        </div>

                        <div>
                          <label className="block text-[10px] tracking-[0.1em] uppercase text-[#0A0A0A] font-semibold mb-1">
                            CVV / CVC *
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className={`w-full bg-white border ${errors.cardCvv ? 'border-red-500' : 'border-[#E8E4DF]'} px-3 py-2.5 text-xs text-[#0A0A0A] font-mono outline-none focus:border-[#C4922A] rounded-xs`}
                          />
                          {errors.cardCvv && <p className="text-red-500 text-[10px] mt-1">{errors.cardCvv}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 p-2.5 rounded-xs">
                        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                        <span>Ready for Payment Gateway Integration. 256-bit encrypted checkout.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 3: Direct Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`border rounded-sm p-4.5 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#C4922A] bg-[#C4922A]/5 ring-1 ring-[#C4922A]'
                      : 'border-[#E8E4DF] hover:border-[#C4922A]/50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'bank_transfer' ? 'border-[#C4922A] bg-[#C4922A]' : 'border-[#9E9E9E]'
                      }`}
                    >
                      {paymentMethod === 'bank_transfer' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                        <Building2 size={15} className="text-[#C4922A]" /> Direct Bank Deposit / Transfer
                      </p>
                      <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                        Transfer to our Commercial Bank / Sampath Bank business account.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-4 border-t border-[#C4922A]/20 bg-white p-3.5 rounded-xs text-xs space-y-1.5 text-[#4A4A4A]">
                      <p className="font-semibold text-[#0A0A0A]">Bank Account Details:</p>
                      <p><strong>Bank:</strong> Commercial Bank of Ceylon PLC</p>
                      <p><strong>Account Name:</strong> Fashion Gate Boutique (Pvt) Ltd</p>
                      <p><strong>Account No:</strong> <span className="font-mono text-[#C4922A] font-bold">1000 8492 7710</span></p>
                      <p><strong>Branch:</strong> Kotte Branch</p>
                      <p className="text-[10px] text-[#7A7A7A] pt-1">
                        * Please use your Order ID as the reference when transferring funds.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="bg-white p-6 md:p-8 rounded-sm border border-[#E8E4DF] shadow-xs space-y-6 md:sticky md:top-32">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DF]">
                <h3 className="font-display text-base font-bold text-[#0A0A0A] uppercase tracking-wider">
                  Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
                </h3>
                <Link to="/cart" className="text-[11px] text-[#C4922A] underline">
                  Edit Bag
                </Link>
              </div>

              {/* Items Mini List */}
              <div className="max-h-[260px] overflow-y-auto divide-y divide-[#E8E4DF] pr-1">
                {items.map(item => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="py-3 flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover bg-[#F2F0ED] rounded-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0A0A0A] truncate leading-tight">{item.name}</p>
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

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-[#E8E4DF] text-xs">
                <div className="flex justify-between text-[#7A7A7A]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#0A0A0A]">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A7A7A]">
                  <span>Islandwide Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-[#0A0A0A]'}>
                    {shipping === 0 ? 'Free Shipping' : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#7A7A7A]">
                  <span>Govt. Tax (8%)</span>
                  <span className="font-semibold text-[#0A0A0A]">Rs. {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E4DF]">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">Total Payable</span>
                  <span className="font-display text-xl font-bold text-[#0A0A0A]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>Processing Your Order...</>
                ) : (
                  <>
                    <Sparkles size={14} /> Place Order (Rs. {grandTotal.toLocaleString()})
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9E9E9E] tracking-wider text-center">
                <Lock size={12} />
                <span>SSL Encrypted &amp; Guaranteed Authentic Boutique Pieces</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
