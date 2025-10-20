import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import UsernameModal from '../components/UsernameModal';
import { useMessages } from '../hooks/useMessages';
import { useUsers } from '../hooks/useUsers';
import { Message, CreateMessage } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Configuration de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const ChatScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const { messages, isLoading, sendMessage, isSending, refetch } = useMessages();
  const { users, createUser } = useUsers();

  // Charger le nom d'utilisateur au démarrage
  useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('emotion-chat-username');
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        setShowUsernameModal(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du nom d\'utilisateur:', error);
      setShowUsernameModal(true);
    }
  };

  const handleSendMessage = async (message: CreateMessage) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const handleUsernameSet = async (newUsername: string) => {
    try {
      // Créer l'utilisateur dans le backend
      await createUser({ username: newUsername });
      setUsername(newUsername);
      setShowUsernameModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
      // Even if there's an error, continue with the username
      setUsername(newUsername);
      setShowUsernameModal(false);
    }
  };

  // Fonction pour changer d'utilisateur actif (pour mobile)
  const handleUserSwitch = (selectedUsername: string) => {
    if (selectedUsername !== username) {
      Alert.alert(
        "Switch User",
        `Do you want to become user "${selectedUsername}"?\n\nThis will change your identity in the chat.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Confirm", 
            onPress: () => {
              setUsername(selectedUsername);
              // Save the new username
              AsyncStorage.setItem('username', selectedUsername);
            }
          }
        ]
      );
    }
  };

  const handleUsernameChange = () => {
    setShowUsernameModal(true);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatMessage
      message={item}
      isOwnMessage={item.username === username}
      currentUsername={username}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>💬</Text>
      <Text style={styles.emptyTitle}>Aucun message pour le moment</Text>
      <Text style={styles.emptySubtitle}>
        Soyez le premier à envoyer un message !
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {username ? username.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.appTitle}>Emotion Chat</Text>
            <Text style={styles.userName}>{username || 'Non connecté'}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleUsernameChange}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sentimentLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Positif</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Neutre</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.legendText}>Négatif</Text>
        </View>
      </View>
    </View>
  );

  if (!username) {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
          
          <UsernameModal
            visible={showUsernameModal}
            onClose={() => setShowUsernameModal(false)}
            onUsernameSet={handleUsernameSet}
          />
        </SafeAreaView>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.messagesContainer,
            messages.length === 0 && styles.emptyContainer
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={['#667eea']}
            />
          }
          onContentSizeChange={scrollToBottom}
        />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          username={username}
          isLoading={isSending}
        />
        
        <UsernameModal
          visible={showUsernameModal}
          onClose={() => setShowUsernameModal(false)}
          onUsernameSet={handleUsernameSet}
        />
      </SafeAreaView>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userName: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  sentimentLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  messagesContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default ChatScreen;


