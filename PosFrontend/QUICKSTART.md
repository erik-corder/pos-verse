# POS Frontend - Quick Start Guide

## Installation Complete! ✅

All dependencies have been installed successfully.

## Start the Application

Run the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Important Notes

### Backend Connection
- The frontend is configured to connect to: `https://localhost:5001`
- Make sure your .NET backend is running before using the frontend
- If the backend URL is different, update `.env.local`

### First Run
1. Start your .NET backend API first
2. Then run `npm run dev` to start the frontend
3. The app will automatically redirect to `/dashboard`

## Navigation

Once the app is running, you'll have access to:

- **Dashboard** (`/dashboard`) - Overview and statistics
- **POS** (`/pos`) - Create new orders with cart functionality
- **Products** (`/products`) - Manage your product inventory
- **Customers** (`/customers`) - Manage customer information
- **Orders** (`/orders`) - View and manage order history

## Features

### Professional UI Components
✅ Responsive design that works on all devices
✅ Clean, modern interface with Tailwind CSS
✅ Loading states and error handling
✅ Toast notifications for user feedback
✅ Modal dialogs for forms
✅ Searchable tables and lists

### Full CRUD Operations
✅ Create, Read, Update, Delete for Products
✅ Create, Read, Update, Delete for Customers
✅ Create, Read, Delete for Orders
✅ View detailed order information with line items

### POS Features
✅ Product catalog with search
✅ Shopping cart with quantity controls
✅ Customer selection
✅ Real-time total calculation
✅ Easy checkout process

### Dashboard Analytics
✅ Monthly revenue tracking
✅ Order statistics
✅ Recent orders list
✅ Quick action buttons

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Next.js will automatically try the next available port.

### Backend Connection Issues
- Verify the backend is running on `https://localhost:5001`
- Check CORS settings in the backend
- Look at browser console for detailed error messages

### Build Issues
If you encounter TypeScript errors after installation, try:
```bash
npm run build
```

## Production Build

To create a production build:

```bash
npm run build
npm start
```

## Development Tips

- Hot reload is enabled - changes will reflect automatically
- Check the browser console for debugging
- API errors will show toast notifications
- All pages use client-side rendering for better interactivity

## Need Help?

Check the main README.md for detailed documentation about:
- Project structure
- API endpoints
- Component architecture
- Styling guidelines

---

Happy coding! 🚀
