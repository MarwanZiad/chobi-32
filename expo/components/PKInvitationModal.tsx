import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePK } from '@/hooks/use-pk-store';
import type { PKInvitation } from '@/types/pk-challenge';
import { Sword, Clock, User, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface PKInvitationModalProps {
  invitation: PKInvitation;
  visible: boolean;
  onClose: () => void;
}

export default function PKInvitationModal({ invitation, visible, onClose }: PKInvitationModalProps) {
  const { respondToInvitation, isLoading } = usePK();

  const handleResponse = async (response: 'accept' | 'reject') => {
    try {
      await respondToInvitation(invitation.id, response);
      onClose();
      
      if (response === 'accept') {
        Alert.alert('تم القبول', 'تم قبول التحدي بنجاح! سيبدأ التحدي قريباً.');
      }
    } catch (error) {
      Alert.alert('خطأ', error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const getTimeRemaining = () => {
    const now = new Date().getTime();
    const expiresAt = new Date(invitation.expiresAt).getTime();
    const remaining = Math.max(0, expiresAt - now);
    
    const seconds = Math.floor(remaining / 1000);
    return seconds;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!invitation.challenge || !invitation.inviter) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Sword size={32} color="white" />
              </View>
              <Text style={styles.title}>تحدي PK جديد!</Text>
            </View>

            {/* Inviter Info */}
            <View style={styles.inviterSection}>
              <View style={styles.inviterAvatar}>
                <Text style={styles.avatarText}>
                  {invitation.inviter.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.inviterInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.inviterName}>{invitation.inviter.displayName}</Text>
                  {invitation.inviter.isVerified && (
                    <Text style={styles.verifiedBadge}>✓</Text>
                  )}
                </View>
                <Text style={styles.inviterLevel}>المستوى {invitation.inviter.level}</Text>
              </View>
            </View>

            {/* Challenge Details */}
            <View style={styles.challengeDetails}>
              <Text style={styles.challengeTitle}>{invitation.challenge.title}</Text>
              {invitation.challenge.description && (
                <Text style={styles.challengeDescription}>
                  {invitation.challenge.description}
                </Text>
              )}
              
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <User size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>
                    {invitation.challenge.type === '1v1' ? 'تحدي فردي' : 'تحدي جماعي'}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Clock size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.detailText}>
                    {formatDuration(invitation.challenge.duration)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Message */}
            {invitation.message && (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>&quot;{invitation.message}&quot;</Text>
              </View>
            )}

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Clock size={16} color="#FFD700" />
              <Text style={styles.timerText}>
                ينتهي خلال: {formatDuration(getTimeRemaining())}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleResponse('reject')}
                disabled={isLoading}
              >
                <Text style={styles.rejectButtonText}>رفض</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={() => handleResponse('accept')}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D']}
                  style={styles.acceptGradient}
                >
                  <Trophy size={20} color="white" />
                  <Text style={styles.acceptButtonText}>قبول التحدي</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalGradient: {
    padding: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inviterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  inviterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inviterInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  inviterName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  verifiedBadge: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inviterLevel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  challengeDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  challengeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  challengeDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 25,
  },
  timerText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  rejectButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingVertical: 15,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    overflow: 'hidden',
  },
  acceptGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});