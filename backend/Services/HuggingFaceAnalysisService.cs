using EmotionChat.API.Models;
using EmotionChat.API.Models.DTOs;
using System.Text.Json;

namespace EmotionChat.API.Services
{
    public class HuggingFaceAnalysisService : IAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HuggingFaceAnalysisService> _logger;
        private readonly IConfiguration _configuration;

        public HuggingFaceAnalysisService(
            HttpClient httpClient, 
            ILogger<HuggingFaceAnalysisService> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<SentimentAnalysisResult> AnalyzeSentimentAsync(string text)
        {
            try
            {
                var huggingFaceUrl = _configuration["HuggingFaceUrl"] ?? 
                    "http://localhost:8000/analyze";
                
                _logger.LogInformation("Tentative de connexion à l'IA locale: {Url}", huggingFaceUrl);
                
                var requestData = new { text = text };
                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.Timeout = TimeSpan.FromSeconds(5);

                var response = await _httpClient.PostAsync(huggingFaceUrl, content);
                
                _logger.LogInformation("Réponse de l'IA: {StatusCode}", response.StatusCode);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Échec de l'analyse sentiment: {StatusCode} - {Reason}", response.StatusCode, response.ReasonPhrase);
                    return new SentimentAnalysisResult 
                    { 
                        Label = Sentiment.Neutral, 
                        Score = 0.5 
                    };
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Contenu de la réponse IA: {Content}", responseContent);
                
                var result = JsonSerializer.Deserialize<LocalAIResult>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (result == null || string.IsNullOrEmpty(result.Label))
                {
                    _logger.LogWarning("Impossible de désérialiser la réponse de l'IA ou label vide");
                    return new SentimentAnalysisResult 
                    { 
                        Label = Sentiment.Neutral, 
                        Score = 0.5 
                    };
                }

                var sentiment = result.Label.ToLower() switch
                {
                    "positive" => Sentiment.Positive,
                    "negative" => Sentiment.Negative,
                    _ => Sentiment.Neutral
                };

                _logger.LogInformation("Sentiment détecté: {Sentiment} avec score {Score}", sentiment, result.Score);

                return new SentimentAnalysisResult
                {
                    Label = sentiment,
                    Score = result.Score
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'analyse sentiment pour le texte: {Text}", text);
                return new SentimentAnalysisResult 
                { 
                    Label = Sentiment.Neutral, 
                    Score = 0.5 
                };
            }
        }

        private class LocalAIResult
        {
            public string Label { get; set; } = string.Empty;
            public double Score { get; set; }
        }
    }
}


