import React, { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import UsernameModal from './components/UsernameModal';
import { useMessages } from './hooks/useMessages';
import { useUsers } from './hooks/useUsers';
import { Message, CreateMessage } from './types';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Main Chat Application Component
function ChatAppContent() {
  const [username, setUsername] = useState<string>('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the hooks
  const { messages, isLoading, isSending, sendMessage } = useMessages();
  const { users, createUser } = useUsers();

  // Always show username modal on startup (no local storage)
  useEffect(() => {
    setShowUsernameModal(true);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (message: CreateMessage) => {
    if (!username || !message.content.trim()) return;
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
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

  const handleUsernameChange = () => {
    setShowUsernameModal(true);
  };

  const handleAddNewUser = () => {
    setShowUsernameModal(true);
  };

  // Extraire les noms d'utilisateurs pour la compatibilité avec le composant Sidebar
  const userNames = React.useMemo(() => {
    return users.map(user => user.username);
  }, [users]);

  // Filtrer les messages selon l'utilisateur sélectionné
  const filteredMessages = React.useMemo(() => {
    if (!selectedUser || !messages) return messages || [];
    return messages.filter(msg => msg.username === selectedUser);
  }, [messages, selectedUser]);

  const handleUserSelect = (selectedUsername: string) => {
    // Si l'utilisateur sélectionné est différent de l'utilisateur actuel
    if (selectedUsername !== username) {
      // Demander confirmation avant de changer d'utilisateur
      const confirmChange = window.confirm(
        `Do you want to become user "${selectedUsername}"?\n\nThis will change your identity in the chat.`
      );
      
      if (confirmChange) {
        // Changer l'utilisateur actif
        setUsername(selectedUsername);
        setSelectedUser(null); // Retourner à la vue générale
      }
    } else {
      // Si c'est le même utilisateur, juste filtrer ses messages
      setSelectedUser(selectedUsername);
    }
  };

  const handleBackToAllMessages = () => {
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Barre latérale */}
      <Sidebar
        users={users}
        currentUser={username}
        onUserSelect={handleUserSelect}
        selectedUser={selectedUser}
        messages={messages || []}
      />

      {/* Zone principale de chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader
          username={username}
          messageCount={filteredMessages?.length || 0}
          onUsernameChange={handleUsernameChange}
          onAddNewUser={handleAddNewUser}
          selectedUser={selectedUser}
          onBackToAll={handleBackToAllMessages}
        />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading messages...</p>
              </div>
            ) : filteredMessages?.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">💬</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  {selectedUser ? `Chat with ${selectedUser}` : 'Welcome to Emotion Chat!'}
                </h3>
                <p className="text-gray-500 text-lg">
                  {selectedUser 
                    ? `No messages from ${selectedUser} yet` 
                    : 'Start a conversation and see how AI analyzes emotions in real-time'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredMessages?.map((message: Message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isOwnMessage={message.username === username}
                    currentUsername={username}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          username={username}
          isLoading={isSending}
        />
      </div>

      {/* Username Modal */}
      <UsernameModal
        isOpen={showUsernameModal || !username}
        onClose={() => setShowUsernameModal(false)}
        onUsernameSet={handleUsernameSet}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatAppContent />
    </QueryClientProvider>
  );
}

export default App;