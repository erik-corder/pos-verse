# POS Backend - Dataverse Integration

This .NET 8 Web API project integrates with Microsoft Dataverse for data persistence.

## Configuration

The Dataverse connection is configured in `appsettings.json`:

```json
{
  "Dataverse": {
    "Url": "https://your-org.api.crm.dynamics.com",
    "TenantId": "your-tenant-id-here",
    "ClientId": "your-client-id-here",
    "ClientSecret": "your-client-secret-here"
  }
}
```

**?? Security Note:** For production, move these credentials to:
- Azure Key Vault
- User Secrets (for local development)
- Environment Variables

### Using User Secrets (Recommended for Development)

```bash
dotnet user-secrets init
dotnet user-secrets set "Dataverse:Url" "https://your-org.api.crm.dynamics.com"
dotnet user-secrets set "Dataverse:TenantId" "your-tenant-id-here"
dotnet user-secrets set "Dataverse:ClientId" "your-client-id-here"
dotnet user-secrets set "Dataverse:ClientSecret" "your-client-secret-here"
```

## Running the Application

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:5001/swagger`

## API Endpoints

### Health Check
- **GET** `/api/health/dataverse` - Check Dataverse connection status

### Products (Example CRUD)
- **GET** `/api/products` - Get all products
- **GET** `/api/products/{id}` - Get product by ID
- **POST** `/api/products` - Create new product
  ```json
  {
    "name": "Product Name",
    "price": 29.99
  }
  ```
- **PUT** `/api/products/{id}` - Update product
  ```json
  {
    "name": "Updated Product Name",
    "price": 39.99
  }
  ```
- **DELETE** `/api/products/{id}` - Delete product

## Customizing for Your Dataverse Tables

The `ProductsController.cs` uses placeholder table and column names. Update these constants to match your actual Dataverse schema:

```csharp
private const string ProductEntityName = "cr4a0_product"; // Your table logical name
private const string ProductIdField = "cr4a0_productid"; // Your primary key field
private const string ProductNameField = "cr4a0_name"; // Your name field
private const string ProductPriceField = "cr4a0_price"; // Your price field
```

### Finding Your Table/Column Names

1. Go to [Power Apps](https://make.powerapps.com/)
2. Select your environment
3. Go to **Tables** (or **Dataverse** > **Tables**)
4. Click on your table
5. View **Columns** to see the logical names (e.g., `cr4a0_name`)

## Architecture

### Services
- **ServiceClient**: Direct Dataverse SDK client (registered as Singleton)
- **IDataverseService**: Service layer abstraction with logging
- **DataverseService**: Implementation of IDataverseService

### Controllers
- **ProductsController**: Example CRUD controller for products
- **WeatherForecastController**: Default template controller (can be removed)

## Common Operations

### Query with Filter
```csharp
var query = new QueryExpression("cr4a0_product");
query.ColumnSet.AddColumns("cr4a0_name", "cr4a0_price");
query.Criteria.AddCondition("cr4a0_price", ConditionOperator.GreaterThan, 10.0);
var results = await _dataverseService.RetrieveMultiple(query);
```

### Create Entity
```csharp
var entity = new Entity("cr4a0_product")
{
    ["cr4a0_name"] = "New Product",
    ["cr4a0_price"] = new Money(25.99m)
};
var id = await _dataverseService.Create(entity);
```

### Update Entity
```csharp
var entity = new Entity("cr4a0_product")
{
    Id = productId,
    ["cr4a0_name"] = "Updated Name"
};
await _dataverseService.Update(entity);
```

### Delete Entity
```csharp
await _dataverseService.Delete("cr4a0_product", productId);
```

## Troubleshooting

### Connection Issues
1. Verify credentials in appsettings.json
2. Check `/api/health/dataverse` endpoint
3. Review application logs for Dataverse connection errors
4. Ensure the App Registration has proper permissions in Azure AD
5. Verify the App Registration has been granted access to Dataverse

### Required Permissions
Your Azure AD App Registration needs:
- **Dynamics CRM API**: `user_impersonation` (delegated) or appropriate application permissions
- Grant admin consent for the permissions

### Logs
The application logs Dataverse operations at Information level. Check the console output or configure logging to file.

## Next Steps

1. **Update table/column names** in ProductsController.cs to match your Dataverse schema
2. **Test the connection** using `/api/health/dataverse`
3. **Create additional controllers** for other Dataverse tables (Orders, Customers, etc.)
4. **Add authentication/authorization** to secure your API
5. **Move secrets** to User Secrets or Azure Key Vault
6. **Add data validation** and business logic
7. **Implement error handling** middleware
8. **Add pagination** for large data sets

## Resources

- [Microsoft Dataverse Documentation](https://docs.microsoft.com/power-apps/developer/data-platform/)
- [ServiceClient Documentation](https://docs.microsoft.com/dotnet/api/microsoft.powerplatform.dataverse.client.serviceclient)
- [QueryExpression Examples](https://docs.microsoft.com/power-apps/developer/data-platform/org-service/build-queries-with-queryexpression)
