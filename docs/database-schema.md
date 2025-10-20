# Database Schema - Azure Sales Negotiation Log

## Tables

### Users
- Id (int, PK, Identity)
- Email (nvarchar(255), required, unique)
- Name (nvarchar(255), required)
- Role (nvarchar(50), required) - Values: "User", "Manager", "Admin"
- CreatedAt (datetime2, required)
- UpdatedAt (datetime2, required)

### Customers
- Id (int, PK, Identity)
- Name (nvarchar(255), required)
- Industry (nvarchar(100))
- ContactEmail (nvarchar(255))
- ContactPhone (nvarchar(50))
- Address (nvarchar(500))
- CreatedAt (datetime2, required)
- UpdatedAt (datetime2, required)
- CreatedByUserId (int, FK -> Users.Id)

### Contacts
- Id (int, PK, Identity)
- CustomerId (int, FK -> Customers.Id, required)
- Name (nvarchar(255), required)
- Email (nvarchar(255))
- Phone (nvarchar(50))
- Title (nvarchar(100))
- IsPrimary (bit, required, default: false)
- CreatedAt (datetime2, required)
- UpdatedAt (datetime2, required)

### Deals
- Id (int, PK, Identity)
- CustomerId (int, FK -> Customers.Id, required)
- Title (nvarchar(255), required)
- Description (nvarchar(max))
- Value (decimal(18,2))
- Currency (nvarchar(10), default: "USD")
- Status (nvarchar(50), required) - Values: "Active", "Closed", "Lost"
- Stage (nvarchar(50)) - Values: "Proposal", "Negotiation", "Contract", "Completed"
- CloseDate (datetime2)
- CreatedAt (datetime2, required)
- UpdatedAt (datetime2, required)
- CreatedByUserId (int, FK -> Users.Id)

### InteractionLogs
- Id (int, PK, Identity)
- CustomerId (int, FK -> Customers.Id, required)
- DealId (int, FK -> Deals.Id, required)
- UserId (int, FK -> Users.Id, required)
- Type (nvarchar(50), required) - Values: "Meeting", "Email", "Phone", "Demo", "Other"
- Subject (nvarchar(255), required)
- Notes (nvarchar(max), required)
- InteractionDate (datetime2, required)
- CreatedAt (datetime2, required)
- UpdatedAt (datetime2, required)

### Attachments
- Id (int, PK, Identity)
- InteractionLogId (int, FK -> InteractionLogs.Id, required)
- FileName (nvarchar(255), required)
- BlobUri (nvarchar(1000), required)
- FileSize (bigint)
- ContentType (nvarchar(100))
- UploadedAt (datetime2, required)
- UploadedByUserId (int, FK -> Users.Id)

### Tags
- Id (int, PK, Identity)
- Name (nvarchar(50), required, unique)
- CreatedAt (datetime2, required)

### InteractionLogTags (Many-to-Many join table)
- InteractionLogId (int, FK -> InteractionLogs.Id, PK)
- TagId (int, FK -> Tags.Id, PK)

### AuditLogs
- Id (int, PK, Identity)
- UserId (int, FK -> Users.Id)
- EntityType (nvarchar(50), required)
- EntityId (int, required)
- Action (nvarchar(50), required) - Values: "Create", "Update", "Delete"
- Changes (nvarchar(max)) - JSON string of changes
- Timestamp (datetime2, required)
- IpAddress (nvarchar(50))

## Indexes

- Customers.Name
- Deals.CustomerId, Deals.Status
- InteractionLogs.CustomerId, InteractionLogs.DealId, InteractionLogs.InteractionDate
- Tags.Name
- AuditLogs.UserId, AuditLogs.Timestamp

## Relationships

- Customer 1:N Contacts
- Customer 1:N Deals
- Customer 1:N InteractionLogs
- Deal 1:N InteractionLogs
- User 1:N InteractionLogs
- InteractionLog 1:N Attachments
- InteractionLog N:N Tags (through InteractionLogTags)
