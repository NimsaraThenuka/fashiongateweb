import { useSearchParams } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function Legal() {
  useReveal();
  const [searchParams] = useSearchParams();
  const doc = searchParams.get('doc') || 'privacy';

  const getContent = () => {
    switch (doc) {
      case 'terms':
        return {
          title: 'Terms of Service',
          intro: 'Welcome to Fashion Gate. By accessing or using our website and purchasing our products, you agree to comply with the following Terms of Service.',
          sections: [
            { title: '1. Use of Website', body: 'All content on this site is the property of Fashion Gate. You may not reproduce, duplicate, copy, sell, or exploit any portion of our designs without express written consent.' },
            { title: '2. Pricing & Currency', body: 'All transactions are charged in Sri Lankan Rupees (LKR). While we strive to display prices accurately, errors may occur. In the event of a pricing error, we reserve the right to cancel affected orders.' },
            { title: '3. Product Variations', body: 'Due to the handmade nature of traditional Sri Lankan batik and handloom clothes, minor variations in colors, alignment, and weave structures may occur. These are not defects but markers of authentic artistry.' }
          ]
        };
      case 'cookie':
        return {
          title: 'Cookie Policy',
          intro: 'This Cookie Policy explains how Fashion Gate uses cookies and similar tracking technologies to customize and improve your online browsing experience.',
          sections: [
            { title: '1. What are Cookies?', body: 'Cookies are small text files stored on your browser to help us remember your cart items, wishlisted products, and user preferences.' },
            { title: '2. Types of Cookies We Use', body: 'We use essential cookies to manage your active cart and secure checkout, and analytics cookies to study website traffic and customer behaviour.' },
            { title: '3. Your Choice', body: 'You can disable cookies via your browser settings. Note that disabling cookies may prevent you from adding items to your bag or checking out successfully.' }
          ]
        };
      case 'privacy':
      default:
        return {
          title: 'Privacy Policy',
          intro: 'At Fashion Gate, we respect your privacy and are committed to protecting the personal data you share with us.',
          sections: [
            { title: '1. Information We Collect', body: 'We collect details such as your name, delivery address, phone number, and email address to process orders and courier packages.' },
            { title: '2. Data Security', body: 'We use secure payment gateways (Visa, Mastercard protocols) to ensure your transactional details are encrypted. We never store credit card numbers on our servers.' },
            { title: '3. Shared Information', body: 'We only share delivery details with our verified local courier partners (e.g. Prompt Express) to complete order shipments.' }
          ]
        };
    }
  };

  const data = getContent();

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Legal Documentation</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">{data.title}</h1>
          <p className="text-sm text-[#4A4A4A] mt-6 leading-relaxed border-l-2 border-[#C4922A] pl-4 italic">
            {data.intro}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 reveal">
          {data.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="font-display text-xl font-semibold text-[#0A0A0A] mb-3">{section.title}</h3>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
