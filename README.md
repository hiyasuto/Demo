# Azure Sales Negotiation Log

A lightweight web application for Azure Sales Team to track customer interactions, deals, and negotiations.

## Overview

Azure Sales Negotiation Log is a full-stack application that helps sales teams:
- Track customer information and contacts
- Manage sales deals and opportunities
- Log interactions with customers (meetings, emails, phone calls)
- Search and filter historical data
- Export data to CSV for reporting
- Attach files to interactions
- Tag and categorize interactions

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: MSAL React (Microsoft Entra ID)
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Framework**: .NET 9 Minimal API
- **Language**: C#
- **Database**: Azure SQL Database (EF Core)
- **Authentication**: Microsoft Identity Web
- **Storage**: Azure Blob Storage (for file attachments)

### Infrastructure
- **Hosting**: Azure App Service (Web + API)
- **Database**: Azure SQL Database
- **Storage**: Azure Blob Storage
- **CI/CD**: GitHub Actions
- **Monitoring**: Azure Application Insights (optional)

## Features

✅ **Authentication & Authorization**
- Microsoft Entra ID (Azure AD) authentication
- Role-based access control (User, Manager, Admin)
- Protected routes and API endpoints

✅ **Customer Management**
- CRUD operations for customers
- Contact management
- Industry categorization

✅ **Deal Management**
- Track sales opportunities
- Deal stages and status
- Value and currency tracking
- Link deals to customers

✅ **Interaction Logging**
- Record customer interactions
- Multiple interaction types (Meeting, Email, Phone, Demo)
- Rich notes and descriptions
- Date and time tracking
- Link interactions to customers and deals

✅ **Search & Filter**
- Full-text search across customers, deals, and interactions
- Filter by date range
- Filter by type and status

✅ **Tags**
- Create and manage tags
- Tag interactions for categorization
- Filter by tags

✅ **File Attachments**
- Upload files to interactions
- Secure storage in Azure Blob Storage
- Multiple files per interaction

✅ **CSV Export**
- Export interactions to CSV (Manager+ role)
- Audit-ready data export

✅ **Audit Logging**
- Track all changes to data
- Record who made changes and when
- Store change history

## Project Structure

```
Demo/
├── app/
│   ├── web/                    # Next.js frontend
│   │   ├── app/                # App router pages
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── customers/      # Customer management
│   │   │   ├── deals/          # Deal management
│   │   │   ├── interactions/   # Interaction logging
│   │   │   ├── search/         # Search functionality
│   │   │   ├── settings/       # User settings
│   │   │   └── login/          # Login page
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities and config
│   │   └── .env.example        # Environment variables template
│   │
│   └── api/                    # .NET API
│       ├── Models/             # Entity models
│       ├── Data/               # DbContext
│       ├── Program.cs          # API endpoints
│       └── .env.example        # Environment variables template
│
├── docs/                       # Documentation
│   └── database-schema.md      # Database schema documentation
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
│
└── README.md                   # This file
```

## Prerequisites

- **Node.js** 20 or later
- **.NET SDK** 9.0 or later
- **Azure SQL Database** (or SQL Server LocalDB for local development)
- **Azure Storage Account** (for file attachments)
- **Microsoft Entra ID** (Azure AD) tenant with app registration

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hiyasuto/Demo.git
cd Demo
```

### 2. Configure Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:
   - Name: `Azure Sales Log`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI: `http://localhost:3000` (for development)
5. After creation, note the **Application (client) ID** and **Directory (tenant) ID**
6. Under **Certificates & secrets**, create a new client secret
7. Under **API permissions**, add `User.Read` permission
8. Under **Expose an API**, add a scope (e.g., `access_as_user`)

### 3. Setup Frontend

```bash
cd app/web
npm install

# Copy and configure environment variables
cp .env.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_AZURE_AD_CLIENT_ID=<your-client-id>
# NEXT_PUBLIC_AZURE_AD_TENANT_ID=<your-tenant-id>
# NEXT_PUBLIC_AZURE_AD_REDIRECT_URI=http://localhost:3000
# NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Run development server
npm run dev
```

The frontend will be available at http://localhost:3000

### 4. Setup Backend API

```bash
cd app/api

# Copy and configure environment variables
cp .env.example .env

# Edit appsettings.Development.json with your values:
# - ConnectionStrings:DefaultConnection
# - AzureAd configuration
# - AzureStorage configuration

# Apply database migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at http://localhost:5000

### 5. Database Setup

The application uses Entity Framework Core migrations. To create the database:

```bash
cd app/api

# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

For production, update the connection string in `appsettings.json` to point to your Azure SQL Database.

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_AD_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server.database.windows.net;Database=AzureSalesLog;User Id=your-user;Password=your-password;"
  },
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "yourtenant.onmicrosoft.com",
    "TenantId": "your-tenant-id",
    "ClientId": "your-client-id"
  },
  "AzureStorage": {
    "ConnectionString": "your-storage-connection-string",
    "ContainerName": "attachments"
  }
}
```

## Development

### Running Tests

```bash
# Frontend tests
cd app/web
npm test

# Backend tests
cd app/api
dotnet test
```

### Linting

```bash
# Frontend linting
cd app/web
npm run lint

# Fix linting errors
npm run lint -- --fix
```

### Building

```bash
# Frontend build
cd app/web
npm run build

# Backend build
cd app/api
dotnet build --configuration Release
```

## Deployment

### Azure Deployment

The application is configured for deployment to Azure App Service via GitHub Actions.

#### Prerequisites for Deployment

1. **Azure Resources**:
   - Two App Service instances (one for frontend, one for API)
   - Azure SQL Database
   - Azure Storage Account
   - Application Insights (optional)

2. **GitHub Secrets**:
   Configure the following secrets in your GitHub repository:
   - `AZURE_AD_CLIENT_ID`
   - `AZURE_AD_TENANT_ID`
   - `FRONTEND_URL`
   - `API_BASE_URL`
   - `AZURE_WEBAPP_NAME_FRONTEND`
   - `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`
   - `AZURE_WEBAPP_NAME_API`
   - `AZURE_WEBAPP_PUBLISH_PROFILE_API`

#### Deployment Process

The CI/CD pipeline automatically deploys to Azure when changes are pushed to the `main` branch:

1. Lints and tests the code
2. Builds the applications
3. Deploys frontend to Azure App Service
4. Deploys API to Azure App Service

### Manual Deployment

#### Frontend

```bash
cd app/web
npm run build
# Deploy the .next folder to Azure App Service
```

#### API

```bash
cd app/api
dotnet publish --configuration Release --output ./publish
# Deploy the publish folder to Azure App Service
```

## Database Schema

See [docs/database-schema.md](docs/database-schema.md) for detailed database schema documentation.

Key entities:
- **Users**: Application users
- **Customers**: Customer organizations
- **Contacts**: Customer contacts
- **Deals**: Sales opportunities
- **InteractionLogs**: Customer interaction records
- **Attachments**: File attachments
- **Tags**: Categorization tags
- **AuditLogs**: Change history

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Deals
- `GET /api/deals` - List all deals
- `GET /api/deals/{id}` - Get deal by ID
- `POST /api/deals` - Create deal
- `PUT /api/deals/{id}` - Update deal

### Interactions
- `GET /api/interactions` - List interactions (with optional filters)
- `GET /api/interactions/{id}` - Get interaction by ID
- `POST /api/interactions` - Create interaction
- `PUT /api/interactions/{id}` - Update interaction

### Search
- `GET /api/search?query={query}` - Search across customers, deals, and interactions

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag

### Export
- `GET /api/export/interactions` - Export interactions to CSV

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Security

- **Authentication**: All endpoints and pages require Microsoft Entra ID authentication
- **Authorization**: Role-based access control for sensitive operations
- **Data Protection**: HTTPS enforced, secure token handling
- **Audit Trail**: All data changes are logged with user and timestamp
- **File Storage**: Secure blob storage with access controls

## Performance

- **Caching**: EF Core query caching
- **Pagination**: API endpoints support pagination
- **Optimization**: Database indexes on frequently queried fields
- **CDN**: Static assets served via CDN (in production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The application follows WCAG 2.1 Level AA guidelines:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team

## Roadmap

Future enhancements:
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Integration with external CRM systems
- [ ] Workflow automation
- [ ] Multi-language support
- [ ] Dark mode improvements
- [ ] Bulk operations
- [ ] Advanced search with filters
- [ ] Activity timeline visualization

## Acknowledgments

- Built with ❤️ for the Azure Sales Team
- Powered by Next.js, .NET, and Azure
- Icons from Heroicons
- UI components from Tailwind CSS