using Microsoft.AspNetCore.Mvc;

namespace EmotionChat.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult GetHealth()
        {
            return Ok(new 
            { 
                Status = "Healthy", 
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Service = "Emotion Chat API"
            });
        }
    }
}


