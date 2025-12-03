using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace PosBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ServiceClient _serviceClient;
        private readonly ILogger<ProductsController> _logger;

        private const string ProductEntityName = "cr056_product";
        private const string ProductIdField = "cr056_productid";
        private const string ProductNameField = "cr056_name";
        private const string ProductPriceField = "cr056_price";
        private const string ProductSkuField = "cr056_sku";
        private const string ProductIsActiveField = "cr056_isactive";

        public ProductsController(ServiceClient serviceClient, ILogger<ProductsController> logger)
        {
            _serviceClient = serviceClient;
            _logger = logger;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] bool? isActive = null)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var query = new QueryExpression(ProductEntityName)
                {
                    ColumnSet = new ColumnSet(ProductIdField, ProductNameField, ProductPriceField, ProductSkuField, ProductIsActiveField)
                };

                // Filter by active status if provided
                if (isActive.HasValue)
                {
                    query.Criteria.AddCondition(ProductIsActiveField, ConditionOperator.Equal, isActive.Value);
                }

                var results = await Task.Run(() => _serviceClient.RetrieveMultiple(query));

                var products = results.Entities.Select(e => new
                {
                    Id = e.GetAttributeValue<Guid>(ProductIdField),
                    Name = e.GetAttributeValue<string>(ProductNameField),
                    Price = e.GetAttributeValue<Money>(ProductPriceField)?.Value ?? 0m,
                    Sku = e.GetAttributeValue<string>(ProductSkuField),
                    IsActive = e.GetAttributeValue<bool>(ProductIsActiveField)
                }).ToList();

                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products from Dataverse");
                return StatusCode(500, new { error = "Error retrieving products", details = ex.Message });
            }
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(Guid id)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var entity = await Task.Run(() => _serviceClient.Retrieve(ProductEntityName, id, 
                    new ColumnSet(ProductIdField, ProductNameField, ProductPriceField, ProductSkuField, ProductIsActiveField)));

                if (entity == null)
                {
                    return NotFound(new { error = "Product not found" });
                }

                var product = new
                {
                    Id = entity.GetAttributeValue<Guid>(ProductIdField),
                    Name = entity.GetAttributeValue<string>(ProductNameField),
                    Price = entity.GetAttributeValue<Money>(ProductPriceField)?.Value ?? 0m,
                    Sku = entity.GetAttributeValue<string>(ProductSkuField),
                    IsActive = entity.GetAttributeValue<bool>(ProductIsActiveField)
                };

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product {ProductId} from Dataverse", id);
                return StatusCode(500, new { error = "Error retrieving product", details = ex.Message });
            }
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var entity = new Entity(ProductEntityName)
                {
                    [ProductNameField] = request.Name,
                    [ProductPriceField] = new Money(request.Price),
                    [ProductIsActiveField] = request.IsActive ?? true
                };

                if (!string.IsNullOrWhiteSpace(request.Sku))
                {
                    entity[ProductSkuField] = request.Sku;
                }

                var productId = await Task.Run(() => _serviceClient.Create(entity));

                _logger.LogInformation("Created product with ID: {ProductId}", productId);

                return CreatedAtAction(nameof(GetProduct), new { id = productId }, new 
                { 
                    Id = productId, 
                    request.Name, 
                    request.Price, 
                    request.Sku, 
                    IsActive = request.IsActive ?? true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product in Dataverse");
                return StatusCode(500, new { error = "Error creating product", details = ex.Message });
            }
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var entity = new Entity(ProductEntityName)
                {
                    Id = id,
                    [ProductNameField] = request.Name,
                    [ProductPriceField] = new Money(request.Price),
                    [ProductIsActiveField] = request.IsActive ?? true
                };

                if (!string.IsNullOrWhiteSpace(request.Sku))
                {
                    entity[ProductSkuField] = request.Sku;
                }

                await Task.Run(() => _serviceClient.Update(entity));

                _logger.LogInformation("Updated product with ID: {ProductId}", id);

                return Ok(new { message = "Product updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {ProductId} in Dataverse", id);
                return StatusCode(500, new { error = "Error updating product", details = ex.Message });
            }
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                await Task.Run(() => _serviceClient.Delete(ProductEntityName, id));

                _logger.LogInformation("Deleted product with ID: {ProductId}", id);

                return Ok(new { message = "Product deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {ProductId} from Dataverse", id);
                return StatusCode(500, new { error = "Error deleting product", details = ex.Message });
            }
        }
    }

    // Request DTOs
    public record CreateProductRequest(string Name, decimal Price, string? Sku = null, bool? IsActive = true);
    public record UpdateProductRequest(string Name, decimal Price, string? Sku = null, bool? IsActive = true);
}
