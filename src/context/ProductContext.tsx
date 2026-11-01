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
  addProduct: (newProd: Omit<Product, 'id' | 'rating' | 'reviews'>) => Promise<Product>;
  updateProduct: (id: number, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleStock: (id: number) => Promise<void>;
  updateStockQuantity: (id: number, newStock: number) => Promise<void>;
  reduceStock: (items: { id: number; quantity: number }[]) => Promise<void>;
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

const normalizeProductList = (list: Product[], isCloudSource: boolean = false): Product[] => {
  if (isCloudSource) {
    // Cloud Firestore is the definitive source of truth across all devices.
    // If a product exists in Firestore, it is valid and MUST NOT be blocked by local deleted cache.
    const deletedIds = getDeletedProductIds();
    if (deletedIds.length > 0) {
      const cloudIdSet = new Set(list.map(p => Number(p.id)));
      const remaining = deletedIds.filter(id => !cloudIdSet.has(id));
      if (remaining.length !== deletedIds.length) {
        try {
          localStorage.setItem('fashiongate_deleted_product_ids_v2', JSON.stringify(remaining));
        } catch {
          // ignore
        }
      }
    }
    return list.map(normalizeProduct);
  }

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
          const normalized = normalizeProductList(cloudProducts, true);
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
            const normalized = normalizeProductList(cloudProducts, true);
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

    // Cross-device automatic refresh on tab switch, device screen unlock, or reconnect
    const handleRecheckSync = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && isMountedRef.current) {
        initFirestore(isMountedRef);
      }
    };

    document.addEventListener('visibilitychange', handleRecheckSync);
    window.addEventListener('focus', handleRecheckSync);
    window.addEventListener('online', handleRecheckSync);

    // Heartbeat check every 25s so mobile browsers or background tabs always catch up
    const heartbeatInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && isMountedRef.current) {
        initFirestore(isMountedRef);
      }
    }, 25000);

    // Cross-Tab Live Storage Event Listener (Instantly syncs across multiple tabs in same browser)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashiongate_live_products_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0 && isMountedRef.current) {
            setProducts(normalizeProductList(parsed, true));
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
        setProducts(normalizeProductList(customEvent.detail, true));
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
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', handleRecheckSync);
      window.removeEventListener('focus', handleRecheckSync);
      window.removeEventListener('online', handleRecheckSync);
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

  const addProduct = async (data: Omit<Product, 'id' | 'rating' | 'reviews'>): Promise<Product> => {
    // 1. Fetch latest products from Firestore first to ensure maxId is globally accurate across devices
    let currentCloudProducts: Product[] = [];
    try {
      const fetched = await fetchProductsFromFirestore();
      if (fetched && Array.isArray(fetched) && fetched.length > 0) {
        currentCloudProducts = fetched;
      }
    } catch {
      // ignore
    }

    const local = getLocalStoredProducts() || [];
    const allKnown = [...products, ...local, ...currentCloudProducts];
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

    // Save directly to Firestore and await confirmation so it propagates immediately to all devices
    const saved = await saveProductToFirestore(newProduct);
    if (!saved) {
      console.warn('Direct Firestore write returned false, will still preserve locally.');
    }

    const nextList = [newProduct, ...products.filter(p => p.id !== nextId)];
    setProducts(nextList);
    broadcastProducts(nextList);

    return newProduct;
  };

  const updateProduct = async (id: number, updated: Partial<Product>) => {
    let targetUpdated: Product | undefined;
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
        targetUpdated = merged;
        return merged;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);

    if (targetUpdated) {
      await saveProductToFirestore(targetUpdated);
    }
  };

  const deleteProduct = async (id: number) => {
    addDeletedProductId(id);
    const nextList = products.filter(p => p.id !== id);
    setProducts(nextList);
    broadcastProducts(nextList);

    // Delete in Firestore
    await deleteProductFromFirestore(id);
  };

  const toggleStock = async (id: number) => {
    let targetUpdated: Product | undefined;
    const nextList = products.map(p => {
      if (p.id === id) {
        const willBeInStock = !p.inStock;
        const nextStock = willBeInStock ? (p.stockQuantity && p.stockQuantity > 0 ? p.stockQuantity : 10) : 0;
        const updated: Product = {
          ...p,
          inStock: willBeInStock,
          stockQuantity: nextStock,
        };
        targetUpdated = updated;
        return updated;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);

    if (targetUpdated) {
      await saveProductToFirestore(targetUpdated);
    }
  };

  const updateStockQuantity = async (id: number, newStock: number) => {
    const sanitized = Math.max(0, Math.floor(newStock));
    let targetUpdated: Product | undefined;
    const nextList = products.map(p => {
      if (p.id === id) {
        const updated: Product = {
          ...p,
          stockQuantity: sanitized,
          inStock: sanitized > 0,
        };
        targetUpdated = updated;
        return updated;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);

    if (targetUpdated) {
      await saveProductToFirestore(targetUpdated);
    }
  };

  // Real-time stock reduction after purchase
  const reduceStock = async (itemsToReduce: { id: number; quantity: number }[]) => {
    if (!itemsToReduce || itemsToReduce.length === 0) return;

    const modifiedList: Product[] = [];
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
        modifiedList.push(updated);
        return updated;
      }
      return p;
    });

    setProducts(nextList);
    broadcastProducts(nextList);

    for (const item of modifiedList) {
      await saveProductToFirestore(item).catch(err =>
        console.warn('Firestore stock reduction failed:', err)
      );
    }
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
      // Fetch fresh products from Firestore server
      const cloudProds = await fetchProductsFromFirestore();
      if (cloudProds && cloudProds.length > 0) {
        const normalized = normalizeProductList(cloudProds, true);
        setProducts(normalized);
        saveLocalStoredProducts(normalized);
      }
    } else {
      setCloudSyncStatus(testResult.status);
      setCloudError(testResult.error || 'Connection failed');
    }
    setIsSyncing(false);
  }, []);

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
