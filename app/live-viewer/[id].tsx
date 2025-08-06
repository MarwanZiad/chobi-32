import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  TextInput,
  Modal,
  ScrollView,
  FlatList,
  StatusBar,
  Platform,
  Animated
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  X, 
  Heart, 
  Mic, 
  Gift, 
  Share, 
  Bell,
  Send,
  Search,
  Volume2,
  VolumeX,
  MessageCircle,
  Users,
  MoreHorizontal
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface LiveStreamData {
  id: string;
  username: string;
  avatar: string;
  title: string;
  type: 'LIVE' | 'PK' | 'AUDIO';
  viewerCount: number;
  likes: number;
  thumbnail: string;
  isLive: boolean;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  avatar: string;
  level?: number;
  giftImageUrl?: string;
  type?: 'message' | 'gift' | 'join' | 'system';
}

interface StreamGift {
  id: string;
  name: string;
  icon: string;
  price: number;
}

interface Viewer {
  id: string;
  username: string;
  avatar: string;
}

const { width, height } = Dimensions.get('window');

const getStreamData = (streamId: string): LiveStreamData => {
  const streamDataMap: { [key: string]: LiveStreamData } = {
    '1': {
      id: '1',
      username: 'Marwan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'بث مباشر - دردشة مع المتابعين',
      type: 'LIVE',
      viewerCount: 51,
      likes: 255,
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
      isLive: true,
    },
    '2': {
      id: '2',
      username: 'فاطمة الزهراء',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      title: 'تحدي الطبخ PK مع صديقتي',
      type: 'PK',
      viewerCount: 4521,
      likes: 3240,
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
      isLive: true,
    },
    '3': {
      id: '3',
      username: 'محمد علي حسن',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      title: 'جلسة موسيقية هادئة - أغاني عربية',
      type: 'AUDIO',
      viewerCount: 1234,
      likes: 876,
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
      isLive: true,
    },
  };
  
  return streamDataMap[streamId] || streamDataMap['1'];
};

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    username: 'سارة',
    message: 'مرحبا! بث رائع 👋',
    timestamp: new Date(),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    level: 15,
    type: 'message',
  },
  {
    id: '2',
    username: 'محمد',
    message: 'استمر يا بطل! 🔥',
    timestamp: new Date(),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
    level: 22,
    type: 'message',
  },
];

const mockGifts: StreamGift[] = [
  { id: '1', name: 'قلب', icon: '❤️', price: 10 },
  { id: '2', name: 'وردة', icon: '🌹', price: 25 },
  { id: '3', name: 'تاج', icon: '👑', price: 50 },
  { id: '4', name: 'نجمة', icon: '⭐', price: 100 },
  { id: '5', name: 'ألماسة', icon: '💎', price: 500 },
  { id: '6', name: 'صاروخ', icon: '🚀', price: 1000 },
  { id: '7', name: 'طائرة', icon: '✈️', price: 200 },
  { id: '8', name: 'سيارة', icon: '🚗', price: 300 },
  { id: '9', name: 'قلعة', icon: '🏰', price: 750 },
  { id: '10', name: 'عرش', icon: '👸', price: 1500 },
  { id: '11', name: 'نار', icon: '🔥', price: 150 },
  { id: '12', name: 'برق', icon: '⚡', price: 400 },
];

