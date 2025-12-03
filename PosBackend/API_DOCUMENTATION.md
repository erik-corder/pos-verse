# POS Backend API Documentation

This document describes all available API endpoints for the POS system.

## Base URL
```
https://localhost:{port}/api
```

---

## Products API

### Get All Products
**Endpoint:** `GET /api/products`

**Query Parameters:**
- `isActive` (optional, boolean): Filter by active status

**Response:**
```json
[
  {
    "id": "guid",
    "name": "Product Name",
    "price": 99.99,
    "sku": "SKU123",
    "isActive": true
  }
]
```

**Example:**
```bash
GET /api/products?isActive=true
```

---

### Get Product by ID
**Endpoint:** `GET /api/products/{id}`

**Response:**
```json
{
  "id": "guid",
  "name": "Product Name",
  "price": 99.99,
  "sku": "SKU123",
  "isActive": true
}
```

---

### Create Product
**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "name": "New Product",
  "price": 99.99,
  "sku": "SKU123",
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "id": "guid",
  "name": "New Product",
  "price": 99.99,
  "sku": "SKU123",
  "isActive": true
}
```

---

### Update Product
**Endpoint:** `PUT /api/products/{id}`

**Request Body:**
```json
{
  "name": "Updated Product",
  "price": 149.99,
  "sku": "SKU456",
  "isActive": false
}
```

**Response:** `200 OK`
```json
{
  "message": "Product updated successfully"
}
```

---

### Delete Product
**Endpoint:** `DELETE /api/products/{id}`

**Response:** `200 OK`
```json
{
  "message": "Product deleted successfully"
}
```

---

## Customers API

### Get All Customers
**Endpoint:** `GET /api/customers`

**Query Parameters:**
- `searchTerm` (optional, string): Search by name or email

**Response:**
```json
[
  {
    "id": "guid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
]
```

**Example:**
```bash
GET /api/customers?searchTerm=john
```

---

### Get Customer by ID
**Endpoint:** `GET /api/customers/{id}`

**Response:**
```json
{
  "id": "guid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

---

### Create Customer
**Endpoint:** `POST /api/customers`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "id": "guid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

---

### Update Customer
**Endpoint:** `PUT /api/customers/{id}`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}
```

**Response:** `200 OK`
```json
{
  "message": "Customer updated successfully"
}
```

---

### Delete Customer
**Endpoint:** `DELETE /api/customers/{id}`

**Response:** `200 OK`
```json
{
  "message": "Customer deleted successfully"
}
```

---

## Orders API

### Get All Orders
**Endpoint:** `GET /api/orders`

**Query Parameters:**
- `startDate` (optional, datetime): Filter orders from this date
- `endDate` (optional, datetime): Filter orders until this date

**Response:**
```json
[
  {
    "id": "guid",
    "orderNumber": "ORD-20240115-A1B2C3D4",
    "orderDate": "2024-01-15T10:30:00Z",
    "totalAmount": 299.97,
    "customerId": "guid",
    "customerName": "John Doe"
  }
]
```

**Example:**
```bash
GET /api/orders?startDate=2024-01-01&endDate=2024-01-31
```

---

### Get Order by ID (with Order Lines)
**Endpoint:** `GET /api/orders/{id}`

**Response:**
```json
{
  "id": "guid",
  "orderNumber": "ORD-20240115-A1B2C3D4",
  "orderDate": "2024-01-15T10:30:00Z",
  "totalAmount": 299.97,
  "customerId": "guid",
  "customerName": "John Doe",
  "orderLines": [
    {
      "id": "guid",
      "productId": "guid",
      "productName": "Product 1",
      "quantity": 2,
      "unitPrice": 99.99,
      "lineTotal": 199.98
    },
    {
      "id": "guid",
      "productId": "guid",
      "productName": "Product 2",
      "quantity": 1,
      "unitPrice": 99.99,
      "lineTotal": 99.99
    }
  ]
}
```

---

### Create Order (with Order Lines)
**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "customerId": "guid",
  "orderNumber": "ORD-20240115-001",
  "orderDate": "2024-01-15T10:30:00Z",
  "orderLines": [
    {
      "productId": "guid",
      "quantity": 2,
      "unitPrice": 99.99
    },
    {
      "productId": "guid",
      "quantity": 1,
      "unitPrice": 149.99
    }
  ]
}
```

**Notes:**
- `orderNumber` is optional - system will auto-generate if not provided
- `orderDate` is optional - defaults to current UTC time
- `totalAmount` is calculated automatically from order lines
- Order lines are created atomically with the order

**Response:** `201 Created`
```json
{
  "id": "guid",
  "orderNumber": "ORD-20240115-001",
  "orderDate": "2024-01-15T10:30:00Z",
  "totalAmount": 349.97,
  "customerId": "guid",
  "orderLines": [
    {
      "id": "guid",
      "productId": "guid",
      "quantity": 2,
      "unitPrice": 99.99,
      "lineTotal": 199.98
    },
    {
      "id": "guid",
      "productId": "guid",
      "quantity": 1,
      "unitPrice": 149.99,
      "lineTotal": 149.99
    }
  ]
}
```

---

### Update Order
**Endpoint:** `PUT /api/orders/{id}`

**Request Body:**
```json
{
  "orderNumber": "ORD-20240115-001-UPDATED",
  "orderDate": "2024-01-15T10:30:00Z",
  "totalAmount": 349.97,
  "customerId": "guid"
}
```

**Note:** This endpoint updates only the order header. To modify order lines, delete and recreate them separately.

**Response:** `200 OK`
```json
{
  "message": "Order updated successfully"
}
```

---

### Delete Order
**Endpoint:** `DELETE /api/orders/{id}`

**Note:** This automatically deletes all associated order lines first, then the order.

**Response:** `200 OK`
```json
{
  "message": "Order deleted successfully"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error description",
  "details": "Detailed error message"
}
```

### Dataverse Connection Error
```json
{
  "error": "Dataverse connection not ready",
  "details": "Connection error details"
}
```

---

## Testing with Swagger

Once the application is running, navigate to:
```
https://localhost:{port}/swagger
```

This provides an interactive UI to test all endpoints.

---

## Example Usage Scenarios

### Scenario 1: Create a Complete Order

1. **Create a customer:**
```bash
POST /api/customers
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890"
}
```

2. **Get active products:**
```bash
GET /api/products?isActive=true
```

3. **Create an order:**
```bash
POST /api/orders
{
  "customerId": "{customer-guid-from-step-1}",
  "orderLines": [
    {
      "productId": "{product-guid-from-step-2}",
      "quantity": 2,
      "unitPrice": 99.99
    }
  ]
}
```

---

### Scenario 2: View Order History

```bash
# Get all orders for last month
GET /api/orders?startDate=2024-01-01&endDate=2024-01-31

# Get specific order details with line items
GET /api/orders/{order-id}
```

---

## Required Dataverse Security Roles

The Application User needs the following privileges:

### Custom Entities (Organization Level):
- **cr056_product**: Read, Create, Write, Delete
- **cr056_customer**: Read, Create, Write, Delete
- **cr056_order**: Read, Create, Write, Delete
- **cr056_orderline**: Read, Create, Write, Delete

See the main README for instructions on setting up security roles.
