// Firebase & Firestore Service for Fashion Gate
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  Unsubscribe,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import type { Product } from '../data/products';
import type { GalleryItem } from '../data/gallery';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyAESoAwlEMLc56dFQ-xmCdE0UajEe8aCUs",
  authDomain: "fasion-gate.firebaseapp.com",
  projectId: "fasion-gate",
  storageBucket: "fasion-gate.firebasestorage.app",
  messagingSenderId: "451120587662",
  appId: "1:451120587662:web:bd2fbcf14ccadbd36ffadf",
  measurementId: "G-KTC33ZHS9L"
};

const FIREBASE_CONFIG_KEY = 'fashiongate_firebase_config';
const PRODUCTS_STORAGE_KEY = 'fashiongate_live_products_v2';
const DELETED_PRODUCTS_KEY = 'fashiongate_deleted_product_ids_v2';


export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading Firebase config from localStorage:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveStoredFirebaseConfig(config: FirebaseConfig): void {
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving Firebase config:', e);
  }
}

export function clearStoredFirebaseConfig(): void {
  try {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  } catch (e) {
    console.error('Error removing Firebase config:', e);
  }
}

// Initialize Firebase App & Firestore & Auth singletons
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  try {
    if (authInstance) return authInstance;
    const config = getStoredFirebaseConfig();
    if (!config.apiKey || !config.projectId) return null;

    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    console.warn('Firebase Auth initialization warning:', err);
    return null;
  }
}

export function getFirestoreDB(): Firestore | null {
  try {
    if (dbInstance) return dbInstance;
    const config = getStoredFirebaseConfig();
    if (!config.apiKey || !config.projectId) return null;

    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('Firebase Firestore initialization warning:', err);
    return null;
  }
}

export function resetFirebaseInstance(): void {
  dbInstance = null;
  authInstance = null;
}

// LocalStorage helpers
export function getLocalStoredProducts(): Product[] | null {
  try {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('fashiongate_live_products')) {
        localStorage.removeItem('fashiongate_live_products');
        localStorage.removeItem('fashiongate_deleted_product_ids');
      }
    }
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading products from localStorage:', e);
    return null;
  }
}


export function saveLocalStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
}

// Deleted Product IDs Tracking (Prevents Firestore onSnapshot from resurrecting deleted items locally)
export function getDeletedProductIds(): number[] {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDeletedProductId(id: number): void {
  try {
    const ids = getDeletedProductIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids));
    }
  } catch (e) {
    console.error('Error saving deleted product id:', e);
  }
}

export function removeDeletedProductId(id: number): void {
  try {
    const ids = getDeletedProductIds().filter(existingId => existingId !== id);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Error removing deleted product id:', e);
  }
}

export function clearDeletedProductIds(): void {
  try {
    localStorage.removeItem(DELETED_PRODUCTS_KEY);
  } catch (e) {
    console.error('Error clearing deleted product ids:', e);
  }
}

/**
 * Sanitizes and cleans a Product object for Firestore.
 * Strips all `undefined` values that cause Firestore `setDoc` to throw errors.
 */
export function cleanProductForFirestore(product: Product): Record<string, any> {
  const cleaned: Record<string, any> = JSON.parse(JSON.stringify(product));
  cleaned.id = Number(cleaned.id || product.id);
  cleaned.name = String(cleaned.name || '').trim();
  cleaned.price = Number(cleaned.price || 0);
  cleaned.category = cleaned.category || 'women';
  cleaned.subcategory = String(cleaned.subcategory || '').trim();
  cleaned.image = String(cleaned.image || '').trim();
  cleaned.images = Array.isArray(cleaned.images) && cleaned.images.length > 0 ? cleaned.images : [cleaned.image];
  cleaned.sizes = Array.isArray(cleaned.sizes) && cleaned.sizes.length > 0 ? cleaned.sizes : ['One Size'];
  cleaned.colors = Array.isArray(cleaned.colors) && cleaned.colors.length > 0 ? cleaned.colors : ['Standard'];
  cleaned.description = String(cleaned.description || '').trim();
  cleaned.stockQuantity = typeof cleaned.stockQuantity === 'number' ? Math.max(0, cleaned.stockQuantity) : (cleaned.inStock ? 10 : 0);
  cleaned.inStock = cleaned.stockQuantity > 0;
  cleaned.rating = typeof cleaned.rating === 'number' ? cleaned.rating : 5.0;
  cleaned.reviews = typeof cleaned.reviews === 'number' ? cleaned.reviews : 1;

  if (product.originalPrice && Number(product.originalPrice) > 0) {
    cleaned.originalPrice = Number(product.originalPrice);
  } else {
    delete cleaned.originalPrice;
  }

  if (product.sizeFit && String(product.sizeFit).trim()) {
    cleaned.sizeFit = String(product.sizeFit).trim();
  } else {
    delete cleaned.sizeFit;
  }

  if (product.badge) {
    cleaned.badge = product.badge;
  } else {
    delete cleaned.badge;
  }

  return cleaned;
}

