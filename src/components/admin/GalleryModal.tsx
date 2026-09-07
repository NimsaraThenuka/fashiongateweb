import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check, AlertCircle, Eye, Ratio } from 'lucide-react';
import { GalleryItem } from '../../data/gallery';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    tag: string;
    title: string;
    subtitle: string;
    image: string;
    aspect: 'aspect-[3/4]' | 'aspect-square' | 'aspect-[4/3]';
    description?: string;
  }) => void;
  item?: GalleryItem | null;
}

const CATEGORY_TAGS = [
  { id: 'campaigns', label: 'Campaigns', desc: 'Editorial shoots & lookbooks' },
  { id: 'craft', label: 'Artisan & Craft', desc: 'Handloom, batik & weaving process' },
  { id: 'resortwear', label: 'Resortwear', desc: 'Island & tropical collections' },
  { id: 'editorial', label: 'Editorial', desc: 'Magazine & high fashion features' },
  { id: 'runway', label: 'Runway', desc: 'Fashion shows & catwalks' },
];

const ASPECT_RATIOS: Array<{
  id: 'aspect-[3/4]' | 'aspect-square' | 'aspect-[4/3]';
  label: string;
  ratioName: string;
  sub: string;
  previewClass: string;
}> = [
  {
    id: 'aspect-[3/4]',
    label: 'Portrait (3:4)',
    ratioName: '3:4',
    sub: 'Best for full-body looks & vertical portraits',
    previewClass: 'aspect-[3/4]'
  },
  {
    id: 'aspect-square',
    label: 'Square (1:1)',
    ratioName: '1:1',
    sub: 'Balanced Instagram-style presentation',
    previewClass: 'aspect-square'
  },
  {
    id: 'aspect-[4/3]',
    label: 'Landscape (4:3)',
    ratioName: '4:3',
    sub: 'Wide campaign stills & atelier artisan shots',
    previewClass: 'aspect-[4/3]'
  },
];

