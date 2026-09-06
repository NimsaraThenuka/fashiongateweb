import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { Product } from '../../data/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  product?: Product | null;
}

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  women: ['dresses', 'sarees', 'kurtas', 'tops', 'pants', 'blazers', 'jeans', 'jumpsuits', 'shorts'],
  men: ['shirts', 't-shirts', 'blazers', 'sarongs', 'pants', 'polo-shirts', 'shorts', 'jackets', 'jeans'],
  kids: ['dresses', 'shirts', 'sets', 'shorts', 'frocks'],
  accessories: ['bags', 'jewelry', 'scarves', 'belts'],
  new: ['sets', 'dresses', 'shirts', 'blazers', 'curated'],
};

const DEFAULT_SIZES: Record<string, string[]> = {
  women: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
  men: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
  kids: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y'],
  accessories: ['One Size'],
  new: ['XS', 'S', 'M', 'L', 'XL'],
};

const SIZE_PRESETS = [
  { label: 'XS', category: 'adult' },
  { label: 'S', category: 'adult' },
  { label: 'M', category: 'adult' },
  { label: 'L', category: 'adult' },
  { label: 'XL', category: 'adult' },
  { label: 'XXL', category: 'adult' },
  { label: '3XL', category: 'adult' },
  { label: 'Free Size', category: 'universal' },
  { label: 'One Size', category: 'universal' },
  { label: '28', category: 'numeric' },
  { label: '30', category: 'numeric' },
  { label: '32', category: 'numeric' },
  { label: '34', category: 'numeric' },
  { label: '36', category: 'numeric' },
  { label: '38', category: 'numeric' },
  { label: '1-2Y', category: 'kids' },
  { label: '2-3Y', category: 'kids' },
  { label: '4-5Y', category: 'kids' },
  { label: '6-7Y', category: 'kids' },
  { label: '8-9Y', category: 'kids' },
  { label: '10-12Y', category: 'kids' },
  { label: '13-14Y', category: 'kids' },
];

