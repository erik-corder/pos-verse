using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace PosBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ServiceClient _serviceClient;
        private readonly ILogger<OrdersController> _logger;

        private const string OrderEntityName = "cr056_order";
        private const string OrderIdField = "cr056_orderid";
        private const string OrderNumberField = "cr056_ordernumber";
        private const string OrderDateField = "cr056_orderdate";
        private const string OrderTotalAmountField = "cr056_totalamount";
        private const string OrderCustomerField = "cr056_customerid"; // Lookup field

        private const string OrderLineEntityName = "cr056_orderline";
        private const string OrderLineIdField = "cr056_orderlineid";
        private const string OrderLineOrderField = "cr056_orderid"; // Lookup to Order
        private const string OrderLineProductField = "cr056_productid"; // Lookup to Product
        private const string OrderLineQuantityField = "cr056_quantity";
        private const string OrderLineUnitPriceField = "cr056_unitprice";
        private const string OrderLineLineTotalField = "cr056_linetotal";

        private const string CustomerEntityName = "cr056_customer";
        private const string CustomerNameField = "cr056_name";

        private const string ProductEntityName = "cr056_product";
        private const string ProductNameField = "cr056_name";

        public OrdersController(ServiceClient serviceClient, ILogger<OrdersController> logger)
        {
            _serviceClient = serviceClient;
            _logger = logger;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var query = new QueryExpression(OrderEntityName)
                {
                    ColumnSet = new ColumnSet(OrderIdField, OrderNumberField, OrderDateField, OrderTotalAmountField, OrderCustomerField)
                };

                // Add date filters if provided
                if (startDate.HasValue)
                {
                    query.Criteria.AddCondition(OrderDateField, ConditionOperator.GreaterEqual, startDate.Value);
                }
                if (endDate.HasValue)
                {
                    query.Criteria.AddCondition(OrderDateField, ConditionOperator.LessEqual, endDate.Value);
                }

                // Add link to customer to get customer name
                var customerLink = query.AddLink(CustomerEntityName, OrderCustomerField, "cr056_customerid", JoinOperator.LeftOuter);
                customerLink.Columns = new ColumnSet(CustomerNameField);
                customerLink.EntityAlias = "customer";

                // Order by date descending
                query.AddOrder(OrderDateField, OrderType.Descending);

                var results = await Task.Run(() => _serviceClient.RetrieveMultiple(query));

                var orders = results.Entities.Select(e => new
                {
                    Id = e.GetAttributeValue<Guid>(OrderIdField),
                    OrderNumber = e.GetAttributeValue<string>(OrderNumberField),
                    OrderDate = e.GetAttributeValue<DateTime>(OrderDateField),
                    TotalAmount = e.GetAttributeValue<Money>(OrderTotalAmountField)?.Value ?? 0m,
                    CustomerId = e.GetAttributeValue<EntityReference>(OrderCustomerField)?.Id,
                    CustomerName = e.GetAttributeValue<AliasedValue>("customer." + CustomerNameField)?.Value as string
                }).ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders from Dataverse");
                return StatusCode(500, new { error = "Error retrieving orders", details = ex.Message });
            }
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                // Get order
                var orderEntity = await Task.Run(() => _serviceClient.Retrieve(OrderEntityName, id,
                    new ColumnSet(OrderIdField, OrderNumberField, OrderDateField, OrderTotalAmountField, OrderCustomerField)));

                if (orderEntity == null)
                {
                    return NotFound(new { error = "Order not found" });
                }

                // Get customer info
                var customerId = orderEntity.GetAttributeValue<EntityReference>(OrderCustomerField)?.Id;
                string? customerName = null;
                if (customerId.HasValue)
                {
                    var customerEntity = await Task.Run(() => _serviceClient.Retrieve(CustomerEntityName, customerId.Value,
                        new ColumnSet(CustomerNameField)));
                    customerName = customerEntity?.GetAttributeValue<string>(CustomerNameField);
                }

                // Get order lines
                var orderLinesQuery = new QueryExpression(OrderLineEntityName)
                {
                    ColumnSet = new ColumnSet(OrderLineIdField, OrderLineProductField, OrderLineQuantityField, 
                                             OrderLineUnitPriceField, OrderLineLineTotalField),
                    Criteria = new FilterExpression
                    {
                        Conditions =
                        {
                            new ConditionExpression(OrderLineOrderField, ConditionOperator.Equal, id)
                        }
                    }
                };

                // Add link to product to get product name
                var productLink = orderLinesQuery.AddLink(ProductEntityName, OrderLineProductField, "cr056_productid", JoinOperator.LeftOuter);
                productLink.Columns = new ColumnSet(ProductNameField);
                productLink.EntityAlias = "product";

                var orderLinesResults = await Task.Run(() => _serviceClient.RetrieveMultiple(orderLinesQuery));

                var orderLines = orderLinesResults.Entities.Select(e => new
                {
                    Id = e.GetAttributeValue<Guid>(OrderLineIdField),
                    ProductId = e.GetAttributeValue<EntityReference>(OrderLineProductField)?.Id,
                    ProductName = e.GetAttributeValue<AliasedValue>("product." + ProductNameField)?.Value as string,
                    Quantity = e.GetAttributeValue<int>(OrderLineQuantityField),
                    UnitPrice = e.GetAttributeValue<Money>(OrderLineUnitPriceField)?.Value ?? 0m,
                    LineTotal = e.GetAttributeValue<Money>(OrderLineLineTotalField)?.Value ?? 0m
                }).ToList();

                var order = new
                {
                    Id = orderEntity.GetAttributeValue<Guid>(OrderIdField),
                    OrderNumber = orderEntity.GetAttributeValue<string>(OrderNumberField),
                    OrderDate = orderEntity.GetAttributeValue<DateTime>(OrderDateField),
                    TotalAmount = orderEntity.GetAttributeValue<Money>(OrderTotalAmountField)?.Value ?? 0m,
                    CustomerId = customerId,
                    CustomerName = customerName,
                    OrderLines = orderLines
                };

                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order {OrderId} from Dataverse", id);
                return StatusCode(500, new { error = "Error retrieving order", details = ex.Message });
            }
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                // Validate order lines
                if (request.OrderLines == null || !request.OrderLines.Any())
                {
                    return BadRequest(new { error = "Order must contain at least one order line" });
                }

                // Calculate total amount
                decimal totalAmount = request.OrderLines.Sum(line => line.Quantity * line.UnitPrice);

                // Create order entity
                var orderEntity = new Entity(OrderEntityName)
                {
                    [OrderNumberField] = request.OrderNumber ?? GenerateOrderNumber(),
                    [OrderDateField] = request.OrderDate ?? DateTime.UtcNow,
                    [OrderTotalAmountField] = new Money(totalAmount),
                    [OrderCustomerField] = new EntityReference(CustomerEntityName, request.CustomerId)
                };

                var orderId = await Task.Run(() => _serviceClient.Create(orderEntity));

                _logger.LogInformation("Created order with ID: {OrderId}", orderId);

                // Create order lines
                var createdOrderLines = new List<object>();
                foreach (var line in request.OrderLines)
                {
                    var lineTotal = line.Quantity * line.UnitPrice;

                    var orderLineEntity = new Entity(OrderLineEntityName)
                    {
                        [OrderLineOrderField] = new EntityReference(OrderEntityName, orderId),
                        [OrderLineProductField] = new EntityReference(ProductEntityName, line.ProductId),
                        [OrderLineQuantityField] = line.Quantity,
                        [OrderLineUnitPriceField] = new Money(line.UnitPrice),
                        [OrderLineLineTotalField] = new Money(lineTotal)
                    };

                    var orderLineId = await Task.Run(() => _serviceClient.Create(orderLineEntity));

                    createdOrderLines.Add(new
                    {
                        Id = orderLineId,
                        line.ProductId,
                        line.Quantity,
                        line.UnitPrice,
                        LineTotal = lineTotal
                    });

                    _logger.LogInformation("Created order line with ID: {OrderLineId} for order {OrderId}", orderLineId, orderId);
                }

                return CreatedAtAction(nameof(GetOrder), new { id = orderId }, new
                {
                    Id = orderId,
                    OrderNumber = request.OrderNumber ?? GenerateOrderNumber(),
                    OrderDate = request.OrderDate ?? DateTime.UtcNow,
                    TotalAmount = totalAmount,
                    request.CustomerId,
                    OrderLines = createdOrderLines
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order in Dataverse");
                return StatusCode(500, new { error = "Error creating order", details = ex.Message });
            }
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] UpdateOrderRequest request)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var orderEntity = new Entity(OrderEntityName)
                {
                    Id = id,
                    [OrderNumberField] = request.OrderNumber,
                    [OrderDateField] = request.OrderDate,
                    [OrderTotalAmountField] = new Money(request.TotalAmount),
                    [OrderCustomerField] = new EntityReference(CustomerEntityName, request.CustomerId)
                };

                await Task.Run(() => _serviceClient.Update(orderEntity));

                _logger.LogInformation("Updated order with ID: {OrderId}", id);

                return Ok(new { message = "Order updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order {OrderId} in Dataverse", id);
                return StatusCode(500, new { error = "Error updating order", details = ex.Message });
            }
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                // Delete order lines first
                var orderLinesQuery = new QueryExpression(OrderLineEntityName)
                {
                    ColumnSet = new ColumnSet(OrderLineIdField),
                    Criteria = new FilterExpression
                    {
                        Conditions =
                        {
                            new ConditionExpression(OrderLineOrderField, ConditionOperator.Equal, id)
                        }
                    }
                };

                var orderLinesResults = await Task.Run(() => _serviceClient.RetrieveMultiple(orderLinesQuery));

                foreach (var orderLine in orderLinesResults.Entities)
                {
                    await Task.Run(() => _serviceClient.Delete(OrderLineEntityName, orderLine.Id));
                }

                // Delete order
                await Task.Run(() => _serviceClient.Delete(OrderEntityName, id));

                _logger.LogInformation("Deleted order with ID: {OrderId} and its order lines", id);

                return Ok(new { message = "Order deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order {OrderId} from Dataverse", id);
                return StatusCode(500, new { error = "Error deleting order", details = ex.Message });
            }
        }

        // Helper method to generate order number
        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }
    }

    // Request DTOs
    public record CreateOrderRequest(
        Guid CustomerId,
        List<OrderLineRequest> OrderLines,
        string? OrderNumber = null,
        DateTime? OrderDate = null
    );

    public record UpdateOrderRequest(
        string OrderNumber,
        DateTime OrderDate,
        decimal TotalAmount,
        Guid CustomerId
    );

    public record OrderLineRequest(
        Guid ProductId,
        int Quantity,
        decimal UnitPrice
    );
}
