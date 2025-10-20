using EmotionChat.API.Data;
using EmotionChat.API.Models;
using EmotionChat.API.Models.DTOs;
using EmotionChat.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmotionChat.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly IAnalysisService _analysisService;
        private readonly ILogger<MessagesController> _logger;

        public MessagesController(
            ChatDbContext context, 
            IAnalysisService analysisService,
            ILogger<MessagesController> logger)
        {
            _context = context;
            _analysisService = analysisService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetMessages()
        {
            try
            {
                var messages = await _context.Messages
                    .Include(m => m.User)
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new MessageResponseDto
                    {
                        Id = m.Id,
                        Username = m.User.Username,
                        Content = m.Content,
                        Sentiment = m.Sentiment.ToString(),
                        Confidence = m.Confidence,
                        Timestamp = m.Timestamp
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des messages");
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetUserMessages(int userId)
        {
            try
            {
                var messages = await _context.Messages
                    .Include(m => m.User)
                    .Where(m => m.UserId == userId)
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new MessageResponseDto
                    {
                        Id = m.Id,
                        Username = m.User.Username,
                        Content = m.Content,
                        Sentiment = m.Sentiment.ToString(),
                        Confidence = m.Confidence,
                        Timestamp = m.Timestamp
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des messages de l'utilisateur {UserId}", userId);
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            try
            {
                // Trouver ou créer l'utilisateur
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == createMessageDto.Username);

                if (user == null)
                {
                    user = new User
                    {
                        Username = createMessageDto.Username,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                // Analyser le sentiment du message
                var sentimentResult = await _analysisService.AnalyzeSentimentAsync(createMessageDto.Content);

                // Créer le message
                var message = new Message
                {
                    UserId = user.Id,
                    Content = createMessageDto.Content,
                    Sentiment = sentimentResult.Label,
                    Confidence = sentimentResult.Score,
                    Timestamp = DateTime.UtcNow
                };

                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                // Retourner le message avec les détails de l'utilisateur
                var messageDto = new MessageResponseDto
                {
                    Id = message.Id,
                    Username = user.Username,
                    Content = message.Content,
                    Sentiment = message.Sentiment.ToString(),
                    Confidence = message.Confidence,
                    Timestamp = message.Timestamp
                };

                return CreatedAtAction(nameof(GetMessages), new { id = message.Id }, messageDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la création du message");
                return StatusCode(500, "Erreur interne du serveur");
            }
        }
    }
}


