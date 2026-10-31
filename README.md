# LoomPilot — Premium Client Portal
## Production-Grade B2B Textile Manufacturing Management Application
### Built with React 18, TypeScript, Vite & Tailwind CSS

LoomPilot is an AI-assisted textile manufacturing management platform that connects enterprise textile brands (e.g., Raymond Apparel) directly with mill operations, offering complete visibility across the manufacturing lifecycle from initial quotation negotiation to loom weaving, laboratory quality certification, and milestone disbursements.

---

### 🎨 Visual Identity & Design System

- **Warm Ivory (`#FBF6F0`)**: Primary workspace canvas providing an authentic paper and fine-linen look.
- **Textile Vermilion (`#E65338`)**: Primary action accent inspired by loom shuttles, active production stages, and high-priority alerts.
- **Deep Charcoal (`#252622`)**: Authoritative dark tone for the collapsible sidebar, header typography, and data tables.
- **Success Green (`#20845A`)**: Certified quality stages, completed production milestones, and settled payments.
- **Warning Amber (`#C78627`)**: Awaiting quotation, price revision counter-offers, and pending milestone invoices.
- **Typography**: Plus Jakarta Sans / Inter paired with JetBrains Mono for order numbers, GSM counts, and Razorpay gateway transaction IDs.

---

### 🏛️ Complete Routing & Page Architecture (14 Routes)

| Page | Route | Description |
|---|---|---|
| **Client Login** | `/client/login` | Strict enterprise authentication with demo credentials helper banner |
| **Client Registration** | `/client/register` | Onboards new textile brand mill entities into `localStorage` |
| **Overview Dashboard** | `/client/dashboard` | Key metrics, active order spotlight, loom velocity Recharts graph, recent activity |
| **Product Catalogue** | `/client/products` | Image-led textile fabric catalogue with GSM, weave, and category filtering |
| **Product Details** | `/client/products/:id` | Mill technical datasheet, engineered properties, lab shade swatches, order CTA |
| **Create Manufacturing Order** | `/client/orders/new` | 4-step wizard with Zod validation, catalogue/custom weave selection, confirmation modal |
| **My Orders** | `/client/orders` | Full order management table with status filtering, search, sorting, and stage badges |
| **Order Details** | `/client/orders/:id` | Full technical specifications, 30/40/30 commercial milestone ledger, plant destination |
| **Production Tracking** | `/client/orders/:id/tracking` | Exact 8-stage production timeline, clickable stage inspector, daily loom output chart |
| **Quotations & Revisions** | `/client/quotations` | Binding quotation sheets, approved price revisions, cost savings calculation (₹2.34L) |
| **Negotiation Chat Workspace** | `/client/messages` | Two-panel negotiation workspace with AI concierge triage and Admin revision proposals |
| **Payments & Invoices** | `/client/payments` | Split milestone tracking, tax invoices, PDF download, and simulated Razorpay modal |
| **Notification Centre** | `/client/notifications` | Categorized operational alerts (Quotes, Production, Payments) with deep links |
| **Client Profile & Settings** | `/client/settings` | Company profile, delivery plant address, password update, notification toggles, demo reset |

---

### 📂 Clean Code Architecture

```
src/
├── assets/                 # SVGs and brand iconography
├── components/
│   ├── common/
│   │   └── Toaster.tsx     # Animated toast notifications system
│   ├── layout/
│   │   ├── ClientLayout.tsx# Main shell layout with responsive sidebar & header
│   │   ├── Header.tsx      # Sticky topbar with search, support modal & user menu
│   │   └── Sidebar.tsx     # Collapsible / mobile drawer navigation
│   └── payments/
│       └── RazorpayModal.tsx# Simulated Razorpay checkout with success/failure triggers
├── context/
│   ├── AuthContext.tsx     # Authentication state, login/register validation, session persistence
│   └── AppContext.tsx      # Global store for orders, products, invoices, chats, notifications, metrics
├── data/
│   └── mockData.ts         # High-fidelity textile dataset for Raymond Apparel Ltd.
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── OverviewPage.tsx
│   ├── messages/
│   │   └── MessagesPage.tsx
│   ├── notifications/
│   │   └── NotificationsPage.tsx
│   ├── orders/
│   │   ├── CreateOrderPage.tsx
│   │   ├── MyOrdersPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   └── ProductionTrackingPage.tsx
│   ├── payments/
│   │   └── PaymentsPage.tsx
│   ├── products/
│   │   ├── ProductCataloguePage.tsx
│   │   └── ProductDetailPage.tsx
│   ├── quotations/
│   │   └── QuotationsPage.tsx
│   └── settings/
│       └── SettingsPage.tsx
├── services/
│   └── storageService.ts   # LocalStorage manager with fallback to mock data
├── types/
│   └── index.ts            # Complete TypeScript domain models and interfaces
├── utils/
│   ├── cn.ts               # Tailwind class merger
│   └── formatters.ts       # Currency (₹), Lakhs, Metres, and Number formatters
├── App.tsx                 # React Router routing configuration
├── index.css               # Tailwind directives & base styles
└── main.tsx                # React DOM root mounting
```

---

### 🚀 Development & Production Scripts

#### Run Development Server:
```bash
npm run dev
```
Accessible at: `http://localhost:3000`

#### Run TypeScript Type Check:
```bash
npx tsc --noEmit
```

#### Run Production Build:
```bash
npm run build
```
Creates an optimized production bundle in `/dist`.

#### Run Production Preview:
```bash
npm run preview
```

---

### 🔑 Demo Credentials (Raymond Apparel Limited)

- **Work Email**: `v.malhotra@raymondapparel.in`
- **Password**: `LoomPilot@2026`
- **Client Code**: `RAY-IND-8842` (Enterprise Tier 1)
