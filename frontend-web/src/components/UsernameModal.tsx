import React, { useState, useEffect } from 'react';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsernameSet: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onClose, onUsernameSet }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Charger le nom d'utilisateur depuis le localStorage
      const savedUsername = localStorage.getItem('emotion-chat-username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Username cannot be empty');
      return;
    }
    
    if (trimmedUsername.length < 3) {
      setError('Username must contain at least 3 characters');
      return;
    }
    
    if (trimmedUsername.length > 20) {
      setError('Username cannot exceed 20 characters');
      return;
    }
    
    // L'utilisateur sera créé automatiquement lors de l'envoi du premier message
    
    // Appeler la fonction de callback
    onUsernameSet(trimmedUsername);
    onClose();
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎭 Welcome!
          </h2>
          <p className="text-gray-600">
            Choose a username to start chatting
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!username.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Chatting
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default UsernameModal;