// Firestore CRUD operations & Real-time Subscriptions
export const PRODUCTS_COLLECTION = 'products_v2';

let lastFirestoreError: string | null = null;
export function getLastFirestoreError(): string | null {
  return lastFirestoreError;
}

/**
 * Diagnostic test for Firestore connection and security rules
 */
export async function testFirestoreConnection(): Promise<{
  connected: boolean;
  status: 'connected' | 'offline' | 'permission_denied';
  error?: string;
  itemCount?: number;
}> {
  const db = getFirestoreDB();
  if (!db) {
    return {
      connected: false,
      status: 'offline',
      error: 'Firebase instance could not be initialized.',
    };
  }

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);

    lastFirestoreError = null;
    return {
      connected: true,
      status: 'connected',
      itemCount: snapshot.size,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    const code = err?.code || '';
    const isPermission =
      code === 'permission-denied' ||
      msg.toLowerCase().includes('permission') ||
      msg.toLowerCase().includes('insufficient permissions');

    lastFirestoreError = msg;
    return {
      connected: false,
      status: isPermission ? 'permission_denied' : 'offline',
      error: isPermission
        ? 'Database access denied. Please verify your cloud permissions.'
        : msg,
    };
  }
}

/**
 * Real-time listener for Firestore "products" collection.
 * Whenever any item is added, updated, or deleted anywhere,
 * this callback fires automatically in real-time without refreshing.
 */
export function subscribeToFirestoreProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: any) => void
): Unsubscribe | null {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty) {
          onUpdate([]);
          return;
        }
        const items: Product[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as Product;
          items.push({
            ...data,
            id: Number(data.id || docSnap.id),
          });
        });
        items.sort((a, b) => a.id - b.id);
        onUpdate(items);
      },
      err => {
        console.warn('Firestore onSnapshot error:', err);
        lastFirestoreError = err?.message || String(err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('Could not attach Firestore onSnapshot listener:', err);
    lastFirestoreError = err?.message || String(err);
    if (onError) onError(err);
    return null;
  }
}

/**
 * Fetch all products from Firestore products collection
 */
export async function fetchProductsFromFirestore(): Promise<Product[] | null> {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);


    if (snapshot.empty) {
      return [];
    }

    const items: Product[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as Product;
      items.push({
        ...data,
        id: Number(data.id || docSnap.id),
      });
    });

    // Sort by ID
    items.sort((a, b) => a.id - b.id);
    lastFirestoreError = null;
    return items;
  } catch (err: any) {
    lastFirestoreError = err?.message || String(err);
    console.warn('Could not fetch from Firestore (will use local cache):', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fashiongate_firestore_error', {
          detail: { error: lastFirestoreError, code: err?.code },
        })
      );
    }
    return null;
  }
}

/**
 * Save or update a single product document in Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(product.id));

    const cleaned = cleanProductForFirestore(product);
    await setDoc(docRef, cleaned, { merge: true });
    removeDeletedProductId(product.id);
    lastFirestoreError = null;
    return true;
  } catch (err: any) {
    lastFirestoreError = err?.message || String(err);
    console.error(`Failed to save product #${product.id} to Firestore:`, err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fashiongate_firestore_error', {
          detail: { error: lastFirestoreError, code: err?.code },
        })
      );
    }
    return false;
  }
}

/**
 * Delete a product document from Firestore
 */
export async function deleteProductFromFirestore(id: number): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(id));
    await deleteDoc(docRef);
    addDeletedProductId(id);
    lastFirestoreError = null;
    return true;
  } catch (err: any) {
    lastFirestoreError = err?.message || String(err);
    console.error(`Failed to delete product #${id} from Firestore:`, err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fashiongate_firestore_error', {
          detail: { error: lastFirestoreError, code: err?.code },
        })
      );
    }
    return false;
  }
}

/**
 * Batch upload / sync all products to Firestore at once with chunking.
 * Also cleans up any obsolete documents in Firestore not present in the current products array.
 */
