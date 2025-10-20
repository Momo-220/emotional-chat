from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import re
from typing import Dict, List, Tuple

app = FastAPI(
    title="Advanced Emotion Analysis Service",
    description="Advanced emotion analysis with multiple emotion categories",
    version="2.0.0",
)

class TextToAnalyze(BaseModel):
    text: str

class SentimentAnalysisResult(BaseModel):
    label: str
    score: float
    emotions: Dict[str, float] = None

# Enhanced emotion detection patterns
EMOTION_PATTERNS = {
    'JOY': {
        'keywords': ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'fantastic', 'great', 'love', 'adore', 'perfect', 'awesome', 'brilliant', 'excellent', 'superb', 'delighted', 'thrilled', 'ecstatic', 'blissful', 'cheerful', 'jubilant', 'good', 'nice', 'cool', 'sweet', 'fine', 'okay', 'alright', 'decent', 'pleasant', 'enjoyable', 'satisfying', 'pleasing', 'delightful'],
        'emojis': ['😊', '😄', '😁', '🤗', '🥰', '😍', '🤩', '😃', '😆', '🙂', '😌', '😇', '🥳', '🎉', '✨', '💖', '❤️', '💕', '💗', '💝'],
        'score': 0.8
    },
    'SADNESS': {
        'keywords': ['sad', 'depressed', 'melancholy', 'gloomy', 'unhappy', 'miserable', 'heartbroken', 'devastated', 'disappointed', 'down', 'blue', 'crying', 'tears', 'grief', 'sorrow', 'mournful', 'despair', 'hopeless', 'lonely', 'empty'],
        'emojis': ['😢', '😭', '😔', '😞', '😟', '😕', '🙁', '☹️', '😿', '💔', '🌧️', '☔', '💧', '💦', '😥', '😪', '😴', '😑', '😐', '😶'],
        'score': 0.9
    },
    'ANGER': {
        'keywords': ['angry', 'mad', 'furious', 'rage', 'outraged', 'irritated', 'annoyed', 'frustrated', 'hate', 'disgust', 'contempt', 'wrath', 'fury', 'indignation', 'resentment', 'bitter', 'hostile', 'aggressive', 'violent', 'enraged', 'bad', 'terrible', 'awful', 'horrible'],
        'emojis': ['😠', '😡', '🤬', '😤', '😾', '💢', '🔥', '⚡', '💥', '🌪️', '👿', '😈', '💀', '☠️', '🗯️', '💨', '💣', '🧨', '⚔️', '🗡️'],
        'score': 0.9
    },
    'FEAR': {
        'keywords': ['scared', 'afraid', 'terrified', 'frightened', 'anxious', 'worried', 'nervous', 'panic', 'alarm', 'dread', 'horror', 'shock', 'apprehension', 'unease', 'concern', 'distress', 'troubled', 'uneasy', 'restless', 'jittery'],
        'emojis': ['😨', '😰', '😱', '😳', '😲', '😵', '🤯', '😦', '😧', '😮', '😯', '🙀', '👻', '👹', '👺', '💀', '☠️', '🌚', '🌙', '🌑'],
        'score': 0.9
    },
    'SURPRISE': {
        'keywords': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'bewildered', 'confused', 'perplexed', 'puzzled', 'incredible', 'unbelievable', 'wow', 'omg', 'holy', 'damn', 'unexpected', 'sudden', 'abrupt', 'startling', 'jarring'],
        'emojis': ['😲', '😮', '😯', '😦', '😧', '😱', '🤯', '😵', '🙀', '😳', '😨', '😰', '🤭', '😏', '😬', '😅', '🤔', '🧐', '🤨', '😤'],
        'score': 0.8
    },
    'DISGUST': {
        'keywords': ['disgusted', 'revolted', 'repulsed', 'sick', 'nauseated', 'gross', 'yuck', 'ew', 'awful', 'terrible', 'horrible', 'vile', 'nasty', 'foul', 'repugnant', 'abhorrent', 'loathsome', 'detestable', 'odious', 'repellent'],
        'emojis': ['🤢', '🤮', '😷', '🤧', '🤒', '😵', '🤯', '😤', '😠', '😡', '🤬', '💀', '☠️', '👹', '👺', '😈', '👿', '💩', '🤡', '👻'],
        'score': 0.9
    },
    'NEUTRAL': {
        'keywords': ['ok', 'fine', 'alright', 'normal', 'regular', 'standard', 'average', 'typical', 'common', 'ordinary', 'usual', 'routine', 'boring', 'plain', 'simple', 'basic', 'neutral', 'indifferent', 'moderate', 'balanced'],
        'emojis': ['😐', '😑', '😶', '🙄', '😒', '😏', '🤷', '🤷‍♂️', '🤷‍♀️', '🙃', '😌', '😊', '🙂', '😐', '😑', '😶', '🤐', '😷', '🤒', '😴'],
        'score': 0.6
    }
}

