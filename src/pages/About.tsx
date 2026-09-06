import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Compass, Heart, Truck, ShoppingBag, Headphones, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { Timeline } from '../components/Timeline';

const SERVICES = [
  {
    icon: Sparkles,
    title: "Premium Men's & Women's Fashion",
    desc: 'Carefully curated collections blending comfort, sophistication, and modern trends for every wardrobe.',
  },
  {
    icon: ShoppingBag,
    title: 'Online Shopping',
    desc: 'A seamless, intuitive digital shopping experience available 24/7 with secure payment options.',
  },
  {
    icon: Truck,
    title: 'Islandwide Delivery',
    desc: 'Reliable doorstep courier delivery across all 25 districts in Sri Lanka.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    desc: 'Dedicated assistance and styling guidance to make your shopping journey effortless.',
  },
  {
    icon: Award,
    title: 'New Arrivals & Seasonal Collections',
    desc: 'Continuously refreshed fashion edits to keep you ahead of contemporary trends.',
  },
];

export default function About() {
  useReveal();

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24 overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative min-h-[65vh] flex items-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=1920&h=900&fit=crop&auto=format)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-24">
          <div className="max-w-2xl reveal">
            <p className="text-xs text-[#E8B84B] tracking-[0.25em] uppercase mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-[#C4922A]" /> Fashion Gate – Elevate Your Style
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Welcome to<br /><em>Fashion Gate</em>
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light">
              At Fashion Gate, we believe that true style is timeless. Our brand is dedicated to offering elegant, high-quality fashion that empowers women to express their confidence with grace.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story & Philosophy */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal text-center md:text-left flex flex-col items-center md:items-start">
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-4 flex items-center justify-center md:justify-start gap-3">
              <span className="w-8 h-px bg-[#C4922A]" /> About Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mb-6">
              Timeless Elegance, <span className="hidden md:inline"><br /></span>Modern <em>Grace</em>
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4 text-center md:text-left">
              Every collection is carefully selected to blend comfort, sophistication, and modern trends, ensuring every piece reflects effortless elegance. From everyday essentials to statement outfits, Fashion Gate brings fashion that complements every lifestyle.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-8 text-center md:text-left">
              We are committed to providing exceptional customer service, premium-quality products, and a seamless shopping experience, making Fashion Gate your trusted destination for contemporary fashion.
            </p>

            {/* Quick Highlights */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-[#E8E4DF] w-full">
              {[
                { val: 'Premium', label: "Men's & Women's" },
                { val: 'Islandwide', label: 'Sri Lanka Delivery' },
                { val: '100%', label: 'Quality Assured' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-xl md:text-2xl font-bold text-[#C4922A]">{val}</p>
                  <p className="text-[10px] md:text-xs text-[#9E9E9E] tracking-[0.1em] uppercase mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative reveal delay-200">
            <div
              className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop&auto=format)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute -bottom-6 -left-6 bg-[#0A0A0A] p-6 text-white hidden md:block border-l-4 border-[#C4922A] shadow-xl">
              <p className="text-xs tracking-[0.15em] uppercase text-[#C4922A] mb-1">Tagline</p>
              <p className="font-display text-xl font-bold">Elevate Your Style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-28 bg-[#FAFAF8] border-y border-[#E8E4DF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 reveal">
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Our Purpose & Direction</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Mission & Vision</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div className="bg-white p-8 md:p-10 border border-[#E8E4DF] rounded-sm relative overflow-hidden group hover:border-[#C4922A] transition-all shadow-sm reveal-left">
              <div className="w-12 h-12 bg-[#FAFAF8] border border-[#C4922A] rounded-full flex items-center justify-center text-[#C4922A] mb-6 group-hover:bg-[#C4922A] group-hover:text-white transition-all">
                <Heart size={22} />
              </div>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#C4922A] mb-2">Our Core Purpose</p>
              <h3 className="font-display text-3xl font-bold text-[#0A0A0A] mb-4">Our Mission</h3>
              <p className="text-[#4A4A4A] leading-relaxed text-base">
                To inspire confidence by delivering elegant, high-quality, and affordable fashion for every woman.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-8 md:p-10 border border-[#E8E4DF] rounded-sm relative overflow-hidden group hover:border-[#C4922A] transition-all shadow-sm reveal-right">
              <div className="w-12 h-12 bg-[#FAFAF8] border border-[#C4922A] rounded-full flex items-center justify-center text-[#C4922A] mb-6 group-hover:bg-[#C4922A] group-hover:text-white transition-all">
                <Compass size={22} />
              </div>
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#C4922A] mb-2">Our Aspiration</p>
              <h3 className="font-display text-3xl font-bold text-[#0A0A0A] mb-4">Our Vision</h3>
              <p className="text-[#4A4A4A] leading-relaxed text-base">
                To become Sri Lanka's leading online fashion destination, recognized for elegance, quality, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SCROLL TIMELINE */}
      <Timeline data={[
        {
          title: "Sourcing & Curation",
          content: (
            <div className="flex flex-col gap-6">
              <p className="text-white/70 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                We select premium fabrics, breathable linens, fine cotton blends, and modern silhouettes. Every piece is curated to meet our standards of lasting comfort, durability, and elegance.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <img
                  src="https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=600&h=800&fit=crop&auto=format"
                  alt="Raw material curation"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=800&fit=crop&auto=format"
                  alt="Fabric selection"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
              </div>
            </div>
          )
        },
        {
          title: "Craft & Tailoring",
          content: (
            <div className="flex flex-col gap-6">
              <p className="text-white/70 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                From precision pattern-making to refined stitching, our garments are crafted with meticulous attention to fit and finish—creating pieces that blend sophistication with effortless everyday wear.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <img
                  src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=800&fit=crop&auto=format"
                  alt="Precision garment construction"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
                <img
                  src="https://images.unsplash.com/photo-1705909237050-7a7625b47fac?w=600&h=800&fit=crop&auto=format"
                  alt="Detailing and texture"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
              </div>
            </div>
          )
        },
        {
          title: "Atelier & Experience",
          content: (
            <div className="flex flex-col gap-6">
              <p className="text-white/70 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                Finished collections arrive at our boutique in Madiwela, Kotte. Each order is inspected, delicately packaged, and dispatched for reliable doorstep delivery across Sri Lanka.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <img
                  src="https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&h=800&fit=crop&auto=format"
                  alt="Atelier fitting and quality check"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
                <img
                  src="https://images.unsplash.com/photo-1779154137940-a251f8c92b10?w=600&h=800&fit=crop&auto=format"
                  alt="Final styling and presentation"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
              </div>
            </div>
          )
        }
      ]} />

      {/* Services Grid */}
      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16 reveal">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">What We Offer</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Our Services</h2>
          <p className="text-sm text-[#9E9E9E] mt-3 max-w-lg mx-auto">
            Comprehensive fashion solutions tailored for modern style enthusiasts across Sri Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, desc }, idx) => (
            <div
              key={title}
              className={`border border-[#E8E4DF] p-8 rounded-sm bg-white hover:border-[#C4922A] hover:shadow-lg transition-all reveal ${
                idx % 2 === 0 ? '' : 'delay-100'
              }`}
            >
              <div className="w-10 h-10 bg-[#FAFAF8] border border-[#C4922A]/40 flex items-center justify-center text-[#C4922A] mb-5">
                <Icon size={18} />
              </div>
              <h3 className="font-display text-lg font-bold text-[#0A0A0A] mb-2">{title}</h3>
              <p className="text-xs md:text-sm text-[#4A4A4A] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business Details & Boutique Info */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <p className="text-xs text-[#C4922A] tracking-[0.25em] uppercase mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-[#C4922A]" /> Business Details
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                Fashion Gate <em>Boutique</em>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8">
                Specialized in Men's & Women's Fashion & Lifestyle. We are committed to serving you with high-touch personal customer care both online and in-store.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 border border-[#C4922A] flex items-center justify-center shrink-0 text-[#C4922A]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#C4922A] font-semibold">Location</p>
                    <p className="text-sm text-white/90">459A 1/1, Thalawathugoda Road, Madiwela, Kotte, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 border border-[#C4922A] flex items-center justify-center shrink-0 text-[#C4922A]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#C4922A] font-semibold">Contact Number</p>
                    <a href="tel:+94707739962" className="text-sm text-white/90 hover:text-[#C4922A] transition-colors">+94 70 773 9962</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 border border-[#C4922A] flex items-center justify-center shrink-0 text-[#C4922A]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#C4922A] font-semibold">Email Address</p>
                    <a href="mailto:fashiongate777@gmail.com" className="text-sm text-white/90 hover:text-[#C4922A] transition-colors">fashiongate777@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual card */}
            <div className="border border-white/15 p-8 bg-white/5 backdrop-blur-sm rounded-sm reveal-right">
              <h3 className="font-display text-2xl font-bold text-white mb-4">Specialization</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Men's & Women's Fashion & Lifestyle — blending everyday essentials with standout statement wear.
              </p>
              <div className="space-y-3 border-t border-white/10 pt-6">
                {[
                  'Contemporary Men’s & Women’s Collections',
                  'Islandwide Doorstep Delivery across Sri Lanka',
                  'Exceptional Customer Care & Personalized Sizing Support',
                  'Curated Elegance, Comfort & Modern Trends'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[#C4922A] shrink-0" />
                    <span className="text-xs md:text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center border-t border-[#E8E4DF]">
        <div className="max-w-xl mx-auto px-6 reveal">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-4">Fashion Gate – Elevate Your Style</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-6">
            Enter the Gate
          </h2>
          <p className="text-[#4A4A4A] mb-10 text-sm md:text-base">Explore our curated collections and find the pieces that express your confidence with grace.</p>
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
