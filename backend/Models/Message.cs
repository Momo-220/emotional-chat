using System.ComponentModel.DataAnnotations;

namespace EmotionChat.API.Models
{
    public enum Sentiment
    {
        Positive,
        Neutral,
        Negative
    }

    public class Message
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;
        
        public Sentiment Sentiment { get; set; } = Sentiment.Neutral;
        
        [Range(0.0, 1.0)]
        public double Confidence { get; set; } = 0.0;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}


