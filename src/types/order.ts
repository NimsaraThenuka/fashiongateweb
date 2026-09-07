// Order Data Types for Fashion Gate E-commerce

export type OrderStatus =
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  image: string;
  subcategory?: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  province: string;
  deliveryNotes?: string;
}

export interface TrackingStep {
  title: string;
  desc: string;
  time: string;
  done: boolean;
  active?: boolean;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  province: string;
}

export interface CustomerUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  preferredSize?: string;
  bio?: string;
  createdAt: string;
  lastLoginAt?: string;
  defaultAddress?: CustomerAddress;
}

export interface Order {
  id: string; // e.g. "FG-2026-8942"
  createdAt: string; // ISO string
  userId?: string; // Google Auth UID
  userEmail?: string;
  userPhotoURL?: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  trackingTimeline: TrackingStep[];
  notes?: string;
  bankReceipt?: string;
  bankReceiptName?: string;
}
