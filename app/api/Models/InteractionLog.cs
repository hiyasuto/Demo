using System.ComponentModel.DataAnnotations;

namespace AzureSalesLog.Models;

public class InteractionLog
{
    public int Id { get; set; }

    [Required]
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    [Required]
    public int DealId { get; set; }
    public Deal Deal { get; set; } = null!;

    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Notes { get; set; } = string.Empty;

    [Required]
    public DateTime InteractionDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
