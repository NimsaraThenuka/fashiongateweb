import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, products as initialProducts } from '../data/products';
import {
  getLocalStoredProducts,
  saveLocalStoredProducts,
  fetchProductsFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  batchUploadAllProductsToFirestore,
  subscribeToFirestoreProducts,
} from '../services/firebase';

interface ProductContextType {
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id' | 'rating' | 'reviews'>) => Product;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleStock: (id: number) => void;
  resetToDefaults: () => void;
  getProductById: (id: number) => Product | undefined;
  syncAllToCloud: () => Promise<boolean>;
  isSyncing: boolean;
  cloudSyncStatus: 'connected' | 'offline' | 'syncing';
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const local = getLocalStoredProducts();
    if (local && Array.isArray(local) && local.length > 0) {
      return local;
    }
    return initialProducts;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'connected' | 'offline' | 'syncing'>('connected');

  // Real-time Firestore Subscription & Cross-tab Live Synchronization
  useEffect(() => {
    let isMounted = true;

    // 1. Initial fetch from Firestore (or auto-seed if empty)
    async function initFirestore() {
      try {
        const cloudProducts = await fetchProductsFromFirestore();
        if (isMounted && cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
          saveLocalStoredProducts(cloudProducts);
          setCloudSyncStatus('connected');
        } else if (isMounted && (!cloudProducts || cloudProducts.length === 0)) {
          const current = getLocalStoredProducts() || initialProducts;
          await batchUploadAllProductsToFirestore(current);
          setCloudSyncStatus('connected');
        }
      } catch (err) {
        console.warn('Firestore initial load notice:', err);
      }
    }

    initFirestore();

    // 2. Real-time Live Firestore onSnapshot Listener (Auto-updates UI in real-time across devices)
    const unsubscribeFirestore = subscribeToFirestoreProducts(
      cloudProducts => {
        if (isMounted && cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
          saveLocalStoredProducts(cloudProducts);
          setCloudSyncStatus('connected');
        }
      },
      err => {
        console.warn('Real-time sync listener notice:', err);
      }
    );

    // 3. Cross-Tab Live Storage Event Listener (Instantly syncs across multiple tabs in same browser)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashiongate_live_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setProducts(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 4. Custom window event for same-tab instant broadcast
    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail) && isMounted) {
        setProducts(customEvent.detail);
      }
    };
    window.addEventListener('fashiongate_products_updated', handleCustomSync);

    return () => {
      isMounted = false;
      if (unsubscribeFirestore) unsubscribeFirestore();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fashiongate_products_updated', handleCustomSync);
    };
  }, []);

  const broadcastProducts = (updatedProducts: Product[]) => {
    saveLocalStoredProducts(updatedProducts);
    try {
      window.dispatchEvent(
        new CustomEvent('fashiongate_products_updated', { detail: updatedProducts })
      );
    } catch {
      // ignore
    }
  };

  const addProduct = (data: Omit<Product, 'id' | 'rating' | 'reviews'>): Product => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      ...data,
      id: nextId,
      rating: 5.0,
      reviews: 1,
      inStock: data.inStock ?? true,
      images: data.images && data.images.length > 0 ? data.images : [data.image],
    };

    const nextList = [newProduct, ...products];
    setProducts(nextList);
    broadcastProducts(nextList);

    // Push to Firestore in background
    saveProductToFirestore(newProduct).catch(err =>
      console.warn('Firestore async save failed:', err)
    );

    return newProduct;
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    const nextList = products.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updated };
        if (updated.image && (!updated.images || updated.images.length === 0)) {
          merged.images = [updated.image];
        }

        // Push to Firestore in background
        saveProductToFirestore(merged).catch(err =>
          console.warn('Firestore async update failed:', err)
        );

        return merged;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);
  };

  const deleteProduct = (id: number) => {
    const nextList = products.filter(p => p.id !== id);
    setProducts(nextList);
    broadcastProducts(nextList);

    // Delete in Firestore
    deleteProductFromFirestore(id).catch(err =>
      console.warn('Firestore async delete failed:', err)
    );
  };

  const toggleStock = (id: number) => {
    const nextList = products.map(p => {
      if (p.id === id) {
        const updated = { ...p, inStock: !p.inStock };
        saveProductToFirestore(updated).catch(err =>
          console.warn('Firestore async stock toggle failed:', err)
        );
        return updated;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    broadcastProducts(initialProducts);
    batchUploadAllProductsToFirestore(initialProducts).catch(err =>
      console.warn('Firestore batch reset failed:', err)
    );
  };

  const getProductById = (id: number) => {
    return products.find(p => p.id === id);
  };

  const syncAllToCloud = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    setCloudSyncStatus('syncing');
    try {
      const success = await batchUploadAllProductsToFirestore(products);
      if (success) {
        setCloudSyncStatus('connected');
      } else {
        setCloudSyncStatus('offline');
      }
      setIsSyncing(false);
      return success;
    } catch (err) {
      console.error('Manual Firestore sync error:', err);
      setCloudSyncStatus('offline');
      setIsSyncing(false);
      return false;
    }
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        resetToDefaults,
        getProductById,
        syncAllToCloud,
        isSyncing,
        cloudSyncStatus,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
