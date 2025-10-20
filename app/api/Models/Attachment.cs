using System.ComponentModel.DataAnnotations;

namespace AzureSalesLog.Models;

public class Attachment
{
    public int Id { get; set; }

    [Required]
    public int InteractionLogId { get; set; }
    public InteractionLog InteractionLog { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string BlobUri { get; set; } = string.Empty;

    public long? FileSize { get; set; }

    [MaxLength(100)]
    public string? ContentType { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public int? UploadedByUserId { get; set; }
    public User? UploadedBy { get; set; }
}
