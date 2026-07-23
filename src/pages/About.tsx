import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { Timeline } from '../components/Timeline';

const VALUES = [
  { icon: '◈', title: 'Craftsmanship', desc: 'Every piece we carry meets our rigorous standards of construction, material quality, and artisanal integrity.' },
  { icon: '✦', title: 'Sustainability', desc: 'We champion designers committed to ethical production, responsible sourcing, and a reduced environmental footprint.' },
  { icon: '❋', title: 'Inclusivity', desc: 'Fashion is for every body. Our curations span a full range of sizes and celebrate diverse expressions of personal style.' },
  { icon: '◇', title: 'Heritage', desc: 'We honour tradition while embracing innovation — supporting established houses and emerging designers alike.' },
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-24">
          <div className="max-w-xl reveal">
            <p className="text-xs text-[#E8B84B] tracking-[0.25em] uppercase mb-5 flex items-center gap-3">
              <span className="w-8 h-px bg-[#C4922A]" /> Our Story
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Where Style<br />Meets <em>Soul</em>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Fashion Gate was founded on the belief that great style is a form of self-expression — and that everyone deserves access to truly exceptional clothing.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal text-center md:text-left flex flex-col items-center md:items-start">
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-4 flex items-center justify-center md:justify-start gap-3">
              <span className="w-8 h-px bg-[#C4922A]" /> Founded 2018, Colombo
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mb-6">
              The Gate Opens <span className="hidden md:inline"><br /></span>to <em>Island Luxury</em>
            </h2>
            <p className="text-[#4A4A4A] leading-relaxed mb-4 text-center md:text-left">
              Fashion Gate began as a small design studio in Colombo, Sri Lanka — showcasing a carefully curated selection of pieces that blended traditional Sri Lankan handloom weaving and batik dye crafts with contemporary fashion silhouettes. Our founder, believed that garments should not only capture tropical beauty but carry the stories of the artisans who made them.
            </p>
            <p className="text-[#4A4A4A] leading-relaxed mb-8 text-center md:text-left">
              Today, we serve customers nationwide and design conscious collections in collaboration with craft clusters across the island, staying true to our core principles of local heritage, slow fashion, and uncompromising quality.
            </p>
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-[#E8E4DF] w-full">
              {[
                { val: '2018', label: 'Founded' },
                { val: '120+', label: 'Artisans' },
                { val: '100%', label: 'Conscious' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold text-[#C4922A]">{val}</p>
                  <p className="text-[10px] md:text-xs text-[#9E9E9E] tracking-[0.1em] uppercase mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative reveal delay-200">
            <div
              className="aspect-[4/5]"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop&auto=format)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute -bottom-6 -left-6 bg-[#0A0A0A] p-6 text-white hidden md:block">
              <p className="text-xs tracking-[0.15em] uppercase text-[#C4922A] mb-1">Est.</p>
              <p className="font-display text-5xl font-bold">2018</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16 reveal">
            <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">What Guides Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {VALUES.map(({ icon, title, desc }, i) => (
              <div key={title} className={`reveal ${i === 0 ? '' : i === 1 ? 'delay-100' : i === 2 ? 'delay-200' : 'delay-300'}`}>
                <span className="text-3xl text-[#C4922A] block mb-4">{icon}</span>
                <h3 className="font-display text-xl font-bold text-[#0A0A0A] mb-3">{title}</h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <Timeline data={[
        {
          title: "Sourcing",
          content: (
            <div className="flex flex-col gap-6">
              <p className="text-white/70 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                We source raw, organic cotton, local bamboo fibers, and premium Irish linen. We partner directly with independent farming collectives across the island to ensure ethical harvesting.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <img
                  src="https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=600&h=800&fit=crop&auto=format"
                  alt="Organic raw material sourcing"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=800&fit=crop&auto=format"
                  alt="Artisan loom prep"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
              </div>
            </div>
          )
        },
        {
          title: "Weaving & Dyeing",
          content: (
            <div className="flex flex-col gap-6">
              <p className="text-white/70 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                Rural weaving clusters translate fibers into textiles on hand-operated wooden looms. Our batik pieces undergo a meticulous resist-dyeing process where hot liquid wax is hand-painted before deep cold-dye immersion.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <img
                  src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=800&fit=crop&auto=format"
                  alt="Traditional handloom weaving"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
                <img
                  src="https://images.unsplash.com/photo-1705909237050-7a7625b47fac?w=600&h=800&fit=crop&auto=format"
                  alt="Batik hand-painting"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
              </div>
            </div>
          )
        },
        {
          title: "Stitching & Atelier",
          content: (
            <div className="flex flex-col gap-6">
              <p className="text-white/70 text-sm md:text-base font-normal max-w-xl leading-relaxed">
                The fabrics are gathered in our Colombo design studio. Pattern-makers and master tailors structure, cut, and sew every blazer, dress, and shirt. Gold-embellished thread details and natural wood buttons are hand-assembled.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <img
                  src="https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&h=800&fit=crop&auto=format"
                  alt="Precision bespoke cutting"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
                <img
                  src="https://images.unsplash.com/photo-1779154137940-a251f8c92b10?w=600&h=800&fit=crop&auto=format"
                  alt="Atelier final assembly"
                  className="h-28 w-full rounded-xs object-cover shadow-[0_0_24px_rgba(196,146,42,0.15)] md:h-48 lg:h-60"
                />
              </div>
            </div>
          )
        }
      ]} />

      {/* MESSAGE FROM CEO */}
      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          {/* Portrait Image with Gold Accents */}
          <div className="col-span-1 md:col-span-5 max-w-[280px] sm:max-w-sm mx-auto md:max-w-none w-full relative group reveal mb-10 md:mb-0">
            <div className="absolute inset-3 md:inset-4 border border-[#C4922A] translate-x-1.5 translate-y-1.5 md:translate-x-2 md:translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 rounded-sm pointer-events-none" />
            <div className="relative aspect-[3/4] bg-[#F2F0ED] overflow-hidden rounded-sm shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop&auto=format"
                alt="CEO Portrait"
                className="w-full h-full object-cover grayscale contrast-[1.05] transition-transform duration-[3000ms] group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent" />
            </div>
            {/* Embedded Badge */}
            <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-[#C4922A] px-4 py-3 md:px-6 md:py-4 text-white shadow-lg rounded-sm">
              <p className="font-display text-base md:text-xl font-bold tracking-widest">VISION</p>
              <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/80">Est. 2018</p>
            </div>
          </div>

          {/* Letter / Quote Content */}
          <div className="col-span-1 md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left reveal-right">
            <p className="text-xs text-[#C4922A] tracking-[0.25em] uppercase mb-4 flex items-center justify-center md:justify-start gap-3">
              <span className="w-8 h-px bg-[#C4922A]" /> A Personal Note
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#0A0A0A] leading-tight mb-8">
              Letter from <em>the CEO</em>
            </h2>
            
            {/* Large quotation block */}
            <div className="relative mb-6">
              <span className="absolute -top-8 -left-4 font-display text-8xl text-[#C4922A]/10 select-none pointer-events-none">“</span>
              <p className="font-display text-lg md:text-xl italic text-[#4A4A4A] leading-relaxed relative z-10">
                At Fashion Gate, our mission has always transcended simply offering garments. We believe that what you wear is a reflection of your soul, your values, and your story.
              </p>
            </div>
            
            <p className="text-[#666666] text-sm md:text-base leading-relaxed mb-6">
              We set out to bridge the gap between traditional Sri Lankan craftsmanship and contemporary global luxury—creating a gateway where slow fashion, artisan empowerment, and high-end design coexist.
            </p>
            <p className="text-[#666666] text-sm md:text-base leading-relaxed mb-8">
              We collaborate directly with rural clusters of handloom weavers, batik dyers, and brass smiths across the island. Every thread you wear carries the story, the warmth, and the pride of their heritage. Thank you for stepping into our gate and carrying their legacy forward.
            </p>

            {/* Signature Block */}
            <div className="border-t border-[#E8E4DF] pt-6 w-full max-w-[200px]">
              <p className="font-display text-lg italic text-[#0A0A0A] font-semibold">Founder &amp; CEO</p>
              <p className="text-[10px] text-[#C4922A] tracking-[0.15em] uppercase mt-1">Fashion Gate Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0A0A0A] text-center">
        <div className="max-w-xl mx-auto px-6 reveal">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-4">Ready to begin?</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Enter the Gate
          </h2>
          <p className="text-white/60 mb-10">Explore our curated collections and find the pieces that tell your story.</p>
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
