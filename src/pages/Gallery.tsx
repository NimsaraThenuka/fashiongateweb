import { useState, useMemo } from 'react';
import { useReveal } from '../hooks/useReveal';
import { X, Eye, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { GalleryItem } from '../data/gallery';

const BASE_FILTERS = [
  { id: 'all', label: 'All Looks' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'craft', label: 'Artisan & Craft' },
  { id: 'resortwear', label: 'Resortwear' }
];

export default function Gallery() {
  useReveal();
  const { galleryItems } = useGallery();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Compute all available filter categories including any custom tags added by admin
  const filters = useMemo(() => {
    const defaultTagIds = new Set(BASE_FILTERS.map(f => f.id));
    const extraTags = new Set<string>();

    galleryItems.forEach(item => {
      if (item.tag && !defaultTagIds.has(item.tag)) {
        extraTags.add(item.tag);
      }
    });

    const extraFilterObjects = Array.from(extraTags).map(tag => ({
      id: tag,
      label: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/[-_]/g, ' ')
    }));

    return [...BASE_FILTERS, ...extraFilterObjects];
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return galleryItems;
    return galleryItems.filter(item => item.tag === activeFilter);
  }, [activeFilter, galleryItems]);

  return (
    <div className="min-h-screen bg-white pt-32 md:pt-40 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-14 reveal text-center">
          <p className="text-xs text-[#C4922A] tracking-[0.2em] uppercase mb-3 font-semibold">Visual Journal</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0A0A0A]">Editorial Gallery</h1>
          <p className="text-sm text-[#707070] mt-4 max-w-lg mx-auto leading-relaxed">
            A celebration of traditional craftsmanship, natural textiles, and tropical style campaigns designed on the island.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12 reveal">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-6 py-2.5 text-[10px] tracking-[0.15em] uppercase font-semibold border transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'border-[#C4922A] bg-[#C4922A] text-white shadow-sm'
                  : 'border-[#E8E4DF] text-[#4A4A4A] hover:border-[#C4922A] hover:text-[#C4922A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry-Style Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#E8E4DF] rounded-sm p-10 max-w-md mx-auto">
            <ImageIcon className="mx-auto text-stone-300 mb-3" size={40} />
            <h3 className="font-display text-xl font-bold text-[#0A0A0A] mb-1">No Photos in This Category</h3>
            <p className="text-xs text-[#888] mb-4">Try selecting another filter or check back soon for new campaign releases.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="btn-gold py-2 px-5 text-[11px] uppercase tracking-wider font-semibold"
            >
              View All Looks
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className={`break-inside-avoid relative overflow-hidden group border border-[#E8E4DF] cursor-pointer rounded-sm ${item.aspect || 'aspect-[3/4]'} reveal shadow-xs hover:shadow-md transition-shadow`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="self-end w-8 h-8 bg-white flex items-center justify-center rounded-full text-[#0A0A0A] hover:bg-[#C4922A] hover:text-white transition-colors shadow-sm">
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
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-[100] bg-black/96 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto animate-scale-in">
          <div className="max-w-[900px] w-full bg-[#0A0A0A] border border-white/10 rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 my-8 md:my-0 relative shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/75 hover:bg-black/95 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg hover:rotate-90 duration-200"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Image panel */}
            <div className="h-[280px] sm:h-[350px] md:h-[600px] overflow-hidden relative bg-[#070707] flex items-center justify-center">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details panel */}
            <div className="p-6 md:p-10 flex flex-col justify-between text-white bg-[#0A0A0A]">
              <div>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="text-[10px] text-[#C4922A] tracking-[0.25em] uppercase font-bold">
                    {lightboxItem.subtitle}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-[9px] uppercase tracking-wider text-stone-300 font-mono rounded-xs">
                    {lightboxItem.tag}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                  {lightboxItem.title}
                </h2>
                <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-light">
                  {lightboxItem.description ||
                    'Captured on location in Sri Lanka. Highlighting our slow-fashion ethos where natural fabrics like linen and traditional handloom cotton are tailored with modern silhouettes.'}
                </p>
              </div>
              <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                <Link
                  to="/shop"
                  onClick={() => setLightboxItem(null)}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3 text-xs tracking-wider uppercase font-bold"
                >
                  Shop the Collection <ArrowRight size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="w-full py-2.5 text-center text-white/50 hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
