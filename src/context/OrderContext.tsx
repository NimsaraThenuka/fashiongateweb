import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus, CustomerDetails, OrderItem, PaymentMethod, TrackingStep } from '../types/order';
import {
  getLocalStoredOrders,
  saveLocalStoredOrders,
  fetchOrdersFromFirestore,
  saveOrderToFirestore,
  deleteOrderFromFirestore,
  subscribeToFirestoreOrders,
  getMyOrderIds,
  addMyOrderId,
} from '../services/orderService';

interface PlaceOrderPayload {
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (payload: PlaceOrderPayload) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, customNote?: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;
  getMyOrders: () => Order[];
  trackOrder: (orderId: string, emailOrPhone?: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => getLocalStoredOrders());

  // Subscribe to real-time Firestore updates and sync across browser tabs
  useEffect(() => {
    let isMounted = true;

    // Initial fetch from Firestore
    fetchOrdersFromFirestore().then(cloudOrders => {
      if (isMounted && cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
        saveLocalStoredOrders(cloudOrders);
      }
    });

    // Real-time Firestore stream
    const unsubscribe = subscribeToFirestoreOrders(cloudOrders => {
      if (isMounted && cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
        saveLocalStoredOrders(cloudOrders);
      }
    });

    // Cross-tab storage listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fashiongate_live_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && isMounted) {
            setOrders(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const broadcastOrders = (newOrders: Order[]) => {
    saveLocalStoredOrders(newOrders);
    try {
      window.dispatchEvent(new CustomEvent('fashiongate_orders_updated', { detail: newOrders }));
    } catch {
      // ignore
    }
  };

  // Generate unique Order Key: e.g. "FG-2026-8942"
  const generateUniqueOrderId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `FG-${year}-${randomNum}`;
  };

  const createInitialTimeline = (orderId: string): TrackingStep[] => {
    const now = new Date();
    const timeFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return [
      {
        title: 'Order Placed',
        desc: `Order ${orderId} placed successfully via Fashion Gate boutique.`,
        time: timeFormatted,
        done: true,
      },
      {
        title: 'Confirmed & Quality Inspected',
        desc: 'Items verified, quality checked, and prepared for luxury packaging.',
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
    ];
  };

  const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
    const uniqueId = generateUniqueOrderId();
    const nowIso = new Date().toISOString();

    const newOrder: Order = {
      id: uniqueId,
      createdAt: nowIso,
      customer: payload.customer,
      items: payload.items,
      subtotal: payload.subtotal,
      shipping: payload.shipping,
      tax: payload.tax,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'card' ? 'paid' : 'pending',
      status: 'processing',
      trackingNumber: `TRK-${uniqueId.replace('FG-', '')}`,
      courierPartner: 'Prompt Express (Islandwide Delivery)',
      estimatedDelivery: 'Within 2 - 3 Business Days',
      trackingTimeline: createInitialTimeline(uniqueId),
      notes: payload.notes,
    };

    const nextList = [newOrder, ...orders];
    setOrders(nextList);
    broadcastOrders(nextList);
    addMyOrderId(uniqueId);

    // Save to Firestore in background
    saveOrderToFirestore(newOrder).catch(err =>
      console.warn('Firestore order save error:', err)
    );

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    customNote?: string
  ): Promise<boolean> => {
    let updatedOrder: Order | null = null;
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const nextList = orders.map(o => {
      if (o.id === orderId) {
        // Update timeline steps based on status
        const timeline = o.trackingTimeline.map(step => {
          if (step.title.toLowerCase().includes('placed')) return { ...step, done: true };
          if (newStatus === 'confirmed' || newStatus === 'shipped' || newStatus === 'out_for_delivery' || newStatus === 'delivered') {
            if (step.title.toLowerCase().includes('confirmed')) {
              return { ...step, done: true, time: step.time === 'Pending confirmation' ? nowFormatted : step.time };
            }
          }
          if (newStatus === 'shipped' || newStatus === 'out_for_delivery' || newStatus === 'delivered') {
            if (step.title.toLowerCase().includes('dispatched') || step.title.toLowerCase().includes('courier')) {
              return { ...step, done: true, time: step.time.includes('Pending') ? nowFormatted : step.time };
            }
          }
          if (newStatus === 'out_for_delivery' || newStatus === 'delivered') {
            if (step.title.toLowerCase().includes('out for delivery')) {
              return { ...step, done: true, time: step.time.includes('Pending') ? nowFormatted : step.time };
            }
          }
          if (newStatus === 'delivered') {
            if (step.title.toLowerCase().includes('delivered')) {
              return { ...step, done: true, time: nowFormatted };
            }
          }
          return step;
        });

        updatedOrder = {
          ...o,
          status: newStatus,
          paymentStatus: newStatus === 'delivered' && o.paymentMethod === 'cod' ? 'paid' : o.paymentStatus,
          trackingTimeline: timeline,
          notes: customNote ? `${o.notes ? o.notes + '\n' : ''}[${nowFormatted}] ${customNote}` : o.notes,
        };
        return updatedOrder;
      }
      return o;
    });

    setOrders(nextList);
    broadcastOrders(nextList);

    if (updatedOrder) {
      await saveOrderToFirestore(updatedOrder);
      return true;
    }
    return false;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    const nextList = orders.filter(o => o.id !== orderId);
    setOrders(nextList);
    broadcastOrders(nextList);
    await deleteOrderFromFirestore(orderId);
    return true;
  };

  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      const cleanId = orderId.trim().toUpperCase();
      return orders.find(o => o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId);
    },
    [orders]
  );

  const getMyOrders = useCallback((): Order[] => {
    const myIds = getMyOrderIds();
    return orders.filter(o => myIds.includes(o.id));
  }, [orders]);

  const trackOrder = useCallback(
    (orderId: string, emailOrPhone?: string): Order | undefined => {
      const cleanId = orderId.trim().toUpperCase();
      const found = orders.find(
        o => o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId
      );

      if (!found) return undefined;

      if (emailOrPhone && emailOrPhone.trim()) {
        const query = emailOrPhone.trim().toLowerCase();
        const emailMatches = found.customer.email.toLowerCase().includes(query);
        const phoneMatches = found.customer.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
        if (!emailMatches && !phoneMatches) {
          // If query doesn't match email/phone, still allow direct ID match if it's exact
          return found;
        }
      }

      return found;
    },
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        getMyOrders,
        trackOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
