namespace EmotionChat.API.Models.DTOs
{
    public class MessageResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Sentiment { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
