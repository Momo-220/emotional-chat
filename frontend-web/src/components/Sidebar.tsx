import React from 'react';
import { Message, User } from '../types';

interface SidebarProps {
  users: User[];
  currentUser: string;
  onUserSelect: (username: string) => void;
  selectedUser: string | null;
  messages: Message[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  users, 
  currentUser, 
  onUserSelect, 
  selectedUser, 
  messages 
}) => {
  // Obtenir les informations d'un utilisateur depuis les données du backend
  const getUserInfo = (user: User) => {
    const userMessages = messages.filter(msg => msg.username === user.username);
    
    // Utiliser les données du backend ou fallback sur les messages
    const messageCount = user.messageCount || userMessages.length;
    const lastMessage = user.lastMessage || (userMessages.length > 0 ? userMessages[userMessages.length - 1].content : null);
    const lastMessageAt = user.lastMessageAt || (userMessages.length > 0 ? userMessages[userMessages.length - 1].timestamp : null);
    
    return {
      messageCount,
      lastMessage: lastMessage ? (lastMessage.length > 30 ? lastMessage.substring(0, 30) + '...' : lastMessage) : null,
      timestamp: lastMessageAt ? new Date(lastMessageAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : null,
      sentiment: userMessages.length > 0 ? userMessages[userMessages.length - 1].sentiment : 'Neutral'
    };
  };

  // Obtenir l'emoji de sentiment
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return '😊';
      case 'Negative': return '😔';
      default: return '😐';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header de la barre latérale */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {currentUser.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Emotion Chat</h2>
            <p className="text-sm text-gray-600">Connected as {currentUser}</p>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Active Users ({users.length})
          </h3>
          
          <div className="space-y-2">
            {users.map((user) => {
              const userInfo = getUserInfo(user);
              const isSelected = selectedUser === user.username;
              const isCurrentUser = user.username === currentUser;
              
              return (
                <div
                  key={user.id}
                  onClick={() => onUserSelect(user.username)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : isCurrentUser
                      ? 'bg-green-50 border-2 border-green-300 hover:bg-green-100'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  title={isCurrentUser ? "You are connected as this user" : "Click to become this user"}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar de l'utilisateur */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCurrentUser 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                      <span className="text-white font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Informations de l'utilisateur */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-semibold truncate flex items-center ${
                          isCurrentUser ? 'text-green-700' : 'text-gray-800'
                        }`}>
                          {isCurrentUser && (
                            <span className="mr-1 text-xs">👤</span>
                          )}
                          {user.username}
                          {isCurrentUser && (
                            <span className="ml-1 text-xs text-green-600 font-bold">(ACTIVE)</span>
                          )}
                        </h4>
                        {userInfo.messageCount > 0 && (
                          <span className="text-xs text-gray-500">
                            {userInfo.messageCount} msg{userInfo.messageCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      
                      {/* Dernier message */}
                      {userInfo.lastMessage ? (
                        <div className="mt-1">
                          <p className="text-xs text-gray-600 truncate">
                            {userInfo.lastMessage}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">
                              {userInfo.timestamp}
                            </span>
                            <span className="text-sm">
                              {getSentimentEmoji(userInfo.sentiment)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          {userInfo.messageCount === 0 ? 'New user' : 'No recent messages'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer avec statistiques */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center space-x-4">
            <span>Total Messages: {messages.length}</span>
            <span>•</span>
            <span>Active Users: {users.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
