using EmotionChat.API.Models;
using EmotionChat.API.Models.DTOs;

namespace EmotionChat.API.Services
{
    public interface IAnalysisService
    {
        Task<SentimentAnalysisResult> AnalyzeSentimentAsync(string text);
    }
}


