import React from 'react';
import { motion } from 'framer-motion';

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative flex min-h-[140px] md:min-h-[180px] flex-col items-center justify-center bg-transparent w-full z-0 ${className}`}
    >
      {/* Rich Golden Glow Aura behind/under the text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Large soft radial glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-[260px] md:w-[680px] h-[140px] md:h-[180px] rounded-full bg-gradient-to-b from-[#C4922A]/25 via-[#E8B84B]/10 to-transparent blur-3xl"
        />

        {/* Ambient secondary glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.1, ease: 'easeOut' }}
          className="absolute w-[180px] md:w-[420px] h-[80px] md:h-[100px] rounded-full bg-[#C4922A]/15 blur-2xl -translate-y-4"
        />
      </div>

      {/* Golden Emitter and Light Beam Projection */}
      <div className="relative flex flex-col items-center w-full z-10">
        {/* Horizontal gold emitter line */}
        <motion.div
          initial={{ width: '0rem' }}
          whileInView={{ width: '22rem' }}
          viewport={{ once: true }}
          transition={{
            duration: 1.1,
            ease: 'easeOut',
          }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#C4922A] to-transparent shadow-[0_0_12px_rgba(196,146,42,0.6)]"
        />

        {/* Soft light beam coming down from emitter line (Ellipse gradient for smooth fadeout) */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: '60px', opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: 'easeOut',
          }}
          className="w-[20rem] bg-[radial-gradient(ellipse_at_top,rgba(196,146,42,0.4),transparent_70%)] blur-[2px] pointer-events-none"
        />
      </div>

      {/* Header text content sits perfectly aligned over the glow */}
      <div className="relative z-20 mt-2 md:mt-3 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
