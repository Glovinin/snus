# 🚀 SnusIdea - Marketplace Platform

**Current Status:** High-Fidelity Frontend Prototype & Admin System (Ready for Payment Integration)  
**Last Updated:** February 2026

SnusIdea is a modern, scalable B2C marketplace platform designed for selling snus and nicotine products. It functions similarly to Amazon, allowing multiple sellers (brands) to list products while providing consumers with a unified, premium shopping experience.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (using new engine)
- **State Management:** Zustand (Cart & Global UI state)
- **Backend & Auth:** Firebase (Auth, Firestore, Storage)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

---

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router (Pages & Layouts)
│   ├── (auth)/            # Login/Signup groups
│   ├── admin/             # Seller/Admin Dashboard
│   ├── checkout/          # Checkout Flow (Info > Shipping > Payment)
│   ├── product/[slug]/    # Dynamic Product Details
│   └── api/               # Server-side API routes
├── components/
│   ├── ui/                # Reusable shadcn/radix-style components
│   ├── home/              # Homepage specific sections
│   ├── cart/              # Cart slide-over & logic
│   └── admin/             # Admin dashboard components
├── lib/
│   └── firebase/          # Firebase Configuration & Services
│       ├── auth.ts        # Authentication logic
│       ├── firestore.ts   # Database CRUD operations
│       └── storage.ts     # Image upload utilities
└── store/                 # Global state (cartStore.ts)
```

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- A Firebase Project (with Auth, Firestore, and Storage enabled)

### 2. Installation
Clone the repo and install dependencies:

```bash
git clone <repository-url>
cd snus-idea
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory. You **must** populate these with your Firebase credentials for the app to function.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (Future Integration)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧩 Key Features Status (Handover Notes)

This section details what is built and what needs to be completed by the next developer.

### ✅ Completed (Stable)
1.  **Storefront UI**: Fully responsive, premium design with animations.
    -   Hero, Category Grid, Product Carousel, Brands.
2.  **Product Browsing**:
    -   Product Details Page (`/product/[slug]`) with image gallery and variant selection.
    -   Shop Filters (Category, Brand, Strength).
3.  **Shopping Cart**:
    -   Global state using Zustand.
    -   Persists to local storage.
    -   Slide-over drawer UI.
4.  **Authentication**:
    -   Login/Signup pages connected to Firebase Auth.
    -   User session management.
5.  **Admin Dashboard (UI + Partial Logic)**:
    -   Product management interfaces.
    -   Image uploads to Firebase Storage.

### ⚠️ In Progress / To Do (Critical)
1.  **Checkout Flow (`/checkout`)**:
    -   **Current State**: The UI for Information, Shipping, and Payment steps is complete and beautiful.
    -   **Missing**: The "Pay Now" button is not connected to a real payment gateway.
    -   **Task**: Integate Stripe Elements or Redirect Checkout.
2.  **Order Fulfillment**:
    -   **Current State**: No order record is created in Firebase upon "checkout completion".
    -   **Task**: Create an `orders` collection in Firestore. Trigger creation via Webhook (after Stripe payment) or client-side (for MVP).
3.  **Inventory Sync**:
    -   **Task**: Decrement product stock levels upon successful order.

---

## 📝 Database Schema (Firestore)

Recommended reference schema for the next steps:

-   **`users`**: `{ uid, email, role, savedAddresses }`
-   **`products`**: `{ id, name, price, stock, images[], category, brand }`
-   **`orders`** (To Create):
    ```json
    {
      "id": "order_123",
      "userId": "auth_uid",
      "status": "pending | paid | shipped",
      "items": [{ "productId": "...", "quantity": 1, "price": 10.00 }],
      "total": 55.00,
      "createdAt": "timestamp"
    }
    ```

---

## 🤝 Handover Contact
For questions regarding the design system or current codebase architecture, please refer to the `PROJECT_STATUS.md` file for a historical log of decisions.
