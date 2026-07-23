import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  useReveal();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const FAQS = [
    {
      q: 'Where is your boutique located in Sri Lanka?',
      a: 'Our physical store is located at 459A 1/1, Thalawathugoda Rd, Madiwela, Kotte. We welcome you to visit us and experience our products firsthand, touch the fabrics, and receive personalized fittings.'
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept all major Visa and Mastercard payments online. For local deliveries, we also support Cash on Delivery (COD) and direct Bank Transfers.'
    },
    {
      q: 'Can I exchange an item if it doesn’t fit?',
      a: 'Yes, absolutely. You can exchange any purchase within 14 days of delivery. Items must be unworn, undamaged, and still have all tags attached. Please visit our store or contact us to organize courier pickup.'
    },
    {
      q: 'How long does shipping take?',
      a: 'Orders within Colombo are delivered within 1 to 2 business days. Outstation shipments to other districts usually take 2 to 4 business days. We partner with Prompt Express and other reliable local courier services.'
    },
    {
      q: 'Do you offer international shipping?',
      a: 'Currently, we focus on delivering across Sri Lanka. If you are located overseas and wish to place an order, please email us directly at fashiongate777@gmail.com and we will evaluate shipping availability on a custom basis.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Questions & Answers</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Frequently Asked Questions</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Got questions? We have answers. Find general details about orders, boutique visits, and local courier shipping.
          </p>
        </div>

        {/* Accordions */}
        <div className="border-t border-[#E8E4DF] reveal">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border-b border-[#E8E4DF]">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between py-5 text-left text-[#0A0A0A] hover:text-[#C4922A] transition-colors focus:outline-none"
              >
                <span className="font-display text-base font-semibold pr-4">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-[#C4922A] transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIdx === idx ? 'max-h-[200px] pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