const COLOR_PRESETS = [
  'Classic Black',
  'Ivory / White',
  'Emerald Green',
  'Navy Blue',
  'Royal Blue',
  'Ruby Red',
  'Natural Sand',
  'Champagne Gold',
  'Rose Pink',
  'Burgundy',
  'Olive Green',
  'Charcoal Grey',
  'Maroon',
  'Mustard Yellow',
];

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'women' | 'men' | 'kids' | 'accessories' | 'new'>('women');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState<'new' | 'sale' | 'trending' | 'limited' | undefined>(undefined);
  const [inStock, setInStock] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setSubcategory(product.subcategory);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || '');
      setMainImage(product.image);
      setGalleryImages(product.images ? product.images.filter(img => img !== product.image) : []);
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setDescription(product.description || '');
      setBadge(product.badge);
      setInStock(product.inStock ?? true);
    } else {
      // Defaults for new product
      setName('');
      setCategory('women');
      setSubcategory('dresses');
      setPrice('');
      setOriginalPrice('');
      setMainImage('');
      setGalleryImages([]);
      setSizes(['S', 'M', 'L']);
      setColors(['Classic Black', 'Natural Sand']);
      setDescription('');
      setBadge(undefined);
      setInStock(true);
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: 'women' | 'men' | 'kids' | 'accessories' | 'new') => {
    setCategory(newCat);
    const suggested = CATEGORY_SUGGESTIONS[newCat];
    if (suggested && suggested.length > 0) {
      setSubcategory(suggested[0]);
    }
    if (!product) {
      setSizes(DEFAULT_SIZES[newCat] || ['One Size']);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages(prev => [...prev, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Toggle size on/off
  const toggleSize = (sizeLabel: string) => {
    setSizes(prev =>
      prev.includes(sizeLabel) ? prev.filter(s => s !== sizeLabel) : [...prev, sizeLabel]
    );
  };

  const handleAddCustomSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes(prev => [...prev, newSize.trim()]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(prev => prev.filter(s => s !== sizeToRemove));
  };

  // Quick size bundle helpers
  const applyQuickSizes = (type: 'standard' | 'all-adult' | 'kids' | 'freesize' | 'clear') => {
    if (type === 'standard') setSizes(['S', 'M', 'L', 'XL']);
    else if (type === 'all-adult') setSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    else if (type === 'kids') setSizes(['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y']);
    else if (type === 'freesize') setSizes(['Free Size']);
    else if (type === 'clear') setSizes([]);
  };

  // Toggle color on/off
  const toggleColor = (colorLabel: string) => {
    setColors(prev =>
      prev.includes(colorLabel) ? prev.filter(c => c !== colorLabel) : [...prev, colorLabel]
    );
  };

  const handleAddCustomColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors(prev => [...prev, newColor.trim()]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(prev => prev.filter(c => c !== colorToRemove));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'Product name is required';
    if (!subcategory.trim()) err.subcategory = 'Subcategory is required';
    if (!price || Number(price) <= 0) err.price = 'Valid price is required';
    if (!mainImage.trim()) err.mainImage = 'Main Cloudinary image URL is required';
    if (!description.trim()) err.description = 'Description is required';
    if (sizes.length === 0) err.sizes = 'At least one size is required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const allImgs = [mainImage.trim(), ...galleryImages.filter(img => img.trim() !== mainImage.trim())];

    const payload = {
      name: name.trim(),
      category,
      subcategory: subcategory.trim().toLowerCase(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: mainImage.trim(),
      images: allImgs,
      sizes: sizes.length > 0 ? sizes : ['One Size'],
      colors: colors.length > 0 ? colors : ['Standard'],
      description: description.trim(),
      badge: badge || undefined,
      inStock,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-scale-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0F0F0F] text-white border border-[#C4922A]/30 rounded-md shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0A0A0A]">
          <div>
            <p className="text-[10px] text-[#C4922A] tracking-[0.2em] uppercase font-mono">
              {product ? 'Product Editor' : 'Create New Piece'}
            </p>
            <h3 className="text-2xl font-bold text-white">
              {product ? `Edit "${product.name}"` : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#C4922A] hover:bg-white/5 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Luxe Handloom Silk Saree"
                className={`w-full bg-[#181818] border ${errors.name ? 'border-red-500' : 'border-white/15'} px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] transition-colors rounded-xs`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value as any)}
                className="w-full bg-[#181818] border border-white/15 px-4 py-3 text-sm text-white outline-none focus:border-[#C4922A] transition-colors rounded-xs cursor-pointer"
              >
                <option value="women">Women's Collection</option>
                <option value="men">Men's Collection</option>
                <option value="kids">Kids' Collection</option>
                <option value="accessories">Accessories</option>
                <option value="new">New Arrivals &amp; Edits</option>
              </select>
            </div>
          </div>

          {/* Subcategory & Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
                Subcategory *
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                placeholder="e.g. dresses, shirts, sarees"
                className={`w-full bg-[#181818] border ${errors.subcategory ? 'border-red-500' : 'border-white/15'} px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] transition-colors rounded-xs`}
              />
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1 mt-2">
                {CATEGORY_SUGGESTIONS[category]?.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSubcategory(s)}
                    className={`text-[9px] px-2 py-0.5 rounded-xs uppercase tracking-wider border cursor-pointer ${
                      subcategory.toLowerCase() === s.toLowerCase()
                        ? 'border-[#C4922A] text-[#C4922A] bg-[#C4922A]/10'
                        : 'border-white/10 text-white/50 hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
                Selling Price (LKR) *
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 6800"
                className={`w-full bg-[#181818] border ${errors.price ? 'border-red-500' : 'border-white/15'} px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] transition-colors rounded-xs`}
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
                Original Price (LKR - Optional)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="For strike-through discount"
                className="w-full bg-[#181818] border border-white/15 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] transition-colors rounded-xs"
              />
            </div>
          </div>

          {/* Cloudinary Main Image URL with Live Preview */}
          <div className="border border-white/10 p-4 bg-[#141414] rounded-sm">
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#C4922A] font-semibold mb-2 flex items-center gap-2">
              <ImageIcon size={14} /> Main Cover Image (Cloudinary or Image URL) *
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <input
                type="url"
                value={mainImage}
                onChange={e => setMainImage(e.target.value)}
                placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                className={`flex-1 w-full bg-[#181818] border ${errors.mainImage ? 'border-red-500' : 'border-white/15'} px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] transition-colors rounded-xs`}
              />
              {mainImage && (
                <div className="w-16 h-20 bg-black/40 border border-[#C4922A]/50 rounded-xs overflow-hidden shrink-0">
                  <img src={mainImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            {errors.mainImage && <p className="text-red-400 text-xs mt-1">{errors.mainImage}</p>}
          </div>

          {/* Additional Gallery Images */}
          <div className="border border-white/10 p-4 bg-[#141414] rounded-sm">
            <label className="block text-[11px] tracking-[0.1em] uppercase text-white/80 font-semibold mb-2">
              Additional Gallery Images (Cloudinary Links)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newGalleryUrl}
                onChange={e => setNewGalleryUrl(e.target.value)}
                placeholder="Paste extra image link..."
                className="flex-1 bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="btn-gold py-2 px-4 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Gallery thumbnails */}
            {galleryImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative group w-16 h-20 bg-black/40 border border-white/20 rounded-xs overflow-hidden">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 text-red-400 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes & Colors Selection Sections */}
          <div className="space-y-5">
            {/* 1. AVAILABLE SIZES SELECTION */}
            <div className="border border-white/10 p-4 bg-[#141414] rounded-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#C4922A] font-bold">
                    Available Sizes * (Click to Select / Deselect)
                  </label>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    Select one or more sizes by clicking the badges below, or add custom sizes.
                  </p>
                </div>

                {/* Quick Bundles */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider mr-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyQuickSizes('standard')}
                    className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/15 hover:border-[#C4922A] rounded-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                  >
                    S, M, L, XL
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickSizes('all-adult')}
                    className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/15 hover:border-[#C4922A] rounded-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                  >
                    XS – XXL
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickSizes('freesize')}
                    className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/15 hover:border-[#C4922A] rounded-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                  >
                    Free Size
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickSizes('kids')}
                    className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/15 hover:border-[#C4922A] rounded-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                  >
                    Kids' Ages
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickSizes('clear')}
                    className="text-[9px] px-2 py-0.5 bg-red-950/40 border border-red-500/30 hover:border-red-400 rounded-xs text-red-300 cursor-pointer transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Clickable Size Badges Grid */}
              <div>
                <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold mb-2">
                  Click to Toggle Sizes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map(({ label }) => {
                    const isSelected = sizes.includes(label);
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => toggleSize(label)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#C4922A] text-white border-[#C4922A] shadow-[0_2px_8px_rgba(196,146,42,0.4)] font-bold scale-102'
                            : 'bg-[#181818] border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currently Selected Sizes Summary Chips */}
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2">
                  Active Selected Sizes ({sizes.length}):
                </p>
                <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-black/40 border border-white/10 rounded-xs">
                  {sizes.length === 0 ? (
                    <span className="text-xs text-red-400/80 italic">No sizes selected yet. Click any size above.</span>
                  ) : (
                    sizes.map(s => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 bg-[#C4922A]/20 border border-[#C4922A]/60 px-2.5 py-1 text-xs text-white rounded-xs font-medium"
                      >
                        {s}
                        <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => handleRemoveSize(s)} />
                      </span>
                    ))
                  )}
                </div>
                {errors.sizes && <p className="text-red-400 text-xs mt-1">{errors.sizes}</p>}
              </div>

              {/* Custom Size Adder */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSize}
                  onChange={e => setNewSize(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSize();
                    }
                  }}
                  placeholder="Type a custom size (e.g. UK 10, EU 40, 42)..."
                  className="flex-1 bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="btn-outline-gold py-2 px-4 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus size={13} /> Add Custom
                </button>
              </div>
            </div>

            {/* 2. COLOR OPTIONS SELECTION */}
            <div className="border border-white/10 p-4 bg-[#141414] rounded-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-white/80 font-bold">
                    Color Options (Click to Select / Deselect)
                  </label>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    Select popular colors or enter custom color names below.
                  </p>
                </div>
                {colors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setColors([])}
                    className="text-[9px] px-2 py-0.5 bg-red-950/40 border border-red-500/30 text-red-300 rounded-xs cursor-pointer"
                  >
                    Clear Colors
                  </button>
                )}
              </div>

              {/* Clickable Color Badges Grid */}
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map(colorName => {
                  const isSelected = colors.includes(colorName);
                  return (
                    <button
                      type="button"
                      key={colorName}
                      onClick={() => toggleColor(colorName)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#C4922A]/30 text-white border-[#C4922A] font-semibold'
                          : 'bg-[#181818] border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-[#C4922A]" />}
                      {colorName}
                    </button>
                  );
                })}
              </div>

              {/* Currently Selected Colors */}
              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2">
                  Active Selected Colors ({colors.length}):
                </p>
                <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-black/40 border border-white/10 rounded-xs">
                  {colors.length === 0 ? (
                    <span className="text-xs text-white/40 italic">No specific colors (Standard default will be used).</span>
                  ) : (
                    colors.map(c => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-1 text-xs text-white rounded-xs"
                      >
                        {c}
                        <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => handleRemoveColor(c)} />
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Custom Color Adder */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newColor}
                  onChange={e => setNewColor(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomColor();
                    }
                  }}
                  placeholder="Type a custom color (e.g. Lavender, Teal, Rust)..."
                  className="flex-1 bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C4922A] rounded-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="btn-outline-gold py-2 px-4 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus size={13} /> Add Custom
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
              Product Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe material, artisanal features, tailoring and fit..."
              className={`w-full bg-[#181818] border ${errors.description ? 'border-red-500' : 'border-white/15'} px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C4922A] transition-colors rounded-xs resize-none`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Badge & Stock status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-white/10">
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-white/70 font-semibold mb-2">
                Promotional Badge
              </label>
              <select
                value={badge || ''}
                onChange={e => setBadge(e.target.value ? (e.target.value as any) : undefined)}
                className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white outline-none focus:border-[#C4922A] rounded-xs cursor-pointer"
              >
                <option value="">None (Standard)</option>
                <option value="new">New Arrival</option>
                <option value="trending">Trending Now</option>
                <option value="limited">Limited Edition</option>
                <option value="sale">Special Sale</option>
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4 pt-6">
              <label className="text-[12px] tracking-[0.1em] uppercase text-white/90 font-semibold cursor-pointer select-none">
                Availability Status:
              </label>
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
                  inStock
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-red-500 bg-red-500/20 text-red-400'
                }`}
              >
                {inStock ? <><Check size={13} /> In Stock</> : <><X size={13} /> Out of Stock</>}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs tracking-wider uppercase font-semibold transition-all rounded-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold px-8 py-3 text-xs tracking-wider uppercase font-bold flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles size={14} /> {product ? 'Update Piece' : 'Publish to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
