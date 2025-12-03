# POS Backend API - Complete Implementation

This is a complete POS (Point of Sale) Backend API built with .NET 8 and Microsoft Dataverse.

## ?? What's Included

### API Endpoints

#### ? Products API (`/api/products`)
- GET all products (with optional `isActive` filter)
- GET product by ID
- POST create new product
- PUT update product
- DELETE product

#### ? Customers API (`/api/customers`)
- GET all customers (with optional search)
- GET customer by ID
- POST create new customer
- PUT update customer
- DELETE customer

#### ? Orders API (`/api/orders`)
- GET all orders (with optional date range filter)
- GET order by ID (includes order lines)
- POST create order with order lines
- PUT update order
- DELETE order (cascades to order lines)

### Database Schema (Dataverse)

```
?? Product (cr056_product)
   ?? Name (text)
   ?? Price (currency)
   ?? SKU (text, optional)
   ?? IsActive (yes/no)

?? Customer (cr056_customer)
   ?? Name (text)
   ?? Email (text)
   ?? Phone (text, optional)

?? Order (cr056_order)
   ?? Order Number (text)
   ?? Order Date (datetime)
   ?? Total Amount (currency)
   ?? Customer (lookup ? Customer)

?? Order Line (cr056_orderline)
   ?? Order (lookup ? Order)
   ?? Product (lookup ? Product)
   ?? Quantity (number)
   ?? Unit Price (currency)
   ?? Line Total (currency)
```

## ?? Quick Start

### 1. Prerequisites
- .NET 8 SDK
- Dataverse environment
- Azure AD App Registration (already configured)

### 2. Security Setup (IMPORTANT!)

**Fastest way (2 minutes):**
```
1. Go to: https://admin.powerplatform.microsoft.com
2. Select your environment
3. Settings ? Users + permissions ? Application users
4. Find: PosBackendDataverseApp
5. Manage security roles ? Check "System Customizer"
6. Save
```

**Detailed instructions:** See [SECURITY_SETUP_GUIDE.md](SECURITY_SETUP_GUIDE.md)

### 3. Run the Application

```bash
cd PosBackend
dotnet run
```

### 4. Test the API

Open your browser:
```
https://localhost:{port}/swagger
```

## ?? Documentation Files

| File | Description |
|------|-------------|
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference with examples |
| [API_TESTING_EXAMPLES.md](API_TESTING_EXAMPLES.md) | cURL, PowerShell, and Postman examples |
| [DATAVERSE_FIELD_MAPPINGS.md](DATAVERSE_FIELD_MAPPINGS.md) | Table and field name mappings |
| [SECURITY_SETUP_GUIDE.md](SECURITY_SETUP_GUIDE.md) | Detailed security configuration |

## ?? Try It Out

### Example 1: Create a Complete Order

**Step 1:** Create a product
```bash
POST /api/products
{
  "name": "Laptop",
  "price": 999.99,
  "sku": "LAP-001",
  "isActive": true
}
```

