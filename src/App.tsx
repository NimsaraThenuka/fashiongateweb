import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
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

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

function Layout() {
  const { scrollYProgress } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-[#C4922A] text-white rounded-full shadow-lg hover:bg-[#A3771F] transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Layout />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
