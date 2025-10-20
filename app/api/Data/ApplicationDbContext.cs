using Microsoft.EntityFrameworkCore;
using AzureSalesLog.Models;

namespace AzureSalesLog.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Deal> Deals { get; set; }
    public DbSet<InteractionLog> InteractionLogs { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // Customer
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.CreatedBy)
                .WithMany(u => u.Customers)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Contact
        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Contacts)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Deal
        modelBuilder.Entity<Deal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CustomerId, e.Status });
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Deals)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CreatedBy)
                .WithMany(u => u.Deals)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // InteractionLog
        modelBuilder.Entity<InteractionLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CustomerId, e.DealId, e.InteractionDate });
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Customer)
                .WithMany(c => c.InteractionLogs)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.Deal)
                .WithMany(d => d.InteractionLogs)
                .HasForeignKey(e => e.DealId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.User)
                .WithMany(u => u.InteractionLogs)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Many-to-many with Tags
            entity.HasMany(e => e.Tags)
                .WithMany(t => t.InteractionLogs)
                .UsingEntity<Dictionary<string, object>>(
                    "InteractionLogTags",
                    j => j.HasOne<Tag>().WithMany().HasForeignKey("TagId"),
                    j => j.HasOne<InteractionLog>().WithMany().HasForeignKey("InteractionLogId"));
        });

        // Attachment
        modelBuilder.Entity<Attachment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UploadedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.InteractionLog)
                .WithMany(i => i.Attachments)
                .HasForeignKey(e => e.InteractionLogId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.UploadedBy)
                .WithMany(u => u.Attachments)
                .HasForeignKey(e => e.UploadedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Tag
        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // AuditLog
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.Timestamp });
            entity.Property(e => e.Timestamp).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
