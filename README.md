# SnusIdea - The Amazon of Snus

**SnusIdea** is a modern B2C marketplace platform designed to revolutionize the snus and nicotine products industry. Our mission is to become the leading global marketplace where businesses can create their own stores and sell directly to consumers worldwide.

## 🎯 Platform Overview

SnusIdea is a comprehensive e-commerce marketplace that enables businesses to:

- **Create Custom Stores**: Each seller gets their own branded storefront with a unique URL (e.g., `yourstore.snusidea.com`)
- **Sell Globally**: Reach millions of consumers worldwide through our unified platform
- **Manage Everything**: Complete control panel for products, orders, inventory, and sales analytics
- **Scale Effortlessly**: Built on robust infrastructure designed for growth

Think of it as **Amazon for snus products** - a centralized marketplace where multiple sellers can operate their own stores while benefiting from our global reach, secure payment processing, and streamlined logistics.

## 🚀 How It Works

### For Sellers (Businesses)

1. **Sign Up**: Register as a seller and create your store profile
2. **Customize Your Store**: Build your unique storefront with custom branding
3. **Add Products**: List your snus products with detailed descriptions, images, and pricing
4. **Get Your Store URL**: Receive a dedicated store link (e.g., `mystore.snusidea.com`)
5. **Start Selling**: Begin receiving orders from customers worldwide
6. **Manage Orders**: Track sales, manage inventory, and handle fulfillment through your dashboard

### For Buyers (Consumers)

1. **Browse Products**: Explore products from multiple sellers in one place
2. **Shop by Store**: Visit individual seller stores or browse the marketplace
3. **Secure Checkout**: Complete purchases with SSL-secured payments
4. **Track Orders**: Monitor your orders from purchase to delivery

## 🏗️ Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **State Management**: React Hooks & Context API

### Backend & Services
- **Backend**: Firebase
  - **Firestore**: NoSQL database for products, orders, and user data
  - **Authentication**: Firebase Auth (Email/Password, OAuth providers)
  - **Storage**: Firebase Storage for product images and files
  - **Cloud Functions**: Serverless functions for backend logic
  - **Real-time**: Firestore real-time listeners for live updates
- **Payment Processing**: Stripe
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── login/             # Authentication pages
│   └── layout.tsx         # Root layout
├── components/
│   ├── home/              # Homepage sections
│   ├── layout/            # Header, Footer
│   ├── cart/              # Shopping cart
│   ├── search/            # Search functionality
│   └── ui/                # Reusable UI components
├── lib/
│   ├── firebase/          # Firebase configuration and utilities
│   │   ├── config.ts      # Firebase initialization
│   │   ├── auth.ts        # Authentication helpers
│   │   ├── firestore.ts   # Firestore database helpers
│   │   └── storage.ts      # Firebase Storage helpers
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Firebase account ([Sign up here](https://firebase.google.com/))
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Snus codebase"
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - **Authentication**: Enable Email/Password and any OAuth providers you need
   - **Firestore Database**: Create a database in production mode
   - **Storage**: Enable Firebase Storage
   - **Cloud Functions**: (Optional) For serverless backend functions
3. Get your Firebase config from Project Settings > General > Your apps
4. Add the configuration values to your `.env.local` file

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Features

### Current Features

- ✅ Modern, responsive homepage design
- ✅ Product browsing and carousels
- ✅ Category navigation
- ✅ Shopping cart functionality
- ✅ Search overlay
- ✅ User authentication (login page)
- ✅ SSL-secured checkout
- ✅ Multiple payment methods support
- ✅ Seller store creation interface (B2C section)

### Coming Soon

- 🔄 Full Firebase integration
- 🔄 Product database and management (Firestore)
- 🔄 User authentication system (Firebase Auth)
- 🔄 Store creation and customization
- 🔄 Order management system
- 🔄 Payment processing integration (Stripe)
- 🔄 Inventory management
- 🔄 Seller dashboard analytics
- 🔄 Real-time notifications
- 🔄 B2B features (wholesale, bulk orders)

## 🛣️ Roadmap

### Phase 1: B2C Marketplace (Current Focus)
- Complete Firebase backend integration
- User authentication and authorization (Firebase Auth)
- Firestore database setup and schema design
- Store creation and management
- Product listing and management
- Shopping cart and checkout
- Order processing and tracking
- Payment gateway integration (Stripe)
- Firebase Storage for product images

### Phase 2: Enhanced Features
- Advanced search and filtering
- Product reviews and ratings
- Seller analytics dashboard
- Marketing tools for sellers
- Multi-language support
- Mobile app

### Phase 3: B2B Platform (Future)
- Wholesale pricing tiers
- Bulk order management
- B2B invoicing system
- International shipping optimization
- Direct brand-to-retailer connections

## 🔒 Security

- SSL encryption (256-bit)
- Secure payment processing (Stripe)
- Firebase Security Rules for Firestore and Storage
- Protected API routes and middleware
- Secure authentication flows (Firebase Auth)
- Environment variable protection
- CORS configuration
- Input validation and sanitization

## 💳 Payment

- **Stripe**: Integrated payment processing
  - Credit/Debit cards
  - Multiple payment methods support
  - Secure checkout flow
  - Payment webhooks for order confirmation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Firebase Services Used

- **Firestore**: Main database for storing products, orders, users, and stores
- **Firebase Authentication**: User authentication and authorization
- **Firebase Storage**: Product images and file uploads
- **Cloud Functions**: (Future) Serverless backend functions for complex operations

### Database Schema (Firestore Collections)

- `users` - User profiles and preferences
- `stores` - Seller store information
- `products` - Product listings
- `orders` - Customer orders
- `cart` - Shopping cart items (per user)
- `categories` - Product categories

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

## 📧 Contact

For inquiries about SnusIdea, please reach out through the platform's contact form.

---

Built with ❤️ by Glovinin
