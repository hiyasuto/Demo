using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AzureSalesLog.Models;

public class Deal
{
    public int Id { get; set; }

    [Required]
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Value { get; set; }

    [MaxLength(10)]
    public string Currency { get; set; } = "USD";

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active";

    [MaxLength(50)]
    public string? Stage { get; set; }

    public DateTime? CloseDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int? CreatedByUserId { get; set; }
    public User? CreatedBy { get; set; }

    // Navigation properties
    public ICollection<InteractionLog> InteractionLogs { get; set; } = new List<InteractionLog>();
}
