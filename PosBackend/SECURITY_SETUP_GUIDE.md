# Dataverse Security Setup Guide

This guide shows you exactly how to set up the security roles for your POS Backend application user.

## Quick Setup (Recommended for Development)

### Option 1: Use System Customizer Role (Fastest - 2 minutes)

1. Open **Power Platform Admin Center**: https://admin.powerplatform.microsoft.com
2. Select your environment (Erik Ranjay's Environment)
3. Go to **Settings** ? **Users + permissions** ? **Application users**
4. Find your application user (look for your App ID/Client ID)
5. Click **Manage security roles**
6. Check ? **System Customizer**
7. Click **Save**

? Done! Your app now has full access to all custom entities.

---

## Production Setup (Custom Security Role)

For production, create a specific role with minimal required privileges.

### Step 1: Create Custom Security Role

1. **Power Platform Admin Center** ? Your environment
2. **Settings** ? **Security** ? **Security roles**
3. Click **+ New role**
4. **Name:** `POS Backend Service Role`
5. **Description:** `Security role for POS Backend API application user`

### Step 2: Grant Privileges for Custom Entities

Go to the **Custom Entities** tab and configure:

#### Product Table (cr056_product)
| Privilege | Access Level | How to Set |
|-----------|-------------|------------|
| Create | Organization | Click circle 4 times: ????? ? ????? |
| Read | Organization | Click circle 4 times: ????? ? ????? |
| Write | Organization | Click circle 4 times: ????? ? ????? |
| Delete | Organization | Click circle 4 times: ????? ? ????? |

#### Customer Table (cr056_customer)
| Privilege | Access Level | How to Set |
|-----------|-------------|------------|
| Create | Organization | Click circle 4 times: ????? ? ????? |
| Read | Organization | Click circle 4 times: ????? ? ????? |
| Write | Organization | Click circle 4 times: ????? ? ????? |
| Delete | Organization | Click circle 4 times: ????? ? ????? |

#### Order Table (cr056_order)
| Privilege | Access Level | How to Set |
|-----------|-------------|------------|
| Create | Organization | Click circle 4 times: ????? ? ????? |
| Read | Organization | Click circle 4 times: ????? ? ????? |
| Write | Organization | Click circle 4 times: ????? ? ????? |
| Delete | Organization | Click circle 4 times: ????? ? ????? |
| Append | Organization | Click circle 4 times: ????? ? ????? |
| Append To | Organization | Click circle 4 times: ????? ? ????? |

#### Order Line Table (cr056_orderline)
| Privilege | Access Level | How to Set |
|-----------|-------------|------------|
| Create | Organization | Click circle 4 times: ????? ? ????? |
| Read | Organization | Click circle 4 times: ????? ? ????? |
| Write | Organization | Click circle 4 times: ????? ? ????? |
| Delete | Organization | Click circle 4 times: ????? ? ????? |
| Append | Organization | Click circle 4 times: ????? ? ????? |
| Append To | Organization | Click circle 4 times: ????? ? ????? |

### Understanding Access Levels

Each privilege has 5 access level circles:

```
? ? ? ? ?
1 2 3 4 5

1 = None (no access)
2 = User (only records owned by the user)
3 = Business Unit (records in the same business unit)
4 = Parent: Child Business Units (current and child BUs)
5 = Organization (all records) ? Use this for service accounts
```

**For Application Users:** Always use **Organization** level (5th circle) because service accounts need access to all records regardless of ownership.

### Step 3: Save the Role

1. Click **Save and Close**

### Step 4: Assign Role to Application User

1. Go back to **Settings** ? **Users + permissions** ? **Application users**
2. Find your application user (look for your App ID/Client ID)
3. Click **Manage security roles**
4. **Uncheck** any existing roles (like Basic User)
5. **Check** ? `POS Backend Service Role`
6. Click **Save**

---

## Verify Setup

### Method 1: Test the API

1. Start your application
2. Navigate to Swagger: `https://localhost:{port}/swagger`
3. Try: `GET /api/products`
4. If successful, security is configured correctly

### Method 2: Check in Power Platform

1. Go to **Application users** list
2. Click on **PosBackendDataverseApp**
3. Scroll to **Security roles** section
4. Verify you see your custom role

---

## Troubleshooting

### Error: "Principal user is missing prvReadcr056_Product privilege"

**Cause:** Application user doesn't have Read privilege on the Product table

**Fix:**
1. Go to your custom security role
2. Find **cr056_product** in Custom Entities tab
3. Set **Read** privilege to Organization level (5th circle)
4. Save

### Error: "Principal user is missing prvCreatecr056_Order privilege"

**Cause:** Application user doesn't have Create privilege on the Order table

**Fix:**
1. Go to your custom security role
2. Find **cr056_order** in Custom Entities tab
3. Set **Create** privilege to Organization level (5th circle)
4. Save

### Error: "seclib::AccessCheckEx2 failed. Returned hr = -2147220960"

**Cause:** Application user doesn't have proper privileges for relationship operations

**Fix:**
1. Add **Append** and **Append To** privileges to tables with lookups
2. Set both to Organization level

### Application User Not Visible

**Cause:** Application user hasn't been created yet

**Fix:**
1. Run your application once - this creates the app user automatically
2. Refresh the Application users list
3. The user should appear with your App ID

---

## Security Best Practices

### For Development
- ? Use **System Customizer** role for quick setup
- ? This gives access to all custom entities
- ?? Don't use in production

### For Production
- ? Create a custom role with minimal required privileges
- ? Only grant Organization-level access to tables your app needs
- ? Regularly review and audit privileges
- ? Never use **System Administrator** role for service accounts

### For Testing
- Create a test environment
- Use the same security role as production
- Test all API operations

---

## Application User Details

Your current application user information (from the error message):

```
Application Name: YourAppName
Application ID: your-client-id-here
User ID: your-user-id-here
AAD Object ID: your-aad-object-id-here
Access Mode: Non-Interactive (correct for service accounts)
Business Unit ID: your-business-unit-id-here
Current Privileges: (check your app's current privileges)
```

---

## Quick Reference Commands

### Check Current Roles (PowerShell)
```powershell
# Install Power Apps module
Install-Module -Name Microsoft.PowerApps.Administration.PowerShell

# Connect
Add-PowerAppsAccount

# List app users
Get-AdminPowerAppEnvironment | Get-PowerAppEnvironmentRoleAssignment
```

---

## Summary Checklist

Before running your API, verify:

- [ ] Application user exists in Dataverse
- [ ] Security role created with custom entity privileges
- [ ] All 4 tables have Create, Read, Write, Delete privileges
- [ ] All privileges set to Organization level
- [ ] Order and OrderLine tables have Append/Append To privileges
- [ ] Security role assigned to application user
- [ ] Tested with a simple GET request

Once all items are checked, your API should work without permission errors!

---

## Support

If you continue to have issues:

1. **Check the error message** - it tells you exactly which privilege is missing
2. **Verify table names** - use the Metadata API: `GET /api/metadata/entities`
3. **Check Application logs** - look in the console output for detailed errors
4. **Review Dataverse audit logs** - Power Platform Admin Center ? Environments ? [Your Environment] ? Audit logs

## Additional Resources

- [Microsoft Learn: Security roles and privileges](https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges)
- [Create application users in Dataverse](https://learn.microsoft.com/en-us/power-platform/admin/manage-application-users)
- [How access to a record is determined](https://learn.microsoft.com/en-us/power-platform/admin/how-record-access-determined)
