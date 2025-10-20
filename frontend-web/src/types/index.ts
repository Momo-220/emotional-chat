export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative'
}

export interface Message {
  id: number;
  username: string;
  content: string;
  sentiment: Sentiment;
  confidence: number;
  timestamp: string;
}

export interface CreateMessage {
  username: string;
  content: string;
}

export interface SentimentAnalysisResult {
  label: Sentiment;
  score: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  createdAt: string;
  messageCount: number;
  lastMessageAt?: string;
  lastMessage?: string;
}

export interface CreateUser {
  username: string;
}


