import { useReveal } from '../hooks/useReveal';
import { Truck, RefreshCw, MapPin, Clock } from 'lucide-react';

export default function ShippingReturns() {
  useReveal();

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Delivery & Policy</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Shipping & Returns</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Enjoy reliable domestic shipping across Sri Lanka and worry-free exchange policies.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 reveal">
          <div className="border border-[#E8E4DF] p-8 rounded-sm">
            <div className="w-10 h-10 bg-[#FAFAF8] border border-[#C4922A] flex items-center justify-center text-[#C4922A] mb-6">
              <Truck size={18} />
            </div>
            <h3 className="font-display text-xl font-bold text-[#0A0A0A] mb-4">Domestic Shipping</h3>
            <ul className="space-y-3 text-sm text-[#4A4A4A]">
              <li><strong>Colombo & Suburbs:</strong> Same-day or next-day delivery (Rs. 350, or Free over Rs. 25,000).</li>
              <li><strong>Outstation Districts:</strong> 2 to 4 business days via registered courier (Rs. 500, or Free over Rs. 25,000).</li>
              <li><strong>Tracking:</strong> All orders receive a tracking SMS link as soon as they leave our Kotte boutique.</li>
            </ul>
          </div>

          <div className="border border-[#E8E4DF] p-8 rounded-sm">
            <div className="w-10 h-10 bg-[#FAFAF8] border border-[#C4922A] flex items-center justify-center text-[#C4922A] mb-6">
              <RefreshCw size={18} />
            </div>
            <h3 className="font-display text-xl font-bold text-[#0A0A0A] mb-4">Islandwide Returns</h3>
            <ul className="space-y-3 text-sm text-[#4A4A4A]">
              <li><strong>Exchange Window:</strong> Within 14 days of purchase.</li>
              <li><strong>Condition:</strong> Items must be unworn, unwashed, and have all original designer tags intact.</li>
              <li><strong>How to Return:</strong> Drop off items directly at our Kotte boutique, or ship them back via courier. Return courier fees are covered by the customer unless the product is defective.</li>
            </ul>
          </div>
        </div>

        {/* Store Pickup Section */}
        <div className="bg-[#FAFAF8] p-8 border border-[#E8E4DF] rounded-sm reveal flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-lg font-bold text-[#0A0A0A] mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-[#C4922A]" /> Collect In-Store (Kotte Boutique)
            </h3>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              Skip the delivery queue! Place your order online, choose "Store Pickup" at checkout, and collect it directly from our boutique at 459A 1/1, Thalawathugoda Road, Madiwela, Kotte. Ready in just 2 hours.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9E9E9E] font-semibold tracking-wider uppercase border border-[#E8E4DF] px-4 py-3 bg-white">
            <Clock size={14} className="text-[#C4922A]" /> Ready in 2 Hours
          </div>
        </div>
      </div>
    </div>
  );
}
