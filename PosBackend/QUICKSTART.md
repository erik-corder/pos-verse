# Quick Start Guide

## What Has Been Set Up

Your POS Backend now has full Dataverse integration with:

? **ServiceClient** configured with your credentials
? **IDataverseService** abstraction layer with logging
? **ProductsController** with full CRUD operations (example)
? **Health check endpoint** to verify Dataverse connection
? **Swagger UI** for API testing

## Your Dataverse Credentials

The following credentials need to be configured in `appsettings.json`:

- **URL**: https://your-org.api.crm.dynamics.com
- **Tenant ID**: your-tenant-id-here
- **Client ID**: your-client-id-here
- **Client Secret**: your-client-secret-here

**⚠️ IMPORTANT**: Never commit actual credentials to source control. Use User Secrets or environment variables.

## Step 1: Run the Application

```bash
dotnet run
```

## Step 2: Test the Connection

Open your browser and go to:
- **Swagger UI**: https://localhost:5001/swagger
- **Health Check**: https://localhost:5001/api/health/dataverse

The health check should return:
```json
{
  "status": "Connected",
  "isReady": true,
  "connectedOrgFriendlyName": "Your Org Name",
  "connectedOrgVersion": "9.2.x.x"
}
```

## Step 3: Customize for Your Tables

The `ProductsController.cs` is a template. Update these constants to match your actual Dataverse tables:

```csharp
// In Controllers/ProductsController.cs, line ~14-17
private const string ProductEntityName = "cr4a0_product";     // ? Change this
private const string ProductIdField = "cr4a0_productid";       // ? Change this
private const string ProductNameField = "cr4a0_name";          // ? Change this
private const string ProductPriceField = "cr4a0_price";        // ? Change this
```

### How to Find Your Table Names

1. Go to https://make.powerapps.com/
2. Select your environment (should match your URL)
3. Click **Tables** (or Dataverse ? Tables)
4. Find your table and click it
5. The **Logical Name** is what you need (e.g., `cr4a0_product`)
6. Click **Columns** to see field logical names

## Step 4: Test the API

Using Swagger UI at https://localhost:5001/swagger:

1. **GET /api/products** - Retrieve all products
2. **POST /api/products** - Create a new product
   ```json
   {
     "name": "Test Product",
     "price": 19.99
   }
   ```
3. **GET /api/products/{id}** - Get specific product
4. **PUT /api/products/{id}** - Update a product
5. **DELETE /api/products/{id}** - Delete a product

## Common Issues & Solutions

### ? "Dataverse connection not ready"

**Possible causes:**
1. Wrong credentials in appsettings.json
2. App registration doesn't have access to Dataverse
3. Network/firewall issues

**Solution:**
1. Verify credentials are correct
2. In Azure Portal, go to your App Registration
3. Add API permission: **Dynamics CRM ? user_impersonation**
4. Grant admin consent
5. In Power Platform Admin Center, ensure the app user is added to your environment

### ? "Table not found" or "Column not found"

**Solution:**
- Update the table/column constants in ProductsController.cs to match your actual Dataverse schema

### ? "SecLib::CrmCheckPrivilege failed"

**Solution:**
- Your app user needs proper security roles in Dataverse
- Go to Power Platform Admin Center ? Your Environment ? Users ? Application Users
- Assign appropriate security role (e.g., System Administrator for testing)

## File Structure

```
PosBackend/
??? Configuration/
?   ??? DataverseConfiguration.cs    ? Configuration model
??? Controllers/
?   ??? ProductsController.cs        ? Example CRUD controller
?   ??? WeatherForecastController.cs ? Can be deleted
??? Services/
?   ??? DataverseService.cs          ? Dataverse service abstraction
??? Program.cs                        ? App configuration
??? appsettings.json                  ? Contains Dataverse credentials
??? appsettings.Development.json     ? Dev-specific settings
??? DATAVERSE_README.md              ? Detailed documentation

## Next Steps

### For Production:
1. **Move secrets to Azure Key Vault or User Secrets**
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "Dataverse:ClientSecret" "your-secret"
   ```

2. **Add authentication to your API**
   - Consider Azure AD B2C or JWT tokens
   - Protect your endpoints with [Authorize] attributes

3. **Add error handling middleware**
   - Global exception handler
   - Consistent error responses

4. **Implement pagination**
   - For large datasets, add skip/take parameters

5. **Add caching**
   - Redis or in-memory cache for frequently accessed data

### For Development:
1. **Create more controllers** for your other tables (Orders, Customers, Inventory, etc.)
2. **Add validation** using FluentValidation or Data Annotations
3. **Add unit tests** for your services and controllers
4. **Set up logging** to file or Application Insights

## Need Help?

- **Dataverse Docs**: https://docs.microsoft.com/power-apps/developer/data-platform/
- **ServiceClient API**: https://docs.microsoft.com/dotnet/api/microsoft.powerplatform.dataverse.client.serviceclient
- **Query Examples**: https://docs.microsoft.com/power-apps/developer/data-platform/org-service/build-queries-with-queryexpression

## Testing Checklist

- [ ] Run `dotnet run` successfully
- [ ] Visit https://localhost:5001/swagger
- [ ] Test `/api/health/dataverse` - should return "Connected"
- [ ] Update table/column names in ProductsController.cs
- [ ] Test GET /api/products (might be empty initially)
- [ ] Create a product using POST /api/products
- [ ] Verify in Power Apps that the record was created
- [ ] Test PUT and DELETE operations

**You're all set!** ?? Your POS Backend is now connected to Dataverse.
