import React from 'react';

interface ChatHeaderProps {
  username: string;
  messageCount: number;
  onUsernameChange: () => void;
  onAddNewUser?: () => void;
  selectedUser?: string | null;
  onBackToAll?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ username, messageCount, onUsernameChange, onAddNewUser, selectedUser, onBackToAll }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            {selectedUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onBackToAll}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Back to all messages"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-xl font-bold text-gray-800">
                    Chat with {selectedUser}
                  </h1>
                </div>
                <p className="text-sm text-gray-500">
                  Viewing messages from <span className="font-semibold">{selectedUser}</span>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="mr-2">👤</span>
                  Emotion Chat
                  <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    {username} (ACTIVE)
                  </span>
                </h1>
                <p className="text-sm text-gray-500">
                  Connected as <span className="font-semibold text-green-600">{username}</span>
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Messages
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {messageCount}
            </div>
          </div>
          
          <button
            onClick={onAddNewUser}
            className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            title="Add new user"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">Add User</span>
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-600">Positive</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-xs text-gray-600">Neutral</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-xs text-gray-600">Negative</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;


