using EmotionChat.API.Models;
using EmotionChat.API.Models.DTOs;

namespace EmotionChat.API.Services
{
    public class SimpleAnalysisService : IAnalysisService
    {
        private readonly ILogger<SimpleAnalysisService> _logger;

        public SimpleAnalysisService(ILogger<SimpleAnalysisService> logger)
        {
            _logger = logger;
        }

        public async Task<SentimentAnalysisResult> AnalyzeSentimentAsync(string text)
        {
            try
            {
                _logger.LogInformation("Analyse du sentiment pour: {Text}", text);
                
                // Analyse instantanée - pas de délai pour une réponse immédiate
                // await Task.Delay(50); // Supprimé pour une analyse instantanée
                
                // Analyse simple mais efficace basée sur des mots-clés
                var textLower = text.ToLower();
                
                // Mots positifs - Version étendue et plus intelligente
                var positiveWords = new[] { 
                    // Émotions positives fortes
                    "love", "adore", "passion", "bliss", "ecstatic", "thrilled", "elated", "euphoric",
                    "like", "enjoy", "appreciate", "cherish", "treasure", "value", "favor", "prefer",
                    
                    // Qualités positives
                    "good", "great", "amazing", "awesome", "fantastic", "wonderful", "excellent", "perfect",
                    "brilliant", "superb", "outstanding", "marvelous", "incredible", "magnificent", "spectacular",
                    "phenomenal", "extraordinary", "remarkable", "impressive", "stunning", "gorgeous", "beautiful",
                    
                    // Bien-être et satisfaction
                    "happy", "joy", "delighted", "pleased", "satisfied", "content", "cheerful", "merry",
                    "glad", "pleased", "grateful", "thankful", "blessed", "fortunate", "lucky",
                    
                    // Approbation et accord
                    "yes", "yeah", "yep", "sure", "okay", "alright", "fine", "good", "well",
                    "agree", "support", "approve", "endorse", "recommend", "suggest",
                    
                    // Expressions informelles positives
                    "nice", "cool", "sweet", "lovely", "cute", "charming", "pleasant", "delightful",
                    "wow", "awesome", "rad", "dope", "sick", "fire", "lit", "epic", "legendary",
                    
                    // Progrès et amélioration
                    "better", "improved", "enhanced", "upgraded", "progress", "success", "victory", "triumph",
                    "achievement", "accomplishment", "breakthrough", "milestone", "advancement"
                };
                
                // Mots négatifs - Version étendue et plus intelligente
                var negativeWords = new[] { 
                    // Émotions négatives fortes
                    "hate", "loathe", "despise", "detest", "abhor", "disgust", "repulse", "revolt",
                    "dislike", "disdain", "scorn", "contempt", "aversion", "antipathy", "hostility",
                    
                    // Qualités négatives
                    "bad", "terrible", "awful", "horrible", "disgusting", "vile", "nasty", "foul",
                    "worse", "worst", "pathetic", "pathetic", "useless", "worthless", "pointless",
                    "stupid", "dumb", "idiot", "moron", "foolish", "silly", "ridiculous", "absurd",
                    
                    // Colère et frustration
                    "angry", "mad", "furious", "rage", "outrage", "indignation", "resentment", "bitterness",
                    "annoyed", "irritated", "aggravated", "exasperated", "frustrated", "bothered", "troubled",
                    
                    // Tristesse et déception
                    "sad", "depressed", "melancholy", "gloomy", "miserable", "heartbroken", "devastated",
                    "disappointed", "let down", "discouraged", "disheartened", "crushed", "defeated",
                    
                    // Peur et anxiété
                    "worried", "concerned", "anxious", "nervous", "scared", "afraid", "terrified", "frightened",
                    "panic", "alarm", "dread", "horror", "shock", "apprehension", "unease", "distress",
                    
                    // Rejet et refus
                    "no", "nope", "never", "reject", "refuse", "deny", "oppose", "resist", "object",
                    "disagree", "disapprove", "condemn", "criticize", "blame", "fault", "accuse",
                    
                    // Fatigue et stress
                    "tired", "exhausted", "drained", "weary", "fatigued", "burned out", "stressed",
                    "overwhelmed", "pressured", "strained", "tense", "uptight", "on edge",
                    
                    // Ennui et monotonie
                    "boring", "tedious", "dull", "monotonous", "repetitive", "uninteresting", "lame",
                    "sick", "gross", "yuck", "ew", "nasty", "disgusting", "revolting", "repulsive"
                };
                
                // Calculer les scores avec pondération intelligente
                var positiveScore = 0.0;
                var negativeScore = 0.0;
                
                // Analyser chaque mot avec pondération
                foreach (var word in positiveWords)
                {
                    if (textLower.Contains(word))
                    {
                        // Pondération selon l'importance du mot
                        var weight = word switch
                        {
                            "love" or "adore" or "passion" or "bliss" or "ecstatic" => 3.0,
                            "hate" or "loathe" or "despise" or "detest" => -3.0, // Ces mots sont dans les positifs par erreur
                            "great" or "amazing" or "awesome" or "fantastic" => 2.5,
                            "good" or "nice" or "well" or "fine" => 2.0,
                            "okay" or "alright" or "sure" => 1.5,
                            _ => 1.0
                        };
                        positiveScore += weight;
                    }
                }
                
                foreach (var word in negativeWords)
                {
                    if (textLower.Contains(word))
                    {
                        // Pondération selon l'importance du mot
                        var weight = word switch
                        {
                            "hate" or "loathe" or "despise" or "detest" => 3.0,
                            "terrible" or "awful" or "horrible" or "disgusting" => 2.5,
                            "bad" or "worse" or "worst" => 2.0,
                            "sad" or "angry" or "mad" or "upset" => 2.0,
                            "no" or "never" or "nope" => 1.5,
                            _ => 1.0
                        };
                        negativeScore += weight;
                    }
                }
                
                // Détecter les négations complexes
                var negationWords = new[] { "not", "don't", "doesn't", "didn't", "won't", "can't", "couldn't", "shouldn't", "wouldn't", "never", "no", "none", "nothing", "nobody", "nowhere" };
                var hasNegation = negationWords.Any(neg => textLower.Contains(neg));
                
                if (hasNegation)
                {
                    // Inverser les scores si négation détectée
                    var temp = positiveScore;
                    positiveScore = negativeScore;
                    negativeScore = temp;
                    
                    // Bonus pour les négations fortes
                    if (textLower.Contains("never") || textLower.Contains("not at all"))
                    {
                        negativeScore *= 1.3;
                    }
                }
                
                // Détecter les intensificateurs avec pondération
                var intensityWords = new Dictionary<string, double>
                {
                    { "extremely", 2.0 },
                    { "incredibly", 2.0 },
                    { "absolutely", 1.8 },
                    { "totally", 1.8 },
                    { "completely", 1.8 },
                    { "really", 1.5 },
                    { "very", 1.4 },
                    { "so", 1.3 },
                    { "super", 1.3 },
                    { "ultra", 1.3 },
                    { "quite", 1.2 },
                    { "pretty", 1.2 },
                    { "rather", 1.2 },
                    { "somewhat", 1.1 }
                };
                
                foreach (var intensity in intensityWords)
                {
                    if (textLower.Contains(intensity.Key))
                    {
                        positiveScore *= intensity.Value;
                        negativeScore *= intensity.Value;
                        break; // Prendre seulement le premier intensificateur trouvé
                    }
                }
                
                // Détecter les comparaisons
                if (textLower.Contains("better than") || textLower.Contains("better"))
                {
                    positiveScore += 1.5;
                }
                
                if (textLower.Contains("worse than") || textLower.Contains("worse"))
                {
                    negativeScore += 1.5;
                }
                
                // Détecter les questions (souvent neutres)
                var isQuestion = textLower.EndsWith("?") || textLower.Contains("what") || textLower.Contains("how") || 
                               textLower.Contains("why") || textLower.Contains("when") || textLower.Contains("where");
                
                if (isQuestion && positiveScore < 2 && negativeScore < 2)
                {
                    positiveScore *= 0.5;
                    negativeScore *= 0.5;
                }
                
                // Déterminer le sentiment final avec logique avancée
                Sentiment sentiment;
                double confidence;
                
                // Logique de décision améliorée
                var scoreDifference = Math.Abs(positiveScore - negativeScore);
                var totalScore = positiveScore + negativeScore;
                
                if (totalScore == 0)
                {
                    // Aucun mot émotionnel détecté
                    sentiment = Sentiment.Neutral;
                    confidence = 0.5;
                }
                else if (positiveScore > negativeScore)
                {
                    sentiment = Sentiment.Positive;
                    
                    // Calcul de confiance basé sur la différence et l'intensité
                    var baseConfidence = 0.6;
                    var intensityBonus = Math.Min(0.3, totalScore * 0.05);
                    var differenceBonus = Math.Min(0.2, scoreDifference * 0.1);
                    
                    confidence = Math.Min(0.95, baseConfidence + intensityBonus + differenceBonus);
                }
                else if (negativeScore > positiveScore)
                {
                    sentiment = Sentiment.Negative;
                    
                    // Calcul de confiance basé sur la différence et l'intensité
                    var baseConfidence = 0.6;
                    var intensityBonus = Math.Min(0.3, totalScore * 0.05);
                    var differenceBonus = Math.Min(0.2, scoreDifference * 0.1);
                    
                    confidence = Math.Min(0.95, baseConfidence + intensityBonus + differenceBonus);
                }
                else
                {
                    // Scores égaux ou très proches
                    sentiment = Sentiment.Neutral;
                    confidence = 0.5 + Math.Min(0.3, totalScore * 0.02);
                }
                
                // Cas spéciaux pour une meilleure détection
                if (textLower.Contains("well") && !textLower.Contains("not well") && !textLower.Contains("not very well"))
                {
                    sentiment = Sentiment.Positive;
                    confidence = 0.7;
                }
                
                if (textLower.Contains("worse") || textLower.Contains("worst"))
                {
                    sentiment = Sentiment.Negative;
                    confidence = Math.Max(confidence, 0.8);
                }
                
                _logger.LogInformation("Sentiment détecté: {Sentiment} avec score {Score}", sentiment, confidence);
                
                return new SentimentAnalysisResult
                {
                    Label = sentiment,
                    Score = confidence
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
    }
}
