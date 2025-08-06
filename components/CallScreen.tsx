import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, Animated, Alert, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  MoreHorizontal,
  UserPlus,
  Settings,
  Maximize,
  Minimize,
  Wifi,
  WifiOff,
  Camera,
  CameraOff
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { useChat } from '@/hooks/use-chat-store';
import colors from '@/constants/colors';

interface CallScreenProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function CallScreen({ visible, onClose }: CallScreenProps) {
  const { activeCall, endCall, getUserById, addNotification } = useChat();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('excellent');
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isCallAccepted, setIsCallAccepted] = useState<boolean>(false);
  
  const pulseAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(1);

  const caller = activeCall ? getUserById(activeCall.callerId) : null;
  const receiver = activeCall ? getUserById(activeCall.receiverId) : null;
  const otherUser = activeCall?.callerId !== 'current-user' ? caller : receiver;
  const isIncomingCall = activeCall?.callerId !== 'current-user' && activeCall?.status === 'ringing';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeCall?.status === 'active' && connectionStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status, connectionStatus]);

  useEffect(() => {
    if (activeCall?.type === 'audio') {
      setIsVideoEnabled(false);
    }
  }, [activeCall?.type]);

  useEffect(() => {
    // Pulse animation for incoming calls
    if (isIncomingCall) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [isIncomingCall]);

  useEffect(() => {
    // Simulate connection process
    if (isCallAccepted && activeCall?.status === 'active') {
      const timer = setTimeout(() => {
        setConnectionStatus('connected');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isCallAccepted, activeCall?.status]);

  useEffect(() => {
    // Auto-hide controls after 5 seconds
    if (activeCall?.status === 'active' && showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [activeCall?.status, showControls]);

  useEffect(() => {
    // Simulate network quality changes
    const interval = setInterval(() => {
      const qualities = ['excellent', 'good', 'poor'] as const;
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setNetworkQuality(randomQuality);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: !isSpeakerOn,
        });
      }
      
      setIsCallAccepted(true);
      setConnectionStatus('connecting');
      
      // Add notification for call start
      await addNotification({
        type: 'call',
        title: 'بدأت المكالمة',
        body: `مكالمة ${activeCall?.type === 'video' ? 'فيديو' : 'صوتية'} مع ${otherUser?.name}`,
        userId: 'current-user',
        isRead: false,
        data: { callId: activeCall?.id, callType: activeCall?.type }
      });
    } catch (error) {
      console.error('Error accepting call:', error);
      Alert.alert('خطأ', 'فشل في قبول المكالمة');
    }
  };

  const handleDeclineCall = async () => {
    try {
      await addNotification({
        type: 'call',
        title: 'تم رفض المكالمة',
        body: `تم رفض مكالمة ${activeCall?.type === 'video' ? 'فيديو' : 'صوتية'} من ${otherUser?.name}`,
        userId: 'current-user',
        isRead: false,
        data: { callId: activeCall?.id, callType: activeCall?.type }
      });
      
      endCall();
      setCallDuration(0);
      onClose();
    } catch (error) {
      console.error('Error declining call:', error);
      endCall();
      setCallDuration(0);
      onClose();
    }
  };

  const handleEndCall = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      }
      
      // Add notification for call end
      if (callDuration > 0) {
        await addNotification({
          type: 'call',
          title: 'انتهت المكالمة',
          body: `مدة المكالمة: ${formatDuration(callDuration)}`,
          userId: 'current-user',
          isRead: false,
          data: { callId: activeCall?.id, callType: activeCall?.type, duration: callDuration }
        });
      }
      
      endCall();
      setCallDuration(0);
      setIsCallAccepted(false);
      setConnectionStatus('connecting');
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
      endCall();
      setCallDuration(0);
      onClose();
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    if (activeCall?.type === 'video') {
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleToggleSpeaker = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: !isSpeakerOn,
        });
      }
      setIsSpeakerOn(!isSpeakerOn);
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const addParticipant = () => {
    Alert.alert('إضافة مشارك', 'هذه الميزة غير متاحة حالياً');
  };

  const openSettings = () => {
    Alert.alert('إعدادات المكالمة', 'هذه الميزة غير متاحة حالياً');
  };

  const getNetworkIcon = () => {
    switch (networkQuality) {
      case 'excellent':
      case 'good':
        return <Wifi color={colors.white} size={16} />;
      case 'poor':
      case 'disconnected':
        return <WifiOff color='#FF4444' size={16} />;
      default:
        return <Wifi color={colors.white} size={16} />;
    }
  };

  const getConnectionStatusText = () => {
    if (isIncomingCall) {
      return 'مكالمة واردة...';
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return 'جاري الاتصال...';
      case 'connected':
        return formatDuration(callDuration);
      case 'disconnected':
        return 'تم قطع الاتصال';
      case 'failed':
        return 'فشل في الاتصال';
      default:
        return '';
    }
  };

  if (!activeCall || !otherUser) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
    >
      <SafeAreaView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.networkStatus}>
            {getNetworkIcon()}
            <Text style={styles.networkText}>{networkQuality}</Text>
          </View>
          
          <TouchableOpacity onPress={toggleMinimize} style={styles.minimizeButton}>
            {isMinimized ? <Maximize color={colors.white} size={20} /> : <Minimize color={colors.white} size={20} />}
          </TouchableOpacity>
        </View>

        {/* Call Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {getConnectionStatusText()}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userContainer}>
          <Animated.View 
            style={[
              styles.avatarContainer,
              isIncomingCall && { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Image 
              source={{ uri: otherUser.avatar }} 
              style={styles.avatar}
              contentFit='cover'
            />
            {isIncomingCall && (
              <View style={styles.pulseRing} />
            )}
          </Animated.View>
          
          <Text style={styles.userName}>{otherUser.name}</Text>
          <Text style={styles.callType}>
            {activeCall.type === 'video' ? 'مكالمة فيديو' : 'مكالمة صوتية'}
          </Text>
          
          {otherUser.isOnline && (
            <Text style={styles.onlineStatus}>متصل الآن</Text>
          )}
        </View>

        {/* Video Preview (for video calls) */}
        {activeCall.type === 'video' && isVideoEnabled && !isMinimized && (
          <View style={styles.videoContainer}>
            <View style={styles.localVideo}>
              <Text style={styles.videoPlaceholder}>الكاميرا المحلية</Text>
            </View>
          </View>
        )}

        {/* Call Controls */}
        {(!isIncomingCall || isCallAccepted) && (
          <Animated.View style={[styles.controlsContainer, { opacity: fadeAnim }]}>
            <View style={styles.controlsRow}>
              {/* Mute Button */}
              <TouchableOpacity 
                style={[styles.controlButton, isMuted && styles.activeControlButton]}
                onPress={handleToggleMute}
              >
                {isMuted ? (
                  <MicOff color={colors.white} size={24} />
                ) : (
                  <Mic color={colors.white} size={24} />
                )}
              </TouchableOpacity>

              {/* Speaker Button */}
              <TouchableOpacity 
                style={[styles.controlButton, isSpeakerOn && styles.activeControlButton]}
                onPress={handleToggleSpeaker}
              >
                {isSpeakerOn ? (
                  <Volume2 color={colors.white} size={24} />
                ) : (
                  <VolumeX color={colors.white} size={24} />
                )}
              </TouchableOpacity>

              {/* Video Button (only for video calls) */}
              {activeCall.type === 'video' && (
                <TouchableOpacity 
                  style={[styles.controlButton, !isVideoEnabled && styles.activeControlButton]}
                  onPress={handleToggleVideo}
                >
                  {isVideoEnabled ? (
                    <Video color={colors.white} size={24} />
                  ) : (
                    <VideoOff color={colors.white} size={24} />
                  )}
                </TouchableOpacity>
              )}

              {/* Add Participant Button */}
              <TouchableOpacity style={styles.controlButton} onPress={addParticipant}>
                <UserPlus color={colors.white} size={24} />
              </TouchableOpacity>

              {/* Settings Button */}
              <TouchableOpacity style={styles.controlButton} onPress={openSettings}>
                <Settings color={colors.white} size={24} />
              </TouchableOpacity>
            </View>

            {/* End Call Button */}
            <TouchableOpacity 
              style={styles.endCallButton}
              onPress={handleEndCall}
            >
              <PhoneOff color={colors.white} size={28} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Incoming Call Actions */}
        {isIncomingCall && !isCallAccepted && (
          <View style={styles.incomingCallActions}>
            <TouchableOpacity 
              style={styles.declineButton}
              onPress={handleDeclineCall}
            >
              <PhoneOff color={colors.white} size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={handleAcceptCall}
            >
              <Phone color={colors.white} size={24} />
            </TouchableOpacity>
          </View>
        )}

        {/* Connection Quality Indicator */}
        {connectionStatus === 'connected' && (
          <View style={styles.qualityIndicator}>
            <Text style={styles.qualityText}>
              جودة الاتصال: {networkQuality === 'excellent' ? 'ممتازة' : 
                            networkQuality === 'good' ? 'جيدة' : 
                            networkQuality === 'poor' ? 'ضعيفة' : 'منقطعة'}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  networkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  networkText: {
    color: colors.white,
    fontSize: 12,
  },
  minimizeButton: {
    padding: 8,
  },
  statusContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  pulseRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.6,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  callType: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  onlineStatus: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
  },
  videoContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
  },
  localVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  controlsContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: colors.primary,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  incomingCallActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 80,
    paddingBottom: 40,
  },
  acceptButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityIndicator: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  qualityText: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});