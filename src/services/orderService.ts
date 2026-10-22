// Order Persistence & Firestore Service for Fashion Gate
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getFirestoreDB } from './firebase';
import type { Order } from '../types/order';

export const ORDERS_COLLECTION = 'orders_v2';
const ORDERS_STORAGE_KEY = 'fashiongate_live_orders_v2';
const MY_ORDERS_KEY = 'fashiongate_my_orders_ids_v2';

// Empty default: Only real orders placed via checkout should appear
export const INITIAL_ORDERS: Order[] = [];

export function getLocalStoredOrders(): Order[] {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fashiongate_live_orders');
      localStorage.removeItem('fashiongate_live_orders_v1');
    }
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading orders from localStorage:', e);
  }
  return INITIAL_ORDERS;
}

export function saveLocalStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage:', e);
  }
}

export function getMyOrderIds(): string[] {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fashiongate_my_orders_ids');
    }
    const raw = localStorage.getItem(MY_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMyOrderId(orderId: string): void {
  try {
    const current = getMyOrderIds();
    if (!current.includes(orderId)) {
      localStorage.setItem(MY_ORDERS_KEY, JSON.stringify([orderId, ...current]));
    }
  } catch (e) {
    console.error('Error saving my order ID:', e);
  }
}

// Real-time Firestore orders collection listener
export function subscribeToFirestoreOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (error: any) => void
): Unsubscribe | null {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty) {
          onUpdate([]);
          return;
        }
        const items: Order[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as Order);
        });
        // Sort newest first
        items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onUpdate(items);
      },
      err => {
        console.warn('Firestore orders onSnapshot notice:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Could not attach Firestore orders listener:', err);
    return null;
  }
}

export async function fetchOrdersFromFirestore(): Promise<Order[] | null> {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];

    const items: Order[] = [];
    snapshot.forEach(docSnap => {
      items.push(docSnap.data() as Order);
    });
    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return items;
  } catch (err) {
    console.warn('Could not fetch orders from Firestore:', err);
    return null;
  }
}

export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    const cleanedOrder = JSON.parse(JSON.stringify(order));
    await setDoc(docRef, cleanedOrder, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save order ${order.id} to Firestore:`, err);
    return false;
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  const db = getFirestoreDB();
  if (!db) return false;

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Failed to delete order ${orderId} from Firestore:`, err);
    return false;
  }
}
