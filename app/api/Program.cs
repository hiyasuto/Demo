using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using AzureSalesLog.Data;
using AzureSalesLog.Models;
using System.Text;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddOpenApi();

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=AzureSalesLog;Trusted_Connection=True;MultipleActiveResultSets=true";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add Authentication (Microsoft Entra ID)
builder.Services.AddAuthentication(Microsoft.Identity.Web.Constants.Bearer)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            builder.Configuration["Frontend:Url"] ?? "http://localhost:3000"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithName("HealthCheck");

// Customer endpoints
app.MapGet("/api/customers", async (ApplicationDbContext db) =>
{
    var customers = await db.Customers
        .Include(c => c.CreatedBy)
        .OrderByDescending(c => c.CreatedAt)
        .ToListAsync();
    return Results.Ok(customers);
})
.WithName("GetCustomers");

app.MapGet("/api/customers/{id}", async (int id, ApplicationDbContext db) =>
{
    var customer = await db.Customers
        .Include(c => c.CreatedBy)
        .Include(c => c.Contacts)
        .FirstOrDefaultAsync(c => c.Id == id);

    return customer is not null ? Results.Ok(customer) : Results.NotFound();
})
.WithName("GetCustomer");

app.MapPost("/api/customers", async ([FromBody] Customer customer, ApplicationDbContext db) =>
{
    customer.CreatedAt = DateTime.UtcNow;
    customer.UpdatedAt = DateTime.UtcNow;
    db.Customers.Add(customer);
    await db.SaveChangesAsync();
    return Results.Created($"/api/customers/{customer.Id}", customer);
})
.WithName("CreateCustomer");

app.MapPut("/api/customers/{id}", async (int id, [FromBody] Customer inputCustomer, ApplicationDbContext db) =>
{
    var customer = await db.Customers.FindAsync(id);
    if (customer is null) return Results.NotFound();

    customer.Name = inputCustomer.Name;
    customer.Industry = inputCustomer.Industry;
    customer.ContactEmail = inputCustomer.ContactEmail;
    customer.ContactPhone = inputCustomer.ContactPhone;
    customer.Address = inputCustomer.Address;
    customer.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.Ok(customer);
})
.WithName("UpdateCustomer");

