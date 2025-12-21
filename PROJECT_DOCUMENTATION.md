# SnusIdea - Project Documentation

> **Version:** 1.0
> **Last Updated:** December 21, 2024
> **Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Firebase, Zustand

---

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Directory Structure](#2-directory-structure)
3.  [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4.  [Type Definitions](#4-type-definitions)
5.  [Homepage (Public)](#5-homepage-public)
6.  [Shop Page](#6-shop-page)
7.  [Product Detail Page](#7-product-detail-page)
8.  [Cart & Checkout](#8-cart--checkout)
9.  [Authentication System](#9-authentication-system)
10. [Admin Dashboard](#10-admin-dashboard)
11. [Backend Integration Plan](#11-backend-integration-plan)
12. [Next Steps](#12-next-steps)

---

## 1. Project Overview

**SnusIdea** is a premium e-commerce platform for nicotine pouches (snus). The project currently features:

-   **Public Storefront**: Homepage with hero slider, product carousels, and category grids.
-   **Shop Page**: Full product listing with filtering by brand, strength, flavor, and price.
-   **Product Detail Page**: Detailed product view with pack size selection and reviews.
-   **Cart System**: Persistent cart using Zustand + localStorage.
-   **Checkout Flow**: Multi-step checkout (Info → Shipping → Payment) - UI only.
-   **Authentication**: Firebase Auth with Email/Password and Google Sign-In.
-   **Admin Dashboard**: Protected admin area with pages for Dashboard, Products, Orders, Customers, Analytics, and Settings.

---

## 2. Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin Dashboard (Protected)
│   │   ├── layout.tsx            # Admin layout with auth guard
│   │   ├── page.tsx              # Redirects to /admin/dashboard
│   │   ├── dashboard/page.tsx    # Main metrics overview
│   │   ├── products/             # Product management
│   │   │   ├── page.tsx          # Products list + Sheet
│   │   │   └── new/page.tsx      # New product page
│   │   ├── orders/page.tsx       # Orders management
│   │   ├── customers/page.tsx    # Customer list
│   │   ├── analytics/page.tsx    # Charts & insights
│   │   └── settings/page.tsx     # Store settings
│   ├── auth/                     # Auth callback handlers
│   ├── checkout/page.tsx         # Multi-step checkout
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Registration page
│   ├── product/[id]/page.tsx     # Product detail page
│   ├── shop/page.tsx             # Shop with filters
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/
│   ├── admin/                    # Admin components
│   │   ├── AdminTable.tsx        # Reusable table component
│   │   ├── Header.tsx            # Admin header
│   │   ├── MetricCard.tsx        # KPI cards
│   │   ├── PageHeader.tsx        # Page title + action button
│   │   ├── RevenueChart.tsx      # Recharts charts
│   │   ├── Sidebar.tsx           # Admin navigation
│   │   └── products/
│   │       └── ProductSheet.tsx  # Add/Edit product sheet
│   ├── auth/                     # Auth components
│   │   └── AccountSheet.tsx      # User account dropdown
│   ├── cart/
│   │   └── Cart.tsx              # Sliding cart drawer
│   ├── home/                     # Homepage sections
│   │   ├── Hero.tsx              # Hero slider
│   │   ├── CategoryGrid.tsx      # Category cards
│   │   ├── BrandCarousel.tsx     # Brand logos
│   │   ├── ProductCarousel.tsx   # Featured products
│   │   ├── DealsSection.tsx      # Deals & promotions
│   │   ├── Testimonials.tsx      # Customer reviews
│   │   └── ...                   # More sections
│   ├── layout/
│   │   ├── Header.tsx            # Main site header
│   │   ├── Footer.tsx            # Site footer
│   │   └── MobileMenu.tsx        # Mobile navigation
│   ├── orders/
│   │   └── OrderHistorySheet.tsx # Order history panel
│   ├── support/
│   │   └── ChatBot.tsx           # Support chat widget
│   └── ui/                       # UI primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── sheet.tsx             # Slide-over panel
│
├── contexts/
│   └── AuthContext.tsx           # Firebase auth context
│
├── data/
│   └── products.ts               # Mock product data (to be replaced)
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts             # Firebase initialization
│   │   ├── auth.ts               # Auth functions
│   │   ├── firestore.ts          # Firestore CRUD helpers
│   │   └── storage.ts            # File upload functions
│   └── utils.ts                  # Utility functions (cn)
│
├── store/
│   └── cartStore.ts              # Zustand cart state
│
└── types/
    ├── product.ts                # Product type (for backend)
    ├── order.ts                  # Order & OrderItem types
    ├── user.ts                   # User & UserRole types
    └── store.ts                  # Store type (for multi-vendor)
```

---

## 3. Tech Stack & Dependencies

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.0.3 | React framework |
| react | 19.2.0 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Styling |

### State & Data
| Package | Purpose |
|---------|---------|
| zustand | Cart & global state |
| @supabase/supabase-js | Not currently used (Firebase instead) |
| firebase | Auth, Firestore, Storage |

### Forms & Validation
| Package | Purpose |
|---------|---------|
| react-hook-form | Form handling |
| @hookform/resolvers | Zod integration |
| zod | Schema validation |

### UI & Animation
| Package | Purpose |
|---------|---------|
| framer-motion | Animations |
| lucide-react | Icons |
| recharts | Charts (admin) |
| react-hot-toast | Toast notifications |

---

## 4. Type Definitions

### Product (Backend-ready)
**File:** `src/types/product.ts`

```typescript
interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;              // In cents or decimal
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
  dimensions?: { length, width, height };
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  sales: number;
  rating: number;
  reviewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Order
**File:** `src/types/order.ts`

```typescript
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Order {
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
```

### User
**File:** `src/types/user.ts`

```typescript
type UserRole = "buyer" | "seller" | "admin";

interface User {
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
  address?: Address;
}
```

---

## 5. Homepage (Public)

**Route:** `/` → `src/app/page.tsx`

### Components Used
| Component | Description |
|-----------|-------------|
| `Header` | Main navigation with mega menu, cart, user dropdown |
| `Hero` | Full-screen slider with 3 brand banners (auto-play, 6s) |
| `CategoryGrid` | Category cards linking to filtered shop |
| `BrandCarousel` | Brand logos |
| `ProductCarousel` | Featured products with add-to-cart |
| `DealsSection` | Promotional banners and deals |
| `Testimonials` | Customer reviews |
| `Footer` | Site footer with links |
| `ChatBot` | Support widget (hidden on `/admin/*`) |

### Data Source
- Currently uses **mock data** from `src/data/products.ts`
- Hero slides are hardcoded in `Hero.tsx`

### Backend Requirements
- [ ] Fetch featured products from Firestore
- [ ] Fetch hero banners from CMS/Firestore
- [ ] Dynamic categories from Firestore

---

## 6. Shop Page

**Route:** `/shop` → `src/app/shop/page.tsx`

### Features
1. **URL-based Filters**: Supports query params (`?brand=Velo&strength=STRONG&flavor=Mint&sort=price-asc`)
2. **Sidebar Filters**:
   - Price Range (€ min/max inputs)
   - Brands (checkbox pills)
   - Strength (WEAK, MEDIUM, STRONG, EXTRA, EXTREME)
   - Flavor (dynamic from products)
3. **Sort Options**: Featured, Price Low→High, Price High→Low, Name A-Z
4. **Mobile Drawer**: Responsive filter drawer for mobile
5. **Product Cards**: Pack size selector, add to cart directly

### Filter Logic
```typescript
const filteredProducts = products.filter(product => {
  const brandMatch = selectedBrands.includes(productBrand);
  const strengthMatch = selectedStrengths.includes(product.strength);
  const flavorMatch = selectedFlavors.includes(product.flavor);
  const priceMatch = price >= min && price <= max;
  return brandMatch && strengthMatch && flavorMatch && priceMatch;
});
```

### Data Source
- **Mock**: `src/data/products.ts` (5 products)
- Products have: id, name, category, price, image (CSS class), textColor, description, features[], reviews[], strength, flavor

### Backend Requirements
- [ ] Firestore collection: `products`
- [ ] Real-time filtering with Firestore queries
- [ ] Pagination for large catalogs
- [ ] Algolia/Meilisearch for advanced search

---

## 7. Product Detail Page

**Route:** `/product/[id]` → `src/app/product/[id]/page.tsx`

### Features
- Dynamic routing by product ID
- Pack size selector (1, 5, 10, 20, 40)
- Quantity selector
- Add to Cart functionality
- Customer reviews section
- Stock status badge
- Trustpilot rating display

### Data Flow
```
URL param (id) → Find product in mock data → Render details
```

### Backend Requirements
- [ ] Fetch single product by ID/slug
- [ ] Fetch reviews from sub-collection
- [ ] Real-time stock status
- [ ] Related products recommendation

---

## 8. Cart & Checkout

### Cart System
**Store:** `src/store/cartStore.ts` (Zustand + localStorage persistence)

```typescript
interface CartItem {
  id: string;
  name: string;
  variant: string;        // e.g. "Strong • 5 Pack"
  price: number;          // Pack price
  quantity: number;
  image: string;
  bgClass: string;
}

// Actions
addItem(item)             // Add or increment
removeItem(id, variant)   // Remove item
updateQuantity(id, variant, qty)
clearCart()
getTotalItems()
getSubtotal()
openCart() / closeCart() / toggleCart()
```

### Cart UI
**Component:** `src/components/cart/Cart.tsx`
- Slide-over drawer with animation
- Edit quantities inline
- Remove items
- Subtotal calculation
- "Checkout" button → `/checkout`

### Checkout Flow
**Route:** `/checkout` → `src/app/checkout/page.tsx`

**Steps:**
1. **Information**: Email, Shipping Address (name, street, city, postal)
2. **Shipping**: Method selection (Standard free over €50, or €5.90)
3. **Payment**: Credit card form (mock UI)

### Backend Requirements
- [ ] Stripe integration for payments
- [ ] Create Order document in Firestore
- [ ] Send confirmation email
- [ ] Inventory decrement on order
- [ ] Order status webhooks

---

## 9. Authentication System

### Firebase Auth
**Config:** `src/lib/firebase/config.ts`
**Functions:** `src/lib/firebase/auth.ts`

| Function | Description |
|----------|-------------|
| `signUp(email, password, displayName, role)` | Create user + Firestore doc |
| `signIn(email, password)` | Email login |
| `signInWithGoogle(role)` | Google OAuth |
| `logout()` | Sign out |
| `resetPassword(email)` | Password reset email |
| `getUserData(userId)` | Get user from Firestore |
| `updateUserData(userId, data)` | Update user profile |

### Auth Context
**File:** `src/contexts/AuthContext.tsx`

```typescript
interface AuthContextType {
  user: FirebaseUser | null;    // Firebase auth user
  userData: User | null;        // Firestore user doc
  loading: boolean;
  signOut(): Promise<void>;
  refreshUserData(): Promise<void>;
}
```

### User Roles
- `buyer`: Default role, can purchase
- `seller`: Can manage products (future multi-vendor)
- `admin`: Full access to admin dashboard

---

## 10. Admin Dashboard

**Route:** `/admin/*`
**Layout:** `src/app/admin/layout.tsx`

### Access Control
```typescript
// Admin layout checks:
1. User is logged in → else redirect to /login
2. User role === 'admin' → else redirect to /
```

### Pages

#### Dashboard (`/admin/dashboard`)
- 4 Metric Cards: Revenue, Orders, Returning Rate, Active Users
- Revenue Over Time chart (Recharts AreaChart)
- Recent Sales list

**Data:** Currently all **mock data**

#### Products (`/admin/products`)
- Product table with: Name, Category, Price, Inventory, SKU, Actions
- Search functionality
- **ProductSheet** for Add/Edit (slide-over panel)
- Delete with toast confirmation

**Data:** Mock array `PRODUCTS_DATA`

#### Orders (`/admin/orders`)
- Orders table with: Order ID, Date, Customer, Status, Total, Items
- Status badges (pending, processing, shipped, delivered, cancelled)

**Data:** Mock array

#### Customers (`/admin/customers`)
- Customer list with: Name, Email, Location, Orders, Total Spent

**Data:** Mock array

#### Analytics (`/admin/analytics`)
- 4 Metric Cards: Total Sales, Sessions, Conversion Rate, Orders
- Sales over time chart
- Top selling products bar chart

**Data:** Mock

#### Settings (`/admin/settings`)
- Store configuration (TBD)

---

## 11. Backend Integration Plan

### Phase 1: Products (Priority: HIGH)

**Firestore Collection:** `products`

```
products/
  └── {productId}/
      ├── name: string
      ├── slug: string
      ├── description: string
      ├── price: number
      ├── sku: string
      ├── images: string[]
      ├── category: string
      ├── brand: string
      ├── strength: string
      ├── flavor: string[]
      ├── stock: number
      ├── isActive: boolean
      ├── isFeatured: boolean
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

**Tasks:**
- [ ] Create `getProducts()` function with filters
- [ ] Create `getProductById(id)` function
- [ ] Create `createProduct(data)` function
- [ ] Create `updateProduct(id, data)` function
- [ ] Create `deleteProduct(id)` function
- [ ] Replace mock data in Shop page
- [ ] Replace mock data in Admin Products page
- [ ] Image upload to Firebase Storage

### Phase 2: Orders (Priority: HIGH)

**Firestore Collection:** `orders`

```
orders/
  └── {orderId}/
      ├── userId: string
      ├── orderNumber: string
      ├── status: string
      ├── items: array
      ├── subtotal: number
      ├── shipping: number
      ├── total: number
      ├── shippingAddress: map
      ├── paymentStatus: string
      ├── stripePaymentIntentId: string
      └── createdAt: timestamp
```

**Tasks:**
- [ ] Stripe Checkout integration
- [ ] Create order on successful payment
- [ ] Decrement stock on order
- [ ] Order confirmation email (SendGrid/Resend)
- [ ] Real order list in Admin

### Phase 3: Users & Customers (Priority: MEDIUM)

**Tasks:**
- [ ] Customer list from Firestore users
- [ ] Order history per user
- [ ] User profile editing
- [ ] Address book management

### Phase 4: Analytics (Priority: LOW)

**Tasks:**
- [ ] Calculate real metrics from orders
- [ ] Revenue aggregation by date
- [ ] Product sales ranking
- [ ] Session tracking (optional: Analytics)

---

## 12. Next Steps

### Immediate (This Sprint)
1. ✅ Document current state (this file)
2. Create Firestore collections structure
3. Implement product CRUD functions
4. Connect Admin Products page to Firestore
5. Connect Shop page to Firestore

### Short-term
6. Implement Stripe Checkout
7. Create orders on payment
8. Real-time order status updates
9. Email notifications

### Future
10. Inventory management (low stock alerts)
11. Multi-image product gallery
12. Reviews system
13. Discount codes / promotions
14. Multi-vendor support (using `storeId`)

---

## Quick Reference

### Local Development
```bash
npm run dev    # Start dev server on localhost:3000
npm run build  # Production build
npm run lint   # Run ESLint
```

### Firebase Collections
- `users` - User profiles
- `products` - Product catalog
- `orders` - Customer orders

### Key Files to Modify for Backend Integration
1. `src/app/shop/page.tsx` - Replace mock products
2. `src/app/admin/products/page.tsx` - CRUD operations
3. `src/app/checkout/page.tsx` - Stripe integration
4. `src/lib/firebase/firestore.ts` - Add product/order functions

---

*Document maintained by the development team. Update as features are implemented.*
