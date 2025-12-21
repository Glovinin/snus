import { Timestamp } from "firebase/firestore";

export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  avatarUrl?: string;
  preferences?: {
    theme?: "light" | "dark";
    language?: string;
    currency?: string;
  };
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}




