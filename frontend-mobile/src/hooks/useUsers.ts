import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userApi } from '../services/api';
import { User, CreateUser } from '../types';

export const useUsers = () => {
  const queryClient = useQueryClient();
  
  // Récupérer tous les utilisateurs
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery<User[], Error>(
    'users',
    userApi.getUsers,
    {
      refetchInterval: 5000, // Actualiser toutes les 5 secondes sur mobile
      staleTime: 3000,
    }
  );

  // Mutation pour créer un utilisateur
  const createUserMutation = useMutation(
    (user: CreateUser) => userApi.createUser(user),
    {
      onSuccess: () => {
        // Invalider et refetch les utilisateurs après création
        queryClient.invalidateQueries('users');
      },
      onError: (error) => {
        console.error('Error creating user:', error);
      },
    }
  );

  const createUser = async (user: CreateUser) => {
    try {
      await createUserMutation.mutateAsync(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  return {
    users,
    isLoading,
    error,
    createUser,
    isCreating: createUserMutation.isLoading,
    refetch
  };
};