def analyze_emotion_advanced(text: str) -> Tuple[str, float, Dict[str, float]]:
    """Advanced emotion analysis with multiple emotion detection"""
    text_lower = text.lower()
    
    # Count emotion indicators
    emotion_scores = {}
    
    for emotion, data in EMOTION_PATTERNS.items():
        score = 0.0
        
        # Check keywords
        for keyword in data['keywords']:
            if keyword in text_lower:
                score += data['score']
        
        # Check emojis
        for emoji in data['emojis']:
            if emoji in text:
                score += data['score'] * 0.8
        
        # Check for negation patterns
        negation_words = ['not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither', 'nor', 'don\'t', 'doesn\'t', 'didn\'t', 'won\'t', 'can\'t', 'couldn\'t', 'shouldn\'t', 'wouldn\'t']
        for negation in negation_words:
            if negation in text_lower:
                # Look for emotion words after negation
                for keyword in data['keywords']:
                    if f"{negation} {keyword}" in text_lower or f"{keyword} {negation}" in text_lower:
                        score -= data['score'] * 0.7
        
        # Check for intensity modifiers
        intensity_words = ['very', 'extremely', 'incredibly', 'totally', 'completely', 'absolutely', 'really', 'so', 'super', 'ultra', 'quite', 'pretty', 'rather', 'somewhat']
        for intensity in intensity_words:
            for keyword in data['keywords']:
                if f"{intensity} {keyword}" in text_lower or f"{keyword} {intensity}" in text_lower:
                    score += data['score'] * 0.4
        
        emotion_scores[emotion] = max(0.0, min(1.0, score))
    
    # Determine primary emotion
    if not any(score > 0 for score in emotion_scores.values()):
        primary_emotion = 'NEUTRAL'
        confidence = 0.5
    else:
        primary_emotion = max(emotion_scores, key=emotion_scores.get)
        confidence = emotion_scores[primary_emotion]
    
    # Enhanced sentiment mapping with more positive/negative detection
    sentiment_mapping = {
        'JOY': 'POSITIVE',
        'SADNESS': 'NEGATIVE',
        'ANGER': 'NEGATIVE',
        'FEAR': 'NEGATIVE',
        'SURPRISE': 'POSITIVE',  # Surprise is often positive
        'DISGUST': 'NEGATIVE',
        'NEUTRAL': 'NEUTRAL'
    }
    
    sentiment = sentiment_mapping.get(primary_emotion, 'NEUTRAL')
    
    # Additional checks for common positive/negative words
    if sentiment == 'NEUTRAL' and confidence < 0.6:
        # Check for additional positive indicators
        positive_indicators = ['yes', 'yeah', 'yep', 'sure', 'okay', 'alright', 'good', 'nice', 'cool', 'great', 'awesome', 'fantastic', 'amazing', 'wonderful', 'perfect', 'excellent', 'superb', 'brilliant', 'love', 'like', 'enjoy', 'appreciate', 'thank', 'thanks', 'please', 'welcome']
        negative_indicators = ['no', 'nope', 'nah', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'disgusting', 'sick', 'gross', 'yuck', 'ew', 'stupid', 'dumb', 'idiot', 'moron', 'annoying', 'irritating', 'frustrating', 'boring', 'tired', 'exhausted', 'stressed', 'worried', 'scared', 'afraid']
        
        text_words = text_lower.split()
        positive_count = sum(1 for word in positive_indicators if word in text_words)
        negative_count = sum(1 for word in negative_indicators if word in text_words)
        
        if positive_count > negative_count and positive_count > 0:
            sentiment = 'POSITIVE'
            confidence = 0.7
        elif negative_count > positive_count and negative_count > 0:
            sentiment = 'NEGATIVE'
            confidence = 0.7
    
    return sentiment, confidence, emotion_scores

@app.get("/health", summary="Health Check")
async def health_check():
    return {"status": "ok", "service": "advanced-emotion-analysis"}

@app.post("/analyze", response_model=SentimentAnalysisResult, summary="Analyze Text Emotion")
async def analyze_sentiment(data: TextToAnalyze):
    try:
        # Analyse instantanée - pas de délai artificiel
        sentiment, confidence, emotions = analyze_emotion_advanced(data.text)
        
        return SentimentAnalysisResult(
            label=sentiment,
            score=confidence,
            emotions=emotions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)