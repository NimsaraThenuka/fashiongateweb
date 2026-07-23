import { useReveal } from '../hooks/useReveal';

export default function SizeGuide() {
  useReveal();

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">
        <div className="mb-12 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Fit Guide</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Size Guide</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            Find your perfect fit. Our garments are designed with relaxed, breathable silhouettes to suit the tropical climate.
          </p>
        </div>

        {/* Women Table */}
        <div className="mb-16 reveal">
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E8E4DF] pb-3">Women's Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E8E4DF] text-xs tracking-[0.15em] uppercase text-[#9E9E9E] font-semibold">
                  <th className="py-4 pr-4">Size</th>
                  <th className="py-4 px-4">Bust (inches)</th>
                  <th className="py-4 px-4">Waist (inches)</th>
                  <th className="py-4 px-4">Hips (inches)</th>
                  <th className="py-4 pl-4 text-right">LKR Numeric Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]/60 text-[#4A4A4A]">
                {[
                  { size: 'XS', bust: '31 - 33', waist: '24 - 26', hips: '34 - 36', numeric: 'UK 6' },
                  { size: 'S', bust: '33 - 35', waist: '26 - 28', hips: '36 - 38', numeric: 'UK 8 - 10' },
                  { size: 'M', bust: '35 - 37', waist: '28 - 30', hips: '38 - 40', numeric: 'UK 12' },
                  { size: 'L', bust: '37 - 39', waist: '30 - 32', hips: '40 - 42', numeric: 'UK 14 - 16' },
                  { size: 'XL', bust: '39 - 42', waist: '32 - 35', hips: '42 - 45', numeric: 'UK 18' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-4 pr-4 font-semibold text-[#0A0A0A]">{row.size}</td>
                    <td className="py-4 px-4">{row.bust}</td>
                    <td className="py-4 px-4">{row.waist}</td>
                    <td className="py-4 px-4">{row.hips}</td>
                    <td className="py-4 pl-4 text-right font-medium text-[#C4922A]">{row.numeric}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Men Table */}
        <div className="reveal">
          <h2 className="font-display text-2xl font-bold text-[#0A0A0A] mb-6 border-b border-[#E8E4DF] pb-3">Men's Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E8E4DF] text-xs tracking-[0.15em] uppercase text-[#9E9E9E] font-semibold">
                  <th className="py-4 pr-4">Size</th>
                  <th className="py-4 px-4">Chest (inches)</th>
                  <th className="py-4 px-4">Waist (inches)</th>
                  <th className="py-4 px-4">Collar (inches)</th>
                  <th className="py-4 pl-4 text-right">Standard Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]/60 text-[#4A4A4A]">
                {[
                  { size: 'S', chest: '35 - 37', waist: '28 - 30', collar: '14 - 14.5', fit: 'Slim / Regular' },
                  { size: 'M', chest: '38 - 40', waist: '31 - 33', collar: '15 - 15.5', fit: 'Regular' },
                  { size: 'L', chest: '41 - 43', waist: '34 - 36', collar: '16 - 16.5', fit: 'Regular / Relaxed' },
                  { size: 'XL', chest: '44 - 46', waist: '37 - 39', collar: '17 - 17.5', fit: 'Relaxed' },
                  { size: 'XXL', chest: '47 - 49', waist: '40 - 42', collar: '18 - 18.5', fit: 'Relaxed Oversized' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="py-4 pr-4 font-semibold text-[#0A0A0A]">{row.size}</td>
                    <td className="py-4 px-4">{row.chest}</td>
                    <td className="py-4 px-4">{row.waist}</td>
                    <td className="py-4 px-4">{row.collar}</td>
                    <td className="py-4 pl-4 text-right font-medium text-[#C4922A]">{row.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
