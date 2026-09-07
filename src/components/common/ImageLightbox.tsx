import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen?: boolean;
  onClose: () => void;
  productName?: string;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen = true,
  onClose,
  productName = 'Product View',
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const toggleZoom = () => {
    setZoomLevel(prev => (prev === 1 ? 2 : 1));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="High Resolution Image Viewer"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/90 to-transparent z-50 shrink-0">
        <div className="flex flex-col">
          <h3 className="text-white font-serif text-sm sm:text-base font-semibold tracking-wide truncate max-w-[200px] sm:max-w-md">
            {productName}
          </h3>
          <span className="text-[11px] text-white/60 tracking-wider uppercase font-medium">
            Photo {currentIndex + 1} of {images.length} {zoomLevel > 1 && `• ${zoomLevel}x Zoom`}
          </span>
        </div>

        {/* Action Controls & Close Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom controls on medium+ screens */}
          <div className="hidden sm:flex items-center bg-white/10 rounded-full border border-white/15 p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 text-white/80 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Zoom Out (-)"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-[11px] font-mono font-bold text-white px-2 min-w-[36px] text-center">
              {zoomLevel}x
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 text-white/80 hover:text-white disabled:opacity-30 hover:bg-white/10 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Zoom In (+)"
            >
              <ZoomIn size={16} />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-2 text-amber-400 hover:text-amber-300 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                title="Reset Zoom (0)"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          {/* Close / Exit Button (Cross) */}
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-2 bg-white/15 hover:bg-red-600 text-white px-4 py-2 rounded-full border border-white/30 hover:border-red-500 transition-all cursor-pointer shadow-lg active:scale-95"
            title="Close Image Viewer (Esc)"
          >
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
              Close
            </span>
            <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden min-h-0"
        onClick={e => {
          // If clicked directly on the stage (backdrop), close
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Navigation Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/15 hover:bg-[#C4922A] text-white flex items-center justify-center border border-white/25 backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90 hover:scale-105"
            aria-label="Previous image"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Display Image with interactive zoom */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center overflow-auto transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={images[currentIndex]}
            alt={`${productName} view ${currentIndex + 1}`}
            onClick={e => {
              e.stopPropagation();
              toggleZoom();
            }}
            className={`max-h-[72vh] sm:max-h-[78vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xs shadow-2xl transition-all duration-200 ${
              zoomLevel === 1 ? 'cursor-zoom-in' : 'cursor-zoom-out'
            }`}
          />
        </div>

        {/* Navigation Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/15 hover:bg-[#C4922A] text-white flex items-center justify-center border border-white/25 backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-90 hover:scale-105"
            aria-label="Next image"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Controls */}
      <div className="flex flex-col items-center gap-2 px-4 py-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-50 shrink-0">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full py-1 px-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoomLevel(1);
                }}
                className={`relative w-12 sm:w-16 aspect-square rounded-xs overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  currentIndex === idx
                    ? 'border-[#C4922A] scale-105 shadow-md ring-2 ring-[#C4922A]/50 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Helpful keyboard hint */}
        <p className="text-[11px] text-white/50 tracking-wider text-center hidden sm:block">
          💡 Click image to toggle 2x zoom • Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded-xs text-white/80">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded-xs text-white/80">→</kbd> to navigate • Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded-xs text-white/80">Esc</kbd> or click ✕ to exit
        </p>
      </div>
    </div>,
    document.body
  );
}
