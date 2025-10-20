import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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
        return '#10b981';
      case Sentiment.Neutral:
        return '#f59e0b';
      case Sentiment.Negative:
        return '#ef4444';
      default:
        return '#f59e0b';
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
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sentimentColor = getSentimentColor(message.sentiment);
  const sentimentEmoji = getSentimentEmoji(message.sentiment);

  return (
    <View style={[
      styles.messageContainer,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: isOwnMessage ? '#667eea' : '#f3f4f6',
          borderLeftColor: sentimentColor,
        }
      ]}>
        {/* Header avec nom d'utilisateur et timestamp */}
        <View style={styles.messageHeader}>
          <Text style={[
            styles.username,
            { color: isOwnMessage ? 'rgba(255,255,255,0.8)' : '#6b7280' }
          ]}>
            {message.username}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: isOwnMessage ? 'rgba(255,255,255,0.6)' : '#9ca3af' }
          ]}>
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>

        {/* Contenu du message */}
        <Text style={[
          styles.messageContent,
          { color: isOwnMessage ? 'white' : '#374151' }
        ]}>
          {message.content}
        </Text>

        {/* Footer avec sentiment et confiance */}
        <View style={styles.messageFooter}>
          <View style={[
            styles.sentimentIndicator,
            { backgroundColor: `${sentimentColor}20` }
          ]}>
            <Text style={styles.sentimentEmoji}>{sentimentEmoji}</Text>
            <Text style={[
              styles.sentimentText,
              { color: sentimentColor }
            ]}>
              {message.sentiment === Sentiment.Positive && 'Positif'}
              {message.sentiment === Sentiment.Neutral && 'Neutre'}
              {message.sentiment === Sentiment.Negative && 'Négatif'}
            </Text>
          </View>
          
          <Text style={[
            styles.confidence,
            { color: isOwnMessage ? 'rgba(255,255,255,0.6)' : '#9ca3af' }
          ]}>
            {(message.confidence * 100).toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 10,
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentimentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '600',
  },
  confidence: {
    fontSize: 10,
  },
});

export default ChatMessage;


