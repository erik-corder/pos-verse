namespace PosBackend.Configuration
{
    /// <summary>
    /// Configuration model for Dataverse connection settings
    /// </summary>
    public class DataverseConfiguration
    {
        public const string SectionName = "Dataverse";

        /// <summary>
        /// The Dataverse environment URL (e.g., https://orgname.crm.dynamics.com)
        /// </summary>
        public string Url { get; set; } = string.Empty;

        /// <summary>
        /// Azure AD Tenant ID
        /// </summary>
        public string TenantId { get; set; } = string.Empty;

        /// <summary>
        /// Azure AD Application (Client) ID
        /// </summary>
        public string ClientId { get; set; } = string.Empty;

        /// <summary>
        /// Azure AD Application Client Secret
        /// </summary>
        public string ClientSecret { get; set; } = string.Empty;

        /// <summary>
        /// Validates that all required configuration values are present
        /// </summary>
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(Url) &&
                   !string.IsNullOrWhiteSpace(TenantId) &&
                   !string.IsNullOrWhiteSpace(ClientId) &&
                   !string.IsNullOrWhiteSpace(ClientSecret);
        }

        /// <summary>
        /// Builds the connection string for Dataverse ServiceClient
        /// </summary>
        public string GetConnectionString()
        {
            if (!IsValid())
            {
                throw new InvalidOperationException("Dataverse configuration is incomplete");
            }

            return $"AuthType=ClientSecret;Url={Url};TenantId={TenantId};ClientId={ClientId};ClientSecret={ClientSecret};";
        }
    }
}
