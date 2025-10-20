using EmotionChat.API.Data;
using EmotionChat.API.Models;
using EmotionChat.API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmotionChat.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ChatDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ChatDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.Messages)
                    .OrderBy(u => u.Username)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Username = u.Username,
                        CreatedAt = u.CreatedAt,
                        MessageCount = u.Messages.Count,
                        LastMessageAt = u.Messages.Any() 
                            ? u.Messages.OrderByDescending(m => m.Timestamp).First().Timestamp 
                            : (DateTime?)null,
                        LastMessage = u.Messages.Any() 
                            ? u.Messages.OrderByDescending(m => m.Timestamp).First().Content 
                            : null
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des utilisateurs");
                return StatusCode(500, "Erreur interne du serveur");
            }
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
        {
            try
            {
                // Vérifier si l'utilisateur existe déjà
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == createUserDto.Username);

                if (existingUser != null)
                {
                    return Ok(new UserDto
                    {
                        Id = existingUser.Id,
                        Username = existingUser.Username,
                        CreatedAt = existingUser.CreatedAt,
                        MessageCount = 0,
                        LastMessageAt = null,
                        LastMessage = null
                    });
                }

                // Créer un nouvel utilisateur
                var user = new User
                {
                    Username = createUserDto.Username,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    CreatedAt = user.CreatedAt,
                    MessageCount = 0,
                    LastMessageAt = null,
                    LastMessage = null
                };

                return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la création de l'utilisateur");
                return StatusCode(500, "Erreur interne du serveur");
            }
        }
    }
}
