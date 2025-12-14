import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  images: string[];
  category: string;
  tags: string[];
  brand?: string;
  strength?: string;
  flavor?: string[];
  stock: number;
  trackInventory: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


