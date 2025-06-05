# ONAI Payment System

Comprehensive subscription and payment management dashboard.

## 🚀 Features

- **Subscription Management** - View and manage subscription plans
- **Payment Methods** - Add, edit, and remove payment methods
- **Billing History** - Complete transaction history with filtering
- **Usage Analytics** - Track usage and billing metrics
- **Plan Management** - Upgrade/downgrade subscription plans
- **Invoice Generation** - Download invoices and receipts
- **Stripe Integration** - Secure payment processing

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Shadcn/UI** - High-quality component library
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Stripe** - Payment processing (ready for integration)

## 🚀 Quick Start

```bash
cd apps/payment-system
npm install
npm run dev
```

## 💳 Live Demo

**URL:** https://hwdvwfgc.manus.space

## 🎨 Components

### Dashboard
- Subscription overview
- Usage metrics
- Quick actions

### Subscription Plans
- Plan comparison
- Upgrade/downgrade flows
- Feature comparisons

### Payment Methods
- Credit card management
- Payment method validation
- Default payment selection

### Billing History
- Transaction history
- Invoice downloads
- Payment filtering

## 📦 Build & Deploy

```bash
npm run build    # Creates dist/ folder
npm run preview  # Preview production build
```

## 🔧 Configuration

Create `.env` file:
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_API_URL=https://api.onai.com
```

