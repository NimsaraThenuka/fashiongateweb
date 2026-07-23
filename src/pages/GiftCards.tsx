import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Gift, Sparkles, Send } from 'lucide-react';

const AMOUNTS = [2000, 5000, 10000, 25000];

export default function GiftCards() {
  useReveal();
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail || !senderName) return;

    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Share Elegance</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">E-Gift Cards</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Give the gift of choice. Our E-Gift Cards are delivered instantly to the recipient via email and can be redeemed online or in-store.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start reveal">
          {/* Card Mockup Preview */}
          <div className="sticky top-32">
            <div className="w-full aspect-[1.58/1] bg-gradient-to-br from-[#0A0A0A] to-[#2D2D2D] p-8 text-white rounded-md border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              {/* Logo / Header */}
              <div className="flex justify-between items-start">
                <span className="font-display text-xl font-bold tracking-widest text-[#C4922A]">FASHION GATE</span>
                <Gift size={20} className="text-[#C4922A]" />
              </div>

              {/* Value display */}
              <div className="my-6">
                <p className="text-[10px] text-white/40 tracking-wider uppercase mb-1">Gift Card Value</p>
                <p className="font-display text-4xl font-bold text-white">Rs. {selectedAmount.toLocaleString()}</p>
              </div>

              {/* Card Details */}
              <div className="flex justify-between items-end border-t border-white/10 pt-4 text-left">
                <div>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest">For</p>
                  <p className="text-xs font-semibold tracking-wide text-white truncate max-w-[150px]">{recipientName || 'Recipient Name'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest">From</p>
                  <p className="text-xs font-semibold tracking-wide text-white truncate max-w-[150px]">{senderName || 'Sender Name'}</p>
                </div>
              </div>

              {/* Shimmer element */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-marquee" style={{ animationDuration: '4s' }} />
            </div>
          </div>

          {/* Form Controls */}
          <div>
            {sent ? (
              <div className="border border-[#E8E4DF] p-8 rounded-sm bg-[#FAFAF8] text-center">
                <div className="w-12 h-12 bg-[#C4922A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0A0A0A] mb-3">Gift Card Prepared</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">
                  We have generated your E-Gift Card code and scheduled email delivery to <strong>{recipientEmail}</strong>.
                </p>
                <button onClick={() => setSent(false)} className="btn-gold">
                  Create Another Card
                </button>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="flex flex-col gap-6">
                {/* Select Amount */}
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0A0A0A] mb-3">Select Gift Amount (LKR)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {AMOUNTS.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedAmount(amt)}
                        className={`py-3 text-xs tracking-wider border transition-all font-semibold ${
                          selectedAmount === amt
                            ? 'border-[#C4922A] bg-[#C4922A] text-white'
                            : 'border-[#E8E4DF] hover:border-[#C4922A] text-[#4A4A4A]'
                        }`}
                      >
                        {amt / 1000}K
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender/Recipient details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-2">Recipient Name *</label>
                    <input
                      required
                      type="text"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      placeholder="Their full name"
                      className="w-full border border-[#E8E4DF] px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-2">Recipient Email *</label>
                    <input
                      required
                      type="email"
                      value={recipientEmail}
                      onChange={e => setRecipientEmail(e.target.value)}
                      placeholder="their@email.com"
                      className="w-full border border-[#E8E4DF] px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-2">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-[#E8E4DF] px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-2">Personal Message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write a warm note..."
                    rows={4}
                    className="w-full border border-[#E8E4DF] px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : <><Send size={14} /> Send Gift Card</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
