# SnusIdea - Developer & User Manual

**Last Updated:** February 2026
**Status:** Advanced Frontend MVP (Ready for Payment Integration)
**License:** Private / Proprietary

---

## 📖 Introduction

**SnusIdea** is a modern B2C marketplace platform for nicotine products, built with the latest web technologies. It is designed to be scalable, fast, and aesthetically premium, mimicking the feature set of major e-commerce platforms like Amazon, but tailored for a specific niche.

This document serves as the **comprehensive manual** for developers and administrators to understand, run, and extend the platform.

---

## 🛠 Technology Stack

The project relies on a modern React ecosystem stack:

-   **Frontend:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Cart & UI State)
-   **Backend (Serverless):** [Firebase](https://firebase.google.com/)
    -   **Auth:** User authentication
    -   **Firestore:** NoSQL Database
    -   **Storage:** Image hosting
-   **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
-   Node.js 18.17 or later
-   npm, yarn, or Bun
-   A Google Firebase project (free tier is sufficient)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Glovinin/snus.git
cd snus

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory. You will need API keys from your Firebase Console.

> **Note:** The repository comes with an `.env.example` file. Copy it to `.env.local` and fill in the values.

```env
# .env.local

# Firebase Credentials (Found in Project Settings > General > Your apps)
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://project.firebaseio.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:123..."
```

### 4. Running Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📂 Project Architecture

The project follows the standard Next.js App Router structure with feature-based grouping.

```
src/
├── app/                        # Pages & Routes
│   ├── (auth)/                 # Login/Signup/Recovery (Route Groups)
│   ├── admin/                  # Protected Admin Dashboard
│   ├── checkout/               # Checkout Flow Steps
│   ├── product/[id]/           # Dynamic Product Details
│   ├── shop/                   # Filterable Product Listing
│   └── api/                    # Server-side API endpoints
├── components/
│   ├── ui/                     # Reusable atoms (Buttons, Inputs, etc.)
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── home/                   # Homepage sections (Hero, Carousel)
│   ├── admin/                  # Admin-specific components
│   └── cart/                   # Cart drawer components
├── lib/
│   └── firebase/               # Firebase configuration & helpers
├── store/                      # Global State (Zustand)
└── types/                      # TypeScript definitions (Interfaces)
```

### Key Directories Explained

-   **`src/components/ui`**: Contains the "design system". These are generic, reusable components like `Button.tsx`, `Input.tsx`, `Sheet.tsx` (Sidebar), built on top of Radix UI primitives.
-   **`src/lib/firebase`**: Contains the logic to connect to the backend.
    -   `config.ts`: Initializes the app.
    -   `auth.ts`: Helper functions for Sign In/Up/Out.
    -   `firestore.ts`: Helper functions to CRUD documents in database.
-   **`src/store/cartStore.ts`**: The brain of the shopping cart. It handles adding items, calculating totals, and saving the cart to the browser's Local Storage so it survives page reloads.

---

## 📱 Features & How to Use

### 1. The Storefront (User Side)
-   **Filtering**: Users can filter products by Brand, Strength, and Price on the `/shop` page. This is handled by URL query parameters, making the filters shareable.
-   **Cart**: The cart is accessible from the header. It opens as a "Sheet" (slide-over) from the right. Users can adjust quantities or remove items.
-   **Authentication**: Users can sign up with Email/Password or Google. Accounts are created in Firebase Auth.

### 2. The Admin Dashboard
-   **Route:** `/admin`
-   **Access:** Only accessible to users with specific credentials/roles (customizable).
-   **Capabilities:**
    -   **Overview:** View key metrics (Sales, Orders).
    -   **Products:** Add and edit products. Includes an **Image Uploader** that automatically compresses images before saving to Firebase Storage.
    -   **Orders:** View customer orders (Needs Firestore connection).

### 3. Checkout Flow
-   **Route:** `/checkout`
-   **Steps:**
    1.  **Information**: Captures shipping details.
    2.  **Shipping**: Selects delivery method.
    3.  **Payment**: Credit Card entry.
-   **Integration Note:** The UI is complete, but the "Pay Now" button needs to be connected to a Payment Processor (like Stripe or PayPal) to process real money.

---

## 💾 Database Schema (Reference)

When connecting the real database (Firestore), follow this data structure to ensure compatibility with the frontend code.

### Collection: `products`
```json
{
  "id": "auto_generated",
  "name": "Kratos Black Cherry",
  "price": 12.90,
  "description": "...",
  "category": "nicotine_pouches",
  "brand": "Kratos",
  "stock": 100,
  "images": ["url1", "url2"],
  "variants": [
    { "strength": "strong", "sku": "KRA-BC-S" }
  ],
  "createdAt": "timestamp"
}
```

### Collection: `users`
```json
{
  "uid": "user_auth_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "customer",
  "createdAt": "timestamp"
}
```

### Collection: `orders` (To Be Implemented)
```json
{
  "orderId": "ORD-2026-001",
  "userId": "user_auth_id",
  "status": "pending",
  "items": [
    { "productId": "...", "qty": 1, "price": 12.90 }
  ],
  "totalAmount": 12.90,
  "shippingAddress": { ... }
}
```

---

## ⚠️ Known Issues & Handover Notes

1.  **Payment Gateway:** The Checkout page (`src/app/checkout/page.tsx`) mimics a successful payment but does not charge a card. You must integrate the Stripe API or similar.
2.  **Email Notifications:** There is currently no email service (like SendGrid or Resend) connected to send order confirmations.
3.  **Admin Protection:** Ensure extensive Security Rules are applied in the Firebase Console to prevent unauthorized users from writing to the `products` database.

---

## 📄 License

This codebase is proprietary. Unauthorized copying, distribution, or use is strictly prohibited without permission from the owner.
