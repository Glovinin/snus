import { Timestamp } from "firebase/firestore";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


