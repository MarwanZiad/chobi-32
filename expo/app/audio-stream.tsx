import React, { useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, TextInput, ScrollView, Alert, Share as RNShare } from "react-native";
import { 
  X, 
  Mic, 
  MicOff,
  Heart,
  Flame,
  User,
  Share,
  Gift,
  Settings,
  Plus,
  SmilePlus,
  MessageCircle,
  UserMinus,
  Ban,
  UserPlus,
  Filter,
  Volume2,
  Music,
  Sparkles,
  Sliders,
  Bell,
  Crown,
  MoreHorizontal,
  Image as ImageIcon,
  UserCheck,
  Send
} from "lucide-react-native";
import { useRouter } from "expo-router";
import LiveEndedModal from '@/components/LiveEndedModal';
import StreamSettingsModal from '@/components/StreamSettingsModal';

export default function AudioStreamScreen() {
  const router = useRouter();
  const [viewerCount] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<{id: string, user: string, text: string}[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [commentsEnabled, setCommentsEnabled] = useState<boolean>(true);
  const [showGifts, setShowGifts] = useState<boolean>(false);
  const [showStreamSettings, setShowStreamSettings] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showEffects, setShowEffects] = useState<boolean>(false);
  const [showSoundControls, setShowSoundControls] = useState<boolean>(false);
  const [showMediaRoomModal, setShowMediaRoomModal] = useState<boolean>(false);
  const [showLiveEndedModal, setShowLiveEndedModal] = useState<boolean>(false);
  const [showStreamSettingsModal, setShowStreamSettingsModal] = useState<boolean>(false);
  const commentIdRef = useRef<number>(0);
  
  const handleClose = useCallback(() => {
    console.log('X button pressed - showing live ended modal');
    setShowLiveEndedModal(true);
  }, []);

  const handleCloseWithConfirmation = useCallback(() => {
    setShowLiveEndedModal(true);
  }, []);

  const handleLiveEndedClose = useCallback(() => {
    setShowLiveEndedModal(false);
    router.back();
  }, [router]);

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

  const handleSubmitComment = useCallback(() => {
    if (comment.trim() && commentsEnabled) {
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
  }, [comment, commentsEnabled]);

  const handleToggleGifts = useCallback(() => {
    setShowGifts(prev => !prev);
  }, []);

  const handleToggleSettings = useCallback(() => {
    setShowStreamSettings(prev => !prev);
  }, []);

  const handleToggleComments = useCallback(() => {
    setCommentsEnabled(prev => {
      const newState = !prev;
      Alert.alert(
        newState ? 'تشغيل التعليقات' : 'إيقاف التعليقات',
        newState ? 'تم تشغيل التعليقات' : 'تم إيقاف التعليقات'
      );
      return newState;
    });
  }, []);

  const handleEmojiPress = useCallback(() => {
    if (commentsEnabled) {
      const emojis = ['😀', '😂', '❤️', '👏', '🔥', '💎', '🎉', '✨'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setComment(prev => prev + randomEmoji);
    } else {
      Alert.alert('تعذر الإضافة', 'التعليقات معطلة حالياً');
    }
  }, [commentsEnabled]);

  const handleToggleCommentsInSettings = useCallback(() => {
    setCommentsEnabled(prev => {
      const newState = !prev;
      Alert.alert(
        newState ? 'تشغيل التعليقات' : 'إيقاف التعليقات',
        newState ? 'تم تشغيل التعليقات' : 'تم إيقاف التعليقات'
      );
      return newState;
    });
    setShowStreamSettings(false);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    setShowStreamSettings(false);
  }, []);

  const headerUsers = [
    { id: 1, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { id: 2, image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { id: 3, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  ];
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Top Status Bar - Exact copy from video-stream.tsx */}
      <View style={styles.statusBar}>
        <View style={styles.leftStatus}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={20} color="white" />
          </TouchableOpacity>
          
          <View style={styles.viewerCountDisplay}>
            <Text style={styles.viewerCountTextStatus}>5.0k</Text>
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
          <View style={styles.hostInfoStatus}>
            <TouchableOpacity style={styles.bellButtonSmaller}>
              <Bell size={8} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.followButtonLarger}>
              <Plus size={8} color="white" />
            </TouchableOpacity>
            <Text style={styles.hostNameRightLarger}>Marwan</Text>
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
          <Text style={styles.activitiesTitle}>الفعالية واليوميات</Text>
          <Text style={styles.activitiesSubtitle}>انضم الآن</Text>
        </View>
      </View>

      {/* Trending Now Banner - Animated Colors */}
      <View style={styles.weeklyUpdatesBannerBelowActivities}>
        <Text style={[styles.weeklyUpdatesText, { backgroundColor: '#ff4757' }]}>رائج الآن</Text>
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

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Host Profile - Smaller */}
        <View style={styles.hostSection}>
          <TouchableOpacity 
            style={styles.hostImageContainer}
            onPress={() => {
              Alert.alert(
                'ملف المضيف الشخصي',
                'mutab.🎸\n\nالمستضيف الحالي للبث الصوتي',
                [{ text: 'موافق' }]
              );
            }}
            testID="host-profile"
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }}
              style={styles.hostImage}
            />
          </TouchableOpacity>
          <Text style={styles.hostNameMain}>mutab.🎸</Text>
          <View style={styles.hostBadge}>
            <User color="#999" size={12} strokeWidth={1.5} />
            <Text style={styles.hostBadgeText}>المستضيف</Text>
          </View>
        </View>

        {/* Mic Grid - Smaller */}
        <View style={styles.micGrid}>
          {/* First row */}
          <View style={styles.micRow}>
            {/* Active user KYAN.🦋 */}
            <View style={styles.micSlot}>
              <TouchableOpacity 
                style={[styles.micButton, styles.activeMicButton]}
                onPress={() => {
                  Alert.alert(
                    'KYAN.🦋',
                    'المستخدم يتحدث الآن\n\nخيارات المتاحة:',
                    [
                      { text: 'إرسال هدية', onPress: () => console.log('Send gift to KYAN') },
                      { text: 'عرض الملف الشخصي', onPress: () => console.log('View KYAN profile') },
                      { text: 'إغلاق', style: 'cancel' }
                    ]
                  );
                }}
                testID="active-mic-user"
              >
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }}
                  style={styles.micUserImage}
                />
              </TouchableOpacity>
              <Text style={styles.micLabel}>KYAN.🦋</Text>
              <View style={styles.giftBadge}>
                <Gift color="#DA70D6" size={8} strokeWidth={1.5} />
                <Text style={styles.giftCount}>0</Text>
              </View>
            </View>
            
            {/* Empty mic slots in first row */}
            {[1, 2, 3].map((index) => (
              <View key={index} style={styles.micSlot}>
                <TouchableOpacity 
                  style={styles.micButton}
                  onPress={() => {
                    Alert.alert(
                      'الانضمام للمحادثة',
                      'هل تريد طلب الانضمام للمحادثة الصوتية؟',
                      [
                        { text: 'إلغاء', style: 'cancel' },
                        { text: 'انضم', onPress: () => {
                          console.log(`Requested to join mic slot ${index}`);
                          Alert.alert('تم الإرسال', 'تم إرسال طلب الانضمام للمضيف');
                        }}
                      ]
                    );
                  }}
                  testID={`join-mic-${index}`}
                >
                  <Mic color="#666" size={18} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.micLabel}>انضم</Text>
              </View>
            ))}
          </View>
          
          {/* Second row - all empty */}
          <View style={styles.micRow}>
            {[4, 5, 6, 7].map((index) => (
              <View key={index} style={styles.micSlot}>
                <TouchableOpacity 
                  style={styles.micButton}
                  onPress={() => {
                    Alert.alert(
                      'الانضمام للمحادثة',
                      'هل تريد طلب الانضمام للمحادثة الصوتية؟',
                      [
                        { text: 'إلغاء', style: 'cancel' },
                        { text: 'انضم', onPress: () => {
                          console.log(`Requested to join mic slot ${index}`);
                          Alert.alert('تم الإرسال', 'تم إرسال طلب الانضمام للمضيف');
                        }}
                      ]
                    );
                  }}
                  testID={`join-mic-${index}`}
                >
                  <Mic color="#666" size={18} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.micLabel}>انضم</Text>
              </View>
            ))}
          </View>
        </View>
      </View>



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

      {/* Stream Settings Modal */}
      {showStreamSettings && (
        <View style={styles.settingsModal}>
          <View style={styles.settingsModalContent}>
            <Text style={styles.settingsModalTitle}>إعدادات البث</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                setShowStreamSettings(false);
                Alert.alert('حظر مستخدم', 'اختر المستخدم المراد حظره');
              }}
            >
              <Ban color="#FF4444" size={20} />
              <Text style={styles.settingText}>حظر مستخدم</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                setShowStreamSettings(false);
                Alert.alert('طرد مستخدم', 'اختر المستخدم المراد طرده');
              }}
            >
              <UserMinus color="#FF6B35" size={20} />
              <Text style={styles.settingText}>طرد مستخدم</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleToggleCommentsInSettings}
            >
              <MessageCircle color={commentsEnabled ? "#00FF88" : "#FF4444"} size={20} />
              <Text style={styles.settingText}>
                {commentsEnabled ? 'إيقاف التعليقات' : 'تشغيل التعليقات'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleToggleMute}
            >
              {isMuted ? (
                <MicOff color="#FF4444" size={20} />
              ) : (
                <Mic color="#00FF88" size={20} />
              )}
              <Text style={styles.settingText}>
                {isMuted ? 'تشغيل الميكروفون' : 'إيقاف الميكروفون'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                setShowStreamSettings(false);
                handleCloseWithConfirmation();
              }}
              testID="end-stream-setting"
            >
              <X color="#FF4444" size={20} />
              <Text style={styles.settingText}>إنهاء البث</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeSettingsModal}
              onPress={() => setShowStreamSettings(false)}
            >
              <X color="white" size={20} strokeWidth={2} />
              <Text style={styles.closeSettingsModalText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Filters Modal */}
      {showFilters && (
        <View style={styles.filtersModal}>
          <View style={styles.filtersModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>فلاتر الصوت</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X color="white" size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filtersGrid}>
              {[
                { name: 'طبيعي', icon: '🎤', active: true },
                { name: 'عميق', icon: '🎭', active: false },
                { name: 'حاد', icon: '✨', active: false },
                { name: 'صدى', icon: '🔊', active: false },
                { name: 'روبوت', icon: '🤖', active: false },
                { name: 'كرتوني', icon: '🎪', active: false }
              ].map((filter, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.filterItem, filter.active && styles.activeFilterItem]}
                  onPress={() => {
                    console.log(`Filter applied: ${filter.name}`);
                    Alert.alert('فلتر الصوت', `تم تطبيق فلتر ${filter.name}`);
                  }}
                >
                  <Text style={styles.filterIcon}>{filter.icon}</Text>
                  <Text style={styles.filterName}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {/* Effects Modal */}
      {showEffects && (
        <View style={styles.effectsModal}>
          <View style={styles.effectsModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>المؤثرات الصوتية</Text>
              <TouchableOpacity onPress={() => setShowEffects(false)}>
                <X color="white" size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.effectsGrid}>
              {[
                { name: 'تصفيق', icon: '👏', sound: 'applause' },
                { name: 'ضحك', icon: '😂', sound: 'laugh' },
                { name: 'طبول', icon: '🥁', sound: 'drums' },
                { name: 'جرس', icon: '🔔', sound: 'bell' },
                { name: 'صافرة', icon: '📯', sound: 'whistle' },
                { name: 'موسيقى', icon: '🎵', sound: 'music' }
              ].map((effect, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.effectItem}
                  onPress={() => {
                    console.log(`Effect played: ${effect.sound}`);
                    Alert.alert('مؤثر صوتي', `تم تشغيل ${effect.name}`);
                  }}
                >
                  <Text style={styles.effectIcon}>{effect.icon}</Text>
                  <Text style={styles.effectName}>{effect.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {/* Sound Controls Modal */}
      {showSoundControls && (
        <View style={styles.soundModal}>
          <View style={styles.soundModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>التحكم في الصوت</Text>
              <TouchableOpacity onPress={() => setShowSoundControls(false)}>
                <X color="white" size={20} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.soundControls}>
              <View style={styles.soundControl}>
                <Text style={styles.soundControlLabel}>مستوى الصوت</Text>
                <View style={styles.sliderContainer}>
                  <Sliders color="#00FF88" size={20} />
                  <View style={styles.slider}>
                    <View style={styles.sliderTrack} />
                    <View style={styles.sliderThumb} />
                  </View>
                  <Text style={styles.sliderValue}>75%</Text>
                </View>
              </View>
              
              <View style={styles.soundControl}>
                <Text style={styles.soundControlLabel}>الباس</Text>
                <View style={styles.sliderContainer}>
                  <Music color="#FFD700" size={20} />
                  <View style={styles.slider}>
                    <View style={styles.sliderTrack} />
                    <View style={styles.sliderThumb} />
                  </View>
                  <Text style={styles.sliderValue}>50%</Text>
                </View>
              </View>
              
              <View style={styles.soundControl}>
                <Text style={styles.soundControlLabel}>الترددات العالية</Text>
                <View style={styles.sliderContainer}>
                  <Volume2 color="#00BFFF" size={20} />
                  <View style={styles.slider}>
                    <View style={styles.sliderTrack} />
                    <View style={styles.sliderThumb} />
                  </View>
                  <Text style={styles.sliderValue}>60%</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetButtonText}>إعادة تعيين</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Bottom Controls - Reversed Order */}
      <View style={styles.bottomControlsAtBottom}>
        <View style={styles.leftBottomControls}>
          <TouchableOpacity 
            style={styles.bottomControlButton}
            onPress={() => {
              setShowStreamSettingsModal(true);
              console.log('Opening stream settings modal');
            }}
          >
            <MoreHorizontal size={18} color="white" />
            <Text style={styles.bottomControlLabel}>المزيد</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={async () => {
            try {
              await RNShare.share({
                message: 'انضم إلي في البث الصوتي المباشر!',
                title: 'مشاركة البث'
              });
            } catch (error) {
              console.log('Share error:', error);
            }
          }}>
            <Share size={18} color="white" />
            <Text style={styles.bottomControlLabel}>المشاركة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => {
            setShowMediaRoomModal(true);
            console.log('Opening media room modal');
          }}>
            <ImageIcon size={18} color="white" />
            <Text style={styles.bottomControlLabel}>الوسائط</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => {
            setShowEffects(true);
            console.log('Opening effects modal');
          }}>
            <Sparkles size={18} color="white" />
            <Text style={styles.bottomControlLabel}>تحسين</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentsButton} onPress={() => {
            Alert.alert('التعليقات', 'نافذة التعليقات مفعلة\n\nيمكنك كتابة التعليقات والتفاعل مع المستمعين');
            console.log('Comments feature activated');
          }}>
            <Text style={styles.commentsButtonText}>التعليقات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => {
            Alert.alert(
              'قائمة الضيوف',
              'المستمعين الحاليين: 5.0k\n\nيمكنك دعوة المستمعين للانضمام للمحادثة الصوتية',
              [
                { text: 'عرض القائمة', onPress: () => console.log('Showing guests list') },
                { text: 'إغلاق', style: 'cancel' }
              ]
            );
          }}>
            <UserCheck size={18} color="white" />
            <Text style={styles.bottomControlLabel}>ضيوف</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomControlButton} onPress={() => {
            Alert.alert(
              'المضيفين المتاحين',
              'يمكنك دعوة مضيفين آخرين للانضمام إلى البث الصوتي',
              [
                { text: 'عرض المضيفين', onPress: () => console.log('Showing hosts list') },
                { text: 'إغلاق', style: 'cancel' }
              ]
            );
          }}>
            <UserPlus size={18} color="white" />
            <Text style={styles.bottomControlLabel}>المضيفين</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 45,
    paddingBottom: 8,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 3,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  viewerCountText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  
  headerUserAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  
  headerAvatarContainer: {
    borderWidth: 1.5,
    borderColor: '#8A2BE2',
    borderRadius: 9,
    padding: 0.5,
  },
  
  headerSmallAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  
  timeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -15 }],
    top: 50,
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  headerAddButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  hostInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  hostNameHeader: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
  },
  
  heartCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  profileImageContainer: {
    borderWidth: 1.5,
    borderColor: '#8A2BE2',
    borderRadius: 9,
    padding: 0.5,
  },
  
  profileImage: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  
  roomCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: 'absolute',
    right: 12,
    top: 85,
    gap: 4,
    zIndex: 5,
  },
  
  roomCategoryText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  
  hostSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  
  hostImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  hostImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  
  hostNameMain: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  
  hostBadgeText: {
    color: '#999',
    fontSize: 13,
    fontWeight: '500',
  },
  
  micGrid: {
    flexDirection: 'column',
    gap: 8,
    width: '90%',
    alignItems: 'center',
  },
  
  micRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  
  micSlot: {
    alignItems: 'center',
    width: 50,
  },
  
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  
  activeMicButton: {
    backgroundColor: '#8A2BE2',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  
  micUserImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  
  micLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  
  giftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(218, 112, 214, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
    marginTop: 4,
  },
  
  giftCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  bottomMessagesOverlay: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    maxHeight: 150,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
  commentsContainer: {
    maxHeight: 100,
    marginTop: 8,
  },
  
  commentItem: {
    flexDirection: 'row',
    marginBottom: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    padding: 4,
    alignSelf: 'flex-start',
  },
  
  commentUser: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 4,
  },
  
  commentText: {
    color: 'white',
    fontSize: 10,
    flex: 1,
  },
  
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: 75,
  },

  bottomNavIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1.2,
    gap: 2,
  },
  
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    minWidth: 32,
  },
  
  navText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
  },

  chatInputWrapper: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 15,
    marginLeft: 10,
  },

  chatInputField: {
    flex: 1,
    color: 'white',
    fontSize: 13,
  },

  chatInputIcon: {
    paddingHorizontal: 10,
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

  // Settings Modal Styles
  settingsModal: {
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

  settingsModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },

  settingsModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    gap: 15,
  },

  settingText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },

  closeSettingsModal: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  closeSettingsModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Filters Modal Styles
  filtersModal: {
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
  
  filtersModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  filterItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  
  activeFilterItem: {
    backgroundColor: 'rgba(0, 191, 255, 0.3)',
    borderWidth: 1,
    borderColor: '#00BFFF',
  },
  
  filterIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  
  filterName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Effects Modal Styles
  effectsModal: {
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
  
  effectsModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  effectItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  
  effectIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  
  effectName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Sound Controls Modal Styles
  soundModal: {
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
  
  soundModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  
  soundControls: {
    gap: 20,
  },
  
  soundControl: {
    gap: 10,
  },
  
  soundControlLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  slider: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  
  sliderTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  
  sliderThumb: {
    position: 'absolute',
    left: '75%',
    width: 16,
    height: 16,
    backgroundColor: '#00FF88',
    borderRadius: 8,
    marginLeft: -8,
  },
  
  sliderValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  
  resetButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  viewerCountTextStatus: {
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
  hostInfoStatus: {
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
  },
  hostAvatarTextLarger: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
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
  chatInputWrapperSeparate: {
    position: 'absolute',
    bottom: 30,
    left: 12,
    right: 12,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  messageInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    color: 'white',
  },
  sendButton: {
    padding: 6,
  },
  

});