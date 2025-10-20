import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { messageApi } from '../services/api';
import { Message, CreateMessage } from '../types';

export const useMessages = () => {
  const queryClient = useQueryClient();
  
  // Récupérer les messages
  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useQuery<Message[], Error>(
    'messages',
    messageApi.getMessages,
    {
      refetchInterval: 3000, // Actualiser toutes les 3 secondes sur mobile
      staleTime: 2000,
    }
  );

  // Mutation pour créer un message
  const createMessageMutation = useMutation(
    (message: CreateMessage) => messageApi.createMessage(message),
    {
      onSuccess: () => {
        // Invalider et refetch les messages après création
        queryClient.invalidateQueries('messages');
      },
      onError: (error) => {
        console.error('Erreur lors de la création du message:', error);
      },
    }
  );

  const sendMessage = async (message: CreateMessage) => {
    try {
      await createMessageMutation.mutateAsync(message);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isSending: createMessageMutation.isLoading,
    refetch
  };
};