**Step 2:** Create a customer
```bash
POST /api/customers
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Step 3:** Create an order
```bash
POST /api/orders
{
  "customerId": "{customer-id-from-step-2}",
  "orderLines": [
    {
      "productId": "{product-id-from-step-1}",
      "quantity": 1,
      "unitPrice": 999.99
    }
  ]
}
```

**Step 4:** View the order
```bash
GET /api/orders/{order-id}
```

## ?? Configuration

Your current configuration (from `appsettings.json`):

```json
{
  "Dataverse": {
    "Url": "https://your-org.api.crm.dynamics.com",
    "TenantId": "your-tenant-id-here",
    "ClientId": "your-client-id-here"
  }
}
```

## ?? Project Structure

```
PosBackend/
??? Controllers/
?   ??? ProductsController.cs      ? Full CRUD for Products
?   ??? CustomersController.cs     ? Full CRUD for Customers
?   ??? OrdersController.cs        ? Full CRUD for Orders + Order Lines
?   ??? MetadataController.cs      ?? Utility for inspecting tables
??? Configuration/
?   ??? DataverseConfiguration.cs  ?? Connection settings
??? Services/
?   ??? DataverseService.cs        ?? Dataverse operations
??? Program.cs                      ?? Application startup
??? appsettings.json               ?? Configuration
```

## ?? API Features

### Products
- Filter by active status
- Full CRUD operations
- SKU tracking
- Price management

### Customers
- Search by name or email
- Full contact management
- Optional phone number

### Orders
- Auto-generate order numbers
- Date range filtering
- Automatic total calculation
- Cascading deletes
- Include customer details
- Include order lines with product info

## ?? Security

### Current Application User
```
Name: YourAppName
App ID: your-client-id-here
User ID: your-user-id-here
Access Mode: Non-Interactive (Service Account)
```

### Required Privileges
All custom entities need these privileges at **Organization** level:
- ? Create
- ? Read
- ? Write
- ? Delete
- ? Append (for Order and OrderLine)
- ? Append To (for Order and OrderLine)

## ?? Troubleshooting

### "Principal user is missing privilege" error
?? See [SECURITY_SETUP_GUIDE.md](SECURITY_SETUP_GUIDE.md)

### "Entity not found" error
?? Check table names in [DATAVERSE_FIELD_MAPPINGS.md](DATAVERSE_FIELD_MAPPINGS.md)

### Connection issues
?? Check `appsettings.json` configuration
?? Verify App Registration is valid
?? Check Dataverse environment is accessible

## ?? Testing

### Using Swagger UI
```
https://localhost:{port}/swagger
```

### Using cURL
See [API_TESTING_EXAMPLES.md](API_TESTING_EXAMPLES.md)

### Using Postman
Import the collection from [API_TESTING_EXAMPLES.md](API_TESTING_EXAMPLES.md)

## ?? Customization

### Change Publisher Prefix
If your tables use a different prefix (e.g., `abc_` instead of `cr056_`):

1. Update constants in each controller:
   - `ProductsController.cs`
   - `CustomersController.cs`
   - `OrdersController.cs`

2. Replace `cr056_` with your prefix:
```csharp
// Before
private const string ProductEntityName = "cr056_product";

// After
private const string ProductEntityName = "abc_product";
```

### Add New Fields
1. Add field to Dataverse table
2. Add constant in controller
3. Update ColumnSet in queries
4. Update DTO records
5. Map in Select/Create/Update methods

### Add New Table
1. Create table in Dataverse
2. Add security privileges
3. Create new controller (use existing controllers as template)
4. Add to API documentation

## ?? Next Steps

### Suggested Enhancements
- [ ] Add authentication/authorization for API endpoints
- [ ] Implement pagination for list endpoints
- [ ] Add input validation and error handling
- [ ] Create DTOs for request/response objects
- [ ] Add logging and monitoring
- [ ] Implement caching
- [ ] Add unit tests
- [ ] Create CI/CD pipeline
- [ ] Add API versioning
- [ ] Implement rate limiting

### Production Readiness
- [ ] Use Azure Key Vault for secrets
- [ ] Enable Application Insights
- [ ] Set up health checks
- [ ] Configure CORS policies
- [ ] Add request throttling
- [ ] Implement retry policies
- [ ] Add comprehensive logging
- [ ] Set up automated backups

## ?? Support

### Resources
- ?? [Microsoft Dataverse Documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/)
- ?? [Power Platform Admin Center](https://admin.powerplatform.microsoft.com)
- ?? [Azure AD App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)

### Common Links
- **Swagger UI**: `https://localhost:{port}/swagger`
- **Health Check**: `https://localhost:{port}/api/health/dataverse`
- **Power Apps Portal**: https://make.powerapps.com
- **Admin Portal**: https://admin.powerplatform.microsoft.com

## ? Checklist

Before deploying:
- [ ] Security role configured and assigned
- [ ] All API endpoints tested
- [ ] Connection string secured (use Azure Key Vault)
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Documentation updated
- [ ] CORS configured (if needed)
- [ ] SSL certificate configured (production)

## ?? License

Your license here

## ?? Contributors

Your team here

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Status:** ? Ready for Development / ?? Configure Security First
