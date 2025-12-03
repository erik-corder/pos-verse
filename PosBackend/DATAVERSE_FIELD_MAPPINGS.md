# Dataverse Table Field Mappings

This document shows the mapping between your Dataverse table structure and the API field names.

## Important Notes

?? **Publisher Prefix**: All field names use the `cr056_` prefix. If your Dataverse environment uses a different publisher prefix, you'll need to update the constants in each controller.

## Product Table

**Dataverse Table Name:** `cr056_product`

| Display Name | Logical Name | Type | Required | API Field |
|-------------|--------------|------|----------|-----------|
| Product | cr056_productid | Primary Key (GUID) | Yes | id |
| Name | cr056_name | Text | Yes | name |
| Price | cr056_price | Currency | Yes | price |
| Sku | cr056_sku | Text | No | sku |
| Is Active | cr056_isactive | Yes/No (Boolean) | Yes | isActive |

**Controller Location:** `Controllers\ProductsController.cs`

**Field Constants:**
```csharp
private const string ProductEntityName = "cr056_product";
private const string ProductIdField = "cr056_productid";
private const string ProductNameField = "cr056_name";
private const string ProductPriceField = "cr056_price";
private const string ProductSkuField = "cr056_sku";
private const string ProductIsActiveField = "cr056_isactive";
```

---

## Customer Table

**Dataverse Table Name:** `cr056_customer`

| Display Name | Logical Name | Type | Required | API Field |
|-------------|--------------|------|----------|-----------|
| Customer | cr056_customerid | Primary Key (GUID) | Yes | id |
| Name | cr056_name | Text | Yes | name |
| Email | cr056_email | Text | Yes | email |
| Phone | cr056_phone | Text | No | phone |

**Controller Location:** `Controllers\CustomersController.cs`

**Field Constants:**
```csharp
private const string CustomerEntityName = "cr056_customer";
private const string CustomerIdField = "cr056_customerid";
private const string CustomerNameField = "cr056_name";
private const string CustomerEmailField = "cr056_email";
private const string CustomerPhoneField = "cr056_phone";
```

---

## Order Table

**Dataverse Table Name:** `cr056_order`

| Display Name | Logical Name | Type | Required | API Field |
|-------------|--------------|------|----------|-----------|
| Order | cr056_orderid | Primary Key (GUID) | Yes | id |
| Order Number | cr056_ordernumber | Text | Yes | orderNumber |
| Order Date | cr056_orderdate | Date and Time | Yes | orderDate |
| Total Amount | cr056_totalamount | Currency | Yes | totalAmount |
| Customer | cr056_customerid | Lookup (Customer) | Yes | customerId |

**Controller Location:** `Controllers\OrdersController.cs`

**Field Constants:**
```csharp
private const string OrderEntityName = "cr056_order";
private const string OrderIdField = "cr056_orderid";
private const string OrderNumberField = "cr056_ordernumber";
private const string OrderDateField = "cr056_orderdate";
private const string OrderTotalAmountField = "cr056_totalamount";
private const string OrderCustomerField = "cr056_customerid"; // Lookup field
```

**Relationships:**
- Many-to-One relationship with Customer table

---

## Order Line Table

**Dataverse Table Name:** `cr056_orderline`

| Display Name | Logical Name | Type | Required | API Field |
|-------------|--------------|------|----------|-----------|
| Order Line | cr056_orderlineid | Primary Key (GUID) | Yes | id |
| Order | cr056_orderid | Lookup (Order) | Yes | orderId |
| Product | cr056_productid | Lookup (Product) | Yes | productId |
| Quantity | cr056_quantity | Whole Number | Yes | quantity |
| Unit Price | cr056_unitprice | Currency | Yes | unitPrice |
| Line Total | cr056_linetotal | Currency | Yes | lineTotal |

**Controller Location:** `Controllers\OrdersController.cs` (managed within Orders controller)

