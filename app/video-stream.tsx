import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Heart,
  MessageCircle,
  Share as ShareIcon,
  Users,
  Eye,
  Gift,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Crown,
  Sparkles,
  Send,
  FlipHorizontal,
  UserPlus,
  Plus,
  Image as ImageIcon,
  MoreHorizontal,
  UserCheck,
  Bell,
  Clock,
  Coins,
} from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Animated, SafeAreaView, Image, Share, Alert } from "react-native";
import { useRouter } from "expo-router";
import MediaRoomScreen from './media-room';
import LiveEndedModal from '@/components/LiveEndedModal';
import StreamOptimizationModal from '@/components/StreamOptimizationModal';
import StreamSettingsModal from '@/components/StreamSettingsModal';

// Mock data
const mockTopViewers = [
  { id: 1, name: "سارة", avatar: "س", isVip: true },
  { id: 2, name: "محمد", avatar: "م", isVip: false },
  { id: 3, name: "فاطمة", avatar: "ف", isVip: true },
  { id: 4, name: "علي", avatar: "ع", isVip: false },
  { id: 5, name: "نور", avatar: "ن", isVip: true },
];

const mockChatMessages = [
  { id: 1, user: "سارة", message: "مرحبا! 👋", avatar: "س" },
  { id: 2, user: "محمد", message: "بث رائع! 🔥", avatar: "م" },
  { id: 3, user: "فاطمة", message: "استمر! 💪", avatar: "ف" },
  { id: 4, user: "علي", message: "محتوى مميز", avatar: "ع" },
  { id: 5, user: "نور", message: "رائع جداً! ❤️", avatar: "ن" },
  { id: 6, user: "أحمد", message: "واصل 🔥", avatar: "أ" },
];

const mockGifts = [
  { id: 1, name: "قلب", icon: "❤️", price: 1, category: 'basic' },
  { id: 2, name: "وردة", icon: "🌹", price: 5, category: 'basic' },
  { id: 3, name: "تاج", icon: "👑", price: 99, category: 'premium' },
  { id: 4, name: "نجمة", icon: "⭐", price: 10, category: 'basic' },
  { id: 5, name: "صاروخ", icon: "🚀", price: 199, category: 'premium' },
  { id: 6, name: "ماس", icon: "💎", price: 999, category: 'vip' },
  { id: 7, name: "سيارة", icon: "🚗", price: 2999, category: 'vip' },
  { id: 8, name: "طائرة", icon: "✈️", price: 9999, category: 'vip' },
];

const mockFilters = [
  { id: 1, name: "عادي", value: 'none' },
  { id: 2, name: "جميل", value: 'beauty' },
  { id: 3, name: "دافئ", value: 'warm' },
  { id: 4, name: "بارد", value: 'cool' },
  { id: 5, name: "خمري", value: 'vintage' },
  { id: 6, name: "أبيض وأسود", value: 'bw' },
];

// Mock data for active live hosts
const mockLiveHosts = [
  { id: 1, name: "أحمد محمد", avatar: "أ", title: "بث مباشر - دردشة مع المتابعين", viewers: 2847, type: 'LIVE' },
  { id: 2, name: "فاطمة الزهراء", avatar: "ف", title: "تحدي الطبخ مع صديقتي", viewers: 4521, type: 'LIVE' },
  { id: 3, name: "محمد علي", avatar: "م", title: "جلسة موسيقية هادئة", viewers: 1834, type: 'AUDIO' },
  { id: 4, name: "سارة خالد", avatar: "س", title: "دردشة مسائية ممتعة", viewers: 1890, type: 'LIVE' },
  { id: 5, name: "عبدالله حسن", avatar: "ع", title: "تحدي الألعاب", viewers: 3456, type: 'LIVE' },
  { id: 6, name: "نور الدين", avatar: "ن", title: "بودكاست مباشر", viewers: 987, type: 'AUDIO' },
  { id: 7, name: "ليلى أحمد", avatar: "ل", title: "جلسة رسم مباشرة", viewers: 2134, type: 'LIVE' },
  { id: 8, name: "يوسف محمود", avatar: "ي", title: "مناقشة رياضية", viewers: 5678, type: 'LIVE' },
];

