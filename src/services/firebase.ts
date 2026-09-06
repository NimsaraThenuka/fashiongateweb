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
import type { Product } from '../data/products';

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
const PRODUCTS_STORAGE_KEY = 'fashiongate_live_products';

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

// Initialize Firebase App & Firestore singleton
let dbInstance: Firestore | null = null;

export function getFirestoreDB(): Firestore | null {
  try {
    if (dbInstance) return dbInstance;
    const config = getStoredFirebaseConfig();
    if (!config.apiKey || !config.projectId) return null;

    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
    return null;
  }
}

export function resetFirebaseInstance(): void {
  dbInstance = null;
}

// LocalStorage helpers
export function getLocalStoredProducts(): Product[] | null {
  try {
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

// Firestore CRUD operations & Real-time Subscriptions

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
    const colRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty) {
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
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not attach Firestore onSnapshot listener:', err);
    return null;
  }
}

/**
 * Fetch all products from Firestore "products" collection
 */
export async function fetchProductsFromFirestore(): Promise<Product[] | null> {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return null;
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
    return items;
  } catch (err) {
    console.warn('Could not fetch from Firestore (will use local cache):', err);
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
    const docRef = doc(db, 'products', String(product.id));
    await setDoc(docRef, { ...product }, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save product #${product.id} to Firestore:`, err);
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
    const docRef = doc(db, 'products', String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Failed to delete product #${id} from Firestore:`, err);
    return false;
  }
}

/**
 * Batch upload / sync all products to Firestore at once
 */
export async function batchUploadAllProductsToFirestore(products: Product[]): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const batch = writeBatch(db);
    for (const p of products) {
      const docRef = doc(db, 'products', String(p.id));
      batch.set(docRef, { ...p }, { merge: true });
    }
    await batch.commit();
    return true;
  } catch (err) {
    console.error('Failed to batch upload products to Firestore:', err);
    return false;
  }
}
