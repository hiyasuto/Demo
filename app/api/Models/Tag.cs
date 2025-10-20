using System.ComponentModel.DataAnnotations;

namespace AzureSalesLog.Models;

public class Tag
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<InteractionLog> InteractionLogs { get; set; } = new List<InteractionLog>();
}