// Mock data for current viewers in the stream
const mockCurrentViewers = [
  { id: 1, name: "سارة أحمد", avatar: "س", level: 25, isVip: true },
  { id: 2, name: "محمد علي", avatar: "م", level: 18, isVip: false },
  { id: 3, name: "فاطمة حسن", avatar: "ف", level: 32, isVip: true },
  { id: 4, name: "علي محمود", avatar: "ع", level: 12, isVip: false },
  { id: 5, name: "نور الهدى", avatar: "ن", level: 28, isVip: true },
  { id: 6, name: "أحمد سالم", avatar: "أ", level: 15, isVip: false },
  { id: 7, name: "مريم خالد", avatar: "م", level: 22, isVip: true },
  { id: 8, name: "حسن عبدالله", avatar: "ح", level: 19, isVip: false },
  { id: 9, name: "زينب محمد", avatar: "ز", level: 35, isVip: true },
  { id: 10, name: "خالد أحمد", avatar: "خ", level: 14, isVip: false },
];

function VideoStreamScreen() {
  const router = useRouter();
  const [viewerCount, setViewerCount] = useState(1247);
  const [streamDuration, setStreamDuration] = useState(219); // 3h59m
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showGiftsModal, setShowGiftsModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [showHostsModal, setShowHostsModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [showMediaRoomModal, setShowMediaRoomModal] = useState(false);
  const [showLiveEndedModal, setShowLiveEndedModal] = useState(false);
  const [showStreamSettingsModal, setShowStreamSettingsModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
  const [floatingHearts, setFloatingHearts] = useState<Array<{id: number, left: number}>>([]);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [isBeautyMode, setIsBeautyMode] = useState(false);
  const [countdownTime, setCountdownTime] = useState(3540); // 59 minutes in seconds
  const [activitiesIndex, setActivitiesIndex] = useState(0);
  const [trendingColorIndex, setTrendingColorIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [heartCount, setHeartCount] = useState(100);
  const [coinsCount, setCoinsCount] = useState(10000);
  const [selectedGiftCategory, setSelectedGiftCategory] = useState<'basic' | 'premium' | 'vip'>('basic');
  const [giftAnimation, setGiftAnimation] = useState<{id: number, gift: string, x: number, y: number} | null>(null);
  const activitiesRef = useRef<any>(null);
  const trendingRef = useRef<any>(null);

  // Activities data for animation
  const activitiesData = [
    { title: "الفعالية واليوميات", subtitle: "انضم الآن" },
    { title: "تحدي اليوم", subtitle: "شارك الآن" },
    { title: "مسابقة الأسبوع", subtitle: "اربح جوائز" },
    { title: "بطولة الشهر", subtitle: "سجل الآن" },
  ];

  // Trending colors
  const trendingColors = ['#ff4757', '#2196F3', '#9C27B0', '#E91E63'];

  useEffect(() => {
    const timer = setInterval(() => {
      setStreamDuration(prev => prev + 1);
      setCountdownTime(prev => Math.max(0, prev - 1));
      if (Math.random() > 0.7) {
        setViewerCount(prev => Math.max(1, prev + Math.floor(Math.random() * 10) - 5));
      }
      if (Math.random() > 0.85) {
        addFloatingHeart();
      }
    }, 1000);

    return () => clearInterval(timer);
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m`;
  };

  const addFloatingHeart = () => {
    const id = Date.now() + Math.random();
    const newHeart = { id, left: Math.random() * 100 };
    setFloatingHearts(prev => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== id));
    }, 3000);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        user: "أنت",
        message: chatMessage,
        avatar: "أ",
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  const handleSendGift = (gift: typeof mockGifts[0]) => {
    // Check if user has enough coins
    if (coinsCount < gift.price) {
      Alert.alert('رصيد غير كافي', 'ليس لديك عملات كافية لإرسال هذه الهدية');
      return;
    }
    
    // Deduct coins
    setCoinsCount(prev => prev - gift.price);
    
    // Add hearts based on gift value
    const heartsToAdd = Math.min(gift.price / 10, 50);
    setHeartCount(prev => prev + Math.floor(heartsToAdd));
    
    // Show gift animation
    const animationId = Date.now();
    setGiftAnimation({
      id: animationId,
      gift: gift.icon,
      x: Math.random() * 80 + 10,
      y: 50
    });
    
    // Remove animation after 3 seconds
    setTimeout(() => {
      setGiftAnimation(null);
    }, 3000);
    
    // Add floating hearts
    for (let i = 0; i < Math.min(gift.price / 100, 10); i++) {
      setTimeout(() => addFloatingHeart(), i * 200);
    }
    
    // Add gift message to chat
    const giftMessage = {
      id: Date.now(),
      user: "أنت",
      message: `أرسل ${gift.name} ${gift.icon}`,
      avatar: "أ",
    };
    setChatMessages(prev => [...prev, giftMessage]);
    
    console.log(`Gift sent: ${gift.name} for ${gift.price} coins`);
    setShowGiftsModal(false);
  };

  const handleCloseStream = () => {
    console.log('X button pressed - showing live ended modal');
    setShowLiveEndedModal(true);
  };

  const handleLiveEndedClose = () => {
    setShowLiveEndedModal(false);
    router.back();
  };

  const mockStreamData = {
    startTime: '14:30',
    endTime: '16:45',
    duration: '2h 15m',
    earnings: '1,250 ج.م',
    viewers: 1247,
    newFollowers: 89,
    supporters: 156,
    pcu: 892,
    comments: 2341
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Arabic Calligraphy Background - Fullscreen */}
      <Image 
        source={{ uri: 'https://r2-pub.chobi.com/attachments/l3xh0xzicaab3a8fapoqm' }}
        style={styles.arabicCalligraphyBackground}
        resizeMode="cover"
      />
      
      {/* Video Background */}
      <View style={styles.videoBackground}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoPlaceholderText}>محتوى البث المباشر هنا</Text>
        </View>
      </View>

      {/* Top Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.leftStatus}>
          <TouchableOpacity onPress={handleCloseStream} style={styles.closeButton}>
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
            <TouchableOpacity 
              style={[styles.bellButtonSmaller, notificationsEnabled && styles.bellButtonActive]}
              onPress={() => {
                setNotificationsEnabled(!notificationsEnabled);
                console.log('Notifications:', !notificationsEnabled ? 'enabled' : 'disabled');
              }}
            >
              <Bell size={8} color={notificationsEnabled ? "#ffd700" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.followButtonLarger, isFollowing && styles.followButtonActive]}
              onPress={() => {
                setIsFollowing(!isFollowing);
                console.log('Follow status:', !isFollowing ? 'following' : 'unfollowed');
              }}
            >
              {isFollowing ? (
                <UserCheck size={8} color="white" />
              ) : (
                <Plus size={8} color="white" />
              )}
            </TouchableOpacity>
            <Text style={styles.hostNameRightLarger}>Marwan</Text>
            <View style={styles.hostAvatarLarger}>
              <Text style={styles.hostAvatarTextLarger}>👤</Text>
            </View>
          </View>
          <View style={styles.hostStatsUnderAvatar}>
            <Text style={styles.heartEmojiUnderAvatar}>❤️</Text>
            <Text style={styles.heartCountTextUnderAvatar}>{heartCount}</Text>
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
            <Text style={styles.coinsText}>{coinsCount.toLocaleString()}</Text>
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



      {/* Bottom Controls */}
      <View style={styles.bottomControlsAtBottom}>
        <View style={styles.leftBottomControls}>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => setShowStreamSettingsModal(true)}>
            <MoreHorizontal size={18} color="white" />
            <Text style={styles.bottomControlLabel}>المزيد</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomControlButton}
            onPress={async () => {
              try {
                const result = await Share.share({
                  message: 'شاهد البث المباشر معي! 🎥\n\nانضم إلى البث المباشر الآن',
                  title: 'مشاركة البث المباشر'
                });
                if (result.action === Share.sharedAction) {
                  console.log('Shared successfully');
                }
              } catch (error) {
                console.error('Share error:', error);
              }
            }}
          >
            <ShareIcon size={18} color="white" />
            <Text style={styles.bottomControlLabel}>المشاركة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => setShowMediaRoomModal(true)}>
            <ImageIcon size={18} color="white" />
            <Text style={styles.bottomControlLabel}>الوسائط</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => setShowOptimizationModal(true)}>
            <Sparkles size={18} color="white" />
            <Text style={styles.bottomControlLabel}>تحسين</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentsButton} onPress={() => setShowChatModal(true)}>
            <Text style={styles.commentsButtonText}>التعليقات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => setShowGuestsModal(true)}>
            <UserCheck size={18} color="white" />
            <Text style={styles.bottomControlLabel}>ضيوف</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => setShowHostsModal(true)}>
            <UserPlus size={18} color="white" />
            <Text style={styles.bottomControlLabel}>المضيفين</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Modal */}
      <Modal visible={showChatModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الدردشة المباشرة</Text>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.chatModalContent}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={styles.chatModalMessage}>
                  <View style={styles.chatModalAvatar}>
                    <Text style={styles.chatModalAvatarText}>{msg.avatar}</Text>
                  </View>
                  <View style={styles.chatModalMessageContent}>
                    <Text style={styles.chatModalUser}>{msg.user}</Text>
                    <Text style={styles.chatModalText}>{msg.message}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.chatInputContainer}>
              <TextInput
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder="اكتب رسالة..."
                style={styles.chatInput}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Send size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Gifts Modal */}
      <Modal visible={showGiftsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إرسال هدية</Text>
              <TouchableOpacity onPress={() => setShowGiftsModal(false)}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.giftsGrid}>
              {mockGifts.map((gift) => (
                <TouchableOpacity key={gift.id} onPress={() => handleSendGift(gift)} style={styles.giftItem}>
                  <Text style={styles.giftIcon}>{gift.icon}</Text>
                  <Text style={styles.giftName}>{gift.name}</Text>
                  <Text style={styles.giftPrice}>{gift.price} 💎</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Effects Modal */}
      <Modal visible={showEffectsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الفلاتر والتأثيرات</Text>
              <TouchableOpacity onPress={() => setShowEffectsModal(false)}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.effectsContent}>
              <Text style={styles.sectionTitle}>الفلاتر</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                {mockFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => { setSelectedFilter(filter.value); setShowEffectsModal(false); }}
                    style={[
                      styles.filterItem,
                      selectedFilter === filter.value && styles.filterItemActive
                    ]}
                  >
                    <Text style={styles.filterText}>{filter.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.sectionTitle}>التأثيرات</Text>
              <TouchableOpacity
                onPress={() => setIsBeautyMode(!isBeautyMode)}
                style={[styles.beautyButton, isBeautyMode && styles.beautyButtonActive]}
              >
                <Sparkles size={20} color={isBeautyMode ? "white" : "#333"} />
                <Text style={[styles.beautyText, isBeautyMode && styles.beautyTextActive]}>وضع الجمال</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettingsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إعدادات البث</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.settingsContent}>
              <TouchableOpacity style={styles.settingItem}>
                <Video size={20} color="#333" />
                <Text style={styles.settingText}>جودة الفيديو</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Mic size={20} color="#333" />
                <Text style={styles.settingText}>إعدادات الصوت</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Users size={20} color="#333" />
                <Text style={styles.settingText}>إدارة المشاهدين</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hosts Modal - Active Live Streams */}
      <Modal visible={showHostsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المضيفين - البثوث المباشرة</Text>
              <TouchableOpacity onPress={() => setShowHostsModal(false)}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.hostsContent}>
              {mockLiveHosts.map((host) => (
                <View key={host.id} style={styles.hostItem}>
                  <View style={styles.modalHostInfo}>
                    <View style={styles.hostAvatar}>
                      <Text style={styles.hostAvatarText}>{host.avatar}</Text>
                    </View>
                    <View style={styles.hostDetails}>
                      <Text style={styles.hostName}>{host.name}</Text>
                      <Text style={styles.hostStatus}>{host.title}</Text>
                      <View style={styles.hostStats}>
                        <Text style={styles.hostViewers}>{host.viewers} مشاهد</Text>
                        <View style={[styles.liveIndicator, { backgroundColor: host.type === 'AUDIO' ? '#8B5CF6' : '#FF4444' }]}>
                          <Text style={styles.liveText}>{host.type === 'AUDIO' ? 'صوتي' : 'LIVE'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.inviteButton}
                    onPress={() => {
                      console.log(`دعوة مرسلة إلى ${host.name}`);
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
      </Modal>

      {/* Guests Modal - Current Viewers */}
      <Modal visible={showGuestsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الضيوف - المشاهدين الحاليين</Text>
              <TouchableOpacity onPress={() => setShowGuestsModal(false)}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.guestsContent}>
              {mockCurrentViewers.map((viewer) => (
                <View key={viewer.id} style={styles.guestItem}>
                  <View style={styles.guestInfo}>
                    <View style={styles.guestAvatar}>
                      <Text style={styles.guestAvatarText}>{viewer.avatar}</Text>
                    </View>
                    <View style={styles.guestDetails}>
                      <Text style={styles.guestName}>{viewer.name}</Text>
                      <View style={styles.guestStats}>
                        <Text style={styles.guestLevel}>المستوى {viewer.level}</Text>
                        {viewer.isVip && (
                          <View style={styles.vipBadge}>
                            <Crown size={12} color="#ffd700" />
                            <Text style={styles.vipText}>VIP</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.inviteButton}
                    onPress={() => {
                      console.log(`دعوة مرسلة إلى ${viewer.name}`);
                      setShowGuestsModal(false);
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

      {/* Media Room Modal */}
      <MediaRoomScreen 
        visible={showMediaRoomModal} 
        onClose={() => setShowMediaRoomModal(false)} 
      />

      {/* Stream Optimization Modal */}
      <StreamOptimizationModal 
        visible={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
      />

      {/* Live Ended Modal */}
      <LiveEndedModal 
        visible={showLiveEndedModal}
        onClose={handleLiveEndedClose}
        streamData={mockStreamData}
      />

      {/* Stream Settings Modal */}
      <StreamSettingsModal 
        visible={showStreamSettingsModal}
        onClose={() => setShowStreamSettingsModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arabicCalligraphyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 2,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
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
  timeDisplay: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  viewerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 6,
  },
  viewerAvatarLarger: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 6,
  },
  viewerAvatarLargerNoBackground: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    marginRight: 6,
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
  viewerAvatarText: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
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
  hostStatsUnderName: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 2,
    gap: 4,
  },
  hostStatsDirectlyUnderName: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 2,
    gap: 2,
  },
  hostStatsUnderW: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    top: 42,
    gap: 1,
  },
  hostStatsUnderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 60,
    top: 30,
    gap: 1,
  },
  hostStatsUnderNameMoved: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: -2,
    gap: 4,
  },
  hostStatsUnderFollowButton: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 2,
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },
  statsRowUnderName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heartCountTextLarge: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartEmojiLarge: {
    fontSize: 16,
  },
  coinsTextLarge: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinsEmojiLarge: {
    fontSize: 16,
  },
  heartCountTextSmall: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heartCountTextSmaller: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heartEmojiSmall: {
    fontSize: 14,
  },
  heartEmojiSmaller: {
    fontSize: 12,
  },
  heartEmojiUnderName: {
    fontSize: 14,
  },
  heartCountTextUnderName: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heartEmojiDirectlyUnderName: {
    fontSize: 14,
  },
  heartCountTextDirectlyUnderName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heartEmojiUnderW: {
    fontSize: 12,
  },
  heartCountTextUnderW: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heartEmojiUnderAvatar: {
    fontSize: 12,
  },
  heartCountTextUnderAvatar: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coinsTextSmall: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  coinsEmojiSmall: {
    fontSize: 14,
  },
  followButton: {
    backgroundColor: '#007AFF',
    padding: 4,
    borderRadius: 8,
  },
  followButtonSmaller: {
    backgroundColor: '#007AFF',
    padding: 3,
    borderRadius: 6,
  },
  followButtonLarger: {
    backgroundColor: '#8B5CF6',
    padding: 4,
    borderRadius: 6,
  },

  bellButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
    borderRadius: 8,
  },
  bellButtonSmaller: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 3,
    borderRadius: 6,
  },
  bellButtonActive: {
    backgroundColor: '#ffd700',
  },
  followButtonActive: {
    backgroundColor: '#00ff00',
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heartCountBelow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  heartCountCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  heartCountCenterText: {
    color: '#ff4757',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heartEmojiCenter: {
    fontSize: 12,
  },
  heartEmoji: {
    fontSize: 12,
  },
  coinsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  coinsEmoji: {
    fontSize: 12,
  },
  hostNameRight: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  hostNameRightLarger: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostAvatarLarger: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hostAvatarTextLarger: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hostName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  heartCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  heartCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  viewerCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewerCountCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    right: -30,
    top: 0,
  },
  viewerCountCircleBetween: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    right: -60,
    top: 0,
  },
  viewerCountCircleLeft: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    left: -40,
    top: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewerCountCircleLeftSpaced: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    left: -60,
    top: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewerCountLeft: {
    color: 'white',
    fontSize: 10,
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
  weeklyUpdatesBanner: {
    position: 'absolute',
    top: 130,
    left: 16,
    zIndex: 10,
  },
  weeklyUpdatesBannerMoved: {
    position: 'absolute',
    top: 150,
    left: 16,
    zIndex: 10,
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
  activitiesSection: {
    position: 'absolute',
    top: 110,
    left: 0,
    zIndex: 10,
  },
  activitiesSectionMoved: {
    position: 'absolute',
    top: 90,
    left: 0,
    zIndex: 10,
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
  hourRatingSection: {
    position: 'absolute',
    top: 100,
    right: 0,
    zIndex: 10,
  },
  hourRatingSectionMoved: {
    position: 'absolute',
    top: 80,
    right: 0,
    zIndex: 10,
  },
  hourRatingSectionMovedUp: {
    position: 'absolute',
    top: 70,
    right: 0,
    zIndex: 10,
  },
  hourRatingSectionMovedDown: {
    position: 'absolute',
    top: 110,
    right: 0,
    zIndex: 10,
  },
  hourRatingBelowProfile: {
    position: 'absolute',
    top: 80,
    right: 0,
    zIndex: 10,
  },
  coinsDisplay: {
    position: 'absolute',
    top: 80,
    right: 0,
    zIndex: 10,
  },
  coinsDisplayMovedUp: {
    position: 'absolute',
    top: 52,
    right: 16,
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
  hourRatingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hourRatingText: {
    color: '#ffd700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hourRatingWithCountdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
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
  countdownText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  countdownTextSmaller: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
  },


  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    zIndex: 10,
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


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatModalContent: {
    flex: 1,
    padding: 16,
    maxHeight: '60%',
  },
  chatModalMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
    gap: 12,
  },
  chatModalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatModalAvatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatModalMessageContent: {
    flex: 1,
  },
  chatModalUser: {
    color: '#eab308',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatModalText: {
    color: '#333',
    fontSize: 14,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  giftItem: {
    width: '22%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  giftIcon: {
    fontSize: 32,
  },
  giftName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    color: '#333',
  },
  giftPrice: {
    fontSize: 12,
    color: '#eab308',
    marginTop: 2,
  },
  effectsContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterItem: {
    width: 64,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterItemActive: {
    borderColor: '#ef4444',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  beautyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    gap: 8,
  },
  beautyButtonActive: {
    backgroundColor: '#ef4444',
  },
  beautyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  beautyTextActive: {
    color: 'white',
  },
  settingsContent: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  // Hosts Modal Styles
  hostsContent: {
    maxHeight: '70%',
    padding: 16,
  },
  hostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  modalHostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hostDetails: {
    marginLeft: 12,
    flex: 1,
  },
  hostStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  hostStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  hostViewers: {
    fontSize: 11,
    color: '#888',
  },
  liveIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  inviteButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  inviteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Guests Modal Styles
  guestsContent: {
    maxHeight: '70%',
    padding: 16,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestDetails: {
    marginLeft: 12,
    flex: 1,
  },
  guestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  guestStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  guestLevel: {
    fontSize: 11,
    color: '#888',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  vipText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default VideoStreamScreen;