**Field Constants:**
```csharp
private const string OrderLineEntityName = "cr056_orderline";
private const string OrderLineIdField = "cr056_orderlineid";
private const string OrderLineOrderField = "cr056_orderid"; // Lookup to Order
private const string OrderLineProductField = "cr056_productid"; // Lookup to Product
private const string OrderLineQuantityField = "cr056_quantity";
private const string OrderLineUnitPriceField = "cr056_unitprice";
private const string OrderLineLineTotalField = "cr056_linetotal";
```

**Relationships:**
- Many-to-One relationship with Order table
- Many-to-One relationship with Product table

---

## Relationship Diagram

```
Customer (cr056_customer)
    ? 1:N
Order (cr056_order)
    ? 1:N
Order Line (cr056_orderline)
    ? N:1
Product (cr056_product)
```

---

## How to Update Field Names

If your Dataverse environment uses a different publisher prefix (e.g., `abc_` instead of `cr056_`), follow these steps:

### Step 1: Find Your Publisher Prefix

1. Go to Power Apps portal (make.powerapps.com)
2. Select your environment
3. Go to **Settings** ? **Solutions**
4. Open your solution
5. Go to **Tables** ? Select any custom table
6. Look at the **Logical name** column - the prefix before the underscore is your publisher prefix

### Step 2: Update Constants

Replace the prefix in each controller's constants. For example, if your prefix is `abc_`:

**ProductsController.cs:**
```csharp
// Change from:
private const string ProductEntityName = "cr056_product";
private const string ProductIdField = "cr056_productid";
// etc.

// To:
private const string ProductEntityName = "abc_product";
private const string ProductIdField = "abc_productid";
// etc.
```

Repeat for all controllers:
- `Controllers\ProductsController.cs`
- `Controllers\CustomersController.cs`
- `Controllers\OrdersController.cs`

### Step 3: Verify Field Names

You can use the Metadata Controller to verify your table and field names:

```bash
GET /api/metadata/entities

# Or for a specific table:
GET /api/metadata/entities/abc_product
```

---

## API to Dataverse Data Type Mapping

| API Type | Dataverse Type | Example |
|----------|---------------|---------|
| string | Text | "Product Name" |
| decimal | Currency | 99.99 (stored as Money object) |
| int | Whole Number | 5 |
| bool | Yes/No (Two Options) | true/false |
| DateTime | Date and Time | "2024-01-15T10:30:00Z" |
| Guid | Primary Key / Lookup | "00000000-0000-0000-0000-000000000000" |

### Special Handling

**Currency Fields (Money):**
```csharp
// When reading:
var price = entity.GetAttributeValue<Money>(ProductPriceField)?.Value ?? 0m;

// When writing:
entity[ProductPriceField] = new Money(99.99m);
```

**Lookup Fields (EntityReference):**
```csharp
// When reading:
var customerId = entity.GetAttributeValue<EntityReference>(OrderCustomerField)?.Id;

// When writing:
entity[OrderCustomerField] = new EntityReference(CustomerEntityName, customerGuid);
```

**Date/Time Fields:**
```csharp
// Always use UTC
entity[OrderDateField] = DateTime.UtcNow;
```

---

## Security Roles Required

Your Application User needs these privileges for all custom tables:

| Table | Create | Read | Write | Delete | Notes |
|-------|--------|------|-------|--------|-------|
| cr056_product | ? | ? | ? | ? | Organization level |
| cr056_customer | ? | ? | ? | ? | Organization level |
| cr056_order | ? | ? | ? | ? | Organization level |
| cr056_orderline | ? | ? | ? | ? | Organization level |

**Additional Privileges:**
- **Append**: Required if you're creating relationships
- **Append To**: Required if you're creating relationships

See the main documentation for how to set up the security role in Dataverse.

---

## Troubleshooting

### "Entity not found" errors
- Verify your table logical names match your Dataverse tables
- Check that the publisher prefix is correct
- Use the Metadata API to confirm table names

### "Principal user is missing privilege" errors
- The Application User doesn't have proper security roles
- Grant Read/Create/Write/Delete privileges for custom entities
- See security documentation for details

### Lookup field errors
- Ensure the referenced record exists
- Verify the GUID is valid
- Check that you're using EntityReference correctly

### Currency/Money field errors
- Always wrap decimal values in `new Money(value)`
- Check for null values when reading
