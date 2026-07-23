import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  });

  // Use percentage for height transition instead of dynamic pixel values
  const heightTransform = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-[#0A0A0A] font-sans md:px-10 text-white py-16 md:py-24"
      ref={containerRef}
    >
      <div className="max-w-[1400px] mx-auto px-6 mb-16 md:mb-24">
        <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3 flex items-center gap-3">
          <span className="w-8 h-px bg-[#C4922A]" /> How We Create
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white max-w-lg leading-tight">
          Our Craft &amp;<br /><em>Production Process</em>
        </h2>
        <p className="text-white/60 text-sm md:text-base mt-4 max-w-md">
          A look inside our slow-fashion journey — from sourcing natural threads to handcrafted finishing details.
        </p>
      </div>

      {/* Contain relative positioning to the items list only and use bottom spacing */}
      <div className="relative max-w-[1400px] mx-auto pb-16 md:pb-24">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row pt-10 md:pt-40 md:gap-10 relative"
          >
            {/* Title / Header Column */}
            <div className="sticky flex flex-col md:flex-row z-45 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Dot */}
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black border border-[#C4922A] flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-[#C4922A] shadow-[0_0_10px_rgba(196,146,42,0.8)]" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-[#C4922A] font-display uppercase tracking-widest">
                {item.title}
              </h3>
            </div>

            {/* Mobile Title View */}
            <div className="relative pl-20 pr-4 md:hidden mb-4">
              <h3 className="text-2xl text-left font-bold text-[#C4922A] font-display uppercase tracking-wider">
                {item.title}
              </h3>
            </div>

            {/* Content Column */}
            <div className="relative pl-20 pr-6 md:pl-4 w-full md:w-[70%]">
              {item.content}{" "}
            </div>
          </div>
        ))}

        {/* Glow Line Emitter Progress Bar - anchored with top-0 and bottom-0 inside parent to prevent bleeding */}
        <div
          className="absolute md:left-8 left-8 top-0 bottom-0 overflow-hidden w-[2px] bg-white/10 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#E8B84B] via-[#C4922A] to-transparent from-0% via-50% rounded-full shadow-[0_0_12px_rgba(196,146,42,0.8)]"
          />
        </div>
      </div>
    </div>
  );
};
