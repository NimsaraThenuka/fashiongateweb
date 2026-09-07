import React, { createContext, useContext, useState, useEffect } from 'react';
import { GalleryItem, DEFAULT_GALLERY_ITEMS } from '../data/gallery';

interface GalleryContextType {
  galleryItems: GalleryItem[];
  addGalleryItem: (itemData: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (id: number, itemData: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: number) => void;
  resetGalleryToDefaults: () => void;
}

const STORAGE_KEY = 'fashiongate_gallery_items_v1';

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load gallery items from localStorage:', e);
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  // Save to localStorage whenever galleryItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(galleryItems));
    } catch (e) {
      console.error('Failed to save gallery items to localStorage:', e);
    }
  }, [galleryItems]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setGalleryItems(updated);
          }
        } catch (err) {
          console.error('Cross-tab gallery sync error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
    const nextId = galleryItems.length > 0
      ? Math.max(...galleryItems.map(i => i.id)) + 1
      : 1;

    const newItem: GalleryItem = {
      ...itemData,
      id: nextId,
      createdAt: new Date().toISOString(),
    };

    setGalleryItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateGalleryItem = (id: number, itemData: Partial<GalleryItem>) => {
    setGalleryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...itemData } : item))
    );
  };

  const deleteGalleryItem = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const resetGalleryToDefaults = () => {
    setGalleryItems(DEFAULT_GALLERY_ITEMS);
  };

  return (
    <GalleryContext.Provider
      value={{
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetGalleryToDefaults,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
