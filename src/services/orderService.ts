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

const ORDERS_STORAGE_KEY = 'fashiongate_live_orders';
const MY_ORDERS_KEY = 'fashiongate_my_orders_ids';

// Initial sample order for demonstration if empty
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FG-2026-1042',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    customer: {
      fullName: 'Kasun Perera',
      email: 'kasun.p@gmail.com',
      phone: '+94 77 123 4567',
      address: 'No. 24, Flower Road',
      city: 'Colombo 07',
      postalCode: '00700',
      province: 'Western Province',
      deliveryNotes: 'Please call before arrival.',
    },
    items: [
      {
        id: 1,
        name: 'Luxe Handloom Silk Saree',
        price: 18500,
        quantity: 1,
        selectedSize: 'Free Size',
        selectedColor: 'Emerald Green',
        image: 'https://images.unsplash.com/photo-1776262145095-39d46d047537?w=600&h=800&fit=crop&auto=format',
        subcategory: 'sarees',
      },
    ],
    subtotal: 18500,
    shipping: 350,
    tax: 0,
    total: 18850,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'shipped',
    trackingNumber: 'FG-TRK-8821',
    courierPartner: 'Prompt Express (Islandwide)',
    estimatedDelivery: 'Tomorrow, by 5:00 PM',
    trackingTimeline: [
      {
        title: 'Order Placed',
        desc: 'Order received and verified by Fashion Gate boutique.',
        time: 'Sep 03, 10:15 AM',
        done: true,
      },
      {
        title: 'Processing & Quality Check',
        desc: 'Handcrafted piece inspected and carefully packaged.',
        time: 'Sep 03, 02:30 PM',
        done: true,
      },
      {
        title: 'Handed to Courier Partner',
        desc: 'Dispatched via Prompt Express Kotte Hub.',
        time: 'Sep 04, 09:00 AM',
        done: true,
      },
      {
        title: 'Out for Delivery',
        desc: 'Courier rider is out for delivery to Colombo 07.',
        time: 'Pending',
        done: false,
      },
      {
        title: 'Delivered',
        desc: 'Package delivered to recipient.',
        time: 'Pending',
        done: false,
      },
    ],
  },
  {
    id: 'FG-2026-3391',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    customer: {
      fullName: 'Nadeesha Senanayake',
      email: 'nadeesha.s@gmail.com',
      phone: '+94 71 987 6543',
      address: 'No. 58/2, Nawala Road',
      city: 'Nugegoda',
      postalCode: '10250',
      province: 'Western Province',
      deliveryNotes: 'Deliver during afternoon hours.',
    },
    items: [
      {
        id: 2,
        name: 'Royal Heritage Lehenga Set',
        price: 24500,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Deep Crimson',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&auto=format',
        subcategory: 'lehengas',
      },
    ],
    subtotal: 24500,
    shipping: 350,
    tax: 0,
    total: 24850,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    status: 'processing',
    bankReceipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop',
    bankReceiptName: 'Commercial_Bank_Transfer_Slip_FG3391.jpg',
    notes: 'Bank Transfer slip attached (Commercial Bank)',
    trackingNumber: 'FG-TRK-9942',
    courierPartner: 'Prompt Express (Islandwide)',
    estimatedDelivery: 'Within 2 - 3 Business Days',
    trackingTimeline: [
      {
        title: 'Order Placed',
        desc: 'Bank transfer order received with verified deposit slip attached.',
        time: 'Sep 06, 03:45 PM',
        done: true,
      },
      {
        title: 'Confirmed & Quality Inspected',
        desc: 'Awaiting boutique finance clearance and packaging.',
        time: 'Pending confirmation',
        done: false,
      },
      {
        title: 'Dispatched with Courier Partner',
        desc: 'Handed over to Prompt Express courier for islandwide delivery.',
        time: 'Pending dispatch',
        done: false,
      },
      {
        title: 'Out for Delivery',
        desc: 'Courier rider is in transit to destination address.',
        time: 'Pending arrival',
        done: false,
      },
      {
        title: 'Delivered',
        desc: 'Package delivered and signed for by customer.',
        time: 'Pending completion',
        done: false,
      },
    ],
  },
];

export function getLocalStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
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

// Real-time Firestore "orders" collection listener
export function subscribeToFirestoreOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (error: any) => void
): Unsubscribe | null {
  const db = getFirestoreDB();
  if (!db) return null;

  try {
    const colRef = collection(db, 'orders');
    return onSnapshot(
      colRef,
      snapshot => {
        if (snapshot.empty) return;
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
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return null;

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
    const docRef = doc(db, 'orders', order.id);
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
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Failed to delete order ${orderId} from Firestore:`, err);
    return false;
  }
}
