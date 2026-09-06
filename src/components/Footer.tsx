import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const LOGO_URL = 'https://res.cloudinary.com/dyp247eoh/image/upload/v1784785679/Fashion_Gate_JPG_02.jpg-removebg-preview_epbtzx.png';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Stay Connected</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
              First to know.<br />
              <em className="text-[#C4922A]">First to wear.</em>
            </h3>
          </div>
          <div>
            {subscribed ? (
              <div className="text-center md:text-left">
                <p className="text-[#C4922A] font-display text-xl mb-1">Welcome to the Gate.</p>
                <p className="text-white/60 text-sm">You're on the list for exclusive access and early drops.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:gap-0 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full sm:flex-1 bg-white/10 border border-white/20 px-5 py-4 text-sm text-white placeholder-white/40 outline-none focus:border-[#C4922A] transition-colors"
                />
                <button type="submit" className="btn-gold flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto py-4">
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <img src={LOGO_URL} alt="Fashion Gate" className="h-16 w-auto object-contain mb-6 brightness-0 invert" />
          <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
            Fashion Gate – Elevate Your Style. Dedicated to offering elegant, high-quality Men's &amp; Women's fashion and lifestyle collections with islandwide delivery across Sri Lanka.
          </p>
          <div className="flex gap-3">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                ),
                href: 'https://web.facebook.com/profile.php?id=61591346097510',
                label: 'Instagram'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                ),
                href: 'https://web.facebook.com/profile.php?id=61591346097510',
                label: 'Facebook'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                ),
                href: 'https://web.facebook.com/profile.php?id=61591346097510',
                label: 'Twitter'
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                    <polygon points="10 15 15 12 10 9"/>
                  </svg>
                ),
                href: 'https://web.facebook.com/profile.php?id=61591346097510',
                label: 'Youtube'
              },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:border-[#C4922A] hover:text-[#C4922A] hover:bg-white/5 transition-all duration-300 rounded-full focus:outline-none"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase text-[#C4922A] mb-5">Shop</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "New Arrivals", href: "/shop?cat=new" },
              { label: "Women's Collection", href: "/shop?cat=women" },
              { label: "Men's Collection", href: "/shop?cat=men" },
              { label: "Kids' Collection", href: "/shop?cat=kids" },
              { label: "Accessories", href: "/shop?cat=accessories" },
              { label: "Gift Cards", href: "/gift-cards" }
            ].map(l => (
              <li key={l.label}>
                <Link to={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase text-[#C4922A] mb-5">Help</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "Size Guide", href: "/size-guide" },
              { label: "Shipping & Returns", href: "/shipping-returns" },
              { label: "Order Tracking", href: "/order-tracking" },
              { label: "My Orders", href: "/my-orders" },
              { label: "Care Instructions", href: "/care-instructions" },
              { label: "FAQ", href: "/faq" },
              { label: "Sustainability", href: "/sustainability" }
            ].map(l => (
              <li key={l.label}>
                <Link to={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-xs tracking-[0.15em] uppercase text-[#C4922A] mb-5">Contact</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-white/50">
              <MapPin size={14} className="text-[#C4922A] mt-0.5 shrink-0" />
              <span>459A 1/1, Thalawathugoda Road,<br />Madiwela, Kotte, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/50">
              <Phone size={14} className="text-[#C4922A] shrink-0" />
              <a href="tel:+94707739962" className="hover:text-[#C4922A] transition-colors">+94 70 773 9962</a>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/50">
              <Mail size={14} className="text-[#C4922A] shrink-0" />
              <a href="mailto:fashiongate777@gmail.com" className="hover:text-[#C4922A] transition-colors">fashiongate777@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Giant Luxury Watermark Brand Typo */}
      <div className="w-full pt-10 pb-4 overflow-hidden select-none pointer-events-none border-t border-white/5">
        <h2 className="font-display text-[9.5vw] font-extrabold text-center tracking-[0.25em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.14] via-white/[0.06] to-transparent">
          Fashion Gate
        </h2>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-white/30 text-xs">© 2025 Fashion Gate. All rights reserved.</p>
        <div className="flex gap-6">
          {[
            { label: 'Privacy Policy', href: '/legal?doc=privacy' },
            { label: 'Terms of Service', href: '/legal?doc=terms' },
            { label: 'Cookie Policy', href: '/legal?doc=cookie' },
          ].map(l => (
            <Link key={l.label} to={l.href} className="text-xs text-white/30 hover:text-white/60 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
