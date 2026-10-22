import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GalleryItem, DEFAULT_GALLERY_ITEMS } from '../data/gallery';
import {
  fetchGalleryFromFirestore,
  saveGalleryItemToFirestore,
  deleteGalleryItemFromFirestore,
  batchUploadAllGalleryToFirestore,
  subscribeToFirestoreGallery,
} from '../services/firebase';

interface GalleryContextType {
  galleryItems: GalleryItem[];
  addGalleryItem: (itemData: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (id: number, itemData: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: number) => void;
  resetGalleryToDefaults: () => void;
  syncAllGalleryToCloud: () => Promise<boolean>;
  isGallerySyncing: boolean;
}

const STORAGE_KEY = 'fashiongate_gallery_items_v2';

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fashiongate_gallery_items_v1');
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load gallery items from localStorage:', e);
    }
    return DEFAULT_GALLERY_ITEMS;
  });

  const [isGallerySyncing, setIsGallerySyncing] = useState<boolean>(false);

  // Cross-tab and same-tab sync helper
  const broadcastGallery = (items: GalleryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('fashiongate_gallery_updated', { detail: items }));
    } catch (e) {
      console.error('Failed to save gallery items to localStorage:', e);
    }
  };

  // Sync to localStorage whenever galleryItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(galleryItems));
    } catch (e) {
      console.error('Failed to save gallery items to localStorage:', e);
    }
  }, [galleryItems]);

  // Firestore Sync & Cross-Device Live Listeners
  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch from Firestore
    fetchGalleryFromFirestore().then(cloudItems => {
      if (isMounted && cloudItems !== null) {
        setGalleryItems(cloudItems);
      }
    });

    // 2. Real-time subscription across all devices
    const unsubscribe = subscribeToFirestoreGallery(cloudItems => {
      if (isMounted && cloudItems !== null) {
        setGalleryItems(cloudItems);
      }
    });

    // 3. Cross-tab storage listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated) && isMounted) {
            setGalleryItems(updated);
          }
        } catch (err) {
          console.error('Cross-tab gallery sync error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Same-tab custom event
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<GalleryItem[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail) && isMounted) {
        setGalleryItems(customEvent.detail);
      }
    };
    window.addEventListener('fashiongate_gallery_updated', handleCustom);

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('fashiongate_gallery_updated', handleCustom);
    };
  }, []);

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
    const nextId = galleryItems.length > 0
      ? Math.max(...galleryItems.map(i => Number(i.id) || 0)) + 1
      : 1;

    const newItem: GalleryItem = {
      ...itemData,
      id: nextId,
      createdAt: new Date().toISOString(),
    };

    const nextList = [newItem, ...galleryItems.filter(i => i.id !== nextId)];
    setGalleryItems(nextList);
    broadcastGallery(nextList);

    // Push to Firestore in background
    saveGalleryItemToFirestore(newItem).catch(err =>
      console.warn('Firestore gallery save notice:', err)
    );

    return newItem;
  };

  const updateGalleryItem = (id: number, itemData: Partial<GalleryItem>) => {
    let updatedItem: GalleryItem | null = null;
    const nextList = galleryItems.map(item => {
      if (item.id === id) {
        updatedItem = { ...item, ...itemData };
        return updatedItem;
      }
      return item;
    });

    setGalleryItems(nextList);
    broadcastGallery(nextList);

    if (updatedItem) {
      saveGalleryItemToFirestore(updatedItem).catch(err =>
        console.warn('Firestore gallery update notice:', err)
      );
    }
  };

  const deleteGalleryItem = (id: number) => {
    const nextList = galleryItems.filter(item => item.id !== id);
    setGalleryItems(nextList);
    broadcastGallery(nextList);

    deleteGalleryItemFromFirestore(id).catch(err =>
      console.warn('Firestore gallery delete notice:', err)
    );
  };

  const resetGalleryToDefaults = () => {
    setGalleryItems(DEFAULT_GALLERY_ITEMS);
    broadcastGallery(DEFAULT_GALLERY_ITEMS);
    batchUploadAllGalleryToFirestore(DEFAULT_GALLERY_ITEMS).catch(err =>
      console.warn('Firestore gallery batch reset notice:', err)
    );
  };

  const syncAllGalleryToCloud = useCallback(async (): Promise<boolean> => {
    setIsGallerySyncing(true);
    try {
      const ok = await batchUploadAllGalleryToFirestore(galleryItems);
      setIsGallerySyncing(false);
      return ok;
    } catch {
      setIsGallerySyncing(false);
      return false;
    }
  }, [galleryItems]);

  return (
    <GalleryContext.Provider
      value={{
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetGalleryToDefaults,
        syncAllGalleryToCloud,
        isGallerySyncing,
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
