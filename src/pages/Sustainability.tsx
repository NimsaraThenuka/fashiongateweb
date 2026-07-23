import { useReveal } from '../hooks/useReveal';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sustainability() {
  useReveal();

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Conscious Fashion</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Sustainability</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Supporting Sri Lankan heritage, slow fashion design values, and organic fabrics.
          </p>
        </div>

        {/* Hero image style editorial section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16 reveal">
          <div
            className="aspect-[4/5] bg-cover bg-center rounded-sm border border-[#E8E4DF]"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=1000&fit=crop&auto=format)`
            }}
          />
          <div>
            <h2 className="font-display text-3xl font-bold text-[#0A0A0A] mb-4">Empowering Local Weavers</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">
              Fashion Gate is deeply committed to keeping Sri Lanka’s traditional weaving crafts alive. We partner directly with artisan weavers in village clusters across Gampaha, Kurunegala, and Batticaloa.
            </p>
            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">
              By working with us, these communities receive fair wages, reliable work schedules, and a platform to exhibit their incredible handcrafted patterns to a wider audience. Slow fashion is about preserving history and livelihoods.
            </p>
            <div className="border-t border-[#E8E4DF] pt-6 grid grid-cols-2 gap-4">
              <div>
                <span className="font-display text-3xl font-bold text-[#C4922A]">120+</span>
                <p className="text-xs text-[#9E9E9E] uppercase tracking-wider mt-1">Artisan Families Supported</p>
              </div>
              <div>
                <span className="font-display text-3xl font-bold text-[#C4922A]">100%</span>
                <p className="text-xs text-[#9E9E9E] uppercase tracking-wider mt-1">Hand-dyed Batik Yarn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Materials section */}
        <div className="bg-[#FAFAF8] p-8 border border-[#E8E4DF] rounded-sm mb-16 reveal">
          <h3 className="font-display text-xl font-bold text-[#0A0A0A] mb-6 text-center">Conscious Materials</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Organic Linen', desc: 'Sourced from organic flax plantations. Natural, highly breathable, and completely biodegradable.' },
              { title: 'Pure Cotton Handloom', desc: 'Handloom fabrics utilize manually operated wooden looms, consuming zero carbon and electricity.' },
              { title: 'Zero Waste Batik', desc: 'Dyes are carefully managed in closed-loop systems to protect natural water resources and local wetlands.' }
            ].map((material, idx) => (
              <div key={idx} className="bg-white p-6 border border-[#E8E4DF] rounded-sm">
                <h4 className="font-semibold text-sm text-[#0A0A0A] mb-2">{material.title}</h4>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">{material.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center reveal">
          <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
            Explore Conscious Collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
