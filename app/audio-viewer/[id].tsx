import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, TextInput, ScrollView, Alert, Share as RNShare, Animated, Dimensions, Platform, Clipboard } from "react-native";
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import StreamStatusModal from '@/components/StreamStatusModal';
import { 
  X, 
  Heart,
  Flame,
  User,
  Share,
  Gift,
  Plus,
  SmilePlus,
  MessageCircle,
  UserPlus,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  Users,
  Clock,
  Bell,
  Crown,
  MoreHorizontal,
  ImageIcon,
  Send
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AudioViewerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [viewerCount] = useState<number>(127);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<{id: string, user: string, text: string}[]>([
    { id: '1', user: 'أحمد', text: 'مرحبا بالجميع! 👋' },
    { id: '2', user: 'فاطمة', text: 'صوت رائع 🎵' },
    { id: '3', user: 'محمد', text: 'استمر يا بطل! 🔥' }
  ]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showGifts, setShowGifts] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [hasRequestedMic, setHasRequestedMic] = useState<boolean>(false);
  const [streamDuration, setStreamDuration] = useState<string>('12:34');
  const [showHostsList, setShowHostsList] = useState<boolean>(false);
  const [showViewersList, setShowViewersList] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showRoomTools, setShowRoomTools] = useState<boolean>(false);
  const [showMoreOptionsModal, setShowMoreOptionsModal] = useState<boolean>(false);
  const [showHostsModal, setShowHostsModal] = useState<boolean>(false);
  const [showAudioSettings, setShowAudioSettings] = useState<boolean>(false);
  const [showStreamStatus, setShowStreamStatus] = useState<boolean>(false);
  const [streamStartTime] = useState<Date>(new Date(Date.now() - 9000)); // 9 seconds ago
  const [audioQuality, setAudioQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isCoHost, setIsCoHost] = useState<boolean>(false);
  const [hasRequestedCoHost, setHasRequestedCoHost] = useState<boolean>(false);
  const [activitiesIndex, setActivitiesIndex] = useState<number>(0);
  const [trendingColorIndex, setTrendingColorIndex] = useState<number>(0);
  const [countdownTime, setCountdownTime] = useState<number>(3540);
  const [micSlots, setMicSlots] = useState<Array<{id: number, user: any | null, isActive: boolean, isSpeaking: boolean}>>([
    { id: 1, user: { name: 'mutab.🎸', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', isHost: true }, isActive: true, isSpeaking: true },
    { id: 2, user: { name: 'KYAN.🦋', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', isHost: false }, isActive: true, isSpeaking: false },
    { id: 3, user: null, isActive: false, isSpeaking: false },
    { id: 4, user: null, isActive: false, isSpeaking: false },
    { id: 5, user: null, isActive: false, isSpeaking: false },
    { id: 6, user: null, isActive: false, isSpeaking: false },
    { id: 7, user: null, isActive: false, isSpeaking: false },
    { id: 8, user: null, isActive: false, isSpeaking: false },
    { id: 9, user: null, isActive: false, isSpeaking: false },
    { id: 10, user: null, isActive: false, isSpeaking: false },
    { id: 11, user: null, isActive: false, isSpeaking: false },
    { id: 12, user: null, isActive: false, isSpeaking: false },
  ]);
  const [userMicSlot, setUserMicSlot] = useState<number | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(1523);
  const [likesAnimations, setLikesAnimations] = useState<Array<{id: string, animation: Animated.Value}>>([]);
  
  // Mock data for live streams (hosts)
  const mockLiveStreams = [
    {
      id: '1',
      username: 'أحمد محمد الصالح',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'بث مباشر - دردشة مع المتابعين',
      type: 'LIVE' as const,
      viewerCount: 2847,
      likes: 1523,
    },
    {
      id: '2',
      username: 'فاطمة الزهراء',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      title: 'تحدي الطبخ PK مع صديقتي',
      type: 'PK' as const,
      viewerCount: 4521,
      likes: 3240,
    },
    {
      id: '3',
      username: 'محمد علي حسن',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      title: 'جلسة موسيقية هادئة - أغاني عربية',
      type: 'AUDIO' as const,
      viewerCount: 1234,
      likes: 876,
    },
  ];
  
  // Mock viewers data
  const mockViewers = [
    {
      id: '1',
      username: 'فاطمة',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    },
    {
      id: '2',
      username: 'علي',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    {
      id: '3',
      username: 'نور',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
    },
  ];
  
  // Activities data for animation
  const activitiesData = [
    { title: "الفعالية واليوميات", subtitle: "انضم الآن" },
    { title: "تحدي اليوم", subtitle: "شارك الآن" },
    { title: "مسابقة الأسبوع", subtitle: "اربح جوائز" },
    { title: "بطولة الشهر", subtitle: "سجل الآن" },
  ];
  
  // Trending colors
  const trendingColors = ['#ff4757', '#2196F3', '#9C27B0', '#E91E63'];
  const commentIdRef = useRef<number>(4);
  
  // Audio visualization animation
  const waveAnimation1 = useRef(new Animated.Value(0.3)).current;
  const waveAnimation2 = useRef(new Animated.Value(0.5)).current;
  const waveAnimation3 = useRef(new Animated.Value(0.7)).current;
  const waveAnimation4 = useRef(new Animated.Value(0.4)).current;
  const waveAnimation5 = useRef(new Animated.Value(0.6)).current;
  const screenHeight = Dimensions.get('window').height;
  const panRef = useRef<any>(null);
  
  // Calculate stream duration
  const getStreamDuration = useCallback(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - streamStartTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [streamStartTime]);
  
  // Handle swipe gesture
  const onGestureEvent = useCallback((event: any) => {
    const { translationX, velocityX } = event.nativeEvent;
    
    // Swipe from left to right with sufficient distance and velocity
    if (translationX > 100 && velocityX > 500) {
      setShowStreamStatus(true);
    }
  }, []);
  
  const onHandlerStateChange = useCallback((event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      // Swipe from left to right
      if (translationX > 100 && velocityX > 300) {
        setShowStreamStatus(true);
      }
    }
  }, []);
  
  useEffect(() => {
    const createWaveAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 800 + delay,
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 0.2,
            duration: 800 + delay,
            useNativeDriver: false,
          }),
        ])
      );
    };
    
    const animations = [
      createWaveAnimation(waveAnimation1, 0),
      createWaveAnimation(waveAnimation2, 100),
      createWaveAnimation(waveAnimation3, 200),
      createWaveAnimation(waveAnimation4, 300),
      createWaveAnimation(waveAnimation5, 400),
    ];
    
    animations.forEach(anim => anim.start());
    
    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);
  
  // Activities animation timer
  useEffect(() => {
    const activitiesTimer = setInterval(() => {
      setActivitiesIndex(prev => (prev + 1) % activitiesData.length);
    }, 5000);

    return () => clearInterval(activitiesTimer);
  }, []);

  // Trending colors animation timer
  useEffect(() => {
    const trendingTimer = setInterval(() => {
      setTrendingColorIndex(prev => (prev + 1) % trendingColors.length);
    }, 3000);

    return () => clearInterval(trendingTimer);
  }, []);
  
  const handleClose = useCallback(() => {
    router.replace('/(tabs)/' as any);
  }, [router]);

  const handleSubmitComment = useCallback(() => {
    if (comment.trim()) {
      commentIdRef.current += 1;
      const newComment = {
        id: `comment-${commentIdRef.current}`,
        user: 'أنت',
        text: comment.trim()
      };
      setComments(prev => [...prev, newComment].slice(-50));
      console.log('Comment sent:', comment);
      setComment('');
    }
  }, [comment]);

  const handleToggleGifts = useCallback(() => {
    setShowGifts(prev => !prev);
  }, []);

  const handleEmojiPress = useCallback(() => {
    const emojis = ['😀', '😂', '❤️', '👏', '🔥', '💎', '🎉', '✨'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setComment(prev => prev + randomEmoji);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMutedState = !prev;
      Alert.alert(
        newMutedState ? 'تم كتم الصوت' : 'تم تشغيل الصوت',
        newMutedState ? 'تم كتم صوت البث' : 'يمكنك الآن سماع البث'
      );
      return newMutedState;
    });
  }, []);

  const handleRequestMic = useCallback((slotId?: number) => {
    if (slotId) {
      setMicSlots(prev => {
        const slot = prev.find(s => s.id === slotId);
        if (slot && !slot.user) {
          Alert.alert(
            'الانضمام للمحادثة',
            'هل تريد الانضمام للمحادثة الصوتية؟',
            [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'انضمام', onPress: () => {
                setMicSlots(prevSlots => prevSlots.map(s => 
                  s.id === slotId 
                    ? { ...s, user: { name: 'أنت', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face', isHost: false }, isActive: true, isSpeaking: false }
                    : s
                ));
                setUserMicSlot(slotId);
                Alert.alert('تم الانضمام', 'تم انضمامك للمحادثة الصوتية بنجاح! 🎙️');
              }}
            ]
          );
        }
        return prev;
      });
    } else {
      if (!hasRequestedMic) {
        Alert.alert(
          'طلب الانضمام للمحادثة',
          'هل تريد طلب الانضمام للمحادثة الصوتية؟',
          [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'طلب الانضمام', onPress: () => {
              setHasRequestedMic(true);
              Alert.alert('تم الإرسال', 'تم إرسال طلب الانضمام للمضيف');
            }}
          ]
        );
      } else {
        Alert.alert('تم الإرسال', 'تم إرسال طلبك بالفعل، انتظر موافقة المضيف');
      }
    }
  }, [hasRequestedMic]);

  const handleMicControl = useCallback(() => {
    if (userMicSlot) {
      setIsMicMuted(prev => {
        const newState = !prev;
        setMicSlots(prevSlots => prevSlots.map(s => 
          s.id === userMicSlot 
            ? { ...s, isSpeaking: !newState }
            : s
        ));
        Alert.alert(
          newState ? 'تم كتم المايك' : 'تم تشغيل المايك',
          newState ? 'تم كتم الميكروفون الخاص بك' : 'يمكنك الآن التحدث'
        );
        return newState;
      });
    }
  }, [userMicSlot]);

  const handleLeaveMic = useCallback(() => {
    if (userMicSlot) {
      Alert.alert(
        'مغادرة المحادثة',
        'هل تريد مغادرة المحادثة الصوتية؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'مغادرة', style: 'destructive', onPress: () => {
            setMicSlots(prevSlots => prevSlots.map(s => 
              s.id === userMicSlot 
                ? { ...s, user: null, isActive: false, isSpeaking: false }
                : s
            ));
            setUserMicSlot(null);
            setIsMicMuted(false);
            Alert.alert('تم المغادرة', 'تم مغادرة المحادثة الصوتية');
          }}
        ]
      );
    }
  }, [userMicSlot]);

  const handleScreenTap = useCallback(() => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    
    const animationId = Date.now().toString();
    const animation = new Animated.Value(0);
    
    setLikesAnimations(prev => [...prev, { id: animationId, animation }]);
    
    Animated.timing(animation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setLikesAnimations(prev => prev.filter(item => item.id !== animationId));
    });
  }, [likes]);

  const handleToggleFollow = useCallback(() => {
    setIsFollowing(prev => {
      const newState = !prev;
      Alert.alert(
        newState ? 'تمت المتابعة' : 'تم إلغاء المتابعة',
        newState ? 'تمت متابعة mutab.🎸 بنجاح' : 'تم إلغاء متابعة mutab.🎸'
      );
      return newState;
    });
  }, []);

  const handleCoHostRequest = useCallback(() => {
    if (!hasRequestedCoHost && !isCoHost) {
      Alert.alert(
        'طلب Co-Host',
        'هل تريد طلب الانضمام كمضيف مساعد؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'طلب الانضمام', onPress: () => {
            setHasRequestedCoHost(true);
            Alert.alert('تم الإرسال', 'تم إرسال طلب Co-Host للمضيف الرئيسي');
            console.log('Co-Host request sent');
          }}
        ]
      );
    } else if (hasRequestedCoHost && !isCoHost) {
      Alert.alert('تم الإرسال', 'تم إرسال طلبك بالفعل، انتظر موافقة المضيف');
    } else if (isCoHost) {
      Alert.alert(
        'إنهاء Co-Host',
        'هل تريد إنهاء دورك كمضيف مساعد؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'إنهاء', style: 'destructive', onPress: () => {
            setIsCoHost(false);
            setHasRequestedCoHost(false);
            Alert.alert('تم الإنهاء', 'تم إنهاء دورك كمضيف مساعد');
          }}
        ]
      );
    }
  }, [hasRequestedCoHost, isCoHost]);

  const handleCommentsToggle = useCallback(() => {
    setShowComments(prev => {
      const newState = !prev;
      console.log('Comments toggled:', newState);
      if (newState) {
        Alert.alert('التعليقات', 'تم فتح نافذة التعليقات');
      }
      return newState;
    });
  }, []);

  const handleRoomTools = useCallback(() => {
    setShowRoomTools(prev => {
      const newState = !prev;
      console.log('Room tools toggled:', newState);
      return newState;
    });
  }, []);

  const handleShareStream = useCallback(async () => {
    try {
      console.log('Share button pressed');
      const shareData = {
        message: 'شاهد هذا البث الصوتي المباشر الرائع! 🎙️',
        url: `https://chobi.live/audio/${id}`,
        title: 'بث صوتي مباشر - mutab.🎸'
      };
      
      // Check if we're on web and if Web Share API is available
      if (Platform.OS === 'web') {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share({
            title: shareData.title,
            text: shareData.message,
            url: shareData.url
          });
          Alert.alert('تم المشاركة', 'تم مشاركة البث بنجاح! 📤');
          console.log('Stream shared successfully via Web Share API');
        } else {
          // Fallback: Copy to clipboard
          const shareText = `${shareData.message}\n${shareData.url}`;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareText);
            Alert.alert('تم النسخ', 'تم نسخ رابط البث إلى الحافظة! 📋');
            console.log('Stream link copied to clipboard');
          } else {
            // Final fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            Alert.alert('تم النسخ', 'تم نسخ رابط البث إلى الحافظة! 📋');
            console.log('Stream link copied to clipboard (fallback)');
          }
        }
      } else {
        // Native platforms
        const result = await RNShare.share(shareData);
        
        if (result.action === RNShare.sharedAction) {
          Alert.alert('تم المشاركة', 'تم مشاركة البث بنجاح! 📤');
          console.log('Stream shared successfully');
        }
      }
    } catch (error: unknown) {
      console.error('Share error:', error);
      
      // Enhanced error handling with proper type checking
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          Alert.alert('خطأ في المشاركة', 'لا يمكن المشاركة في الوقت الحالي. جرب مرة أخرى.');
        } else if (error.name === 'AbortError') {
          // User cancelled sharing, no need to show error
          console.log('User cancelled sharing');
        } else {
          // Try clipboard fallback on error
          try {
            const shareText = `شاهد هذا البث الصوتي المباشر الرائع! 🎙️\nhttps://chobi.live/audio/${id}`;
            if (Platform.OS === 'web' && navigator.clipboard) {
              await navigator.clipboard.writeText(shareText);
              Alert.alert('تم النسخ بدلاً من ذلك', 'تم نسخ رابط البث إلى الحافظة! 📋');
            } else {
              Alert.alert('خطأ', 'فشل في مشاركة البث');
            }
          } catch (clipboardError: unknown) {
            console.error('Clipboard fallback failed:', clipboardError);
            Alert.alert('خطأ', 'فشل في مشاركة البث');
          }
        }
      } else {
        Alert.alert('خطأ', 'فشل في مشاركة البث');
      }
    }
  }, [id]);

  const handleMoreOptions = useCallback(() => {
    console.log('More options button pressed');
    setShowMoreOptionsModal(true);
  }, []);

  const handleShowHosts = useCallback(() => {
    console.log('Show hosts button pressed');
    setShowHostsModal(true);
  }, []);

  const handleAudioSettings = useCallback(() => {
    console.log('Audio settings opened');
    setShowAudioSettings(true);
  }, []);

  const handleReportStream = useCallback(() => {
    Alert.alert(
      'الإبلاغ عن البث',
      'هل تريد الإبلاغ عن هذا البث؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'إبلاغ', style: 'destructive', onPress: () => {
          Alert.alert('تم الإبلاغ', 'تم إرسال البلاغ بنجاح. شكراً لك!');
          console.log('Stream reported successfully');
        }}
      ]
    );
  }, []);

  const handleBlockUser = useCallback(() => {
    Alert.alert(
      'حظر المستخدم',
      'هل تريد حظر هذا المستخدم؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حظر', style: 'destructive', onPress: () => {
          Alert.alert('تم الحظر', 'تم حظر المستخدم بنجاح');
          console.log('User blocked successfully');
        }}
      ]
    );
  }, []);

  const handleStartRecording = useCallback(() => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingDuration(0);
      Alert.alert('بدء التسجيل', 'تم بدء تسجيل البث الصوتي');
      console.log('Recording started');
      
      // Start recording timer
      const recordingTimer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Store timer reference for cleanup
      (global as any).recordingTimer = recordingTimer;
    } else {
      setIsRecording(false);
      setRecordingDuration(0);
      Alert.alert('تم إيقاف التسجيل', 'تم حفظ التسجيل بنجاح');
      console.log('Recording stopped');
      
      // Clear timer
      if ((global as any).recordingTimer) {
        clearInterval((global as any).recordingTimer);
        (global as any).recordingTimer = null;
      }
    }
  }, [isRecording]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m`;
  };

  const activeSpeakersCount = micSlots.filter(slot => slot.user).length;
  const availableSlotsCount = micSlots.filter(slot => !slot.user).length;
  
  const listeners = [
    { id: 4, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    { id: 5, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { id: 6, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
    { id: 7, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
    { id: 8, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  ];
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
      

      
      {/* Top Status Bar - Exact copy from video-stream.tsx */}
      <View style={styles.statusBar}>
        <View style={styles.leftStatus}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton} testID="close-button">
            <X size={20} color="white" />
          </TouchableOpacity>
          
          <View style={styles.viewerCountDisplay}>
            <Text style={styles.viewerCountText}>5.0k</Text>
          </View>
          
          <View style={styles.viewerAvatars}>
            {[
              { id: 1, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
              { id: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
              { id: 3, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
            ].map((viewer, index) => (
              <View key={viewer.id} style={[styles.viewerAvatarWithCircle, { marginLeft: index > 0 ? -4 : 0 }]}>
                <Image 
                  source={{ uri: viewer.avatar }}
                  style={styles.viewerAvatarImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.centerStatus}>
        </View>
        
        <View style={styles.rightStatus}>
          <View style={styles.hostInfo}>
            <TouchableOpacity style={styles.bellButtonSmaller}>
              <Bell size={8} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.followButtonLarger}
              onPress={handleToggleFollow}
            >
              <Plus size={8} color="white" />
            </TouchableOpacity>
            <Text style={styles.hostNameRightSmaller}>mutab</Text>
            <View style={styles.hostAvatarLarger}>
              <Text style={styles.hostAvatarTextLarger}>👤</Text>
            </View>
          </View>
          <View style={styles.hostStatsUnderAvatar}>
            <Text style={styles.heartEmojiUnderAvatar}>❤️</Text>
            <Text style={styles.heartCountTextUnderAvatar}>100</Text>
          </View>
        </View>
      </View>
      
      {/* Activities Section - Animated */}
      <View style={styles.activitiesSectionBelowX}>
        <View style={styles.activitiesContent}>
          <View style={styles.activitiesIcon}>
            <Crown size={11} color="#00d4ff" />
          </View>
          <Text style={styles.activitiesTitle}>{activitiesData[activitiesIndex].title}</Text>
          <Text style={styles.activitiesSubtitle}>{activitiesData[activitiesIndex].subtitle}</Text>
        </View>
      </View>

      {/* Trending Now Banner - Animated Colors */}
      <View style={styles.weeklyUpdatesBannerBelowActivities}>
        <Text style={[styles.weeklyUpdatesText, { backgroundColor: trendingColors[trendingColorIndex] }]}>رائج الآن</Text>
      </View>

      {/* Coins Display - Moved up */}
      <View style={styles.coinsDisplayMovedUp}>
        <View style={styles.coinsContainer}>
          <View style={styles.coinsWithIcon}>
            <Text style={styles.coinsText}>10000</Text>
            <Text style={styles.coinsIconBehind}>💰</Text>
          </View>
        </View>
      </View>

      {/* Hour Rating - Below Profile */}
      <View style={styles.hourRatingBelowProfile}>
        <View style={styles.hourRatingWithCountdownContainerReversed}>
          <Text style={styles.countdownTextSmaller}>{formatCountdown(countdownTime)}</Text>
          <Text style={styles.hourRatingText}>تصنيف الساعة: 10⭐</Text>
        </View>
      </View>
      
      {/* Host Profile Section */}
      <View style={styles.hostSection}>
        <View style={styles.hostProfileContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' }} 
            style={styles.hostImage} 
          />
          <View style={styles.hostActiveRing} />
        </View>
        <Text style={styles.hostName}>mutab.🎸</Text>
        <TouchableOpacity 
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={handleToggleFollow}
          testID="follow-button"
        >
          <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
            {isFollowing ? 'متابع' : 'المتابعة'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Screen Tap for Likes */}
      <TouchableOpacity 
        style={styles.screenTapArea}
        onPress={handleScreenTap}
        activeOpacity={1}
      >
        {/* Microphone Slots Grid - 3x4 - All Empty */}
        <View style={styles.micSlotsContainerMoved}>
          <View style={styles.micGrid}>
            {Array.from({ length: 12 }, (_, index) => (
              <TouchableOpacity 
                key={index + 1}
                style={styles.micSlot}
                onPress={() => handleRequestMic(index + 1)}
                testID={`mic-slot-${index + 1}`}
              >
                <View style={styles.emptyMicSlot}>
                  <View style={styles.micIcon}>
                    <Mic color="#666" size={16} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.emptyMicText}>انضم</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Floating Hearts Animation */}
        {likesAnimations.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.floatingHeart,
              {
                opacity: item.animation.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0, 0.8, 0],
                }),
                transform: [
                  {
                    translateY: item.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [screenHeight * 0.8, screenHeight * 0.2],
                    }),
                  },
                  {
                    translateX: item.animation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
                    }),
                  },
                  {
                    scale: item.animation.interpolate({
                      inputRange: [0, 0.2, 0.8, 1],
                      outputRange: [0.5, 1.2, 1, 0.8],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.heartEmoji}>❤️</Text>
          </Animated.View>
        ))}
      </TouchableOpacity>



      {/* Bottom Controls - Viewer Specific - Copied from video live viewer */}
      <View style={styles.viewerBottomControls}>
        <View style={styles.viewerControlsContainer}>
          {/* Co-Host Request */}
          <TouchableOpacity 
            style={[styles.viewerControlButton, (hasRequestedCoHost || isCoHost) && styles.activeViewerControl]} 
            onPress={handleCoHostRequest}
            testID="co-host-button"
          >
            <View style={[styles.controlIconContainer, (hasRequestedCoHost || isCoHost) && styles.activeControlIcon]}>
              <Users size={22} color={isCoHost ? "#FFD700" : hasRequestedCoHost ? "#FFA500" : "white"} />
            </View>
            <Text style={[styles.viewerControlLabel, (hasRequestedCoHost || isCoHost) && styles.activeControlText]}>
              {isCoHost ? 'مضيف مساعد' : hasRequestedCoHost ? 'في الانتظار' : 'Co-Host'}
            </Text>
          </TouchableOpacity>
          
          {/* Comments Rectangle Button */}
          <TouchableOpacity 
            style={[styles.commentsRectangleButton, showComments && styles.activeCommentsButton]} 
            onPress={handleCommentsToggle}
            testID="comments-button"
          >
            <MessageCircle size={16} color="white" />
            <Text style={styles.commentsRectangleText}>تعليقات</Text>
            {comments.length > 0 && (
              <View style={styles.commentsBadge}>
                <Text style={styles.commentsBadgeText}>{comments.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Gifts */}
          <TouchableOpacity 
            style={styles.viewerControlButton} 
            onPress={handleToggleGifts}
            testID="gifts-button"
          >
            <View style={styles.controlIconContainer}>
              <Gift size={22} color="#FFD700" />
            </View>
            <Text style={styles.viewerControlLabel}>هدايا</Text>
          </TouchableOpacity>
          
          {/* Share */}
          <TouchableOpacity 
            style={styles.viewerControlButton} 
            onPress={handleShareStream}
            testID="share-button"
          >
            <View style={styles.controlIconContainer}>
              <Share size={22} color="white" />
            </View>
            <Text style={styles.viewerControlLabel}>المشاركة</Text>
          </TouchableOpacity>
          

          
          {/* More Options */}
          <TouchableOpacity 
            style={[styles.viewerControlButton, showMoreOptionsModal && styles.activeViewerControl]} 
            onPress={handleMoreOptions}
            testID="more-options-button"
          >
            <View style={[styles.controlIconContainer, showMoreOptionsModal && styles.activeControlIcon]}>
              <MoreHorizontal size={22} color={showMoreOptionsModal ? "#2196F3" : "white"} />
            </View>
            <Text style={[styles.viewerControlLabel, showMoreOptionsModal && styles.activeControlText]}>المزيد</Text>
          </TouchableOpacity>
        </View>
      </View>
      

      
      {/* Mic Control Panel - Show when user is on mic */}
      {userMicSlot && (
        <View style={styles.micControlPanel}>
          <TouchableOpacity 
            style={[styles.micControlButton, isMicMuted && styles.mutedButton]}
            onPress={handleMicControl}
          >
            {isMicMuted ? <MicOff size={20} color="white" /> : <Mic size={20} color="white" />}
            <Text style={styles.micControlText}>{isMicMuted ? 'مكتوم' : 'مفتوح'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.leaveMicButton}
            onPress={handleLeaveMic}
          >
            <X size={20} color="white" />
            <Text style={styles.micControlText}>مغادرة</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Comments Modal */}
      {showComments && (
        <View style={styles.commentsModal}>
          <View style={styles.commentsModalContent}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>التعليقات المباشرة</Text>
              <TouchableOpacity 
                style={styles.closeCommentsButton}
                onPress={() => setShowComments(false)}
                testID="close-comments-modal"
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsScrollView}>
              {comments.map(comment => (
                <View key={comment.id} style={styles.commentItemModal}>
                  <Text style={styles.commentUserModal}>{comment.user}:</Text>
                  <Text style={styles.commentTextModal}>{comment.text}</Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="اكتب تعليقك..."
                placeholderTextColor="#666"
                multiline
                maxLength={200}
              />
              <TouchableOpacity 
                style={styles.sendCommentButton}
                onPress={handleSubmitComment}
                disabled={!comment.trim()}
              >
                <Send size={20} color={comment.trim() ? "#2196F3" : "#666"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Gift Selection Modal */}
      {showGifts && (
        <View style={styles.giftModal}>
          <View style={styles.giftModalContent}>
            <Text style={styles.giftModalTitle}>اختر هدية</Text>
            <View style={styles.giftGrid}>
              {[
                { name: 'وردة', icon: '🌹', price: 10 },
                { name: 'قلب', icon: '❤️', price: 20 },
                { name: 'تاج', icon: '👑', price: 50 },
                { name: 'ألماس', icon: '💎', price: 100 },
                { name: 'صاروخ', icon: '🚀', price: 200 },
                { name: 'سيارة', icon: '🚗', price: 500 }
              ].map((gift, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.giftItem}
                  onPress={() => {
                    setShowGifts(false);
                    Alert.alert(
                      'إرسال هدية',
                      `هل تريد إرسال ${gift.name} بـ ${gift.price} عملة؟`,
                      [
                        { text: 'إلغاء', style: 'cancel' },
                        { text: 'إرسال', onPress: () => {
                          console.log(`Gift sent: ${gift.name} - ${gift.price} coins`);
                          const newComment = {
                            id: `gift-${Date.now()}`,
                            user: 'أنت',
                            text: `🎁 أرسل ${gift.name} للمضيف!`
                          };
                          setComments(prev => [...prev, newComment]);
                          Alert.alert('تم الإرسال', `تم إرسال ${gift.name} بنجاح! 🎁`);
                        }}
                      ]
                    );
                  }}
                  testID={`gift-${gift.name}`}
                >
                  <Text style={styles.giftIcon}>{gift.icon}</Text>
                  <Text style={styles.giftName}>{gift.name}</Text>
                  <Text style={styles.giftPrice}>{gift.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.closeGiftModal}
              onPress={() => setShowGifts(false)}
            >
              <X color="white" size={20} strokeWidth={2} />
              <Text style={styles.closeGiftModalText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* More Options Modal */}
      {showMoreOptionsModal && (
        <View style={styles.moreOptionsModal}>
          <View style={styles.moreOptionsContent}>
            <View style={styles.moreOptionsHeader}>
              <Text style={styles.moreOptionsTitle}>الإعدادات</Text>
              <TouchableOpacity 
                style={styles.closeMoreOptionsButton}
                onPress={() => setShowMoreOptionsModal(false)}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.moreOptionsSubtitle}>هذه الإعدادات تنطبق على جميع غرف البث المباشر</Text>
            
            <ScrollView style={styles.moreOptionsScrollView}>
              {/* الصوت */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  handleToggleMute();
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    {isMuted ? <VolumeX size={20} color="#FF4444" /> : <Volume2 size={20} color="#2196F3" />}
                  </View>
                  <Text style={styles.moreOptionText}>الصوت</Text>
                </View>
                <View style={styles.moreOptionToggle}>
                  <View style={[styles.toggleSwitch, isMuted && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleKnob, isMuted && styles.toggleKnobActive]} />
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* المايكروفون كتم/إلغاء كتم */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  handleMicControl();
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    {isMicMuted ? <MicOff size={20} color="#FF4444" /> : <Mic size={20} color="#2196F3" />}
                  </View>
                  <Text style={styles.moreOptionText}>المايكروفون كتم/إلغاء كتم</Text>
                </View>
                <View style={styles.moreOptionToggle}>
                  <View style={[styles.toggleSwitch, isMicMuted && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleKnob, isMicMuted && styles.toggleKnobActive]} />
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* المؤثرات الصوتية */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('المؤثرات الصوتية', 'تم فتح إعدادات المؤثرات الصوتية');
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    <Radio size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.moreOptionText}>المؤثرات الصوتية</Text>
                </View>
                <View style={styles.moreOptionToggle}>
                  <View style={styles.toggleSwitch}>
                    <View style={styles.toggleKnob} />
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* الإبلاغ عن البث */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  handleReportStream();
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    <Bell size={20} color="#FFA500" />
                  </View>
                  <Text style={styles.moreOptionText}>الإبلاغ عن البث</Text>
                </View>
                <Text style={styles.moreOptionArrow}>›</Text>
              </TouchableOpacity>
              
              {/* اختيار جودة البث */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  handleAudioSettings();
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    <Radio size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.moreOptionText}>اختيار جودة البث</Text>
                </View>
                <Text style={styles.moreOptionArrow}>›</Text>
              </TouchableOpacity>
              
              {/* تشغيل في شاشة جانبية */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('تشغيل في شاشة جانبية', 'تم تفعيل وضع الشاشة الجانبية');
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    <ImageIcon size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.moreOptionText}>تشغيل في شاشة جانبية</Text>
                </View>
                <Text style={styles.moreOptionArrow}>›</Text>
              </TouchableOpacity>
              
              {/* تشغيل في الخلفية */}
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowMoreOptionsModal(false);
                  Alert.alert('تشغيل في الخلفية', 'تم تفعيل وضع التشغيل في الخلفية');
                }}
              >
                <View style={styles.moreOptionLeft}>
                  <View style={styles.moreOptionIconContainer}>
                    <Radio size={20} color="#2196F3" />
                  </View>
                  <Text style={styles.moreOptionText}>تشغيل في الخلفية</Text>
                </View>
                <Text style={styles.moreOptionArrow}>›</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
      
      {/* Room Tools Modal */}
      {showRoomTools && (
        <View style={styles.roomToolsModal}>
          <View style={styles.roomToolsContent}>
            <View style={styles.roomToolsHeader}>
              <Text style={styles.roomToolsTitle}>أدوات الغرفة</Text>
              <TouchableOpacity 
                style={styles.closeRoomToolsButton}
                onPress={() => setShowRoomTools(false)}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.roomToolsGrid}>
              <TouchableOpacity 
                style={styles.roomToolItem}
                onPress={() => {
                  setShowRoomTools(false);
                  setShowHostsList(true);
                }}
              >
                <Users size={24} color="#2196F3" />
                <Text style={styles.roomToolText}>دعوة مضيفين</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.roomToolItem}
                onPress={() => {
                  setShowRoomTools(false);
                  setShowViewersList(true);
                }}
              >
                <User size={24} color="#2196F3" />
                <Text style={styles.roomToolText}>قائمة المشاهدين</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.roomToolItem}
                onPress={() => {
                  setShowRoomTools(false);
                  handleToggleMute();
                }}
              >
                {isMuted ? <VolumeX size={24} color="#FF4444" /> : <Volume2 size={24} color="#2196F3" />}
                <Text style={styles.roomToolText}>{isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.roomToolItem}
                onPress={() => {
                  setShowRoomTools(false);
                  handleAudioSettings();
                }}
              >
                <Radio size={24} color="#2196F3" />
                <Text style={styles.roomToolText}>جودة الصوت</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Audio Settings Modal */}
      {showAudioSettings && (
        <View style={styles.roomToolsModal}>
          <View style={styles.roomToolsContent}>
            <View style={styles.roomToolsHeader}>
              <Text style={styles.roomToolsTitle}>إعدادات الصوت</Text>
              <TouchableOpacity 
                style={styles.closeRoomToolsButton}
                onPress={() => setShowAudioSettings(false)}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.audioSettingsContainer}>
              <Text style={styles.audioSettingsLabel}>جودة الصوت:</Text>
              <View style={styles.audioQualityOptions}>
                {(['low', 'medium', 'high'] as const).map((quality) => (
                  <TouchableOpacity 
                    key={quality}
                    style={[
                      styles.audioQualityOption,
                      audioQuality === quality && styles.selectedAudioQuality
                    ]}
                    onPress={() => {
                      setAudioQuality(quality);
                      Alert.alert('تم التحديث', `تم تغيير جودة الصوت إلى ${quality === 'low' ? 'منخفضة' : quality === 'medium' ? 'متوسطة' : 'عالية'}`);
                    }}
                  >
                    <Text style={[
                      styles.audioQualityText,
                      audioQuality === quality && styles.selectedAudioQualityText
                    ]}>
                      {quality === 'low' ? 'منخفضة' : quality === 'medium' ? 'متوسطة' : 'عالية'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.audioControlsSection}>
                <TouchableOpacity 
                  style={styles.audioControlButton}
                  onPress={() => {
                    Alert.alert('تحسين الصوت', 'تم تفعيل تحسين جودة الصوت');
                    console.log('Audio enhancement enabled');
                  }}
                >
                  <Volume2 size={20} color="#2196F3" />
                  <Text style={styles.audioControlText}>تحسين الصوت</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.audioControlButton}
                  onPress={() => {
                    Alert.alert('إلغاء الضوضاء', 'تم تفعيل إلغاء الضوضاء');
                    console.log('Noise cancellation enabled');
                  }}
                >
                  <MicOff size={20} color="#2196F3" />
                  <Text style={styles.audioControlText}>إلغاء الضوضاء</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      
      {/* Recording Indicator */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>تسجيل {formatRecordingTime(recordingDuration)}</Text>
        </View>
      )}
      
      {/* Hosts List Modal */}
      {(showHostsList || showHostsModal) && (
        <View style={styles.modalOverlay}>
          <View style={styles.hostsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المضيفين المتاحين</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowHostsList(false);
                  setShowHostsModal(false);
                }}
                style={styles.modalCloseButton}
                testID="close-hosts-modal"
              >
                <X size={24} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.hostsListContainer}>
              {mockLiveStreams.map(host => (
                <View key={host.id} style={styles.hostItem}>
                  <Image 
                    source={{ uri: host.avatar }}
                    style={styles.hostItemAvatar}
                  />
                  <View style={styles.hostItemInfo}>
                    <Text style={styles.hostItemName}>{host.username}</Text>
                    <Text style={styles.hostItemTitle} numberOfLines={1}>{host.title}</Text>
                    <View style={styles.hostItemStats}>
                      <Text style={styles.hostItemViewers}>👥 {host.viewerCount}</Text>
                      <Text style={styles.hostItemLikes}>❤️ {host.likes}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.inviteButton}
                    onPress={() => {
                      console.log('إرسال دعوة للمضيف:', host.username);
                      const newComment = {
                        id: `comment-${Date.now()}`,
                        user: 'النظام',
                        text: `📨 تم إرسال دعوة انضمام إلى ${host.username}`
                      };
                      setComments(prev => [...prev, newComment]);
                      setShowHostsList(false);
                      setShowHostsModal(false);
                    }}
                  >
                    <Text style={styles.inviteButtonText}>دعوة</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      
      {/* Viewers List Modal */}
      {showViewersList && (
        <View style={styles.modalOverlay}>
          <View style={styles.viewersModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المشاهدين الحاليين</Text>
              <TouchableOpacity 
                onPress={() => setShowViewersList(false)}
                style={styles.modalCloseButton}
                testID="close-viewers-modal"
              >
                <X size={24} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.viewersListContainer}>
              {mockViewers.map(viewer => (
                <View key={viewer.id} style={styles.viewerItem}>
                  <Image 
                    source={{ uri: viewer.avatar }}
                    style={styles.viewerItemAvatar}
                  />
                  <View style={styles.viewerItemInfo}>
                    <Text style={styles.viewerItemName}>{viewer.username}</Text>
                    <Text style={styles.viewerItemStatus}>مشاهد نشط</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.inviteButton}
                    onPress={() => {
                      console.log('إرسال دعوة للمشاهد:', viewer.username);
                      const newComment = {
                        id: `comment-${Date.now()}`,
                        user: 'النظام',
                        text: `🎤 تم إرسال دعوة انضمام صوتي إلى ${viewer.username}`
                      };
                      setComments(prev => [...prev, newComment]);
                      setShowViewersList(false);
                    }}
                  >
                    <Text style={styles.inviteButtonText}>دعوة</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      
      {/* Stream Status Modal */}
      <StreamStatusModal
        visible={showStreamStatus}
        onClose={() => setShowStreamStatus(false)}
        streamDuration={getStreamDuration()}
        viewersCount={127}
        newFollowersCount={5}
        supportersCount={12}
        touchesCount={likes}
      />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gestureContainer: {
    flex: 1,
  },
  

  
  // Top Status Bar - Exact copy from video-stream.tsx
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  leftStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  centerStatus: {
    flex: 1,
    alignItems: 'center',
  },
  viewerCountDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewerCountText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  viewerAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerAvatarWithCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 6,
    overflow: 'hidden',
  },
  viewerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8.5,
  },
  rightStatus: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostStatsUnderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 60,
    top: 30,
    gap: 1,
  },
  heartEmojiUnderAvatar: {
    fontSize: 12,
  },
  heartCountTextUnderAvatar: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followButtonLarger: {
    backgroundColor: '#8B5CF6',
    padding: 4,
    borderRadius: 6,
  },
  bellButtonSmaller: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 3,
    borderRadius: 6,
  },
  hostNameRightSmaller: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hostAvatarLarger: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostAvatarTextLarger: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitiesSectionBelowX: {
    position: 'absolute',
    top: 53,
    left: 0,
    zIndex: 10,
  },
  activitiesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  activitiesIcon: {
    width: 17,
    height: 17,
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitiesTitle: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  activitiesSubtitle: {
    color: '#00d4ff',
    fontSize: 7,
    fontWeight: '500',
  },
  weeklyUpdatesBannerBelowActivities: {
    position: 'absolute',
    top: 83,
    left: 16,
    zIndex: 10,
  },
  weeklyUpdatesText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 11,
    overflow: 'hidden',
  },
  coinsDisplayMovedUp: {
    position: 'absolute',
    top: 54,
    right: 10,
    zIndex: 10,
  },
  coinsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  coinsText: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  coinsWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  coinsIconBehind: {
    position: 'absolute',
    left: -15,
    fontSize: 12,
    opacity: 0.8,
  },
  hourRatingBelowProfile: {
    position: 'absolute',
    top: 73,
    right: 0,
    zIndex: 10,
  },
  hourRatingWithCountdownContainerReversed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  countdownTextSmaller: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
  },
  hourRatingText: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // New Viewer Bottom Controls - Thin and transparent
  viewerBottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
    height: 50,
  },
  viewerControlsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  viewerControlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  controlIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  viewerControlLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeViewerControl: {
    opacity: 1,
  },
  activeControlText: {
    color: '#2196F3',
  },
  activeControlIcon: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
  },
  commentsBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Comments Rectangle Button
  commentsRectangleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 120,
    height: 32,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  commentsRectangleText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  activeCommentsButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.8)',
  },
  chatInputWrapper: {
    position: 'absolute',
    bottom: 50,
    left: 12,
    right: 12,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  messageInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    color: '#000',
  },
  sendButton: {
    padding: 6,
  },
  
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  statNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  headerRight: {
    alignItems: 'flex-end',
  },
  
  notificationBadge: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  
  notificationText: {
    color: '#FFA500',
    fontSize: 10,
    fontWeight: '500',
  },
  
  hostSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#000',
  },
  
  hostProfileContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  hostActiveRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#8A2BE2',
  },
  
  hostName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  followButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  followingButton: {
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
  },
  
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  followingButtonText: {
    color: '#8A2BE2',
  },
  
  micSlotsContainerMoved: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: -50,
  },
  
  micGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    gap: 8,
  },
  
  micSlot: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  screenTapArea: {
    flex: 1,
  },
  
  micSlotContent: {
    alignItems: 'center',
    position: 'relative',
  },
  
  micSlotImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  
  micSlotImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  
  speakingIndicator: {
    borderWidth: 2,
    borderColor: '#00ff00',
    borderRadius: 27,
    padding: 2,
  },
  
  mutedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  micSlotName: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  micSlotBadge: {
    position: 'absolute',
    bottom: 20,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  micSlotBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  emptyMicSlot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  micIcon: {
    marginBottom: 4,
  },
  
  emptyMicText: {
    color: '#666',
    fontSize: 8,
    fontWeight: '500',
    position: 'absolute',
    bottom: -14,
  },
  
  bottomMessagesOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    maxHeight: 150,
  },
  
  commentsContainer: {
    maxHeight: 120,
  },
  
  commentItem: {
    flexDirection: 'row',
    marginBottom: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 6,
    alignSelf: 'flex-start',
  },
  
  commentUser: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  
  commentText: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
  
  bottomControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
  },
  
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    minWidth: 50,
    height: 50,
  },
  

  
  activeControlButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
  },
  
  controlButtonText: {
    fontSize: 10,
    color: 'white',
    marginTop: 3,
    fontWeight: '500',
  },
  
  controlButtonIcon: {
    fontSize: 18,
    color: 'white',
  },
  
  activeControlButtonText: {
    color: '#2196F3',
  },
  

  
  chatInputField: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  
  chatInputIcon: {
    paddingHorizontal: 12,
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  
  hostsModal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  
  viewersModal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  modalCloseButton: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  hostsListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  viewersListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  hostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  
  hostItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  
  viewerItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  
  hostItemInfo: {
    flex: 1,
  },
  
  viewerItemInfo: {
    flex: 1,
  },
  
  hostItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  
  viewerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  
  hostItemTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  
  viewerItemStatus: {
    fontSize: 12,
    color: '#2196F3',
  },
  
  hostItemStats: {
    flexDirection: 'row',
    gap: 12,
  },
  
  hostItemViewers: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  
  hostItemLikes: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  
  inviteButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  
  inviteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Gift Modal Styles
  giftModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  giftModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  
  giftModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  giftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  giftItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  
  giftIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  
  giftName: {
    color: 'white',
    fontSize: 12,
    marginBottom: 3,
  },
  
  giftPrice: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  closeGiftModal: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  
  closeGiftModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Floating Hearts Animation
  floatingHeart: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
  },
  
  heartEmoji: {
    fontSize: 20,
    opacity: 0.8,
  },
  
  // Mic Control Panel
  micControlPanel: {
    position: 'absolute',
    bottom: 100,
    right: 12,
    flexDirection: 'column',
    gap: 8,
    zIndex: 20,
  },
  
  micControlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  
  mutedButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  
  leaveMicButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  
  micControlText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Comments Modal Styles
  commentsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  commentsModalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  commentsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeCommentsButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsScrollView: {
    flex: 1,
    paddingHorizontal: 20,
    maxHeight: 300,
  },
  commentItemModal: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  commentUserModal: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentTextModal: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    fontSize: 14,
    maxHeight: 100,
  },
  sendCommentButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // More Options Modal Styles
  moreOptionsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  moreOptionsContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  moreOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  moreOptionsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  moreOptionsSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingBottom: 20,
    textAlign: 'center',
  },
  closeMoreOptionsButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOptionsScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moreOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  moreOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moreOptionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moreOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  moreOptionArrow: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: '300',
  },
  moreOptionToggle: {
    marginLeft: 12,
  },
  toggleSwitch: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#39393D',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#8A2BE2',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  // Room Tools Modal Styles
  roomToolsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  roomToolsContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    width: '90%',
    maxWidth: 350,
    padding: 20,
  },
  roomToolsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  roomToolsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeRoomToolsButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomToolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  roomToolItem: {
    width: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  roomToolText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Audio Settings Styles
  audioSettingsContainer: {
    gap: 20,
  },
  audioSettingsLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  audioQualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  audioQualityOption: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAudioQuality: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderColor: '#2196F3',
  },
  audioQualityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedAudioQualityText: {
    color: '#2196F3',
  },
  audioControlsSection: {
    gap: 10,
  },
  audioControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    gap: 12,
  },
  audioControlText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Recording Indicator Styles
  recordingIndicator: {
    position: 'absolute',
    top: 100,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    zIndex: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});