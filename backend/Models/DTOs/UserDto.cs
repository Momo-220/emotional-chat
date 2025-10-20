using System.ComponentModel.DataAnnotations;

namespace EmotionChat.API.Models.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int MessageCount { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public string? LastMessage { get; set; }
    }

    public class CreateUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Username { get; set; } = string.Empty;
    }
}