app.MapDelete("/api/customers/{id}", async (int id, ApplicationDbContext db) =>
{
    var customer = await db.Customers.FindAsync(id);
    if (customer is null) return Results.NotFound();

    db.Customers.Remove(customer);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteCustomer");

// Deal endpoints
app.MapGet("/api/deals", async (ApplicationDbContext db) =>
{
    var deals = await db.Deals
        .Include(d => d.Customer)
        .Include(d => d.CreatedBy)
        .OrderByDescending(d => d.CreatedAt)
        .ToListAsync();
    return Results.Ok(deals);
})
.WithName("GetDeals");

app.MapGet("/api/deals/{id}", async (int id, ApplicationDbContext db) =>
{
    var deal = await db.Deals
        .Include(d => d.Customer)
        .Include(d => d.CreatedBy)
        .FirstOrDefaultAsync(d => d.Id == id);

    return deal is not null ? Results.Ok(deal) : Results.NotFound();
})
.WithName("GetDeal");

app.MapPost("/api/deals", async ([FromBody] Deal deal, ApplicationDbContext db) =>
{
    deal.CreatedAt = DateTime.UtcNow;
    deal.UpdatedAt = DateTime.UtcNow;
    db.Deals.Add(deal);
    await db.SaveChangesAsync();
    return Results.Created($"/api/deals/{deal.Id}", deal);
})
.WithName("CreateDeal");

app.MapPut("/api/deals/{id}", async (int id, [FromBody] Deal inputDeal, ApplicationDbContext db) =>
{
    var deal = await db.Deals.FindAsync(id);
    if (deal is null) return Results.NotFound();

    deal.Title = inputDeal.Title;
    deal.Description = inputDeal.Description;
    deal.Value = inputDeal.Value;
    deal.Currency = inputDeal.Currency;
    deal.Status = inputDeal.Status;
    deal.Stage = inputDeal.Stage;
    deal.CloseDate = inputDeal.CloseDate;
    deal.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.Ok(deal);
})
.WithName("UpdateDeal");

// InteractionLog endpoints
app.MapGet("/api/interactions", async (ApplicationDbContext db, int? customerId, int? dealId) =>
{
    var query = db.InteractionLogs
        .Include(i => i.Customer)
        .Include(i => i.Deal)
        .Include(i => i.User)
        .Include(i => i.Tags)
        .AsQueryable();

    if (customerId.HasValue)
        query = query.Where(i => i.CustomerId == customerId.Value);

    if (dealId.HasValue)
        query = query.Where(i => i.DealId == dealId.Value);

    var interactions = await query
        .OrderByDescending(i => i.InteractionDate)
        .ToListAsync();

    return Results.Ok(interactions);
})
.WithName("GetInteractions");

app.MapGet("/api/interactions/{id}", async (int id, ApplicationDbContext db) =>
{
    var interaction = await db.InteractionLogs
        .Include(i => i.Customer)
        .Include(i => i.Deal)
        .Include(i => i.User)
        .Include(i => i.Tags)
        .Include(i => i.Attachments)
        .FirstOrDefaultAsync(i => i.Id == id);

    return interaction is not null ? Results.Ok(interaction) : Results.NotFound();
})
.WithName("GetInteraction");

app.MapPost("/api/interactions", async ([FromBody] InteractionLog interaction, ApplicationDbContext db) =>
{
    interaction.CreatedAt = DateTime.UtcNow;
    interaction.UpdatedAt = DateTime.UtcNow;
    db.InteractionLogs.Add(interaction);
    await db.SaveChangesAsync();
    return Results.Created($"/api/interactions/{interaction.Id}", interaction);
})
.WithName("CreateInteraction");

app.MapPut("/api/interactions/{id}", async (int id, [FromBody] InteractionLog inputInteraction, ApplicationDbContext db) =>
{
    var interaction = await db.InteractionLogs.FindAsync(id);
    if (interaction is null) return Results.NotFound();

    interaction.Type = inputInteraction.Type;
    interaction.Subject = inputInteraction.Subject;
    interaction.Notes = inputInteraction.Notes;
    interaction.InteractionDate = inputInteraction.InteractionDate;
    interaction.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    return Results.Ok(interaction);
})
.WithName("UpdateInteraction");

// Search endpoint
app.MapGet("/api/search", async (string query, ApplicationDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(query))
        return Results.Ok(new { customers = new List<Customer>(), deals = new List<Deal>(), interactions = new List<InteractionLog>() });

    var customers = await db.Customers
        .Where(c => c.Name.Contains(query) || (c.Industry != null && c.Industry.Contains(query)))
        .Take(10)
        .ToListAsync();

    var deals = await db.Deals
        .Include(d => d.Customer)
        .Where(d => d.Title.Contains(query) || (d.Description != null && d.Description.Contains(query)))
        .Take(10)
        .ToListAsync();

    var interactions = await db.InteractionLogs
        .Include(i => i.Customer)
        .Include(i => i.Deal)
        .Where(i => i.Subject.Contains(query) || i.Notes.Contains(query))
        .Take(10)
        .ToListAsync();

    return Results.Ok(new { customers, deals, interactions });
})
.WithName("Search");

// Tag endpoints
app.MapGet("/api/tags", async (ApplicationDbContext db) =>
{
    var tags = await db.Tags.OrderBy(t => t.Name).ToListAsync();
    return Results.Ok(tags);
})
.WithName("GetTags");

app.MapPost("/api/tags", async ([FromBody] Tag tag, ApplicationDbContext db) =>
{
    tag.CreatedAt = DateTime.UtcNow;
    db.Tags.Add(tag);
    await db.SaveChangesAsync();
    return Results.Created($"/api/tags/{tag.Id}", tag);
})
.WithName("CreateTag");

// CSV Export endpoint (for Manager role)
app.MapGet("/api/export/interactions", async (ApplicationDbContext db) =>
{
    var interactions = await db.InteractionLogs
        .Include(i => i.Customer)
        .Include(i => i.Deal)
        .Include(i => i.User)
        .OrderByDescending(i => i.InteractionDate)
        .ToListAsync();

    var csv = new StringBuilder();
    csv.AppendLine("Id,Date,Type,Subject,Customer,Deal,User");
    
    foreach (var interaction in interactions)
    {
        csv.AppendLine($"{interaction.Id},{interaction.InteractionDate:yyyy-MM-dd},{interaction.Type},{interaction.Subject},{interaction.Customer.Name},{interaction.Deal.Title},{interaction.User.Name}");
    }

    return Results.File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "interactions.csv");
})
.WithName("ExportInteractions");

// Dashboard stats endpoint
app.MapGet("/api/dashboard/stats", async (ApplicationDbContext db) =>
{
    var stats = new
    {
        totalCustomers = await db.Customers.CountAsync(),
        totalDeals = await db.Deals.CountAsync(),
        totalInteractions = await db.InteractionLogs.CountAsync(),
        recentInteractions = await db.InteractionLogs
            .Where(i => i.InteractionDate >= DateTime.UtcNow.AddDays(-7))
            .CountAsync()
    };

    return Results.Ok(stats);
})
.WithName("GetDashboardStats");

app.Run();
