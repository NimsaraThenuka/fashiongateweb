import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Search, Package, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function OrderTracking() {
  useReveal();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;

    setLoading(true);
    setTimeout(() => {
      setTrackingData({
        id: orderId,
        status: 'with-courier',
        estimated: 'Tomorrow, by 6:00 PM',
        steps: [
          { title: 'Order Placed', desc: 'We have received your order details', time: 'July 22, 10:15 AM', done: true },
          { title: 'Processing & Packaging', desc: 'Packed carefully at our Kotte boutique', time: 'July 22, 2:30 PM', done: true },
          { title: 'With Courier Partner', desc: 'Dispatched via Prompt Express', time: 'July 23, 9:00 AM', done: true },
          { title: 'Out for Delivery', desc: 'Courier agent is arriving shortly', time: 'Pending', done: false },
        ]
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Courier Status</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Order Tracking</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Enter your Order ID (found in your SMS receipt or email) and email address to view real-time shipping updates.
          </p>
        </div>

        {/* Input Form */}
        <div className="border border-[#E8E4DF] p-8 rounded-sm bg-[#FAFAF8] mb-12 reveal">
          <form onSubmit={handleTrack} className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-2">Order ID *</label>
              <input
                required
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. FG-9962"
                className="w-full border border-[#E8E4DF] px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-2">Email Address *</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-[#E8E4DF] px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold h-[46px] flex items-center justify-center gap-2 px-6"
            >
              {loading ? 'Searching...' : <><Search size={14} /> Track Order</>}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="border border-[#E8E4DF] p-8 rounded-sm reveal animate-scale-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E8E4DF] pb-6 mb-8 gap-4">
              <div>
                <p className="text-[10px] text-[#9E9E9E] tracking-[0.1em] uppercase mb-1">Status of Order {trackingData.id}</p>
                <h3 className="font-display text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
                  <Package size={20} className="text-[#C4922A]" /> In Transit
                </h3>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] text-[#9E9E9E] tracking-[0.1em] uppercase mb-1">Estimated Delivery</p>
                <p className="font-semibold text-[#C4922A] text-sm flex items-center gap-1.5 md:justify-end">
                  <Clock size={13} /> {trackingData.estimated}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 border-l-2 border-[#E8E4DF] ml-3 space-y-8">
              {trackingData.steps.map((step: any, idx: number) => (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span className={`absolute -left-[33px] top-0.5 w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center ${step.done ? 'bg-[#C4922A]' : 'bg-[#E8E4DF]'}`}>
                    {step.done && <CheckCircle size={8} className="text-white fill-white" />}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h4 className={`text-sm font-semibold ${step.done ? 'text-[#0A0A0A]' : 'text-[#9E9E9E]'}`}>{step.title}</h4>
                      <span className="text-[10px] text-[#9E9E9E]">{step.time}</span>
                    </div>
                    <p className="text-xs text-[#4A4A4A]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
