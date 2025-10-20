using EmotionChat.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmotionChat.API.Data
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration des relations
            modelBuilder.Entity<Message>()
                .HasOne(m => m.User)
                .WithMany(u => u.Messages)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuration des index
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Message>()
                .HasIndex(m => m.Timestamp);

            // Configuration des types
            modelBuilder.Entity<Message>()
                .Property(m => m.Sentiment)
                .HasConversion<string>();
        }
    }
}