export async function batchUploadAllProductsToFirestore(products: Product[]): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    // 1. Fetch existing documents to detect and remove obsolete ones
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const existingSnap = await getDocs(colRef);
    const validIds = new Set(products.map(p => String(p.id)));

    // 2. Delete documents from Firestore that are no longer in the active list
    const docsToDelete = existingSnap.docs.filter(d => !validIds.has(String(d.id)));
    if (docsToDelete.length > 0) {
      const deleteBatch = writeBatch(db);
      docsToDelete.forEach(d => deleteBatch.delete(d.ref));
      await deleteBatch.commit();
    }

    // 3. Upsert active products in chunks
    const chunkSize = 300;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const p of chunk) {
        const docRef = doc(db, PRODUCTS_COLLECTION, String(p.id));
        const cleaned = cleanProductForFirestore(p);
        batch.set(docRef, cleaned, { merge: true });
      }
      await batch.commit();
    }
    lastFirestoreError = null;
    return true;
  } catch (err: any) {
    lastFirestoreError = err?.message || String(err);
    console.error('Failed to batch upload products to Firestore:', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fashiongate_firestore_error', {
          detail: { error: lastFirestoreError, code: err?.code },
        })
      );
    }
    return false;
  }
}


// =========================================================================
// GALLERY FIRESTORE INTEGRATION
// =========================================================================

/**
 * Sanitizes and cleans a GalleryItem object for Firestore.
 */
export function cleanGalleryItemForFirestore(item: GalleryItem): Record<string, any> {
  const cleaned: Record<string, any> = JSON.parse(JSON.stringify(item));
  cleaned.id = Number(cleaned.id || item.id);
  cleaned.tag = String(cleaned.tag || 'campaigns').trim();
  cleaned.title = String(cleaned.title || '').trim();
  cleaned.subtitle = String(cleaned.subtitle || '').trim();
  cleaned.image = String(cleaned.image || '').trim();
  cleaned.aspect = cleaned.aspect || 'aspect-[3/4]';
  if (cleaned.description) {
    cleaned.description = String(cleaned.description).trim();
  } else {
    delete cleaned.description;
  }
  if (cleaned.createdAt) {
    cleaned.createdAt = String(cleaned.createdAt);
  }
  return cleaned;
}

/**
 * Real-time listener for Firestore "gallery" collection.
 */
export function subscribeToFirestoreGallery(
  onUpdate: (items: GalleryItem[]) => void,
  onError?: (error: any) => void
): Unsubscribe | null {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, 'gallery');
    const unsubscribe = onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty) {
          onUpdate([]);
          return;
        }
        const items: GalleryItem[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as GalleryItem;
          items.push({
            ...data,
            id: Number(data.id || docSnap.id),
          });
        });
        items.sort((a, b) => b.id - a.id);
        onUpdate(items);
      },
      err => {
        console.warn('Firestore gallery onSnapshot notice:', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('Could not attach Firestore gallery onSnapshot listener:', err);
    if (onError) onError(err);
    return null;
  }
}

/**
 * Fetch all gallery items from Firestore "gallery" collection
 */
export async function fetchGalleryFromFirestore(): Promise<GalleryItem[] | null> {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, 'gallery');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return null;

    const items: GalleryItem[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as GalleryItem;
      items.push({
        ...data,
        id: Number(data.id || docSnap.id),
      });
    });
    items.sort((a, b) => b.id - a.id);
    return items;
  } catch (err) {
    console.warn('Could not fetch gallery from Firestore:', err);
    return null;
  }
}

/**
 * Save or update a single gallery item in Firestore
 */
export async function saveGalleryItemToFirestore(item: GalleryItem): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, 'gallery', String(item.id));
    const cleaned = cleanGalleryItemForFirestore(item);
    await setDoc(docRef, cleaned, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save gallery item #${item.id} to Firestore:`, err);
    return false;
  }
}

/**
 * Delete a gallery item from Firestore
 */
export async function deleteGalleryItemFromFirestore(id: number): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, 'gallery', String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Failed to delete gallery item #${id} from Firestore:`, err);
    return false;
  }
}

/**
 * Batch upload / sync all gallery items to Firestore at once
 */
export async function batchUploadAllGalleryToFirestore(items: GalleryItem[]): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const batch = writeBatch(db);
    for (const item of items) {
      const docRef = doc(db, 'gallery', String(item.id));
      const cleaned = cleanGalleryItemForFirestore(item);
      batch.set(docRef, cleaned, { merge: true });
    }
    await batch.commit();
    return true;
  } catch (err) {
    console.error('Failed to batch upload gallery items to Firestore:', err);
    return false;
  }
}
