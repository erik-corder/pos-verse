using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace PosBackend.Services
{
    public interface IDataverseService
    {
        bool IsReady { get; }
        string LastError { get; }
        Task<EntityCollection> RetrieveMultiple(QueryExpression query);
        Task<Entity> Retrieve(string entityName, Guid id, ColumnSet columnSet);
        Task<Guid> Create(Entity entity);
        Task Update(Entity entity);
        Task Delete(string entityName, Guid id);
    }

    public class DataverseService : IDataverseService
    {
        private readonly ServiceClient _serviceClient;
        private readonly ILogger<DataverseService> _logger;

        public DataverseService(ServiceClient serviceClient, ILogger<DataverseService> logger)
        {
            _serviceClient = serviceClient;
            _logger = logger;
        }

        public bool IsReady => _serviceClient.IsReady;
        public string LastError => _serviceClient.LastError;

        public async Task<EntityCollection> RetrieveMultiple(QueryExpression query)
        {
            try
            {
                _logger.LogInformation("Executing query for entity: {EntityName}", query.EntityName);
                return await Task.Run(() => _serviceClient.RetrieveMultiple(query));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing RetrieveMultiple for entity: {EntityName}", query.EntityName);
                throw;
            }
        }

        public async Task<Entity> Retrieve(string entityName, Guid id, ColumnSet columnSet)
        {
            try
            {
                _logger.LogInformation("Retrieving entity: {EntityName}, ID: {Id}", entityName, id);
                return await Task.Run(() => _serviceClient.Retrieve(entityName, id, columnSet));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving entity: {EntityName}, ID: {Id}", entityName, id);
                throw;
            }
        }

        public async Task<Guid> Create(Entity entity)
        {
            try
            {
                _logger.LogInformation("Creating entity: {EntityName}", entity.LogicalName);
                return await Task.Run(() => _serviceClient.Create(entity));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating entity: {EntityName}", entity.LogicalName);
                throw;
            }
        }

        public async Task Update(Entity entity)
        {
            try
            {
                _logger.LogInformation("Updating entity: {EntityName}, ID: {Id}", entity.LogicalName, entity.Id);
                await Task.Run(() => _serviceClient.Update(entity));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating entity: {EntityName}, ID: {Id}", entity.LogicalName, entity.Id);
                throw;
            }
        }

        public async Task Delete(string entityName, Guid id)
        {
            try
            {
                _logger.LogInformation("Deleting entity: {EntityName}, ID: {Id}", entityName, id);
                await Task.Run(() => _serviceClient.Delete(entityName, id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting entity: {EntityName}, ID: {Id}", entityName, id);
                throw;
            }
        }
    }
}
