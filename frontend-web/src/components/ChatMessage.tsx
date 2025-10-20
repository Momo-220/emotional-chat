import React from 'react';
import { Message, Sentiment } from '../types';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  currentUsername: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, currentUsername }) => {
  const getSentimentColor = (sentiment: Sentiment): string => {
    switch (sentiment) {
      case Sentiment.Positive:
        return 'text-green-600';
      case Sentiment.Neutral:
        return 'text-gray-600';
      case Sentiment.Negative:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentBg = (sentiment: Sentiment): string => {
    switch (sentiment) {
      case Sentiment.Positive:
        return 'bg-green-50 border-green-200';
      case Sentiment.Neutral:
        return 'bg-gray-50 border-gray-200';
      case Sentiment.Negative:
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSentimentEmoji = (sentiment: Sentiment): string => {
    switch (sentiment) {
      case Sentiment.Positive:
        return '😊';
      case Sentiment.Neutral:
        return '😐';
      case Sentiment.Negative:
        return '😔';
      default:
        return '😐';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'ml-12' : 'mr-12'}`}>
        {/* Header avec nom complet et timestamp */}
        <div className={`flex items-center space-x-2 mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs font-semibold text-gray-600">
            {message.username}
          </span>
          <span className="text-xs text-gray-400">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        
        {/* Bulle de message circulaire moderne */}
        <div className={`relative ${isOwnMessage ? 'flex justify-end' : 'flex justify-start'}`}>
          <div className={`px-6 py-4 rounded-3xl shadow-lg max-w-full ${
            isOwnMessage 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' 
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
          }`}>
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          </div>
          
          {/* Flèche de la bulle */}
          <div className={`absolute top-0 w-0 h-0 ${
            isOwnMessage 
              ? 'right-0 transform translate-x-1 border-l-8 border-l-blue-600 border-t-8 border-t-transparent border-b-8 border-b-transparent'
              : 'left-0 transform -translate-x-1 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent'
          }`}></div>
        </div>
        
        {/* Affichage du sentiment moderne */}
        <div className={`mt-3 ${isOwnMessage ? 'flex justify-end' : 'flex justify-start'}`}>
          <div className={`flex items-center space-x-2 rounded-full px-3 py-1 shadow-sm border ${getSentimentBg(message.sentiment)}`}>
            <div className={`w-2 h-2 rounded-full ${
              message.sentiment === Sentiment.Positive 
                ? 'bg-green-400' 
                : message.sentiment === Sentiment.Negative
                ? 'bg-red-400'
                : 'bg-gray-400'
            }`}></div>
            <span className="text-sm">
              {getSentimentEmoji(message.sentiment)}
            </span>
            <span className={`text-xs font-medium ${getSentimentColor(message.sentiment)}`}>
              {message.sentiment === Sentiment.Positive && 'Positive'}
              {message.sentiment === Sentiment.Neutral && 'Neutral'}
              {message.sentiment === Sentiment.Negative && 'Negative'}
            </span>
            <span className="text-xs text-gray-500">
              {Math.round(message.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;