using System.ComponentModel.DataAnnotations;
using EmotionChat.API.Models;

namespace EmotionChat.API.Models.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Sentiment Sentiment { get; set; }
        public double Confidence { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class CreateMessageDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; } = string.Empty;
    }

    public class AnalyzeTextDto
    {
        [Required]
        public string Text { get; set; } = string.Empty;
    }

    public class SentimentAnalysisResult
    {
        public Sentiment Label { get; set; }
        public double Score { get; set; }
    }
}
