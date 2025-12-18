import { Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  domain?: string;
  settings: {
    theme: "light" | "dark";
    primaryColor: string;
    currency: string;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}




