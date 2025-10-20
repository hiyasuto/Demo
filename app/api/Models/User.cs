using System.ComponentModel.DataAnnotations;

namespace AzureSalesLog.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Role { get; set; } = "User";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    public ICollection<Deal> Deals { get; set; } = new List<Deal>();
    public ICollection<InteractionLog> InteractionLogs { get; set; } = new List<InteractionLog>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}
