// Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  isActive: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  sku?: string;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  sku?: string;
  isActive?: boolean;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  customerId?: string;
  customerName?: string;
}

export interface OrderDetail extends Order {
  orderLines: OrderLine[];
}

export interface OrderLine {
  id: string;
  productId?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateOrderRequest {
  customerId: string;
  orderLines: CreateOrderLineRequest[];
  orderNumber?: string;
  orderDate?: string;
}

export interface CreateOrderLineRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderRequest {
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  customerId: string;
}

// Cart Types (for POS)
export interface CartItem {
  product: Product;
  quantity: number;
}

// API Response Types
export interface ApiError {
  error: string;
  details?: string;
}