const SAMPLE_GALLERY_IMAGES = [
  {
    label: 'Beach Sunset Resortwear',
    url: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]' as const,
    tag: 'campaigns',
  },
  {
    label: 'Artisan Handloom Looms',
    url: 'https://images.unsplash.com/photo-1520004481444-7f4137747754?w=800&h=800&fit=crop&auto=format',
    aspect: 'aspect-square' as const,
    tag: 'craft',
  },
  {
    label: 'Indigo Dye Vats',
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop&auto=format',
    aspect: 'aspect-[3/4]' as const,
    tag: 'craft',
  },
  {
    label: 'Tropical Linen Minimalist',
    url: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=800&h=600&fit=crop&auto=format',
    aspect: 'aspect-[4/3]' as const,
    tag: 'campaigns',
  },
];

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tag, setTag] = useState('campaigns');
  const [customTag, setCustomTag] = useState('');
  const [aspect, setAspect] = useState<'aspect-[3/4]' | 'aspect-square' | 'aspect-[4/3]'>('aspect-[3/4]');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setSubtitle(item.subtitle || '');
      const isPresetTag = CATEGORY_TAGS.some(t => t.id === item.tag);
      if (isPresetTag) {
        setTag(item.tag);
        setCustomTag('');
      } else {
        setTag('custom');
        setCustomTag(item.tag || '');
      }
      setAspect(item.aspect || 'aspect-[3/4]');
      setImage(item.image || '');
      setDescription(item.description || '');
    } else {
      setTitle('');
      setSubtitle('');
      setTag('campaigns');
      setCustomTag('');
      setAspect('aspect-[3/4]');
      setImage('');
      setDescription('');
    }
    setErrors({});
    setImageError(false);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Photo title is required';
    if (!subtitle.trim()) newErrors.subtitle = 'Subtitle / Collection line is required';
    if (!image.trim()) newErrors.image = 'Cloudinary image link is required';
    if (tag === 'custom' && !customTag.trim()) newErrors.tag = 'Please specify custom category name';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalTag = tag === 'custom' ? customTag.trim().toLowerCase().replace(/\s+/g, '-') : tag;

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      tag: finalTag,
      aspect,
      image: image.trim(),
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#121212] border border-white/15 rounded-md max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-8 space-y-6 my-auto text-white">

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#C4922A]/15 text-[#C4922A] rounded-xs border border-[#C4922A]/30">
                <ImageIcon size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                {item ? 'Edit Gallery Photo' : 'Add New Gallery Look'}
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Manage editorial photography, craft documentation, and campaign looks showcased on the public gallery.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">

            {/* Left Column: Form Inputs */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Look Title <span className="text-[#C4922A]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. The Sands of Kotte, Batik Midnight Breeze..."
                  className={`w-full bg-[#181818] border ${errors.title ? 'border-red-500' : 'border-white/15'} px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                />
                {errors.title && <p className="text-[10px] text-red-400 mt-1">{errors.title}</p>}
              </div>

              {/* Subtitle / Campaign Tagline */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Subtitle / Collection Line <span className="text-[#C4922A]">*</span>
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="e.g. Luxe Linen Resortwear 2026, Handloom Weaving Process..."
                  className={`w-full bg-[#181818] border ${errors.subtitle ? 'border-red-500' : 'border-white/15'} px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                />
                {errors.subtitle && <p className="text-[10px] text-red-400 mt-1">{errors.subtitle}</p>}
              </div>

              {/* Category / Tag Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Category Tag <span className="text-[#C4922A]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_TAGS.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTag(t.id)}
                      className={`p-2 text-left rounded-xs border text-xs transition-all cursor-pointer ${
                        tag === t.id
                          ? 'border-[#C4922A] bg-[#C4922A]/15 text-[#E8B84B] font-bold shadow-xs'
                          : 'border-white/10 bg-[#161616] text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">{t.label}</div>
                      <div className="text-[9px] text-white/40 truncate">{t.desc}</div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTag('custom')}
                    className={`p-2 text-left rounded-xs border text-xs transition-all cursor-pointer ${
                      tag === 'custom'
                        ? 'border-[#C4922A] bg-[#C4922A]/15 text-[#E8B84B] font-bold shadow-xs'
                        : 'border-white/10 bg-[#161616] text-white/70 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold">+ Custom Tag</div>
                    <div className="text-[9px] text-white/40 truncate">New category</div>
                  </button>
                </div>

                {tag === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={e => setCustomTag(e.target.value)}
                      placeholder="Enter custom category name (e.g. bridal, menswear, silk)..."
                      className={`w-full bg-[#181818] border ${errors.tag ? 'border-red-500' : 'border-white/20'} px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs`}
                    />
                    {errors.tag && <p className="text-[10px] text-red-400 mt-1">{errors.tag}</p>}
                  </div>
                )}
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5 flex items-center gap-1.5">
                  <Ratio size={14} className="text-[#C4922A]" /> Masonry Aspect Ratio <span className="text-[#C4922A]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ASPECT_RATIOS.map(ar => (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => setAspect(ar.id)}
                      className={`p-2.5 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        aspect === ar.id
                          ? 'border-[#C4922A] bg-[#C4922A]/15 text-[#E8B84B] font-bold'
                          : 'border-white/10 bg-[#161616] text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{ar.ratioName}</span>
                        {aspect === ar.id && <Check size={12} className="text-[#C4922A]" />}
                      </div>
                      <div className="text-[10px] text-white/50 mt-1 leading-tight">{ar.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Input (Cloudinary Link Only) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5 flex items-center justify-between">
                  <span>Cloudinary Image Link (URL) <span className="text-[#C4922A]">*</span></span>
                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setImageError(false);
                      }}
                      className="text-[10px] text-white/40 hover:text-red-400 cursor-pointer font-normal"
                    >
                      Clear Link
                    </button>
                  )}
                </label>
                <div className="space-y-1.5">
                  <input
                    type="url"
                    value={image}
                    onChange={e => {
                      setImage(e.target.value);
                      setImageError(false);
                    }}
                    placeholder="https://res.cloudinary.com/dyp247eoh/image/upload/..."
                    className={`w-full bg-[#181818] border ${errors.image ? 'border-red-500' : 'border-white/15'} px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors`}
                  />
                  <p className="text-[10px] text-white/40">
                    Paste your Cloudinary image URL directly. You can test and copy links using the <strong>Cloudinary Tool</strong> in the top header.
                  </p>
                  {errors.image && <p className="text-[10px] text-red-400">{errors.image}</p>}
                </div>

                {/* Sample Presets Quick Load */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-1.5">
                    Quick Sample Presets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_GALLERY_IMAGES.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImage(s.url);
                          setAspect(s.aspect);
                          setTag(s.tag);
                          setImageError(false);
                        }}
                        className="px-2 py-1 bg-black/40 hover:bg-white/10 border border-white/10 rounded-xs text-[10px] text-white/60 hover:text-[#C4922A] transition-colors cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Story / Description */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                  Editorial Story / Caption (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add background notes on fabric, location, artisan craftsmanship or styling..."
                  className="w-full bg-[#181818] border border-white/15 px-3.5 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right Column: Live Photo Card Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C4922A] flex items-center gap-1.5">
                  <Eye size={13} /> Live Gallery Preview
                </p>
                <span className="text-[10px] text-white/40 font-mono">
                  {aspect === 'aspect-[3/4]' ? '3:4 Portrait' : aspect === 'aspect-square' ? '1:1 Square' : '4:3 Landscape'}
                </span>
              </div>

              {/* Mock card matching public gallery styling */}
              <div className="bg-[#0A0A0A] border border-[#C4922A]/40 rounded-sm p-3.5 space-y-3 shadow-xl">
                <div
                  className={`w-full ${aspect} bg-[#181818] rounded-xs overflow-hidden relative border border-white/10 flex items-center justify-center group`}
                >
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="Preview"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {imageError && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center text-red-400 text-xs">
                          <AlertCircle size={24} className="mb-1" />
                          <span>Image failed to load. Check URL.</span>
                        </div>
                      )}
                      {/* Public hover overlay simulation */}
                      <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-90 p-4 flex flex-col justify-between text-white pointer-events-none">
                        <div className="self-end w-7 h-7 bg-white rounded-full flex items-center justify-center text-black">
                          <Eye size={12} />
                        </div>
                        <div>
                          <p className="text-[8px] text-[#E8B84B] uppercase tracking-widest font-bold">
                            {subtitle || 'Campaign Subtitle'}
                          </p>
                          <h4 className="font-display text-sm font-bold text-white leading-tight">
                            {title || 'Look Title'}
                          </h4>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 text-white/30 space-y-2">
                      <ImageIcon size={36} className="mx-auto text-white/20" />
                      <p className="text-xs">No image provided yet</p>
                      <p className="text-[10px] text-white/20">Paste a link or upload a file</p>
                    </div>
                  )}
                </div>

                {/* Summary Metadata */}
                <div className="bg-[#141414] p-3 rounded-xs border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-[10px] uppercase font-mono">Category:</span>
                    <span className="px-2 py-0.5 bg-[#C4922A]/20 text-[#E8B84B] font-bold text-[10px] uppercase rounded-xs">
                      {tag === 'custom' ? customTag || 'custom' : tag}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-[10px] uppercase font-mono">Aspect Ratio:</span>
                    <span className="text-white/80 font-mono text-[11px]">{aspect}</span>
                  </div>
                  {description && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-white/60 italic leading-snug">
                      "{description}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-white/20 text-white/70 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Check size={14} />
              <span>{item ? 'Update Photo' : 'Publish Look'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
