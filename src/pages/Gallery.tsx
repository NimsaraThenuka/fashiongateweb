import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { X, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GALLERY_ITEMS = [
  {
    id: 1,
    tag: 'campaigns',
    title: 'The Sands of Kotte',
    subtitle: 'Luxe Linen Resortwear 2026',
    image: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 2,
    tag: 'craft',
    title: 'The kurunegala Weavers',
    subtitle: 'Handloom Cotton Looming Process',
    image: 'https://images.unsplash.com/photo-1520004481444-7f4137747754?w=800&h=800&fit=crop&auto=format',
    aspect: 'aspect-square'
  },
  {
    id: 3,
    tag: 'resortwear',
    title: 'Batik Midnight Breeze',
    subtitle: 'Indigo Dye Wrap Dress Campaign',
    image: 'https://images.unsplash.com/photo-1779399147584-6c479647263b?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 4,
    tag: 'campaigns',
    title: 'Mandarin Linen Minimalist',
    subtitle: 'Men\'s Tropical Collection',
    image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=600&fit=crop&auto=format',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 5,
    tag: 'craft',
    title: 'Hand-dyed Indigo skeins',
    subtitle: 'Atelier Batik dye vats',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 6,
    tag: 'resortwear',
    title: 'Seafoam Silk Luxury',
    subtitle: 'Tropical Gown campaign',
    image: 'https://images.unsplash.com/photo-1776262145095-39d46d047537?w=800&h=800&fit=crop&auto=format',
    aspect: 'aspect-square'
  },
  {
    id: 7,
    tag: 'campaigns',
    title: 'Unstructured Summer tailoring',
    subtitle: 'Sand Linen Blazers',
    image: 'https://images.unsplash.com/photo-1779154137940-a251f8c92b10?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 8,
    tag: 'craft',
    title: 'Natural Cane weaving',
    subtitle: 'Handcrafted bags by rural artisans',
    image: 'https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=800&h=600&fit=crop&auto=format',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 9,
    tag: 'resortwear',
    title: 'Island Kurta Elegance',
    subtitle: 'Pastel Linen Collection',
    image: 'https://images.unsplash.com/photo-1776262145093-ab3f69760686?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]'
  }
];

const FILTERS = [
  { id: 'all', label: 'All Looks' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'craft', label: 'Artisan & Craft' },
  { id: 'resortwear', label: 'Resortwear' }
];

export default function Gallery() {
  useReveal();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState<any>(null);

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag === activeFilter);

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="mb-14 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3">Visual Journal</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Editorial Gallery</h1>
          <p className="text-sm text-[#9E9E9E] mt-4 max-w-lg mx-auto">
            A celebration of traditional craftsmanship, natural textiles, and tropical style campaigns designed on the island.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12 reveal">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-6 py-2.5 text-[10px] tracking-[0.15em] uppercase font-semibold border transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'border-[#C4922A] bg-[#C4922A] text-white'
                  : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry-Style Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className={`break-inside-avoid relative overflow-hidden group border border-[#E8E4DF] cursor-pointer rounded-sm ${item.aspect} reveal`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="self-end w-8 h-8 bg-white flex items-center justify-center rounded-full text-[#0A0A0A] hover:bg-[#C4922A] hover:text-white transition-colors">
                  <Eye size={14} />
                </div>
                <div>
                  <p className="text-[9px] text-[#E8B84B] tracking-[0.2em] uppercase font-semibold mb-1">{item.subtitle}</p>
                  <h3 className="font-display text-lg font-bold text-white leading-tight">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-[100] bg-black/96 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto animate-scale-in">
          <div className="max-w-[900px] w-full bg-[#0A0A0A] border border-white/10 rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 my-8 md:my-0 relative">
            
            {/* Close Button: Styled as a solid floating glassmorphism circle for 100% visibility on light/dark backgrounds */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/75 hover:bg-black/95 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Image panel: aspect-video/250px height on mobile to leave plenty of screen space for content details */}
            <div className="h-[250px] md:h-[600px] overflow-hidden relative">
              <img src={lightboxItem.image} alt={lightboxItem.title} className="w-full h-full object-cover" />
            </div>
            
            {/* Details panel */}
            <div className="p-6 md:p-10 flex flex-col justify-between text-white bg-[#0A0A0A]">
              <div>
                <span className="text-[10px] text-[#C4922A] tracking-[0.25em] uppercase font-bold block mb-3 md:mb-4">{lightboxItem.subtitle}</span>
                <h2 className="font-display text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">{lightboxItem.title}</h2>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                  Captured on location in Sri Lanka. Highlighting our slow-fashion ethos where natural fabrics like linen and traditional handloom cotton are tailored with modern silhouettes.
                </p>
              </div>
              <div className="mt-auto">
                <Link
                  to="/shop"
                  onClick={() => setLightboxItem(null)}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3"
                >
                  Shop the Collection <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
