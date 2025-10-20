import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UsernameModalProps {
  visible: boolean;
  onClose: () => void;
  onUsernameSet: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ visible, onClose, onUsernameSet }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      loadSavedUsername();
    }
  }, [visible]);

  const loadSavedUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('emotion-chat-username');
      if (savedUsername) {
        setUsername(savedUsername);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du nom d\'utilisateur:', error);
    }
  };

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Le nom d\'utilisateur ne peut pas être vide');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setError('Le nom d\'utilisateur doit contenir au moins 2 caractères');
      return;
    }
    
    if (trimmedUsername.length > 20) {
      setError('Le nom d\'utilisateur ne peut pas dépasser 20 caractères');
      return;
    }
    
    try {
      // Sauvegarder dans AsyncStorage
      await AsyncStorage.setItem('emotion-chat-username', trimmedUsername);
      
      // Appeler la fonction de callback
      onUsernameSet(trimmedUsername);
      onClose();
      setError('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le nom d\'utilisateur');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>🎭 Bienvenue !</Text>
            <Text style={styles.subtitle}>
              Choisissez un nom d'utilisateur pour commencer à chatter
            </Text>
          </View>
          
          <View style={styles.content}>
            <TextInput
              style={[
                styles.input,
                error && styles.inputError
              ]}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError('');
              }}
              placeholder="Votre nom d'utilisateur"
              placeholderTextColor="#9ca3af"
              maxLength={20}
              autoFocus
            />
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
          
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                !username.trim() && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!username.trim()}
            >
              <Text style={styles.submitButtonText}>Commencer</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.footer}>
            Votre nom sera sauvegardé localement
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#667eea',
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default UsernameModal;


