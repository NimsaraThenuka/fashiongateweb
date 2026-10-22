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
  getDeletedProductIds,
  addDeletedProductId,
  removeDeletedProductId,
  clearDeletedProductIds,
  testFirestoreConnection,
  getLastFirestoreError,
} from '../services/firebase';

export type CloudStatus = 'connected' | 'offline' | 'permission_denied' | 'syncing';

interface ProductContextType {
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id' | 'rating' | 'reviews'>) => Product;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  toggleStock: (id: number) => void;
  updateStockQuantity: (id: number, newStock: number) => void;
  reduceStock: (items: { id: number; quantity: number }[]) => void;
  resetToDefaults: () => void;
  getProductById: (id: number) => Product | undefined;
  syncAllToCloud: () => Promise<{ success: boolean; error?: string; count?: number }>;
  isSyncing: boolean;
  cloudSyncStatus: CloudStatus;
  cloudError: string | null;
  refreshCloudSync: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Helper to ensure each product object has valid numeric stockQuantity and accurate inStock boolean
const normalizeProduct = (p: Product): Product => {
  const stock = typeof p.stockQuantity === 'number' ? Math.max(0, p.stockQuantity) : (p.inStock ? 12 : 0);
  return {
    ...p,
    id: Number(p.id),
    price: Number(p.price || 0),
    stockQuantity: stock,
    inStock: stock > 0,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['One Size'],
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : ['Standard'],
  };
};

const normalizeProductList = (list: Product[]): Product[] => {
  const deletedIds = new Set(getDeletedProductIds());
  return list.filter(p => !deletedIds.has(Number(p.id))).map(normalizeProduct);
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const local = getLocalStoredProducts();
    if (local && Array.isArray(local) && local.length > 0) {
      return normalizeProductList(local);
    }
    return normalizeProductList(initialProducts);
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudStatus>('syncing');
  const [cloudError, setCloudError] = useState<string | null>(null);

  const initFirestore = useCallback(async (isMountedRef: { current: boolean }) => {
    try {
      const cloudProducts = await fetchProductsFromFirestore();
      const currentLocal = getLocalStoredProducts() || [];
      const baseLocal = currentLocal.length > 0 ? currentLocal : initialProducts;

      if (cloudProducts !== null) {
        if (cloudProducts.length > 0) {
          // Cloud has data: Cloud is the definitive source of truth across all devices
          const normalized = normalizeProductList(cloudProducts);
          if (isMountedRef.current) {
            setProducts(normalized);
            saveLocalStoredProducts(normalized);
            setCloudSyncStatus('connected');
            setCloudError(null);
          }
        } else {
          // Cloud empty: seed cloud with current products
          const fallback = normalizeProductList(baseLocal);
          if (isMountedRef.current) {
            setProducts(fallback);
            saveLocalStoredProducts(fallback);
          }
          const seeded = await batchUploadAllProductsToFirestore(fallback);
          if (isMountedRef.current) {
            setCloudSyncStatus(seeded ? 'connected' : 'permission_denied');
            if (!seeded) {
              setCloudError('Firestore rules rejected writing default products (Permission Denied).');
            }
          }
        }
      } else {
        // fetchProductsFromFirestore returned null: permission denied or offline
        const fallback = normalizeProductList(baseLocal);
        if (isMountedRef.current) {
          setProducts(fallback);
          saveLocalStoredProducts(fallback);
          const lastErr = getLastFirestoreError() || '';
          const isPerm = lastErr.toLowerCase().includes('permission') || lastErr.toLowerCase().includes('insufficient permissions');
          setCloudSyncStatus(isPerm ? 'permission_denied' : 'offline');
          setCloudError(lastErr || 'Firestore permissions expired. Please update rules in Firebase Console.');
        }
      }
    } catch (err: any) {
      console.warn('Firestore initial load notice:', err);
      if (isMountedRef.current) {
        setCloudSyncStatus('permission_denied');
        setCloudError(err?.message || 'Firestore connection failed');
      }
    }
  }, []);

  // Real-time Firestore Subscription & Cross-tab Live Synchronization
  useEffect(() => {
    const isMountedRef = { current: true };

    initFirestore(isMountedRef);

    // Real-time Live Firestore onSnapshot Listener
    const unsubscribeFirestore = subscribeToFirestoreProducts(
      cloudProducts => {
        if (isMountedRef.current && cloudProducts) {
          if (cloudProducts.length > 0) {
            const normalized = normalizeProductList(cloudProducts);
            setProducts(normalized);
            saveLocalStoredProducts(normalized);
          }
          setCloudSyncStatus('connected');
          setCloudError(null);
        }
      },
      err => {
        console.warn('Real-time sync listener notice:', err);
        const msg = err?.message || String(err);
        const isPerm = err?.code === 'permission-denied' || msg.toLowerCase().includes('permission');
        if (isMountedRef.current) {
          setCloudSyncStatus(isPerm ? 'permission_denied' : 'offline');
          setCloudError(msg);
        }
      }
    );

    // Cross-Tab Live Storage Event Listener (Instantly syncs across multiple tabs in same browser)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashiongate_live_products_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0 && isMountedRef.current) {
            setProducts(normalizeProductList(parsed));
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);


    // Custom window event for same-tab instant broadcast
    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail) && isMountedRef.current) {
        setProducts(normalizeProductList(customEvent.detail));
      }
    };
    window.addEventListener('fashiongate_products_updated', handleCustomSync);

    // Listen for Firestore error event dispatched by firebase.ts
    const handleFirestoreError = (e: Event) => {
      const customEvent = e as CustomEvent<{ error: string; code?: string }>;
      const msg = customEvent.detail?.error || '';
      const isPerm = customEvent.detail?.code === 'permission-denied' || msg.toLowerCase().includes('permission');
      if (isMountedRef.current) {
        setCloudSyncStatus(isPerm ? 'permission_denied' : 'offline');
        setCloudError(msg);
      }
    };
    window.addEventListener('fashiongate_firestore_error', handleFirestoreError);

    return () => {
      isMountedRef.current = false;
      if (unsubscribeFirestore) unsubscribeFirestore();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fashiongate_products_updated', handleCustomSync);
      window.removeEventListener('fashiongate_firestore_error', handleFirestoreError);
    };
  }, [initFirestore]);

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
    // Determine the highest existing ID across memory + localStorage
    const local = getLocalStoredProducts() || [];
    const allKnown = [...products, ...local];
    const maxId = allKnown.length > 0 ? Math.max(...allKnown.map(p => Number(p.id) || 0)) : 0;
    const nextId = maxId + 1;

    const stockQty = typeof data.stockQuantity === 'number' ? Math.max(0, data.stockQuantity) : (data.inStock ? 10 : 0);
    const newProduct: Product = {
      ...data,
      id: nextId,
      rating: 5.0,
      reviews: 1,
      stockQuantity: stockQty,
      inStock: stockQty > 0,
      images: data.images && data.images.length > 0 ? data.images : [data.image],
      sizes: data.sizes && data.sizes.length > 0 ? data.sizes : ['One Size'],
      colors: data.colors && data.colors.length > 0 ? data.colors : ['Standard'],
    };

    removeDeletedProductId(nextId);

    const nextList = [newProduct, ...products.filter(p => p.id !== nextId)];
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

        if (typeof updated.stockQuantity === 'number') {
          merged.stockQuantity = Math.max(0, Math.floor(updated.stockQuantity));
          merged.inStock = merged.stockQuantity > 0;
        } else if (typeof updated.inStock === 'boolean' && updated.stockQuantity === undefined) {
          merged.inStock = updated.inStock;
          if (!updated.inStock) {
            merged.stockQuantity = 0;
          } else if (p.stockQuantity === 0) {
            merged.stockQuantity = 10;
          }
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
    addDeletedProductId(id);
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
        const willBeInStock = !p.inStock;
        const nextStock = willBeInStock ? (p.stockQuantity && p.stockQuantity > 0 ? p.stockQuantity : 10) : 0;
        const updated: Product = {
          ...p,
          inStock: willBeInStock,
          stockQuantity: nextStock,
        };
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

  const updateStockQuantity = (id: number, newStock: number) => {
    const sanitized = Math.max(0, Math.floor(newStock));
    const nextList = products.map(p => {
      if (p.id === id) {
        const updated: Product = {
          ...p,
          stockQuantity: sanitized,
          inStock: sanitized > 0,
        };
        saveProductToFirestore(updated).catch(err =>
          console.warn('Firestore async stock update failed:', err)
        );
        return updated;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);
  };

  // Real-time stock reduction after purchase
  const reduceStock = (itemsToReduce: { id: number; quantity: number }[]) => {
    if (!itemsToReduce || itemsToReduce.length === 0) return;

    const nextList = products.map(p => {
      const target = itemsToReduce.find(i => i.id === p.id);
      if (target) {
        const currentStock = typeof p.stockQuantity === 'number' ? p.stockQuantity : (p.inStock ? 12 : 0);
        const newStock = Math.max(0, currentStock - target.quantity);
        const updated: Product = {
          ...p,
          stockQuantity: newStock,
          inStock: newStock > 0,
        };
        saveProductToFirestore(updated).catch(err =>
          console.warn('Firestore async stock reduction failed:', err)
        );
        return updated;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);
  };

  const resetToDefaults = () => {
    clearDeletedProductIds();
    const normalized = initialProducts.map(normalizeProduct);
    setProducts(normalized);
    broadcastProducts(normalized);
    batchUploadAllProductsToFirestore(normalized).catch(err =>
      console.warn('Firestore batch reset failed:', err)
    );
  };

  const getProductById = (id: number) => {
    return products.find(p => p.id === id);
  };

  const syncAllToCloud = useCallback(async (): Promise<{ success: boolean; error?: string; count?: number }> => {
    setIsSyncing(true);
    setCloudSyncStatus('syncing');
    try {
      const success = await batchUploadAllProductsToFirestore(products);
      if (success) {
        setCloudSyncStatus('connected');
        setCloudError(null);
        setIsSyncing(false);
        return { success: true, count: products.length };
      } else {
        const lastErr = getLastFirestoreError() || 'Permission denied by Firebase security rules.';
        setCloudSyncStatus('permission_denied');
        setCloudError(lastErr);
        setIsSyncing(false);
        return { success: false, error: lastErr };
      }
    } catch (err: any) {
      console.error('Manual Firestore sync error:', err);
      const msg = err?.message || 'Failed to sync to cloud';
      setCloudSyncStatus('permission_denied');
      setCloudError(msg);
      setIsSyncing(false);
      return { success: false, error: msg };
    }
  }, [products]);

  const refreshCloudSync = useCallback(async () => {
    setIsSyncing(true);
    const testResult = await testFirestoreConnection();
    if (testResult.connected) {
      setCloudSyncStatus('connected');
      setCloudError(null);
      // Automatically push latest local products up to cloud so other devices receive them
      await batchUploadAllProductsToFirestore(products);
    } else {
      setCloudSyncStatus(testResult.status);
      setCloudError(testResult.error || 'Connection failed');
    }
    setIsSyncing(false);
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        updateStockQuantity,
        reduceStock,
        resetToDefaults,
        getProductById,
        syncAllToCloud,
        isSyncing,
        cloudSyncStatus,
        cloudError,
        refreshCloudSync,
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
