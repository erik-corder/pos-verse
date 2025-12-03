using Microsoft.AspNetCore.Mvc;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;

namespace PosBackend.Controllers
{
    /// <summary>
    /// Helper controller to discover Dataverse table and column logical names
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MetadataController : ControllerBase
    {
        private readonly ServiceClient _serviceClient;
        private readonly ILogger<MetadataController> _logger;

        public MetadataController(ServiceClient serviceClient, ILogger<MetadataController> logger)
        {
            _serviceClient = serviceClient;
            _logger = logger;
        }

        /// <summary>
        /// Get all custom tables (entities) in the Dataverse environment
        /// GET: api/metadata/tables
        /// </summary>
        [HttpGet("tables")]
        public async Task<IActionResult> GetCustomTables([FromQuery] string? search = null)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var request = new RetrieveAllEntitiesRequest
                {
                    EntityFilters = EntityFilters.Entity,
                    RetrieveAsIfPublished = false
                };

                var response = await Task.Run(() => (RetrieveAllEntitiesResponse)_serviceClient.Execute(request));

                var tables = response.EntityMetadata
                    .Where(e => e.IsCustomEntity == true) // Only custom tables
                    .Where(e => string.IsNullOrEmpty(search) || 
                           (e.LogicalName?.Contains(search, StringComparison.OrdinalIgnoreCase) == true ||
                            e.DisplayName?.UserLocalizedLabel?.Label?.Contains(search, StringComparison.OrdinalIgnoreCase) == true))
                    .Select(e => new
                    {
                        LogicalName = e.LogicalName,
                        DisplayName = e.DisplayName?.UserLocalizedLabel?.Label,
                        SchemaName = e.SchemaName,
                        PrimaryIdAttribute = e.PrimaryIdAttribute,
                        PrimaryNameAttribute = e.PrimaryNameAttribute
                    })
                    .OrderBy(e => e.LogicalName)
                    .ToList();

                return Ok(new
                {
                    Count = tables.Count,
                    Tables = tables
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving table metadata");
                return StatusCode(500, new { error = "Error retrieving tables", details = ex.Message });
            }
        }

        /// <summary>
        /// Get columns (attributes) for a specific table
        /// GET: api/metadata/tables/{tableName}/columns
        /// </summary>
        [HttpGet("tables/{tableName}/columns")]
        public async Task<IActionResult> GetTableColumns(string tableName)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                var request = new RetrieveEntityRequest
                {
                    LogicalName = tableName,
                    EntityFilters = EntityFilters.Attributes
                };

                var response = await Task.Run(() => (RetrieveEntityResponse)_serviceClient.Execute(request));

                var columns = response.EntityMetadata.Attributes
                    .Select(a => new
                    {
                        LogicalName = a.LogicalName,
                        DisplayName = a.DisplayName?.UserLocalizedLabel?.Label,
                        SchemaName = a.SchemaName,
                        AttributeType = a.AttributeType?.ToString(),
                        IsPrimaryId = a.IsPrimaryId == true,
                        IsPrimaryName = a.IsPrimaryName == true,
                        IsCustomAttribute = a.IsCustomAttribute == true
                    })
                    .OrderBy(a => a.LogicalName)
                    .ToList();

                return Ok(new
                {
                    TableName = tableName,
                    PrimaryIdAttribute = response.EntityMetadata.PrimaryIdAttribute,
                    PrimaryNameAttribute = response.EntityMetadata.PrimaryNameAttribute,
                    Count = columns.Count,
                    Columns = columns
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving columns for table {TableName}", tableName);
                return StatusCode(500, new { error = $"Error retrieving columns for table '{tableName}'", details = ex.Message });
            }
        }

        /// <summary>
        /// Search for tables by display name or logical name
        /// GET: api/metadata/search?query=product
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchTables([FromQuery] string query)
        {
            try
            {
                if (!_serviceClient.IsReady)
                {
                    return StatusCode(500, new { error = "Dataverse connection not ready", details = _serviceClient.LastError });
                }

                if (string.IsNullOrWhiteSpace(query))
                {
                    return BadRequest(new { error = "Query parameter is required" });
                }

                var request = new RetrieveAllEntitiesRequest
                {
                    EntityFilters = EntityFilters.Entity,
                    RetrieveAsIfPublished = false
                };

                var response = await Task.Run(() => (RetrieveAllEntitiesResponse)_serviceClient.Execute(request));

                var tables = response.EntityMetadata
                    .Where(e => 
                        e.LogicalName?.Contains(query, StringComparison.OrdinalIgnoreCase) == true ||
                        e.DisplayName?.UserLocalizedLabel?.Label?.Contains(query, StringComparison.OrdinalIgnoreCase) == true ||
                        e.SchemaName?.Contains(query, StringComparison.OrdinalIgnoreCase) == true)
                    .Select(e => new
                    {
                        LogicalName = e.LogicalName,
                        DisplayName = e.DisplayName?.UserLocalizedLabel?.Label,
                        SchemaName = e.SchemaName,
                        IsCustomEntity = e.IsCustomEntity == true,
                        PrimaryIdAttribute = e.PrimaryIdAttribute,
                        PrimaryNameAttribute = e.PrimaryNameAttribute
                    })
                    .OrderBy(e => e.IsCustomEntity ? 0 : 1) // Custom tables first
                    .ThenBy(e => e.LogicalName)
                    .Take(50) // Limit results
                    .ToList();

                return Ok(new
                {
                    Query = query,
                    Count = tables.Count,
                    Tables = tables
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching tables with query: {Query}", query);
                return StatusCode(500, new { error = "Error searching tables", details = ex.Message });
            }
        }
    }
}
