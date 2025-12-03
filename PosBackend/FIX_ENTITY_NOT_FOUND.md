# Fix for "Entity not found in MetadataCache" Error

## Problem Summary
The error occurs because the entity name "Product" does not match the actual logical name in your Dataverse environment. Dataverse custom tables have publisher-prefixed logical names (e.g., `cr7a1_product`, `new_product`).

## Solution Applied

### 1. Updated ProductsController.cs
Changed the entity and field names from:
```csharp
private const string ProductEntityName = "Product";
private const string ProductNameField = "Name";
private const string ProductPriceField = "Price";
```

To (with estimated prefix):
```csharp
private const string ProductEntityName = "cr7a1_product";
private const string ProductNameField = "cr7a1_name";
private const string ProductPriceField = "cr7a1_price";
```

Also fixed the Price field to properly handle `Money` type:
```csharp
Price = e.GetAttributeValue<Money>(ProductPriceField)?.Value ?? 0m
```

### 2. Created MetadataController.cs
A helper controller to discover your actual table and column names.

## How to Find Your Correct Table Names

### Method 1: Using the MetadataController (Recommended)

1. **Stop the current debug session** and restart your application
2. Navigate to: `https://localhost:5001/swagger`
3. Use the new Metadata endpoints:

   **Find Product table:**
   ```
   GET /api/metadata/search?query=product
   ```
   This will show all tables with "product" in the name.

   **Get all custom tables:**
   ```
   GET /api/metadata/tables
   ```
   This lists all your custom tables.

   **Get columns for a specific table:**
   ```
   GET /api/metadata/tables/{tableName}/columns
   ```
   Replace `{tableName}` with the logical name from the previous call.

### Method 2: Using Power Apps Portal

1. Go to https://make.powerapps.com/
2. Select your environment: **Erik Ranjay's Environment**
3. Click **Tables** in the left menu (or **Dataverse** ? **Tables**)
4. Find your **Product** table
5. Click on it to see:
   - **Logical name** (this is what you need for `ProductEntityName`)
   - Example: `cr7a1_product`
6. Click **Columns** tab to see:
   - **Name** column logical name (e.g., `cr7a1_name`)
   - **Price** column logical name (e.g., `cr7a1_price`)
   - **Product Id** column logical name (e.g., `cr7a1_productid`)

## Update ProductsController with Correct Names

Once you find the correct names, update `Controllers/ProductsController.cs`:

```csharp
// Lines 14-17 in ProductsController.cs
private const string ProductEntityName = "YOUR_ACTUAL_TABLE_NAME"; // e.g., "cr7a1_product"
private const string ProductIdField = "YOUR_ACTUAL_ID_FIELD"; // e.g., "cr7a1_productid"
private const string ProductNameField = "YOUR_ACTUAL_NAME_FIELD"; // e.g., "cr7a1_name"
private const string ProductPriceField = "YOUR_ACTUAL_PRICE_FIELD"; // e.g., "cr7a1_price"
```

## Common Publisher Prefixes

Based on your environment, your tables might use one of these patterns:
- `cr7a1_product` (estimated for your environment)
- `new_product` (default for "new" publisher)
- `org_product` (organization-specific)

## Testing After Fix

1. Update the constants with the correct names
2. Restart the application
3. Test the endpoint:
   ```
   GET /api/products
   ```
4. If it works, you'll see your products list
5. If you still get an error, double-check the logical names using the metadata endpoints

## Next Steps

After fixing the Product table, you'll need to create controllers for:
- **Customer** table (e.g., `cr7a1_customer`)
- **Order** table (e.g., `cr7a1_order`)
- **Order Line** table (e.g., `cr7a1_orderline`)

Use the same pattern and the MetadataController to discover their correct names.

## Quick Reference: Your Database Structure

Based on your description:

| Display Name | Estimated Logical Name | Key Fields |
|-------------|----------------------|-----------|
| Product | `cr7a1_product` | name, price, sku, isactive |
| Customer | `cr7a1_customer` | name, email, phone |
| Order | `cr7a1_order` | ordernumber, orderdate, totalamount, customer (lookup) |
| Order Line | `cr7a1_orderline` | order (lookup), product (lookup), quantity, unitprice, linetotal |

**Note:** Replace `cr7a1_` with your actual publisher prefix.

## Additional Resources

- Use `GET /api/metadata/search?query=<search_term>` to find any table
- Check the Swagger UI at `/swagger` for easy testing
- Review the Power Apps portal for visual confirmation
