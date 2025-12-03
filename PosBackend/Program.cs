using Microsoft.PowerPlatform.Dataverse.Client;
using PosBackend.Configuration;
using PosBackend.Services;

namespace PosBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // Bind Dataverse configuration
            var dataverseConfig = builder.Configuration
                .GetSection(DataverseConfiguration.SectionName)
                .Get<DataverseConfiguration>();

            if (dataverseConfig == null || !dataverseConfig.IsValid())
            {
                throw new InvalidOperationException(
                    "Dataverse configuration is missing or incomplete. Please check appsettings.json");
            }

            // Configure Dataverse ServiceClient
            builder.Services.AddSingleton<ServiceClient>(sp =>
            {
                var connectionString = dataverseConfig.GetConnectionString();
                var serviceClient = new ServiceClient(connectionString);
                
                // Log connection status
                var logger = sp.GetRequiredService<ILogger<Program>>();
                if (serviceClient.IsReady)
                {
                    logger.LogInformation("Dataverse connection established successfully to {OrgName}", 
                        serviceClient.ConnectedOrgFriendlyName);
                }
                else
                {
                    logger.LogError("Failed to connect to Dataverse: {Error}", serviceClient.LastError);
                }

                return serviceClient;
            });

            // Register Dataverse service interface
            builder.Services.AddScoped<IDataverseService, DataverseService>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "POS Backend API",
                    Version = "v1",
                    Description = "POS system backend with Dataverse integration"
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            // Example: Test Dataverse connection endpoint
            app.MapGet("/api/health/dataverse", (ServiceClient client) =>
            {
                try
                {
                    if (!client.IsReady)
                    {
                        return Results.Problem($"Dataverse connection not ready: {client.LastError}");
                    }

                    return Results.Ok(new 
                    { 
                        Status = "Connected",
                        IsReady = client.IsReady,
                        ConnectedOrgFriendlyName = client.ConnectedOrgFriendlyName,
                        ConnectedOrgVersion = client.ConnectedOrgVersion?.ToString(),
                        ConnectedOrgId = client.ConnectedOrgId
                    });
                }
                catch (Exception ex)
                {
                    return Results.Problem($"Error checking Dataverse connection: {ex.Message}");
                }
            })
            .WithName("DataverseHealthCheck");

            app.Run();
        }
    }
}
