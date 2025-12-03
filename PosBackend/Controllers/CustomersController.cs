using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace PosBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ServiceClient _serviceClient;
        private readonly ILogger<CustomersController> _logger;

        private const string CustomerEntityName = "cr056_customer";
        private const string CustomerIdField = "cr056_customerid";
        private const string CustomerNameField = "cr056_name";
        private const string CustomerEmailField = "cr056_email";
        private const string CustomerPhoneField = "cr056_phone";

        public CustomersController(ServiceClient serviceClient, ILogger<CustomersController> logger)
        {
            _serviceClient = serviceClient;
            _logger = logger;
        }

        // GET: api/customers
        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] string? searchTerm = null)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var query = new QueryExpression(CustomerEntityName)
                {
                    ColumnSet = new ColumnSet(CustomerIdField, CustomerNameField, CustomerEmailField, CustomerPhoneField)
                };

                // Search by name or email if search term provided
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    var filter = new FilterExpression(LogicalOperator.Or);
                    filter.AddCondition(CustomerNameField, ConditionOperator.Like, $"%{searchTerm}%");
                    filter.AddCondition(CustomerEmailField, ConditionOperator.Like, $"%{searchTerm}%");
                    query.Criteria.AddFilter(filter);
                }

                var results = await Task.Run(() => _serviceClient.RetrieveMultiple(query));

                var customers = results.Entities.Select(e => new
                {
                    Id = e.GetAttributeValue<Guid>(CustomerIdField),
                    Name = e.GetAttributeValue<string>(CustomerNameField),
                    Email = e.GetAttributeValue<string>(CustomerEmailField),
                    Phone = e.GetAttributeValue<string>(CustomerPhoneField)
                }).ToList();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customers from Dataverse");
                return StatusCode(500, new { error = "Error retrieving customers", details = ex.Message });
            }
        }

        // GET: api/customers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(Guid id)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var entity = await Task.Run(() => _serviceClient.Retrieve(CustomerEntityName, id,
                    new ColumnSet(CustomerIdField, CustomerNameField, CustomerEmailField, CustomerPhoneField)));

                if (entity == null)
                {
                    return NotFound(new { error = "Customer not found" });
                }

                var customer = new
                {
                    Id = entity.GetAttributeValue<Guid>(CustomerIdField),
                    Name = entity.GetAttributeValue<string>(CustomerNameField),
                    Email = entity.GetAttributeValue<string>(CustomerEmailField),
                    Phone = entity.GetAttributeValue<string>(CustomerPhoneField)
                };

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer {CustomerId} from Dataverse", id);
                return StatusCode(500, new { error = "Error retrieving customer", details = ex.Message });
            }
        }

        // POST: api/customers
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var entity = new Entity(CustomerEntityName)
                {
                    [CustomerNameField] = request.Name,
                    [CustomerEmailField] = request.Email
                };

                if (!string.IsNullOrWhiteSpace(request.Phone))
                {
                    entity[CustomerPhoneField] = request.Phone;
                }

                var customerId = await Task.Run(() => _serviceClient.Create(entity));

                _logger.LogInformation("Created customer with ID: {CustomerId}", customerId);

                return CreatedAtAction(nameof(GetCustomer), new { id = customerId }, new
                {
                    Id = customerId,
                    request.Name,
                    request.Email,
                    request.Phone
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer in Dataverse");
                return StatusCode(500, new { error = "Error creating customer", details = ex.Message });
            }
        }

        // PUT: api/customers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var entity = new Entity(CustomerEntityName)
                {
                    Id = id,
                    [CustomerNameField] = request.Name,
                    [CustomerEmailField] = request.Email
                };

                if (!string.IsNullOrWhiteSpace(request.Phone))
                {
                    entity[CustomerPhoneField] = request.Phone;
                }

                await Task.Run(() => _serviceClient.Update(entity));

                _logger.LogInformation("Updated customer with ID: {CustomerId}", id);

                return Ok(new { message = "Customer updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customer {CustomerId} in Dataverse", id);
                return StatusCode(500, new { error = "Error updating customer", details = ex.Message });
            }
        }

        // DELETE: api/customers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    _logger.LogError("Dataverse connection not ready: {Error}", _serviceClient.LastError);
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                await Task.Run(() => _serviceClient.Delete(CustomerEntityName, id));

                _logger.LogInformation("Deleted customer with ID: {CustomerId}", id);

                return Ok(new { message = "Customer deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting customer {CustomerId} from Dataverse", id);
                return StatusCode(500, new { error = "Error deleting customer", details = ex.Message });
            }
        }
    }

    // Request DTOs
    public record CreateCustomerRequest(string Name, string Email, string? Phone = null);
    public record UpdateCustomerRequest(string Name, string Email, string? Phone = null);
}
