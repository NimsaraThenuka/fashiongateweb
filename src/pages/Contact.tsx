import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, Check } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

export default function Contact() {
  useReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  const SUBJECTS = ['General Enquiry', 'Order Support', 'Returns & Exchanges', 'Styling Advice', 'Press & Partnerships', 'Other'];

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Header */}
      <section
        className="relative py-20 md:py-28 flex items-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=600&fit=crop&auto=format)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-[#0A0A0A]/75" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 reveal">
          <p className="text-xs text-[#E8B84B] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C4922A]" /> We'd Love to Hear From You
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white">Get in Touch</h1>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-[1fr_1.5fr] gap-16">
        {/* Info */}
        <div className="reveal">
          <h2 className="font-display text-3xl font-bold text-[#0A0A0A] mb-8">Let's Connect</h2>
          <p className="text-[#4A4A4A] leading-relaxed mb-10">
            Our team of style specialists is here to help — whether you have questions about sizing, need personalised styling advice, or want to discuss a special order.
          </p>

          <div className="flex flex-col gap-6 mb-10">
            {[
              { Icon: MapPin, title: 'Our Boutique', lines: ['459A 1/1, Thalawathugoda Road', 'Madiwela, Kotte, Sri Lanka'] },
              { Icon: Phone, title: 'Telephone', lines: ['+94 70 773 9962'] },
              { Icon: Mail, title: 'Email', lines: ['fashiongate777@gmail.com'] },
              { Icon: Clock, title: 'Opening Hours', lines: ['Mon – Sat: 9:30am – 7:30pm', 'Sun: Closed'] },
            ].map(({ Icon, title, lines }) => (
              <div key={title} className="flex gap-4 group">
                <div className="w-10 h-10 border border-[#C4922A] flex items-center justify-center shrink-0 text-[#C4922A] group-hover:bg-[#C4922A] group-hover:text-white transition-all">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase font-semibold text-[#0A0A0A] mb-1">{title}</p>
                  {lines.map(l => <p key={l} className="text-sm text-[#4A4A4A]">{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div
            className="aspect-[4/3] relative overflow-hidden"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&h=600&fit=crop&auto=format)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-[#0A0A0A]/50 flex items-center justify-center">
              <div className="text-center text-white">
                <MapPin size={24} className="text-[#C4922A] mx-auto mb-2" />
                <p className="text-xs tracking-[0.15em] uppercase">Madiwela, Kotte, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="reveal delay-200">
          {sent ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-[#C4922A] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-ring">
                  <Check size={28} className="text-white" />
                </div>
                <h3 className="font-display text-3xl font-bold text-[#0A0A0A] mb-3">Message Received</h3>
                <p className="text-[#4A4A4A] leading-relaxed">
                  Thank you for reaching out. A member of our team will respond within 24 hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0A0A0A] mb-2">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full border border-[#E8E4DF] px-4 py-3.5 text-sm text-[#0A0A0A] placeholder-[#C4C4C4] outline-none focus:border-[#C4922A] transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0A0A0A] mb-2">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full border border-[#E8E4DF] px-4 py-3.5 text-sm text-[#0A0A0A] placeholder-[#C4C4C4] outline-none focus:border-[#C4922A] transition-colors bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0A0A0A] mb-2">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="w-full border border-[#E8E4DF] px-4 py-3.5 text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] transition-colors bg-transparent appearance-none cursor-pointer"
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0A0A0A] mb-2">Message *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className="w-full border border-[#E8E4DF] px-4 py-3.5 text-sm text-[#0A0A0A] placeholder-[#C4C4C4] outline-none focus:border-[#C4922A] transition-colors bg-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex items-center justify-center gap-2 w-full md:w-auto md:self-start"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>Send Message <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
