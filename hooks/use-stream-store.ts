import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export interface StreamSettings {
  videoQuality: 'low' | 'medium' | 'high' | 'ultra';
  audioQuality: 'low' | 'medium' | 'high';
  beautyMode: boolean;
  beautyLevel: number;
  filter: string;
  audioFilter: string;
  micVolume: number;
  speakerVolume: number;
  bassLevel: number;
  trebleLevel: number;
  echoLevel: number;
  noiseReduction: boolean;
  autoGainControl: boolean;
  echoCancellation: boolean;
  backgroundBlur: boolean;
  virtualBackground: string | null;
  streamTitle: string;
  streamCategory: string;
  allowComments: boolean;
  allowGifts: boolean;
  allowGuests: boolean;
  maxGuests: number;
  privateMode: boolean;
  recordStream: boolean;
  saveToGallery: boolean;
  notifyFollowers: boolean;
  scheduledTime: Date | null;
  streamDuration: number;
  viewerLimit: number;
  ageRestriction: boolean;
  watermark: boolean;
  watermarkPosition: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

export interface StreamStats {
  viewers: number;
  peakViewers: number;
  likes: number;
  comments: number;
  gifts: number;
  shares: number;
  duration: number;
  earnings: number;
  newFollowers: number;
  bandwidth: number;
  fps: number;
  bitrate: number;
  packetLoss: number;
  latency: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface StreamIntervals {
  viewerCountInterval: NodeJS.Timeout | null;
  heartAnimationInterval: NodeJS.Timeout | null;
}

export interface ViewerInfo {
  id: string;
  name: string;
  avatar: string;
  level: number;
  isVip: boolean;
  isFollowing: boolean;
  giftsSent: number;
  joinedAt: Date;
  isMuted: boolean;
  isBlocked: boolean;
  isGuest: boolean;
  isSpeaking: boolean;
}

export interface GiftAnimation {
  id: string;
  giftId: string;
  giftName: string;
  giftIcon: string;
  giftValue: number;
  senderId: string;
  senderName: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isSystem: boolean;
  isHighlighted: boolean;
  giftInfo?: {
    giftId: string;
    giftName: string;
    giftIcon: string;
    giftValue: number;
  };
}

export interface AudioEffect {
  id: string;
  name: string;
  icon: string;
  soundFile: string;
  duration: number;
  volume: number;
}

export interface VideoFilter {
  id: string;
  name: string;
  icon: string;
  shader: string;
  intensity: number;
}

const DEFAULT_SETTINGS: StreamSettings = {
  videoQuality: 'high',
  audioQuality: 'high',
  beautyMode: false,
  beautyLevel: 50,
  filter: 'none',
  audioFilter: 'none',
  micVolume: 75,
  speakerVolume: 75,
  bassLevel: 50,
  trebleLevel: 50,
  echoLevel: 0,
  noiseReduction: true,
  autoGainControl: true,
  echoCancellation: true,
  backgroundBlur: false,
  virtualBackground: null,
  streamTitle: '',
  streamCategory: 'general',
  allowComments: true,
  allowGifts: true,
  allowGuests: true,
  maxGuests: 8,
  privateMode: false,
  recordStream: false,
  saveToGallery: false,
  notifyFollowers: true,
  scheduledTime: null,
  streamDuration: 0,
  viewerLimit: 0,
  ageRestriction: false,
  watermark: false,
  watermarkPosition: 'bottomRight',
};

const AUDIO_EFFECTS: AudioEffect[] = [
  { id: '1', name: 'تصفيق', icon: '👏', soundFile: 'applause.mp3', duration: 3000, volume: 0.8 },
  { id: '2', name: 'ضحك', icon: '😂', soundFile: 'laugh.mp3', duration: 2000, volume: 0.7 },
  { id: '3', name: 'طبول', icon: '🥁', soundFile: 'drums.mp3', duration: 1500, volume: 0.9 },
  { id: '4', name: 'جرس', icon: '🔔', soundFile: 'bell.mp3', duration: 1000, volume: 0.6 },
  { id: '5', name: 'صافرة', icon: '📯', soundFile: 'whistle.mp3', duration: 2000, volume: 0.8 },
  { id: '6', name: 'موسيقى', icon: '🎵', soundFile: 'music.mp3', duration: 5000, volume: 0.5 },
  { id: '7', name: 'قلب', icon: '❤️', soundFile: 'heartbeat.mp3', duration: 1000, volume: 0.7 },
  { id: '8', name: 'نجمة', icon: '⭐', soundFile: 'star.mp3', duration: 1500, volume: 0.6 },
];

const VIDEO_FILTERS: VideoFilter[] = [
  { id: '1', name: 'عادي', icon: '🎥', shader: 'none', intensity: 0 },
  { id: '2', name: 'جميل', icon: '✨', shader: 'beauty', intensity: 50 },
  { id: '3', name: 'دافئ', icon: '🌅', shader: 'warm', intensity: 60 },
  { id: '4', name: 'بارد', icon: '❄️', shader: 'cool', intensity: 60 },
  { id: '5', name: 'خمري', icon: '🍷', shader: 'vintage', intensity: 70 },
  { id: '6', name: 'أبيض وأسود', icon: '⚫', shader: 'bw', intensity: 100 },
  { id: '7', name: 'سينمائي', icon: '🎬', shader: 'cinematic', intensity: 80 },
  { id: '8', name: 'نيون', icon: '💜', shader: 'neon', intensity: 75 },
];

export const [StreamProvider, useStream] = createContextHook(() => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamType, setStreamType] = useState<'video' | 'audio'>('video');
  const [settings, setSettings] = useState<StreamSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<StreamStats>({
    viewers: 0,
    peakViewers: 0,
    likes: 0,
    comments: 0,
    gifts: 0,
    shares: 0,
    duration: 0,
    earnings: 0,
    newFollowers: 0,
    bandwidth: 0,
    fps: 30,
    bitrate: 2500,
    packetLoss: 0,
    latency: 50,
    cpuUsage: 45,
    memoryUsage: 60,
  });
  
  const [viewers, setViewers] = useState<ViewerInfo[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [giftAnimations, setGiftAnimations] = useState<GiftAnimation[]>([]);
  const [activeGuests, setActiveGuests] = useState<ViewerInfo[]>([]);
  const [pendingGuests, setPendingGuests] = useState<ViewerInfo[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<ChatMessage | null>(null);
  const [streamKey, setStreamKey] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [currentAudioFilter, setCurrentAudioFilter] = useState('none');
  const [audioEffects] = useState<AudioEffect[]>(AUDIO_EFFECTS);
  const [videoFilters] = useState<VideoFilter[]>(VIDEO_FILTERS);
  const [coinsBalance, setCoinsBalance] = useState(10000);
  const [heartsCount, setHeartsCount] = useState(100);
  const [streamStartTime, setStreamStartTime] = useState<Date | null>(null);
  const [streamEndTime, setStreamEndTime] = useState<Date | null>(null);
  
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewerSimulationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Load settings from storage
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('streamSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };
  
  const saveSettings = async (newSettings: StreamSettings) => {
    try {
      await AsyncStorage.setItem('streamSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };
  
  const startStream = useCallback(async (type: 'video' | 'audio') => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      setStreamType(type);
      setIsStreaming(true);
      setStreamStartTime(new Date());
      setStreamKey(`stream_${Date.now()}`);
      setStreamUrl(`rtmp://live.example.com/${Date.now()}`);
      
      // Start stats simulation
      statsIntervalRef.current = setInterval(() => {
        setStats(prev => ({
          ...prev,
          duration: prev.duration + 1,
          viewers: Math.max(1, prev.viewers + Math.floor(Math.random() * 10) - 4),
          likes: prev.likes + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0),
          comments: prev.comments + (Math.random() > 0.8 ? 1 : 0),
          fps: 30 + Math.random() * 2 - 1,
          bitrate: 2500 + Math.random() * 200 - 100,
          latency: 50 + Math.random() * 20 - 10,
          cpuUsage: Math.min(100, Math.max(20, prev.cpuUsage + Math.random() * 10 - 5)),
          memoryUsage: Math.min(100, Math.max(30, prev.memoryUsage + Math.random() * 10 - 5)),
        }));
      }, 1000);
      
      // Simulate viewers joining
      viewerSimulationRef.current = setInterval(() => {
        if (Math.random() > 0.5) {
          const newViewer: ViewerInfo = {
            id: `viewer_${Date.now()}`,
            name: `مستخدم ${Math.floor(Math.random() * 1000)}`,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            level: Math.floor(Math.random() * 50) + 1,
            isVip: Math.random() > 0.8,
            isFollowing: Math.random() > 0.6,
            giftsSent: 0,
            joinedAt: new Date(),
            isMuted: false,
            isBlocked: false,
            isGuest: false,
            isSpeaking: false,
          };
          setViewers(prev => [...prev.slice(-99), newViewer]);
        }
      }, 3000);
      
      Alert.alert('البث المباشر', `تم بدء البث ${type === 'video' ? 'المرئي' : 'الصوتي'} بنجاح!`);
    } catch (error) {
      console.error('Error starting stream:', error);
      Alert.alert('خطأ', 'فشل بدء البث المباشر');
    }
  }, []);
  
  const endStream = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      
      setIsStreaming(false);
      setStreamEndTime(new Date());
      
      // Clear intervals
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      if (viewerSimulationRef.current) {
        clearInterval(viewerSimulationRef.current);
      }
      
      // Save stream data
      const streamData = {
        startTime: streamStartTime,
        endTime: new Date(),
        stats: stats,
        earnings: stats.earnings,
      };
      
      await AsyncStorage.setItem(`stream_${Date.now()}`, JSON.stringify(streamData));
      
      return streamData;
    } catch (error) {
      console.error('Error ending stream:', error);
      Alert.alert('خطأ', 'فشل إنهاء البث المباشر');
    }
  }, [streamStartTime, stats]);
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);
  
  const toggleVideo = useCallback(() => {
    setIsVideoOn(prev => !prev);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);
  
  const toggleCamera = useCallback(() => {
    setIsFrontCamera(prev => !prev);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);
  
  const applyVideoFilter = useCallback((filterId: string) => {
    const filter = videoFilters.find(f => f.id === filterId);
    if (filter) {
      setCurrentFilter(filter.shader);
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      Alert.alert('فلتر الفيديو', `تم تطبيق فلتر ${filter.name}`);
    }
  }, [videoFilters]);
  
  const applyAudioFilter = useCallback((filterId: string) => {
    setCurrentAudioFilter(filterId);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  }, []);
  
  const playAudioEffect = useCallback(async (effectId: string) => {
    const effect = audioEffects.find(e => e.id === effectId);
    if (effect) {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      // Simulate playing audio effect
      console.log(`Playing audio effect: ${effect.name}`);
      Alert.alert('مؤثر صوتي', `تم تشغيل ${effect.name}`);
    }
  }, [audioEffects]);
  
  const sendGift = useCallback(async (giftId: string, giftName: string, giftIcon: string, giftValue: number, recipientId?: string) => {
    if (coinsBalance < giftValue) {
      Alert.alert('رصيد غير كافي', 'ليس لديك عملات كافية لإرسال هذه الهدية');
      return false;
    }
    
    setCoinsBalance(prev => prev - giftValue);
    setHeartsCount(prev => prev + Math.floor(giftValue / 10));
    
    // Create gift animation
    const animation: GiftAnimation = {
      id: `gift_${Date.now()}`,
      giftId,
      giftName,
      giftIcon,
      giftValue,
      senderId: 'current_user',
      senderName: 'أنت',
      x: Math.random() * 80 + 10,
      y: 50,
      scale: 1,
      opacity: 1,
      rotation: 0,
    };
    
    setGiftAnimations(prev => [...prev, animation]);
    
    // Remove animation after 3 seconds
    setTimeout(() => {
      setGiftAnimations(prev => prev.filter(a => a.id !== animation.id));
    }, 3000);
    
    // Add gift message to chat
    const giftMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: 'current_user',
      userName: 'أنت',
      userAvatar: '',
      message: `أرسل ${giftName} ${giftIcon}`,
      timestamp: new Date(),
      isSystem: false,
      isHighlighted: true,
      giftInfo: {
        giftId,
        giftName,
        giftIcon,
        giftValue,
      },
    };
    
    setMessages(prev => [...prev, giftMessage]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      gifts: prev.gifts + 1,
      earnings: prev.earnings + giftValue,
    }));
    
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    return true;
  }, [coinsBalance]);
  
  const sendMessage = useCallback((message: string) => {
    if (!settings.allowComments) {
      Alert.alert('التعليقات معطلة', 'التعليقات معطلة في هذا البث');
      return;
    }
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: 'current_user',
      userName: 'أنت',
      userAvatar: '',
      message,
      timestamp: new Date(),
      isSystem: false,
      isHighlighted: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setStats(prev => ({ ...prev, comments: prev.comments + 1 }));
  }, [settings.allowComments]);
  
  const inviteGuest = useCallback(async (userId: string) => {
    const user = viewers.find(v => v.id === userId);
    if (user && activeGuests.length < settings.maxGuests) {
      setPendingGuests(prev => [...prev, user]);
      Alert.alert('دعوة مرسلة', `تم إرسال دعوة إلى ${user.name}`);
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [viewers, activeGuests, settings.maxGuests]);
  
  const acceptGuest = useCallback(async (userId: string) => {
    const user = pendingGuests.find(g => g.id === userId);
    if (user) {
      setActiveGuests(prev => [...prev, { ...user, isGuest: true, isSpeaking: true }]);
      setPendingGuests(prev => prev.filter(g => g.id !== userId));
      Alert.alert('ضيف جديد', `${user.name} انضم كضيف`);
    }
  }, [pendingGuests]);
  
  const removeGuest = useCallback(async (userId: string) => {
    setActiveGuests(prev => prev.filter(g => g.id !== userId));
    Alert.alert('إزالة ضيف', 'تم إزالة الضيف من البث');
  }, []);
  
  const blockUser = useCallback(async (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
    setViewers(prev => prev.filter(v => v.id !== userId));
    Alert.alert('حظر مستخدم', 'تم حظر المستخدم من البث');
  }, []);
  
  const muteUser = useCallback(async (userId: string) => {
    setMutedUsers(prev => [...prev, userId]);
    Alert.alert('كتم مستخدم', 'تم كتم المستخدم');
  }, []);
  
  const pinMessage = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setPinnedMessage(message);
      Alert.alert('تثبيت رسالة', 'تم تثبيت الرسالة');
    }
  }, [messages]);
  
  const updateSettings = useCallback(async (newSettings: Partial<StreamSettings>) => {
    const updated = { ...settings, ...newSettings };
    await saveSettings(updated);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  }, [settings]);
  
  const shareStream = useCallback(async () => {
    try {
      const message = `شاهد البث المباشر معي! 🎥\n\n${streamUrl}`;
      // Share functionality would be implemented here
      Alert.alert('مشاركة البث', 'تم نسخ رابط البث');
      return true;
    } catch (error) {
      console.error('Share error:', error);
      return false;
    }
  }, [streamUrl]);
  
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    Alert.alert(
      isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل',
      isRecording ? 'تم إيقاف تسجيل البث' : 'تم بدء تسجيل البث'
    );
  }, [isRecording]);
  
  return {
    // State
    isStreaming,
    streamType,
    settings,
    stats,
    viewers,
    messages,
    giftAnimations,
    activeGuests,
    pendingGuests,
    blockedUsers,
    mutedUsers,
    pinnedMessage,
    streamKey,
    streamUrl,
    isRecording,
    isMuted,
    isVideoOn,
    isFrontCamera,
    currentFilter,
    currentAudioFilter,
    audioEffects,
    videoFilters,
    coinsBalance,
    heartsCount,
    streamStartTime,
    streamEndTime,
    
    // Actions
    startStream,
    endStream,
    toggleMute,
    toggleVideo,
    toggleCamera,
    applyVideoFilter,
    applyAudioFilter,
    playAudioEffect,
    sendGift,
    sendMessage,
    inviteGuest,
    acceptGuest,
    removeGuest,
    blockUser,
    muteUser,
    pinMessage,
    updateSettings,
    shareStream,
    toggleRecording,
  };
});