const mockViewers: Viewer[] = [
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

export default function LiveViewerScreen() {
  const { id } = useLocalSearchParams();
  const streamId = Array.isArray(id) ? id[0] : id || '1';
  const [streamData, setStreamData] = useState<LiveStreamData>(() => getStreamData(streamId));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMicRequest, setShowMicRequest] = useState(false);
  const [viewers] = useState<Viewer[]>(mockViewers);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<Viewer[]>([]);
  const [showHostsList, setShowHostsList] = useState(false);
  const [showViewersList, setShowViewersList] = useState(false);
  const [activitiesIndex, setActivitiesIndex] = useState(0);
  const [trendingColorIndex, setTrendingColorIndex] = useState(0);
  const [showCoHostRequest, setShowCoHostRequest] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likeAnimations, setLikeAnimations] = useState<Array<{ id: number; x: number; y: number; animValue: Animated.Value }>>([]);
  const [floatingComments, setFloatingComments] = useState<Array<{ id: string; comment: ChatMessage; animValue: Animated.Value }>>([]);
  
  // Activities data for animation
  const activitiesData = [
    { title: "الفعالية واليوميات", subtitle: "انضم الآن" },
    { title: "تحدي اليوم", subtitle: "شارك الآن" },
    { title: "مسابقة الأسبوع", subtitle: "اربح جوائز" },
    { title: "بطولة الشهر", subtitle: "سجل الآن" },
  ];

  // Trending colors
  const trendingColors = ['#ff4757', '#2196F3', '#9C27B0', '#E91E63'];
  
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
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
    },
    {
      id: '2',
      username: 'فاطمة الزهراء',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      title: 'تحدي الطبخ PK مع صديقتي',
      type: 'PK' as const,
      viewerCount: 4521,
      likes: 3240,
      thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
    },
    {
      id: '3',
      username: 'محمد علي حسن',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      title: 'جلسة موسيقية هادئة - أغاني عربية',
      type: 'AUDIO' as const,
      viewerCount: 1234,
      likes: 876,
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
    },
    {
      id: '4',
      username: 'سارة خالد أحمد',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      title: 'دردشة مسائية ممتعة مع الأصدقاء',
      type: 'LIVE' as const,
      viewerCount: 1890,
      likes: 1245,
      thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    },
    {
      id: '5',
      username: 'عبدالله حسن محمد',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      title: 'تحدي الألعاب PK - من الأقوى؟',
      type: 'PK' as const,
      viewerCount: 3456,
      likes: 2789,
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
    },
  ];

  useEffect(() => {
    // Hide status bar for full screen experience
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(true, 'fade');
    }
    
    return () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false, 'fade');
      }
    };
  }, []);

  useEffect(() => {
    // Filter chats based on search query
    if (searchQuery.trim()) {
      const filtered = viewers.filter(viewer => 
        viewer.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(viewers);
    }
  }, [searchQuery, viewers]);

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

  // Simulate live comments
  useEffect(() => {
    const commentTimer = setInterval(() => {
      const randomComments = [
        {
          id: Date.now().toString(),
          username: 'مروان',
          message: 'مساء الخير جميعاً',
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          level: 22,
          type: 'message' as const,
        },
        {
          id: Date.now().toString() + '1',
          username: 'حاتم',
          message: 'انضم للبث',
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          level: 22,
          type: 'join' as const,
        },
        {
          id: Date.now().toString() + '2',
          username: 'المها',
          message: 'انضم للبث',
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
          level: 40,
          type: 'join' as const,
        },
        {
          id: Date.now().toString() + '3',
          username: 'محمد',
          message: 'انضم للبث',
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
          level: 12,
          type: 'join' as const,
        },
        {
          id: Date.now().toString() + '4',
          username: 'نورا',
          message: 'أرسل قلب ذهبي إلى المضيف',
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
          level: 31,
          type: 'gift' as const,
          giftImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=30&h=30&fit=crop',
        },
        {
          id: Date.now().toString() + '5',
          username: 'سارة',
          message: 'قام سارة بمشاركة بثك',
          timestamp: new Date(),
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          level: 25,
          type: 'system' as const,
        },
      ];
      
      const randomComment = randomComments[Math.floor(Math.random() * randomComments.length)];
      addFloatingComment(randomComment);
    }, 4000);

    return () => clearInterval(commentTimer);
  }, []);

  const addFloatingComment = (comment: ChatMessage) => {
    const animValue = new Animated.Value(0);
    const newFloatingComment = {
      id: comment.id,
      comment,
      animValue
    };
    
    // Add new comment at the beginning (bottom of screen)
    setFloatingComments(prev => {
      const updated = [newFloatingComment, ...prev];
      return updated;
    });
    
    // Animate the banner sliding from left to right for high level users
    if (comment.level && comment.level >= 21 && comment.type === 'join') {
      Animated.sequence([
        // Enter from left to right (3 seconds)
        Animated.timing(animValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        // Wait on right edge (2 seconds)
        Animated.delay(2000),
        // Exit to right side of screen (3 seconds)
        Animated.timing(animValue, {
          toValue: 2,
          duration: 3000,
          useNativeDriver: true,
        })
      ]).start();
    }
    
    // Comments stay visible permanently - no auto-removal
    // Only remove when they reach middle of screen through scrolling
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: 'أنت',
        message: newMessage,
        timestamp: new Date(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
        level: 25,
        type: 'message',
      };
      setChatMessages(prev => [...prev, message]);
      addFloatingComment(message);
      setNewMessage('');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setStreamData(prev => ({
      ...prev,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1
    }));
    
    // Create floating heart animation
    const animValue = new Animated.Value(0);
    const newAnimation = {
      id: Date.now(),
      x: Math.random() * (width - 100) + 50,
      y: height - 200,
      animValue
    };
    
    setLikeAnimations(prev => [...prev, newAnimation]);
    
    // Start animation
    Animated.timing(animValue, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
    
    // Remove animation after 3 seconds
    setTimeout(() => {
      setLikeAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 3000);
  };

  const handleScreenTap = () => {
    handleLike();
  };

  const handleSendGift = (gift: StreamGift) => {
    console.log('Sending gift:', gift);
    setShowGifts(false);
    
    // Add gift to chat as a special message
    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'أنت',
      message: `أرسل ${gift.icon} ${gift.name} إلى المضيف`,
      timestamp: new Date(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      level: 25,
      type: 'gift',
      giftImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=30&h=30&fit=crop',
    };
    setChatMessages(prev => [...prev, giftMessage]);
    addFloatingComment(giftMessage);
    
    // Update likes count
    setStreamData(prev => ({
      ...prev,
      likes: prev.likes + Math.floor(gift.price / 10)
    }));
  };

  const handleMicRequest = () => {
    setShowMicRequest(true);
    console.log('Mic request sent to host');
    // Show confirmation that request was sent
    const message: ChatMessage = {
      id: Date.now().toString(),
      username: 'النظام',
      message: '🎤 تم إرسال طلب الانضمام للمضيف',
      timestamp: new Date(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
    };
    setChatMessages(prev => [...prev, message]);
  };

  const handleCoHostRequest = () => {
    setShowCoHostRequest(true);
    console.log('Co-host request sent');
    const message: ChatMessage = {
      id: Date.now().toString(),
      username: 'النظام',
      message: '👥 تم إرسال طلب المشاركة في الاستضافة',
      timestamp: new Date(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
    };
    setChatMessages(prev => [...prev, message]);
  };

  const handleShowComments = () => {
    // Comments are always visible now, this function is not needed
    // but keeping for compatibility
  };

  const handleMoreOptions = () => {
    setShowMoreOptions(true);
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.chatMessage}>
      <Image source={{ uri: item.avatar }} style={styles.chatAvatar} contentFit='cover' />
      <View style={styles.chatContent}>
        <Text style={styles.chatUsername}>{item.username}</Text>
        <Text style={styles.chatText}>{item.message}</Text>
      </View>
    </View>
  );

  const renderGift = ({ item }: { item: StreamGift }) => (
    <TouchableOpacity 
      style={styles.giftItem}
      onPress={() => handleSendGift(item)}
    >
      <Text style={styles.giftIcon}>{item.icon}</Text>
      <Text style={styles.giftName}>{item.name}</Text>
      <Text style={styles.giftPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Background Stream */}
      <Image 
        source={{ uri: streamData.thumbnail }}
        style={styles.backgroundStream}
        contentFit='cover'
      />
      
      {/* Overlay */}
      <View style={styles.overlay} />
      
      {/* Tap Area for Likes */}
      <TouchableOpacity 
        style={styles.tapArea}
        onPress={handleScreenTap}
        activeOpacity={1}
      />
      
      {/* Top Bar */}
      <View style={styles.statusBar}>
        <View style={styles.leftStatus}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
            testID="close-button"
          >
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
            <TouchableOpacity style={styles.followButtonLarger}>
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
            <Text style={styles.hostNameRightLarger}>{streamData.username}</Text>
            <View style={styles.hostAvatarLarger}>
              <Image 
                source={{ uri: streamData.avatar }}
                style={styles.hostAvatarImageLarger}
                contentFit='cover'
              />
            </View>
          </View>
          <View style={styles.hostStatsUnderAvatar}>
            <Text style={styles.heartEmojiUnderAvatar}>❤️</Text>
            <Text style={styles.heartCountTextUnderAvatar}>{streamData.likes}</Text>
          </View>
        </View>
      </View>
      
      {/* Activities Section - Animated */}
      <View style={styles.activitiesSectionBelowX}>
        <View style={styles.activitiesContent}>
          <View style={styles.activitiesIcon}>
            <Text style={styles.crownIcon}>👑</Text>
          </View>
          <Text style={styles.activitiesTitle}>{activitiesData[activitiesIndex].title}</Text>
          <Text style={styles.activitiesSubtitle}>{activitiesData[activitiesIndex].subtitle}</Text>
        </View>
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
          <Text style={styles.countdownTextSmaller}>59h00m</Text>
          <Text style={styles.hourRatingText}>تصنيف الساعة: 10⭐</Text>
        </View>
      </View>
      
      {/* TikTok-style Floating Comments Overlay - Scrollable */}
      <ScrollView 
        style={styles.floatingCommentsContainer} 
        contentContainerStyle={styles.floatingCommentsContent}
        showsVerticalScrollIndicator={false}
        pointerEvents="box-none"
        scrollEnabled={true}
        bounces={true}
      >
        {floatingComments.slice().reverse().map((floatingComment, index) => {
          // Special handling for level 21+ users
          const isHighLevel = floatingComment.comment.level && floatingComment.comment.level >= 21;
          const isJoinMessage = floatingComment.comment.type === 'join';
          
          if (isHighLevel && isJoinMessage) {
            // Show special banner for high level users - sliding from left to right
            return (
              <View key={floatingComment.id}>
                <Animated.View
                  style={[
                    styles.highLevelJoinBanner,
                    {
                      marginVertical: 8,
                      alignSelf: 'flex-start',
                      transform: [{
                        translateX: floatingComment.animValue.interpolate({
                          inputRange: [0, 1, 2],
                          outputRange: [-width, 0, width],
                        })
                      }]
                    }
                  ]}
                >
                  <Text style={styles.highLevelJoinText}>
                    🔥 {floatingComment.comment.username} انضم 🔥
                  </Text>
                </Animated.View>
                {/* Also show as regular comment */}
                <View style={styles.floatingCommentItem}>
                  <TouchableOpacity
                    style={styles.floatingCommentContent}
                    onPress={() => {
                      if (floatingComment.comment.username !== 'أنت') {
                        setNewMessage(`@${floatingComment.comment.username} `);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.floatingCommentTextContainer}>
                      <Text style={styles.floatingCommentText}>
                        <Text style={styles.floatingCommentUsername}>{floatingComment.comment.username}</Text>
                        {floatingComment.comment.level && (
                          <Text style={styles.floatingCommentLevel}> LV.{floatingComment.comment.level}</Text>
                        )}
                        <Text style={styles.floatingCommentMessage}>: انضم للبث</Text>
                      </Text>
                    </View>
                    <Image 
                      source={{ uri: floatingComment.comment.avatar }} 
                      style={styles.floatingCommentAvatar}
                      contentFit='cover'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
          
          return (
            <View
              key={floatingComment.id}
              style={styles.floatingCommentItem}
            >
              <TouchableOpacity
                style={styles.floatingCommentContent}
                onPress={() => {
                  if (floatingComment.comment.username !== 'أنت') {
                    setNewMessage(`@${floatingComment.comment.username} `);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.floatingCommentTextContainer}>
                  <Text style={styles.floatingCommentText}>
                    <Text style={styles.floatingCommentUsername}>{floatingComment.comment.username}</Text>
                    {floatingComment.comment.level && (
                      <Text style={styles.floatingCommentLevel}> LV.{floatingComment.comment.level}</Text>
                    )}
                    <Text style={styles.floatingCommentMessage}>: {floatingComment.comment.message}</Text>
                  </Text>
                </View>
                <Image 
                  source={{ uri: floatingComment.comment.avatar }} 
                  style={styles.floatingCommentAvatar}
                  contentFit='cover'
                />
                {floatingComment.comment.giftImageUrl && (
                  <Image 
                    source={{ uri: floatingComment.comment.giftImageUrl }} 
                    style={styles.floatingCommentGift}
                    contentFit='cover'
                  />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Chat Messages are now handled by floating comments only */}
      
      {/* Trending Now Banner - Animated Colors */}
      <View style={styles.weeklyUpdatesBannerBelowActivities}>
        <Text style={[styles.weeklyUpdatesText, { backgroundColor: trendingColors[trendingColorIndex] }]}>رائج الآن</Text>
      </View>
      
      {/* Bottom Controls - Viewer Specific - Reversed Order */}
      <View style={styles.viewerBottomControls}>
        <View style={styles.viewerControlsContainer}>
          {/* Co-Host Request */}
          <TouchableOpacity 
            style={styles.viewerControlButton} 
            onPress={handleCoHostRequest}
            testID="co-host-button"
          >
            <View style={styles.controlIconContainer}>
              <Users size={22} color="white" />
            </View>
            <Text style={styles.viewerControlLabel}>Co-Host</Text>
          </TouchableOpacity>
          
          {/* Comment Input - Direct input without send button */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="اكتب تعليق..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              testID="chat-input"
              multiline={false}
            />
          </View>
          
          {/* Gifts */}
          <TouchableOpacity 
            style={styles.viewerControlButton} 
            onPress={() => setShowGifts(true)}
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
            onPress={handleShare}
            testID="share-button"
          >
            <View style={styles.controlIconContainer}>
              <Share size={22} color="white" />
            </View>
            <Text style={styles.viewerControlLabel}>المشاركة</Text>
          </TouchableOpacity>
          
          {/* More Options */}
          <TouchableOpacity 
            style={styles.viewerControlButton} 
            onPress={handleMoreOptions}
            testID="more-options-button"
          >
            <View style={styles.controlIconContainer}>
              <MoreHorizontal size={22} color="white" />
            </View>
            <Text style={styles.viewerControlLabel}>المزيد</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Chat Input is now integrated in bottom controls */}
      
      {/* Floating Hearts Animation */}
      {likeAnimations.map((animation) => (
        <Animated.View 
          key={animation.id}
          style={[
            styles.floatingHeart,
            {
              left: animation.x,
              bottom: animation.y,
              transform: [
                {
                  translateY: animation.animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -300],
                  }),
                },
                {
                  scale: animation.animValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.2, 0.8],
                  }),
                },
              ],
              opacity: animation.animValue.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0.8, 0.6, 0],
              }),
            }
          ]}
        >
          <Heart 
            size={20} 
            color="#FF4444" 
            fill="#FF4444"
          />
        </Animated.View>
      ))}
      
      {/* Gifts Modal */}
      <Modal
        visible={showGifts}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGifts(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.giftsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الهدايا</Text>
              <TouchableOpacity 
                onPress={() => setShowGifts(false)}
                style={styles.modalCloseButton}
                testID="close-gifts-modal"
              >
                <X size={24} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={mockGifts}
              renderItem={renderGift}
              keyExtractor={item => item.id}
              numColumns={4}
              contentContainerStyle={styles.giftsGrid}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
      
      {/* Share Modal */}
      <Modal
        visible={showShare}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShare(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>مشاركة البث</Text>
              <TouchableOpacity 
                onPress={() => setShowShare(false)}
                style={styles.modalCloseButton}
                testID="close-share-modal"
              >
                <X size={24} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.shareSection}>
              <Text style={styles.sectionTitle}>المحادثات الخاصة</Text>
              
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Search size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="البحث عن حساب..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.privateChats}>
                  {filteredChats.map(viewer => (
                    <TouchableOpacity key={viewer.id} style={styles.privateChatItem}>
                      <Image 
                        source={{ uri: viewer.avatar }}
                        style={styles.privateChatAvatar}
                        contentFit='cover'
                      />
                      <Text style={styles.privateChatName}>{viewer.username}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            
            <View style={styles.shareSection}>
              <Text style={styles.sectionTitle}>تطبيقات أخرى</Text>
              <View style={styles.externalApps}>
                <TouchableOpacity style={styles.externalApp}>
                  <Text style={styles.appIcon}>📱</Text>
                  <Text style={styles.appName}>واتساب</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.externalApp}>
                  <Text style={styles.appIcon}>📧</Text>
                  <Text style={styles.appName}>تيليجرام</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.externalApp}>
                  <Text style={styles.appIcon}>📱</Text>
                  <Text style={styles.appName}>تويتر</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.externalApp}>
                  <Text style={styles.appIcon}>📋</Text>
                  <Text style={styles.appName}>نسخ الرابط</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Hosts List Modal */}
      <Modal
        visible={showHostsList}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHostsList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.hostsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المضيفين المتاحين</Text>
              <TouchableOpacity 
                onPress={() => setShowHostsList(false)}
                style={styles.modalCloseButton}
                testID="close-hosts-modal"
              >
                <X size={24} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.hostsListContainer}>
              {mockLiveStreams.map(host => (
                <View key={host.id} style={styles.hostItem}>
                  <Image 
                    source={{ uri: host.avatar }}
                    style={styles.hostItemAvatar}
                    contentFit='cover'
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
                      const message: ChatMessage = {
                        id: Date.now().toString(),
                        username: 'النظام',
                        message: `📨 تم إرسال دعوة انضمام إلى ${host.username}`,
                        timestamp: new Date(),
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
                      };
                      setChatMessages(prev => [...prev, message]);
                      setShowHostsList(false);
                    }}
                  >
                    <Text style={styles.inviteButtonText}>دعوة</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Viewers List Modal */}
      <Modal
        visible={showViewersList}
        transparent
        animationType="slide"
        onRequestClose={() => setShowViewersList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.viewersModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المشاهدين الحاليين</Text>
              <TouchableOpacity 
                onPress={() => setShowViewersList(false)}
                style={styles.modalCloseButton}
                testID="close-viewers-modal"
              >
                <X size={24} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.viewersListContainer}>
              {viewers.map(viewer => (
                <View key={viewer.id} style={styles.viewerItem}>
                  <Image 
                    source={{ uri: viewer.avatar }}
                    style={styles.viewerItemAvatar}
                    contentFit='cover'
                  />
                  <View style={styles.viewerItemInfo}>
                    <Text style={styles.viewerItemName}>{viewer.username}</Text>
                    <Text style={styles.viewerItemStatus}>مشاهد نشط</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.inviteButton}
                    onPress={() => {
                      console.log('إرسال دعوة للمشاهد:', viewer.username);
                      const message: ChatMessage = {
                        id: Date.now().toString(),
                        username: 'النظام',
                        message: `🎤 تم إرسال دعوة انضمام صوتي إلى ${viewer.username}`,
                        timestamp: new Date(),
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
                      };
                      setChatMessages(prev => [...prev, message]);
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
      </Modal>
      
      {/* More Options Modal */}
      <Modal
        visible={showMoreOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMoreOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.moreOptionsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المزيد من الخيارات</Text>
              <TouchableOpacity 
                onPress={() => setShowMoreOptions(false)}
                style={styles.modalCloseButton}
                testID="close-more-options-modal"
              >
                <X size={24} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.moreOptionsContent}>
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setIsMuted(!isMuted);
                  setShowMoreOptions(false);
                }}
              >
                <View style={styles.moreOptionIcon}>
                  {isMuted ? (
                    <VolumeX size={24} color="#FF4444" />
                  ) : (
                    <Volume2 size={24} color={colors.text} />
                  )}
                </View>
                <View style={styles.moreOptionText}>
                  <Text style={styles.moreOptionTitle}>{isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}</Text>
                  <Text style={styles.moreOptionSubtitle}>التحكم في صوت البث</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  handleMicRequest();
                  setShowMoreOptions(false);
                }}
              >
                <View style={styles.moreOptionIcon}>
                  <Mic size={24} color={colors.primary} />
                </View>
                <View style={styles.moreOptionText}>
                  <Text style={styles.moreOptionTitle}>طلب الانضمام بالصوت</Text>
                  <Text style={styles.moreOptionSubtitle}>اطلب من المضيف السماح لك بالتحدث</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  setShowViewersList(true);
                  setShowMoreOptions(false);
                }}
              >
                <View style={styles.moreOptionIcon}>
                  <Users size={24} color={colors.text} />
                </View>
                <View style={styles.moreOptionText}>
                  <Text style={styles.moreOptionTitle}>قائمة المشاهدين</Text>
                  <Text style={styles.moreOptionSubtitle}>عرض جميع المشاهدين الحاليين</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  console.log('Follow host');
                  setShowMoreOptions(false);
                }}
              >
                <View style={styles.moreOptionIcon}>
                  <Heart size={24} color="#FF4444" />
                </View>
                <View style={styles.moreOptionText}>
                  <Text style={styles.moreOptionTitle}>متابعة المضيف</Text>
                  <Text style={styles.moreOptionSubtitle}>تابع لتلقي إشعارات البث</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  console.log('Add to favorites');
                  setShowMoreOptions(false);
                }}
              >
                <View style={styles.moreOptionIcon}>
                  <Text style={styles.favoriteIcon}>⭐</Text>
                </View>
                <View style={styles.moreOptionText}>
                  <Text style={styles.moreOptionTitle}>إضافة للمفضلة</Text>
                  <Text style={styles.moreOptionSubtitle}>احفظ البث في قائمة المفضلة</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.moreOptionItem}
                onPress={() => {
                  console.log('Report stream');
                  setShowMoreOptions(false);
                }}
              >
                <View style={styles.moreOptionIcon}>
                  <Text style={styles.reportIcon}>⚠️</Text>
                </View>
                <View style={styles.moreOptionText}>
                  <Text style={styles.moreOptionTitle}>الإبلاغ عن البث</Text>
                  <Text style={styles.moreOptionSubtitle}>الإبلاغ عن محتوى غير مناسب</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundStream: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hostAvatar: {
    width: 53,
    height: 53,
    borderRadius: 26.5,
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heartCount: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  coinCount: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
    marginTop: -2,
    marginLeft: 4,
  },
  hourRatingContainer: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hourRating: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  activitiesContainer: {
    position: 'absolute',
    top: 75,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activitiesText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  topRightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerAvatars: {
    flexDirection: 'row',
  },
  viewerAvatar: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'transparent',
  },
  viewerCount: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  viewerCountDisplay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewerCountText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingNowContainer: {
    position: 'absolute',
    bottom: 160,
    left: 16,
  },
  trendingButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  trendingText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  chatContainer: {
    position: 'absolute',
    left: 16,
    bottom: 100,
    width: width * 0.75,
    height: 200,
  },
  chatList: {
    flex: 1,
  },
  chatMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  chatContent: {
    flex: 1,
  },
  chatUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  chatText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 18,
  },
  // Tap Area for Likes
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  // New Viewer Bottom Controls - Larger for better comment input
  viewerBottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 10,
    height: 60,
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
    marginBottom: 3,
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
  bottomControlsAtBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 10,
    zIndex: 10,
  },
  leftBottomControls: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
    justifyContent: 'flex-start',
  },
  bottomControlButton: {
    alignItems: 'center',
    gap: 4,
  },
  bottomControlLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
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
  commentsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
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
    color: colors.primary,
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
    color: colors.background,
  },
  sendButton: {
    padding: 6,
  },
  // Floating Hearts Animation
  floatingHeart: {
    position: 'absolute',
    zIndex: 100,
  },
  
  // TikTok-style Floating Comments Overlay - Right side with scrolling
  floatingCommentsContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
    top: height / 2,
    zIndex: 5,
  },
  floatingCommentsContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  floatingCommentItem: {
    marginVertical: 4,
  },
  floatingCommentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 4,
    marginVertical: 2,
    maxWidth: '100%',
    paddingRight: 40,
  },
  // High level join banner - increased size by 20% and slides from left to right
  highLevelJoinBanner: {
    backgroundColor: '#FF8C00',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 0,
    zIndex: 20,
  },
  highLevelJoinText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingCommentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    position: 'absolute',
    right: 0,
  },
  floatingCommentTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  floatingCommentText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontWeight: '600',
    textAlign: 'left',
  },
  floatingCommentUsername: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  floatingCommentLevel: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 13,
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  floatingCommentMessage: {
    color: '#fff',
    fontSize: 16,
  },
  floatingCommentGift: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  // Comment Input Container - Direct input without send button
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 42,
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  giftsModal: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.6,
  },
  shareModal: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  giftsGrid: {
    padding: 20,
  },
  giftItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 6,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    justifyContent: 'center',
  },
  giftIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  giftName: {
    fontSize: 10,
    color: colors.text,
    marginBottom: 3,
    textAlign: 'center',
  },
  giftPrice: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  shareSection: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  privateChats: {
    flexDirection: 'row',
  },
  privateChatItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  privateChatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
  },
  privateChatName: {
    fontSize: 10,
    color: colors.text,
    textAlign: 'center',
  },
  externalApps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  externalApp: {
    alignItems: 'center',
    padding: 16,
  },
  appIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  appName: {
    fontSize: 12,
    color: colors.text,
  },
  
  modalCloseButton: {
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Hosts Modal Styles
  hostsModal: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  hostsListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  hostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hostItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  hostItemInfo: {
    flex: 1,
  },
  hostItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  hostItemTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  hostItemStats: {
    flexDirection: 'row',
    gap: 12,
  },
  hostItemViewers: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  hostItemLikes: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  
  // Viewers Modal Styles
  viewersModal: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.7,
  },
  viewersListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  viewerItemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  viewerItemInfo: {
    flex: 1,
  },
  viewerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  viewerItemStatus: {
    fontSize: 12,
    color: colors.primary,
  },
  
  // Common invite button styles
  inviteButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Additional styles from video stream screen
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
  rightStatus: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
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
  bellButtonSmaller: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 3,
    borderRadius: 6,
  },
  followButtonLarger: {
    backgroundColor: '#8B5CF6',
    padding: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  hostNameRightLarger: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  hostAvatarLarger: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  hostAvatarImageLarger: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
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
  activitiesSectionBelowX: {
    position: 'absolute',
    top: 60,
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
  crownIcon: {
    fontSize: 11,
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
    top: 90,
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
    top: 61,
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
    top: 80,
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
  
  // More Options Modal Styles
  moreOptionsModal: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.6,
  },
  moreOptionsContent: {
    paddingHorizontal: 20,
  },
  moreOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  moreOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moreOptionText: {
    flex: 1,
  },
  moreOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  moreOptionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reportIcon: {
    fontSize: 24,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});