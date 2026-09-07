import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  Building2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  Upload,
  FileText,
  Check,
  X,
  User,
  ExternalLink,
  RefreshCw,
  MapPin,
  Mail,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useProducts } from '../context/ProductContext';
import { PaymentMethod } from '../types/order';

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

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
  const { reduceStock } = useProducts();
  const { user, isLoggedIn, signInWithGoogle, signInWithDemo, updateSavedAddress } = useCustomerAuth();
  const navigate = useNavigate();
  const isNavigatingAway = useRef(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [province, setProvince] = useState(SRI_LANKA_PROVINCES[0]);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Method State: Unselected by default so the user MUST pick one
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [bankReceipt, setBankReceipt] = useState<string | null>(null);
  const [bankReceiptName, setBankReceiptName] = useState<string>('');
  const [receiptUploading, setReceiptUploading] = useState<boolean>(false);

  // WhatsApp Booking Mode for guest users without Google account
  const [isWhatsAppMode, setIsWhatsAppMode] = useState(false);

  // Order Confirmation Dialog State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Google Sign-In state inside checkout
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = 350;
  const tax = 0;
  const grandTotal = totalPrice + shipping;

  // Auto-populate form from logged-in customer profile
  useEffect(() => {
    if (user) {
      if (user.displayName) setFullName(user.displayName);
      if (user.email) setEmail(user.email);
      if (user.phoneNumber) setPhone(user.phoneNumber);
      if (user.defaultAddress) {
        if (user.defaultAddress.fullName) setFullName(user.defaultAddress.fullName);
        if (user.defaultAddress.phone) setPhone(user.defaultAddress.phone);
        if (user.defaultAddress.address) setAddress(user.defaultAddress.address);
        if (user.defaultAddress.city) setCity(user.defaultAddress.city);
        if (user.defaultAddress.postalCode) setPostalCode(user.defaultAddress.postalCode);
        if (user.defaultAddress.province) setProvince(user.defaultAddress.province);
      }
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setGoogleAuthError(null);
    setGoogleSigningIn(true);
    try {
      const loggedUser = await signInWithGoogle();
      if (loggedUser.displayName) setFullName(loggedUser.displayName);
      if (loggedUser.email) setEmail(loggedUser.email);
      if (loggedUser.phoneNumber) setPhone(loggedUser.phoneNumber);
      if (loggedUser.defaultAddress) {
        if (loggedUser.defaultAddress.fullName) setFullName(loggedUser.defaultAddress.fullName);
        if (loggedUser.defaultAddress.phone) setPhone(loggedUser.defaultAddress.phone);
        if (loggedUser.defaultAddress.address) setAddress(loggedUser.defaultAddress.address);
        if (loggedUser.defaultAddress.city) setCity(loggedUser.defaultAddress.city);
        if (loggedUser.defaultAddress.postalCode) setPostalCode(loggedUser.defaultAddress.postalCode);
        if (loggedUser.defaultAddress.province) setProvince(loggedUser.defaultAddress.province);
      }
    } catch (err: any) {
      setGoogleAuthError(err.message || 'Google Sign-In could not be completed.');
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const handleDemoSignIn = async () => {
    setGoogleAuthError(null);
    setGoogleSigningIn(true);
    try {
      const demoUser = await signInWithDemo();
      if (demoUser.displayName) setFullName(demoUser.displayName);
      if (demoUser.email) setEmail(demoUser.email);
      if (demoUser.phoneNumber) setPhone(demoUser.phoneNumber);
      if (demoUser.defaultAddress) {
        if (demoUser.defaultAddress.fullName) setFullName(demoUser.defaultAddress.fullName);
        if (demoUser.defaultAddress.phone) setPhone(demoUser.defaultAddress.phone);
        if (demoUser.defaultAddress.address) setAddress(demoUser.defaultAddress.address);
        if (demoUser.defaultAddress.city) setCity(demoUser.defaultAddress.city);
        if (demoUser.defaultAddress.postalCode) setPostalCode(demoUser.defaultAddress.postalCode);
        if (demoUser.defaultAddress.province) setProvince(demoUser.defaultAddress.province);
      }
    } catch (err: any) {
      setGoogleAuthError(err.message || 'Demo Sign-In could not be completed.');
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (errors.paymentMethod) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.paymentMethod;
        return next;
      });
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBankReceiptName(file.name);
    setReceiptUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawData = event.target?.result as string;

      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setBankReceipt(compressed);
          } else {
            setBankReceipt(rawData);
          }
          setReceiptUploading(false);
          if (errors.bankReceipt || errors.paymentMethod) {
            setErrors(prev => {
              const next = { ...prev };
              delete next.bankReceipt;
              delete next.paymentMethod;
              return next;
            });
          }
        };
        img.onerror = () => {
          setBankReceipt(rawData);
          setReceiptUploading(false);
        };
        img.src = rawData;
      } else {
        setBankReceipt(rawData);
        setReceiptUploading(false);
        if (errors.bankReceipt || errors.paymentMethod) {
          setErrors(prev => {
            const next = { ...prev };
            delete next.bankReceipt;
            delete next.paymentMethod;
            return next;
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };


  const handleActivateWhatsAppMode = () => {
    setIsWhatsAppMode(true);
    setErrors(prev => {
      const next = { ...prev };
      delete next.auth;
      return next;
    });
    setTimeout(() => {
      const el = document.getElementById('field-fullName');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLInputElement).focus();
      }
    }, 120);
  };

  const generateWhatsAppBookingMessage = (orderRef?: string) => {
    const itemsSummary = items.map((item, index) => {
      const colorText = item.selectedColor ? ` | Colour: ${item.selectedColor}` : '';
      const sizeText = item.selectedSize ? `Size: ${item.selectedSize}` : '';
      return `${index + 1}. *${item.name}*\n   • Quantity: ${item.quantity}\n   • ${sizeText}${colorText}\n   • Price: Rs. ${(item.price * item.quantity).toLocaleString()}`;
    }).join('\n\n');

    const methodNames: Record<string, string> = {
      'cod': 'Cash on Delivery (COD)',
      'card': 'Credit / Debit Card',
      'bank_transfer': 'Direct Bank Transfer / Deposit Slip Attached'
    };

    const paymentText = paymentMethod ? (methodNames[paymentMethod] || paymentMethod) : 'Cash on Delivery (COD)';
    const orderRefLine = orderRef ? `🏷️ *Order Reference:* ${orderRef}\n` : '';

    return `🌟 *FASHION GATE BOUTIQUE - NEW WHATSAPP ORDER BOOKING* 🌟\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello Fashion Gate Concierge, I would like to place my boutique order directly via WhatsApp:\n\n` +
      `${orderRefLine}` +
      `*🛍️ ORDER ITEMS (${items.reduce((s, i) => s + i.quantity, 0)} items):*\n` +
      `${itemsSummary}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*💰 ORDER BILLING SUMMARY:*\n` +
      `💵 *Items Subtotal:* Rs. ${totalPrice.toLocaleString()}\n` +
      `🚚 *Islandwide Shipping:* Rs. ${shipping.toLocaleString()}\n` +
      `💳 *TOTAL AMOUNT PAYABLE:* Rs. ${grandTotal.toLocaleString()}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*📋 CUSTOMER & DELIVERY DETAILS:*\n` +
      `👤 *Customer Name:* ${fullName.trim()}\n` +
      `📞 *Contact Phone:* ${phone.trim()}\n` +
      (email.trim() ? `✉️ *Email:* ${email.trim()}\n` : '') +
      `📍 *Street Address:* ${address.trim()}\n` +
      `🏙️ *City / Town:* ${city.trim()}\n` +
      (postalCode.trim() ? `📮 *Postal Code:* ${postalCode.trim()}\n` : '') +
      `🏛️ *Province:* ${province}\n` +
      `💳 *Payment Method:* ${paymentText}\n` +
      (deliveryNotes.trim() ? `📝 *Special Instructions:* ${deliveryNotes.trim()}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Please verify item availability and confirm my delivery dispatch. Thank you!`;
  };

  const validateWhatsAppDetails = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) err.fullName = 'Full Name is required for WhatsApp booking';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) err.phone = 'Valid phone number is required (e.g. 077 123 4567)';
    if (!address.trim()) err.address = 'Street / Delivery address is required';
    if (!city.trim()) err.city = 'City / Town is required';

    if (!paymentMethod) {
      err.paymentMethod = 'Please choose your preferred payment method (Cash on Delivery or Direct Bank Transfer)';
    } else if (paymentMethod === 'card') {
      err.paymentMethod = 'Online card payment gateway is currently in progress. Please select Cash on Delivery (COD) or Direct Bank Transfer to proceed.';
    } else if (paymentMethod === 'bank_transfer' && !bankReceipt) {
      err.bankReceipt = 'Please upload your bank transfer / deposit slip to proceed.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!isLoggedIn && !isWhatsAppMode) {
      err.auth = 'Please sign in with your Google account, or click "Enter Details & Book via WhatsApp" below to order directly.';
    }
    if (!fullName.trim()) err.fullName = 'Full Name is required';
    if (!email.trim() || !email.includes('@')) err.email = 'Valid email address is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 9) err.phone = 'Valid phone number is required';
    if (!address.trim()) err.address = 'Delivery address is required';
    if (!city.trim()) err.city = 'City / Town is required';

    if (!paymentMethod) {
      err.paymentMethod = 'Please select a payment method (Cash on Delivery or Direct Bank Transfer) to place your order.';
    } else if (paymentMethod === 'card') {
      err.paymentMethod = 'Online card payment gateway is currently coming soon. Please select Cash on Delivery (COD) or Direct Bank Transfer to place your order.';
    } else if (paymentMethod === 'bank_transfer' && !bankReceipt) {
      err.bankReceipt = 'Please upload your bank deposit or transfer slip to proceed.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Validate WhatsApp mode
    if (isWhatsAppMode) {
      const isValid = validateWhatsAppDetails();
      if (!isValid) {
        window.scrollTo({ top: 220, behavior: 'smooth' });
        return;
      }
      setShowConfirmModal(true);
      return;
    }

    // Validate standard Google Logged-In checkout
    if (!validate()) {
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleExecuteOrder = async () => {
    if (items.length === 0) return;

    // Handle WhatsApp Direct Booking Submission
    if (isWhatsAppMode) {
      setIsSubmitting(true);
      try {
        const orderPayload = {
          userId: user?.uid || 'guest_whatsapp',
          userEmail: email.trim() || `${phone.replace(/\D/g, '')}@whatsapp.guest`,
          userPhotoURL: user?.photoURL,
          customer: {
            fullName: fullName.trim(),
            email: email.trim() || `${phone.trim()} (WhatsApp Guest)`,
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            postalCode: postalCode.trim() || undefined,
            province,
            deliveryNotes: deliveryNotes.trim() ? `[WhatsApp Booking] ${deliveryNotes.trim()}` : '[WhatsApp Booking]',
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
          paymentMethod: paymentMethod as PaymentMethod,
          bankReceipt: paymentMethod === 'bank_transfer' ? (bankReceipt || undefined) : undefined,
          bankReceiptName: paymentMethod === 'bank_transfer' ? (bankReceiptName || undefined) : undefined,
          notes: `WhatsApp Booking via +94 70 773 9962. Customer Phone: ${phone.trim()}`,
        };

        const createdOrder = await placeOrder(orderPayload);
        // Automatically deduct purchased quantities from live stock
        reduceStock(items.map(item => ({ id: item.id, quantity: item.quantity })));

        const message = generateWhatsAppBookingMessage(createdOrder.id);
        const waUrl = `https://wa.me/94707739962?text=${encodeURIComponent(message)}`;

        try {
          window.open(waUrl, '_blank');
        } catch {
          // ignore
        }
        isNavigatingAway.current = true;
        setShowConfirmModal(false);
        clearCart();
        navigate(`/order-confirmation/${createdOrder.id}`, { state: { order: createdOrder }, replace: true });
      } catch (err) {
        console.error('WhatsApp booking error:', err);
        const fallbackMsg = generateWhatsAppBookingMessage();
        try {
          window.open(`https://wa.me/94707739962?text=${encodeURIComponent(fallbackMsg)}`, '_blank');
        } catch {}
        setIsSubmitting(false);
      }
      return;
    }

    // Standard Google Logged-In Checkout Submission
    setIsSubmitting(true);
    try {
      // Auto-save address for the user
      if (user) {
        updateSavedAddress({
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          province,
        }).catch(e => console.warn(e));
      }

      const orderPayload = {
        userId: user?.uid,
        userEmail: user?.email || email.trim(),
        userPhotoURL: user?.photoURL,
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
        paymentMethod: paymentMethod as PaymentMethod,
        bankReceipt: paymentMethod === 'bank_transfer' ? (bankReceipt || undefined) : undefined,
        bankReceiptName: paymentMethod === 'bank_transfer' ? (bankReceiptName || undefined) : undefined,
        notes: paymentMethod === 'bank_transfer' ? `Bank Transfer slip attached (${bankReceiptName || 'Receipt'})` : undefined,
      };

      const createdOrder = await placeOrder(orderPayload);
      // Automatically deduct purchased quantities from live stock
      reduceStock(items.map(item => ({ id: item.id, quantity: item.quantity })));

      isNavigatingAway.current = true;
      setShowConfirmModal(false);
      clearCart();
      navigate(`/order-confirmation/${createdOrder.id}`, { state: { order: createdOrder }, replace: true });
    } catch (err) {
      console.error('Error placing order:', err);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isNavigatingAway.current) {
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
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#9E9E9E] tracking-[0.08em] uppercase mb-4 sm:mb-8">
          <Link to="/" className="hover:text-[#C4922A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-[#C4922A] transition-colors">Bag</Link>
          <span>/</span>
          <span className="text-[#0A0A0A] font-semibold">Checkout</span>
        </div>

        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3.5 sm:pb-4 border-b border-[#E8E4DF]">
          <div>
            <p className="text-[10px] text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold">Secure Ordering</p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A0A0A] mt-0.5">Checkout &amp; Delivery</h1>
          </div>
          <Link
            to="/cart"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#C4922A] transition-colors"
          >
            <ArrowLeft size={14} /> Return to Bag
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 sm:gap-8 md:gap-12 items-start">
            {/* Left Column: Customer & Delivery Details + Payment */}
            <div className="space-y-6 sm:space-y-8">
              {/* 1. CONTACT & DELIVERY INFORMATION */}
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-sm border border-[#E8E4DF] shadow-xs space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DF] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[11px] sm:text-xs font-bold font-mono shrink-0">
                      1
                    </span>
                    <h2 className="font-display text-sm sm:text-base md:text-lg font-bold text-[#0A0A0A] uppercase tracking-wider">
                      Customer &amp; Shipping Details
                    </h2>
                  </div>
                  {isLoggedIn && (
                    <span className="text-[8.5px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={11} /> Authenticated
                    </span>
                  )}
                </div>

                {/* Google Sign-In Gate, WhatsApp Mode or Verified Badge */}
                {!isLoggedIn ? (
                  isWhatsAppMode ? (
                    <div className="p-3.5 sm:p-4.5 bg-gradient-to-r from-emerald-50 via-[#F7FDF9] to-emerald-50/40 border border-emerald-500/50 rounded-xs space-y-2.5 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            <WhatsAppIcon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-1.5 flex-wrap">
                              <span>WhatsApp Direct Booking Active</span>
                              <span className="text-[8.5px] sm:text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-2xs font-mono font-bold tracking-wide">
                                STEP 1: FILL DETAILS
                              </span>
                            </p>
                            <p className="text-[10.5px] sm:text-[11px] text-[#444444] leading-relaxed mt-0.5">
                              Please fill in your delivery details below. Once completed, click <strong>Complete Booking on WhatsApp</strong> to send your order.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsWhatsAppMode(false)}
                          className="text-[10.5px] text-[#6B6B6B] hover:text-[#0A0A0A] underline uppercase font-bold tracking-wider shrink-0 self-start sm:self-auto cursor-pointer"
                        >
                          Use Google Sign-In Instead
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#FAFAF8] via-[#FDFBF7] to-[#F4F1EC] border border-[#C4922A]/40 rounded-xs space-y-3.5 shadow-2xs">
                      {/* Primary: Google VIP Sign-In */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8E4DF] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            <GoogleIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2 flex-wrap">
                              <span>Google Sign-In Required</span>
                              <span className="text-[8.5px] sm:text-[9px] bg-[#C4922A] text-white px-1.5 py-0.5 rounded-2xs font-mono font-bold">VIP PATRON</span>
                            </p>
                            <p className="text-[10.5px] sm:text-[11px] text-[#6B6B6B] leading-relaxed mt-0.5">
                              Connect with your Google account to secure live courier tracking, order receipts, and 1-tap express checkout.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleSigningIn}
                            className="inline-flex items-center justify-center gap-2.5 py-2.5 sm:py-3 px-4 sm:px-5 bg-white hover:bg-[#FAFAF8] text-[#0A0A0A] border border-[#D5D0C9] hover:border-[#0A0A0A] text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
                          >
                            <GoogleIcon className="w-4 h-4 shrink-0" />
                            <span>{googleSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Secondary Alternative: Direct WhatsApp Booking */}
                      <div className="pt-3 border-t border-[#E8E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 p-3 sm:p-3.5 rounded-xs border border-emerald-600/25">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[#25D366]">
                            <WhatsAppIcon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-1.5 flex-wrap">
                              <span>Don't have a Google Account?</span>
                              <span className="text-[8.5px] sm:text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-2xs font-mono font-bold tracking-wide">
                                WHATSAPP BOOKING
                              </span>
                            </p>
                            <p className="text-[10px] sm:text-[10.5px] text-[#555555] leading-relaxed mt-0.5">
                              Prefer not to sign in with a Google account? Place your booking directly via WhatsApp with our boutique concierge team.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleActivateWhatsAppMode}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 sm:px-4.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
                        >
                          <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                          <span className="whitespace-nowrap">Enter Details &amp; Book</span>
                        </button>
                      </div>

                      {errors.auth && (
                        <div className="p-2.5 bg-red-50/80 border border-red-200 text-red-700 text-[10.5px] sm:text-[11px] font-semibold rounded-xs flex items-center gap-2">
                          <AlertCircle size={14} className="shrink-0 text-red-600" />
                          <span>{errors.auth}</span>
                        </div>
                      )}

                      {googleAuthError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xs flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={15} className="shrink-0 text-red-600" />
                            <span className="font-semibold">{googleAuthError}</span>
                          </div>
                          <div className="flex items-center gap-3 pt-1 border-t border-red-200/60 flex-wrap">
                            <button
                              type="button"
                              onClick={handleDemoSignIn}
                              className="text-[11px] font-bold text-[#C4922A] hover:underline cursor-pointer"
                            >
                              ⚡ Or Sign In with Demo VIP Account
                            </button>
                            <span className="text-[#999] hidden sm:inline">|</span>
                            <button
                              type="button"
                              onClick={handleActivateWhatsAppMode}
                              className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                            >
                              📱 Or Book via WhatsApp
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="p-3 sm:p-3.5 bg-emerald-50/60 border border-emerald-300/70 rounded-xs flex items-center justify-between gap-3 text-xs flex-wrap">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-emerald-400 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0A0A0A] text-[#C4922A] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                          {user?.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-[#0A0A0A] truncate text-xs flex items-center gap-1.5 flex-wrap">
                          <span>Ordering as: <strong>{user?.displayName}</strong></span>
                          <span className="text-[8.5px] sm:text-[9px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-2xs font-bold uppercase tracking-wider">
                            ✓ Google Verified
                          </span>
                        </p>
                        <p className="text-[10px] text-[#7A7A7A] truncate font-mono">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      <Link
                        to="/account"
                        className="text-[10px] text-[#C4922A] hover:text-[#0A0A0A] font-bold uppercase tracking-wider hover:underline shrink-0 flex items-center gap-1 transition-colors"
                      >
                        <span>Manage Account</span> <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>
                )}

                <div id="details-form-section" className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="field-fullName"
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className={`w-full bg-[#FAFAF8] border ${errors.fullName ? 'border-red-500' : 'border-[#E8E4DF]'} px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Email Address {isWhatsAppMode ? '(Optional)' : '*'}
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. kasun.perera@gmail.com"
                      className={`w-full bg-[#FAFAF8] border ${errors.email ? 'border-red-500' : 'border-[#E8E4DF]'} px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Phone Number * (For Courier SMS &amp; WhatsApp)
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +94 77 123 4567"
                      className={`w-full bg-[#FAFAF8] border ${errors.phone ? 'border-red-500' : 'border-[#E8E4DF]'} px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Street Address *
                    </label>
                    <input
                      id="field-address"
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. No. 45/A, Thalawathugoda Road"
                      className={`w-full bg-[#FAFAF8] border ${errors.address ? 'border-red-500' : 'border-[#E8E4DF]'} px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      City / Town *
                    </label>
                    <input
                      id="field-city"
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Kotte, Nugegoda, Colombo"
                      className={`w-full bg-[#FAFAF8] border ${errors.city ? 'border-red-500' : 'border-[#E8E4DF]'} px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                    />
                    {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Postal Code (Optional)
                    </label>
                    <input
                      id="field-postalCode"
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="e.g. 10100"
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs"
                    />
                  </div>

                  {/* Province / Region */}
                  <div className="md:col-span-2">
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Province / Region
                    </label>
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs cursor-pointer"
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
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Special Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={e => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Leave with security, call upon reaching gate..."
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PAYMENT METHOD SELECTION */}
              <div className={`bg-white p-4 sm:p-6 md:p-8 rounded-sm border transition-all shadow-xs space-y-5 sm:space-y-6 ${errors.paymentMethod ? 'border-amber-400 ring-2 ring-amber-300/60 bg-amber-50/10' : 'border-[#E8E4DF]'
                }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E4DF]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-xs font-bold font-mono shrink-0">
                      2
                    </span>
                    <h2 className="font-display text-base sm:text-lg font-bold text-[#0A0A0A] uppercase tracking-wider">
                      Select Payment Method *
                    </h2>
                  </div>
                  {!paymentMethod ? (
                    <span className="self-start sm:self-auto text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-xs animate-pulse shrink-0">
                      Selection Required
                    </span>
                  ) : (
                    <span className="self-start sm:self-auto text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={11} /> Selected
                    </span>
                  )}
                </div>

                {errors.paymentMethod && (
                  <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xs flex items-center gap-2.5 font-medium">
                    <AlertCircle size={16} className="text-amber-700 shrink-0" />
                    <span>{errors.paymentMethod}</span>
                  </div>
                )}

                {/* Option 1: Cash on Delivery (COD) */}
                <div
                  onClick={() => handleSelectPaymentMethod('cod')}
                  className={`border rounded-sm p-3.5 sm:p-4.5 transition-all cursor-pointer ${paymentMethod === 'cod'
                      ? 'border-[#C4922A] bg-[#C4922A]/5 ring-1 ring-[#C4922A]'
                      : 'border-[#E8E4DF] hover:border-[#C4922A]/50 bg-white'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4.5 h-4.5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-[#C4922A] bg-[#C4922A]' : 'border-[#9E9E9E]'
                        }`}
                    >
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
                          <Truck size={15} className="text-[#C4922A] shrink-0" /> <span>Cash on Delivery (COD)</span>
                        </p>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs shrink-0">
                          Popular
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7A7A] leading-relaxed">
                        Pay securely with cash or card upon courier delivery at your doorstep across Sri Lanka.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option 2: Direct Bank Deposit / Transfer */}
                <div
                  onClick={() => handleSelectPaymentMethod('bank_transfer')}
                  className={`border rounded-sm p-3.5 sm:p-4.5 transition-all cursor-pointer ${paymentMethod === 'bank_transfer'
                      ? 'border-[#C4922A] bg-[#C4922A]/5 ring-1 ring-[#C4922A]'
                      : 'border-[#E8E4DF] hover:border-[#C4922A]/50 bg-white'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4.5 h-4.5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-[#C4922A] bg-[#C4922A]' : 'border-[#9E9E9E]'
                        }`}
                    >
                      {paymentMethod === 'bank_transfer' && <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2 mb-0.5">
                        <Building2 size={15} className="text-[#C4922A] shrink-0" /> <span>Direct Bank Deposit / Transfer</span>
                      </p>
                      <p className="text-[11px] text-[#7A7A7A] leading-relaxed">
                        Transfer to our Commercial Bank / Sampath Bank business account.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-4 border-t border-[#C4922A]/20 bg-white p-3.5 sm:p-4 rounded-xs text-xs space-y-3.5 text-[#4A4A4A]" onClick={e => e.stopPropagation()}>
                      {/* Bank Info Header */}
                      <div className="bg-[#FAFAF8] border border-[#E8E4DF] p-3.5 rounded-xs space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-[#E8E4DF]">
                          <p className="font-bold text-[#0A0A0A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Building2 size={13} className="text-[#C4922A] shrink-0" /> Boutique Bank Account Details
                          </p>
                          <span className="self-start sm:self-auto text-[10px] font-bold text-[#C4922A] bg-[#C4922A]/10 px-2 py-0.5 rounded-xs shrink-0">
                            Amount: Rs. {grandTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                          <p><strong className="text-[#0A0A0A]">Bank:</strong> Commercial Bank of Ceylon PLC</p>
                          <p><strong className="text-[#0A0A0A]">Branch:</strong> Kotte Branch</p>
                          <p><strong className="text-[#0A0A0A]">Account Name:</strong> Fashion Gate Boutique (Pvt) Ltd</p>
                          <p><strong className="text-[#0A0A0A]">Account No:</strong> <span className="font-mono text-[#C4922A] font-bold tracking-wider">1000 8492 7710</span></p>
                        </div>
                      </div>

                      {/* Required Notice */}
                      <div className="p-3 bg-amber-50/90 border border-amber-300 text-amber-900 rounded-xs text-[11px] leading-relaxed">
                        <strong className="block text-xs text-amber-950 font-bold mb-0.5 flex items-center gap-1">
                          <AlertCircle size={13} className="text-[#C4922A] shrink-0" /> Transfer Receipt Required to Place Order:
                        </strong>
                        Please transfer exactly <strong>Rs. {grandTotal.toLocaleString()}</strong> to our bank account above and upload a photo/screenshot of your deposit slip below. Your order will be verified and dispatched immediately.
                      </div>

                      {/* Receipt Upload Box */}
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase text-[#0A0A0A] font-bold mb-1.5 flex items-center justify-between flex-wrap gap-1">
                          <span>Upload Transfer / Deposit Slip *</span>
                          {bankReceipt && (
                            <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 size={12} /> Receipt Uploaded
                            </span>
                          )}
                        </label>

                        {!bankReceipt ? (
                          <div className={`border-2 border-dashed rounded-xs p-5 text-center transition-all bg-[#FAFAF8] relative hover:border-[#C4922A] cursor-pointer ${errors.bankReceipt ? 'border-red-400 bg-red-50/20' : 'border-[#D5D0C9]'
                            }`}>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleReceiptUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {receiptUploading ? (
                              <div className="flex items-center justify-center gap-2 text-xs text-[#C4922A] font-medium py-2">
                                <Sparkles size={16} className="animate-spin" />
                                <span>Attaching receipt slip...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-[#C4922A]/10 text-[#C4922A] flex items-center justify-center">
                                  <Upload size={18} />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#0A0A0A]">
                                    Click to Upload Bank Slip or Screenshot
                                  </p>
                                  <p className="text-[10px] text-[#7A7A7A] mt-0.5">
                                    JPG, PNG, WebP or PDF (Mobile camera photo supported)
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Uploaded Receipt Preview Box */
                          <div className="border border-emerald-500/40 bg-emerald-50/30 p-3 rounded-xs flex items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-14 bg-black/5 border border-[#E8E4DF] rounded-xs overflow-hidden shrink-0 flex items-center justify-center">
                                {bankReceipt.startsWith('data:image') ? (
                                  <img src={bankReceipt} alt="Bank Slip" className="w-full h-full object-cover" />
                                ) : (
                                  <FileText size={22} className="text-[#C4922A]" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#0A0A0A] truncate">
                                  {bankReceiptName || 'Bank_Deposit_Slip.jpg'}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                                  <Check size={12} /> Ready to submit with order
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setBankReceipt(null);
                                setBankReceiptName('');
                              }}
                              className="text-[11px] text-red-600 hover:text-red-700 underline font-semibold px-2 py-1 cursor-pointer shrink-0"
                            >
                              Remove / Change
                            </button>
                          </div>
                        )}

                        {errors.bankReceipt && (
                          <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                            <AlertCircle size={13} /> {errors.bankReceipt}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 3: Credit / Debit Card (Online Payment) - COMING SOON */}
                <div
                  onClick={() => handleSelectPaymentMethod('card')}
                  className={`border rounded-sm p-3.5 sm:p-4.5 transition-all cursor-pointer ${paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400'
                      : 'border-[#E8E4DF] hover:border-amber-300/80 bg-[#FAFAF8]'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4.5 h-4.5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-all ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-500' : 'border-[#9E9E9E]'
                        }`}
                    >
                      {paymentMethod === 'card' && <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center gap-2">
                          <CreditCard size={15} className="text-[#C4922A] shrink-0" /> <span>Credit / Debit Card (Online Payment)</span>
                        </p>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xs flex items-center gap-1 shrink-0">
                          <Clock size={11} /> Coming Soon
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8E8E8E] leading-relaxed">
                        Automated online card gateway integration is in progress.
                      </p>
                    </div>
                  </div>

                  {/* Coming Soon Notice when clicked */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-amber-300/60 bg-white p-3.5 sm:p-4 rounded-xs text-xs space-y-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-start gap-2.5 text-amber-900">
                        <Sparkles size={16} className="text-[#C4922A] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs text-[#0A0A0A]">Online Payment Gateway Under Integration</p>
                          <p className="text-[11px] text-[#6B6B6B] leading-relaxed mt-1">
                            Our automated Visa &amp; MasterCard payment gateway is currently being finalized and will be active very soon.
                            In the meantime, please complete your order easily using <strong>Cash on Delivery (COD)</strong> or <strong>Direct Bank Deposit / Transfer</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSelectPaymentMethod('cod')}
                          className="px-3.5 py-2 bg-[#C4922A] text-white text-[10px] font-bold uppercase tracking-wider rounded-xs hover:bg-[#a67b22] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Truck size={12} /> Switch to Cash on Delivery (COD)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPaymentMethod('bank_transfer')}
                          className="px-3.5 py-2 bg-white border border-[#C4922A] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-wider rounded-xs hover:bg-[#C4922A]/10 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Building2 size={12} /> Switch to Bank Transfer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-sm border border-[#E8E4DF] shadow-xs space-y-6 md:sticky md:top-32">
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
                  <span className="font-semibold text-[#0A0A0A]">
                    Rs. {shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E4DF]">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">Total Payable</span>
                  <span className="font-display text-xl font-bold text-[#0A0A0A]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Error Alert above place order button if payment not selected */}
              {errors.paymentMethod && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle size={15} className="text-amber-700 shrink-0" />
                  <span>{errors.paymentMethod}</span>
                </div>
              )}

              {/* Submit Order Button - switches dynamically based on isWhatsAppMode */}
              {isWhatsAppMode ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer shadow-md hover:shadow-lg transition-all rounded-xs disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>Connecting to WhatsApp...</>
                  ) : (
                    <>
                      <WhatsAppIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white shrink-0" />
                      <span className="text-center font-bold leading-tight">
                        Complete Booking on WhatsApp (Rs. {grandTotal.toLocaleString()})
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 btn-gold text-[11px] sm:text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>Processing Your Order...</>
                  ) : (
                    <>
                      <Sparkles size={14} /> Place Order (Rs. {grandTotal.toLocaleString()})
                    </>
                  )}
                </button>
              )}

              {!isLoggedIn && !isWhatsAppMode && (
                <div className="pt-2 space-y-2.5">
                  <div className="relative flex items-center justify-center my-1">
                    <div className="border-t border-[#E8E4DF] w-full" />
                    <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#7A7A7A] tracking-[0.12em] whitespace-nowrap shrink-0">
                      Or Without Google Login
                    </span>
                    <div className="border-t border-[#E8E4DF] w-full" />
                  </div>
                  <button
                    type="button"
                    onClick={handleActivateWhatsAppMode}
                    className="w-full px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white text-[11px] sm:text-xs tracking-wider uppercase font-bold rounded-xs transition-all shadow-xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                    <span>Fill Details &amp; Book via WhatsApp</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9E9E9E] tracking-wider text-center">
                <Lock size={12} />
                <span>SSL Encrypted &amp; Guaranteed Authentic Boutique Pieces</span>
              </div>
            </div>
          </div>
        </form>

        {/* Order Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl border border-[#D5D0C9] overflow-hidden my-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Top Gold Accent Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#8C6214] via-[#D4A745] to-[#8C6214]" />

              {/* Modal Header */}
              <div className="p-4 sm:p-6 pb-3 border-b border-[#E8E4DF] flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C4922A]/10 text-[#C4922A] flex items-center justify-center shrink-0 border border-[#C4922A]/20">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C4922A] font-bold font-mono">
                      Final Step · Order Verification
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#0A0A0A]">
                      Confirm Your Order
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !isSubmitting && setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="text-[#9E9E9E] hover:text-[#0A0A0A] p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Close confirmation"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content / Summary */}
              <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                <p className="text-xs text-[#555555] leading-relaxed">
                  Please review your delivery details and items summary before confirming your order.
                </p>

                {/* 1. Recipient & Shipping Information */}
                <div className="bg-[#FAFAF8] p-3.5 sm:p-4 rounded-xs border border-[#E8E4DF] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#7A7A7A] flex items-center gap-1">
                      <Truck size={12} className="text-[#C4922A]" /> Delivery Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(false)}
                      className="text-[10.5px] font-semibold text-[#C4922A] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="text-xs space-y-1 text-[#0A0A0A]">
                    <p className="font-bold flex items-center gap-1.5">
                      <User size={12} className="text-[#9E9E9E] shrink-0" />
                      <span>{fullName}</span>
                      {phone && <span className="text-[#7A7A7A] font-normal">({phone})</span>}
                    </p>
                    {email && (
                      <p className="text-[#555555] flex items-center gap-1.5 text-[11px]">
                        <Mail size={12} className="text-[#9E9E9E] shrink-0" /> {email}
                      </p>
                    )}
                    <p className="text-[#444444] leading-tight flex items-start gap-1.5 pt-0.5">
                      <MapPin size={12} className="text-[#9E9E9E] shrink-0 mt-0.5" />
                      <span>
                        {address}, {city}{postalCode ? ` - ${postalCode}` : ''}, {province}
                      </span>
                    </p>
                    {deliveryNotes && (
                      <p className="text-[10.5px] text-[#7A7A7A] italic pt-1 border-t border-[#E8E4DF] mt-1">
                        Note: "{deliveryNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="bg-[#FAFAF8] p-3.5 sm:p-4 rounded-xs border border-[#E8E4DF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#7A7A7A] block mb-0.5">
                      Payment Method
                    </span>
                    <div className="flex items-center gap-2">
                      {paymentMethod === 'cod' && (
                        <>
                          <Truck size={14} className="text-[#C4922A] shrink-0" />
                          <span className="text-xs font-bold text-[#0A0A0A]">Cash on Delivery (COD)</span>
                        </>
                      )}
                      {paymentMethod === 'bank_transfer' && (
                        <>
                          <Building2 size={14} className="text-[#C4922A] shrink-0" />
                          <span className="text-xs font-bold text-[#0A0A0A]">Direct Bank Transfer</span>
                          {bankReceiptName && (
                            <span className="text-[9.5px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                              Slip Attached
                            </span>
                          )}
                        </>
                      )}
                      {paymentMethod === 'card' && (
                        <>
                          <CreditCard size={14} className="text-[#C4922A] shrink-0" />
                          <span className="text-xs font-bold text-[#0A0A0A]">Card Payment</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="text-[10.5px] font-semibold text-[#C4922A] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* 3. Ordered Items List */}
                <div className="border border-[#E8E4DF] rounded-xs overflow-hidden">
                  <div className="bg-[#F2F0ED] px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#555555] flex justify-between items-center">
                    <span>Items Ordered ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span className="font-mono">Subtotal</span>
                  </div>
                  <div className="divide-y divide-[#E8E4DF] max-h-36 overflow-y-auto p-2 bg-white">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-2 px-1 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-11 object-cover rounded-2xs bg-[#F2F0ED] shrink-0 border border-[#E8E4DF]"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-[#0A0A0A] truncate text-[11.5px] leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-[#7A7A7A]">
                              Qty: {item.quantity} · Size: {item.selectedSize}
                              {item.selectedColor ? ` · ${item.selectedColor}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#0A0A0A] shrink-0 text-xs">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Pricing Calculation Breakdown */}
                <div className="bg-[#FDFBF7] p-3.5 sm:p-4 rounded-xs border border-[#C4922A]/30 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#7A7A7A]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#0A0A0A]">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#7A7A7A]">
                    <span>Islandwide Shipping</span>
                    <span className="font-semibold text-[#0A0A0A]">Rs. {shipping.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E8E4DF] flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                      Total Amount Payable
                    </span>
                    <span className="font-display text-lg sm:text-xl font-bold text-[#C4922A]">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-4 sm:p-6 pt-3 bg-[#FAFAF8] border-t border-[#E8E4DF] flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-white hover:bg-[#F2F0ED] text-[#0A0A0A] border border-[#D5D0C9] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50 text-center"
                >
                  Review / Edit Details
                </button>

                {isWhatsAppMode ? (
                  <button
                    type="button"
                    onClick={handleExecuteOrder}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Sending WhatsApp Order...</span>
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>Yes, Confirm &amp; Send to WhatsApp</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleExecuteOrder}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 btn-gold text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Placing Your Order...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Yes, Confirm &amp; Place Order</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
