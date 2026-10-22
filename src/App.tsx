import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// Legacy Cache Purge: ensures all connected client devices flush old demo products
if (typeof window !== 'undefined') {
  const PURGE_KEY = 'fashiongate_v2_cache_purged';
  if (!localStorage.getItem(PURGE_KEY)) {
    localStorage.removeItem('fashiongate_live_products');
    localStorage.removeItem('fashiongate_deleted_product_ids');
    localStorage.setItem(PURGE_KEY, 'true');
  }
}

import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { GalleryProvider } from './context/GalleryContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminRoute } from './components/admin/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import SizeGuide from './pages/SizeGuide';
import ShippingReturns from './pages/ShippingReturns';
import OrderTracking from './pages/OrderTracking';
import CareInstructions from './pages/CareInstructions';
import FAQ from './pages/FAQ';
import Sustainability from './pages/Sustainability';
import GiftCards from './pages/GiftCards';
import Legal from './pages/Legal';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

const WhatsAppFloatingIcon = ({ className = 'w-5 h-5 sm:w-6 sm:h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
  }, [pathname, search]);
  return null;
}

function Layout() {
  const { scrollYProgress } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white print:bg-white print:text-black print:min-h-0 print:h-auto print:p-0 print:m-0">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    );
  }

  return (
    <>
      {/* Global Left-Edge Scroll Progress Gauge */}
      <div className="fixed left-0 top-0 bottom-0 w-[2.5px] bg-[#E8E4DF]/20 z-50 pointer-events-none">
        <motion.div
          style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
          className="w-full h-full bg-[#C4922A] shadow-[0_0_8px_rgba(196,146,42,0.8)]"
        />
      </div>

      <ScrollToTop />
      <Navbar />
      <main className="overflow-x-hidden w-full relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Account />} />
          <Route path="/my-orders" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/care-instructions" element={<CareInstructions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Footer />

      {/* Floating Action Controls (WhatsApp Concierge + Scroll To Top - Shown on scroll) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-2 sm:gap-2.5"
          >
            {/* Floating WhatsApp Quick Action Button */}
            <a
              href="https://wa.me/94707739962?text=Hello%20Fashion%20Gate%2C%20I%20would%20like%20to%20inquire%20about%20your%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-9 h-9 sm:w-11 sm:h-11 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.65)] border border-white/30 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp (+94 70 773 9962)"
            >
              <WhatsAppFloatingIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
              
              {/* Tooltip on Desktop */}
              <span className="absolute right-full mr-2.5 px-2.5 py-1 bg-[#0A0A0A] text-white text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap rounded-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                Chat on WhatsApp
              </span>
            </a>

            {/* Scroll to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="w-9 h-9 sm:w-11 sm:h-11 bg-[#C4922A] hover:bg-[#A3771F] text-white rounded-full shadow-lg border border-white/20 transition-all cursor-pointer flex items-center justify-center active:scale-95"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ArrowUp size={16} className="sm:w-5 sm:h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <GalleryProvider>
            <ProductProvider>
              <OrderProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Layout />
                  </WishlistProvider>
                </CartProvider>
              </OrderProvider>
            </ProductProvider>
          </GalleryProvider>
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
