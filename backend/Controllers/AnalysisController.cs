using EmotionChat.API.Models.DTOs;
using EmotionChat.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmotionChat.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalysisController : ControllerBase
    {
        private readonly IAnalysisService _analysisService;
        private readonly ILogger<AnalysisController> _logger;

        public AnalysisController(IAnalysisService analysisService, ILogger<AnalysisController> logger)
        {
            _analysisService = analysisService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<SentimentAnalysisResult>> AnalyzeText(AnalyzeTextDto analyzeTextDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(analyzeTextDto.Text))
                {
                    return BadRequest("Le texte à analyser ne peut pas être vide");
                }

                var result = await _analysisService.AnalyzeSentimentAsync(analyzeTextDto.Text);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'analyse du texte: {Text}", analyzeTextDto.Text);
                return StatusCode(500, "Erreur interne du serveur");
            }
        }
    }
}


