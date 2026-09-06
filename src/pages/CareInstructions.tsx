import { useReveal } from '../hooks/useReveal';
import { Info } from 'lucide-react';

export default function CareInstructions() {
  useReveal();

  const INSTRUCTIONS = [
    {
      fabric: 'Handloom Cotton & Silk',
      icon: '❁',
      tips: [
        'Dry clean recommended to maintain color and gold thread integrity.',
        'If hand washing, use cold water and extremely mild detergent.',
        'Never wring or twist. Roll in a clean towel to absorb excess water.',
        'Dry flat in shade, avoiding direct tropical sunlight.'
      ]
    },
    {
      fabric: 'Pure Indigo & Block Batik',
      icon: '✦',
      tips: [
        'Wash separately during the first few washes as natural dyes may bleed.',
        'Wash inside out in cold water on a delicate cycle.',
        'Dry on a hanger away from direct sun to prevent indigo fading.',
        'Iron inside out on cotton settings.'
      ]
    },
    {
      fabric: 'Premium Linen Resortwear',
      icon: '◈',
      tips: [
        'Machine wash in cold or lukewarm water with matching colors.',
        'Do not bleach. Hang to dry naturally.',
        'Linen wrinkles naturally (it is part of its charm). Iron slightly damp for crispness.',
        'Store in a cool, dry place to prevent moisture issues.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Garment Care</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Care Instructions</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Our pieces are handcrafted using delicate local materials. Treat them with care to preserve their shape and colors for years.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 reveal">
          {INSTRUCTIONS.map((item, idx) => (
            <div key={idx} className="border border-[#E8E4DF] p-8 rounded-sm bg-white hover:border-[#C4922A] transition-all">
              <span className="text-[#C4922A] text-2xl block mb-4">{item.icon}</span>
              <h3 className="font-display text-lg font-bold text-[#0A0A0A] mb-4">{item.fabric}</h3>
              <ul className="space-y-3 text-xs text-[#4A4A4A] list-disc list-inside leading-relaxed pl-1">
                {item.tips.map((tip, tIdx) => (
                  <li key={tIdx}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pro tip banner */}
        <div className="bg-[#FAFAF8] p-8 border border-[#E8E4DF] rounded-sm reveal flex gap-4">
          <Info size={20} className="text-[#C4922A] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-[#0A0A0A] mb-1">Quick Storage Tip</h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Always store your premium silk sarees and handloom sarongs in cotton garment bags instead of plastic covers. Natural fibers need to breathe to avoid fabric degradation over time in high-humidity climates like Sri Lanka.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
