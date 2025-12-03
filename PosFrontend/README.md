# POS Frontend - Next.js Application

A professional Point of Sale (POS) system built with Next.js, TypeScript, and Tailwind CSS, connected to a .NET backend API.

## Features

- **Dashboard**: Overview of business metrics, recent orders, and quick actions
- **POS Interface**: User-friendly cart system for creating orders
- **Products Management**: CRUD operations for products with search functionality
- **Customers Management**: CRUD operations for customers with search
- **Orders History**: View, filter, and manage orders with detailed information

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- .NET backend API running on `https://localhost:5001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env.local` file is already configured with:
```
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
PosFrontend/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── dashboard/        # Dashboard page
│   │   ├── pos/              # Point of Sale page
│   │   ├── products/         # Products management
│   │   ├── customers/        # Customers management
│   │   ├── orders/           # Orders history
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page (redirects to dashboard)
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       ├── Table.tsx
│   │       └── Loading.tsx
│   ├── services/             # API service layer
│   │   ├── products.service.ts
│   │   ├── customers.service.ts
│   │   └── orders.service.ts
│   ├── lib/
│   │   ├── api-client.ts     # Axios configuration
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── public/                   # Static assets
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## API Integration

The frontend connects to the following backend endpoints:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID with line items
- `POST /api/orders` - Create order with line items
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

## Features Overview

### Dashboard
- Monthly statistics (products, customers, orders, revenue)
- Recent orders list
- Quick action buttons for common tasks
- Revenue analytics

### POS (Point of Sale)
- Product catalog with search
- Shopping cart with quantity management
- Customer selection
- Real-time total calculation
- Order checkout

### Products Management
- Product listing with search
- Add/Edit/Delete products
- Price and SKU management
- Active/Inactive status

### Customers Management
- Customer listing with search
- Add/Edit/Delete customers
- Contact information management

### Orders History
- Order listing with filtering by date range
- Detailed order view with line items
- Order deletion
- Customer and product information

## Styling

The application uses Tailwind CSS with a custom color scheme:
- Primary color: Blue (`primary-*` classes)
- Professional, clean UI design
- Responsive layout for all screen sizes
- Consistent spacing and typography

## Development Notes

- The app uses client-side rendering (`'use client'`) for all pages
- API calls use Axios with interceptors for error handling
- Toast notifications for user feedback
- TypeScript for type safety
- Modular component architecture

## Troubleshooting

### HTTPS/SSL Certificate Issues
If you encounter SSL certificate errors in development, the API client is configured to ignore certificate validation for `https://localhost:5001`.

### CORS Issues
Ensure your .NET backend has CORS properly configured to allow requests from `http://localhost:3000`.

### API Connection
Verify the backend is running on `https://localhost:5001` and accessible.

## License

This project is part of a POS system demonstration.
