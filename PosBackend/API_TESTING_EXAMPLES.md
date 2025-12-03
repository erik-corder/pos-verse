# API Testing Examples

This file contains cURL and Postman examples for testing the POS Backend APIs.

## Setup

Replace `{BASE_URL}` with your actual API URL, e.g., `https://localhost:7001`

---

## Products API

### Get All Active Products
```bash
curl -X GET "{BASE_URL}/api/products?isActive=true" \
  -H "accept: application/json"
```

### Create a Product
```bash
curl -X POST "{BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "sku": "LAP-001",
    "isActive": true
  }'
```

### Update a Product
```bash
curl -X PUT "{BASE_URL}/api/products/{product-id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "price": 1299.99,
    "sku": "LAP-001-G",
    "isActive": true
  }'
```

### Delete a Product
```bash
curl -X DELETE "{BASE_URL}/api/products/{product-id}"
```

---

## Customers API

### Search Customers
```bash
curl -X GET "{BASE_URL}/api/customers?searchTerm=john" \
  -H "accept: application/json"
```

### Create a Customer
```bash
curl -X POST "{BASE_URL}/api/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123"
  }'
```

### Update a Customer
```bash
curl -X PUT "{BASE_URL}/api/customers/{customer-id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Jr.",
    "email": "john.doe.jr@example.com",
    "phone": "+1-555-0124"
  }'
```

---

## Orders API

### Get All Orders
```bash
curl -X GET "{BASE_URL}/api/orders" \
  -H "accept: application/json"
```

### Get Orders by Date Range
```bash
curl -X GET "{BASE_URL}/api/orders?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z" \
  -H "accept: application/json"
```

### Get Order with Details
```bash
curl -X GET "{BASE_URL}/api/orders/{order-id}" \
  -H "accept: application/json"
```

### Create an Order with Multiple Lines
```bash
curl -X POST "{BASE_URL}/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "00000000-0000-0000-0000-000000000000",
    "orderNumber": "ORD-2024-001",
    "orderDate": "2024-01-15T10:30:00Z",
    "orderLines": [
      {
        "productId": "00000000-0000-0000-0000-000000000000",
        "quantity": 2,
        "unitPrice": 99.99
      },
      {
        "productId": "00000000-0000-0000-0000-000000000000",
        "quantity": 1,
        "unitPrice": 149.99
      }
    ]
  }'
```

### Create Order with Auto-Generated Order Number
```bash
curl -X POST "{BASE_URL}/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{customer-id}",
    "orderLines": [
      {
        "productId": "{product-id}",
        "quantity": 1,
        "unitPrice": 99.99
      }
    ]
  }'
```

### Delete an Order (and its lines)
```bash
curl -X DELETE "{BASE_URL}/api/orders/{order-id}"
```

---

## Complete Workflow Example

### Step 1: Create Products
```bash
# Create Product 1
curl -X POST "{BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "price": 29.99,
    "sku": "MOUSE-001",
    "isActive": true
  }'

# Save the returned ID as PRODUCT_1_ID

# Create Product 2
curl -X POST "{BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mechanical Keyboard",
    "price": 79.99,
    "sku": "KEYB-001",
    "isActive": true
  }'

# Save the returned ID as PRODUCT_2_ID
```

### Step 2: Create a Customer
```bash
curl -X POST "{BASE_URL}/api/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+1-555-1234"
  }'

# Save the returned ID as CUSTOMER_ID
```

### Step 3: Create an Order
```bash
curl -X POST "{BASE_URL}/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{CUSTOMER_ID}",
    "orderLines": [
      {
        "productId": "{PRODUCT_1_ID}",
        "quantity": 2,
        "unitPrice": 29.99
      },
      {
        "productId": "{PRODUCT_2_ID}",
        "quantity": 1,
        "unitPrice": 79.99
      }
    ]
  }'

# Save the returned ID as ORDER_ID
```

### Step 4: View the Order
```bash
curl -X GET "{BASE_URL}/api/orders/{ORDER_ID}" \
  -H "accept: application/json"
```

---

## PowerShell Examples

### Get All Products (PowerShell)
```powershell
$baseUrl = "https://localhost:7001"

$response = Invoke-RestMethod -Uri "$baseUrl/api/products?isActive=true" `
  -Method Get `
  -ContentType "application/json"

$response | ConvertTo-Json
```

### Create Product (PowerShell)
```powershell
$baseUrl = "https://localhost:7001"

$body = @{
    name = "USB Cable"
    price = 9.99
    sku = "USB-001"
    isActive = $true
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/api/products" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"

Write-Host "Created product with ID: $($response.id)"
```

### Create Order (PowerShell)
```powershell
$baseUrl = "https://localhost:7001"

$body = @{
    customerId = "your-customer-guid"
    orderLines = @(
        @{
            productId = "your-product-guid"
            quantity = 2
            unitPrice = 29.99
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "$baseUrl/api/orders" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"

Write-Host "Created order: $($response.orderNumber)"
Write-Host "Total amount: $($response.totalAmount)"
```

---

## Postman Collection

Import this JSON into Postman to get a complete collection:

```json
{
  "info": {
    "name": "POS Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://localhost:7001",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/products"
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/products",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Sample Product\",\n  \"price\": 99.99,\n  \"sku\": \"SKU-001\",\n  \"isActive\": true\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Customers",
      "item": [
        {
          "name": "Get All Customers",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/customers"
          }
        },
        {
          "name": "Create Customer",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/customers",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"phone\": \"+1234567890\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Get All Orders",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/orders"
          }
        },
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/orders",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"customerId\": \"guid-here\",\n  \"orderLines\": [\n    {\n      \"productId\": \"guid-here\",\n      \"quantity\": 1,\n      \"unitPrice\": 99.99\n    }\n  ]\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Testing Tips

1. **Use Swagger UI**: Navigate to `https://localhost:{port}/swagger` for interactive testing
2. **Save GUIDs**: Save returned GUIDs from CREATE operations to use in subsequent requests
3. **Check Logs**: Monitor the application console for detailed error messages
4. **Verify in Dataverse**: Check the Power Apps portal to see created records

## Common Issues

### SSL Certificate Issues (Development)
If using self-signed certificates in development:

**cURL:**
```bash
curl -k -X GET "{BASE_URL}/api/products"
```

**PowerShell:**
```powershell
# Ignore SSL errors (development only!)
add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
```
