import axios, { AxiosResponse } from 'axios';
import { Message, CreateMessage, SentimentAnalysisResult, User, CreateUser } from '../types';

const API_BASE_URL = 'https://your-api.onrender.com'; // Remplacer par votre URL de déploiement

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const messageApi = {
  // Récupérer tous les messages
  getMessages: async (): Promise<Message[]> => {
    const response: AxiosResponse<Message[]> = await api.get('/api/messages');
    return response.data;
  },

  // Récupérer les messages d'un utilisateur
  getUserMessages: async (userId: number): Promise<Message[]> => {
    const response: AxiosResponse<Message[]> = await api.get(`/api/messages/${userId}`);
    return response.data;
  },

  // Créer un nouveau message
  createMessage: async (message: CreateMessage): Promise<Message> => {
    const response: AxiosResponse<Message> = await api.post('/api/messages', message);
    return response.data;
  },
};

export const analysisApi = {
  // Analyser le sentiment d'un texte
  analyzeText: async (text: string): Promise<SentimentAnalysisResult> => {
    const response: AxiosResponse<SentimentAnalysisResult> = await api.post('/api/analysis', { text });
    return response.data;
  },
};

export const healthApi = {
  // Vérifier le statut de l'API
  checkHealth: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export const userApi = {
  // Récupérer tous les utilisateurs
  getUsers: async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await api.get('/api/users');
    return response.data;
  },

  // Créer un nouvel utilisateur
  createUser: async (user: CreateUser): Promise<User> => {
    const response: AxiosResponse<User> = await api.post('/api/users', user);
    return response.data;
  },
};

export default api;


