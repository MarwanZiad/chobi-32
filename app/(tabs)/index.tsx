import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Text } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import Header from "@/components/Header";
import UserGrid from "@/components/UserGrid";
import VideoGrid from "@/components/VideoGrid";
import BottomNavigation from "@/components/BottomNavigation";
import { useChobiStore } from "@/hooks/use-chobi-store";
import { useNavigation } from "@/hooks/use-app-store";
import colors from "@/constants/colors";
import CreateScreen from "./create";
import { getVideosForTab, Video } from "@/mocks/videos";

interface LiveStream {
  id: string;
  username: string;
  avatar: string;
  title: string;
  type: 'LIVE' | 'PK' | 'AUDIO';
  viewerCount: number;
  likes: number;
  thumbnail: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
const cardHeight = cardWidth * 1.25;

const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    username: 'أحمد محمد الصالح',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    title: 'بث مباشر - دردشة مع المتابعين',
    type: 'LIVE',
    viewerCount: 2847,
    likes: 1523,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
  },
  {
    id: '2',
    username: 'فاطمة الزهراء',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    title: 'تحدي الطبخ PK مع صديقتي',
    type: 'PK',
    viewerCount: 4521,
    likes: 3240,
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
  },
  {
    id: '3',
    username: 'محمد علي حسن',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    title: 'جلسة موسيقية هادئة - أغاني عربية',
    type: 'AUDIO',
    viewerCount: 1234,
    likes: 876,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
  },
  {
    id: '4',
    username: 'سارة خالد أحمد',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    title: 'دردشة مسائية ممتعة مع الأصدقاء',
    type: 'LIVE',
    viewerCount: 1890,
    likes: 1245,
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
  },
  {
    id: '5',
    username: 'عبدالله حسن محمد',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    title: 'تحدي الألعاب PK - من الأقوى؟',
    type: 'PK',
    viewerCount: 3456,
    likes: 2789,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
  },
  {
    id: '6',
    username: 'نور الدين عبدالله',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    title: 'بودكاست مباشر - قصص ملهمة',
    type: 'AUDIO',
    viewerCount: 987,
    likes: 654,
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop',
  },
  {
    id: '7',
    username: 'ليلى أحمد سالم',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    title: 'جلسة رسم مباشرة - تعلم معي',
    type: 'LIVE',
    viewerCount: 2134,
    likes: 1567,
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
  },
  {
    id: '8',
    username: 'يوسف محمود علي',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    title: 'مناقشة رياضية حامية PK',
    type: 'PK',
    viewerCount: 5678,
    likes: 4321,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
  },
  {
    id: '9',
    username: 'مريم سالم أحمد',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    title: 'قراءة شعر مباشرة - أمسية أدبية',
    type: 'AUDIO',
    viewerCount: 756,
    likes: 432,
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  },
  {
    id: '10',
    username: 'خالد عمر حسين',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
    title: 'بث تقنية وبرمجة - تعلم البرمجة',
    type: 'LIVE',
    viewerCount: 3245,
    likes: 2456,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop',
  },
];

export default function HomeScreen() {
  const { 
    users, 
    activeContentTab, 
    setActiveContentTab, 
    followUser 
  } = useChobiStore();
  
  const { activeTab: activeNavTab, setActiveTab: setActiveNavTab } = useNavigation();
  
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadStreams = React.useCallback(() => {
    const shuffled = [...mockLiveStreams]
      .sort(() => 0.5 - Math.random())
      .map(stream => ({
        ...stream,
        viewerCount: stream.viewerCount + Math.floor(Math.random() * 100) - 50,
        likes: stream.likes + Math.floor(Math.random() * 20) - 10
      }));
    setStreams(shuffled.slice(0, 10));
  }, []);

  const loadVideos = React.useCallback(() => {
    const tabVideos = getVideosForTab(activeContentTab, 12);
    setVideos(tabVideos);
  }, [activeContentTab]);

  // Initial load
  useEffect(() => {
    loadStreams();
  }, [loadStreams]);

  // Load videos when tab changes
  useEffect(() => {
    loadVideos();
  }, [activeContentTab]);

  // Reset to home tab when component mounts
  useEffect(() => {
    setActiveNavTab("home");
  }, []);

  const refreshStreams = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadStreams();
      loadVideos();
      setRefreshing(false);
    }, 1000);
  };

  // Auto-refresh streams every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadStreams();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update viewer counts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams(prevStreams => 
        prevStreams.map(stream => ({
          ...stream,
          viewerCount: Math.max(0, stream.viewerCount + Math.floor(Math.random() * 10) - 5),
          likes: Math.max(0, stream.likes + Math.floor(Math.random() * 5))
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTypeLabel = (type: LiveStream['type']) => {
    switch (type) {
      case 'LIVE': return 'LIVE';
      case 'PK': return 'PK';
      case 'AUDIO': return 'لايف صوتي';
    }
  };

  const getTypeColor = (type: LiveStream['type']) => {
    switch (type) {
      case 'LIVE': return '#FF4444';
      case 'PK': return '#FF6B35';
      case 'AUDIO': return '#8B5CF6';
    }
  };

  const handleStreamPress = (stream: LiveStream) => {
    if (stream.type === 'AUDIO') {
      router.push(`/audio-viewer/${stream.id}`);
    } else {
      router.push(`/live-viewer/${stream.id}`);
    }
  };

  const handleVideoPress = (video: Video) => {
    console.log('Video pressed:', video.title);
    // TODO: Navigate to video player
  };

  const renderStreamCard = (stream: LiveStream) => (
    <TouchableOpacity 
      key={stream.id} 
      style={[styles.streamCard, { borderColor: getTypeColor(stream.type) }]}
      onPress={() => handleStreamPress(stream)}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: stream.thumbnail }}
          style={styles.thumbnail}
          contentFit='cover'
        />
        
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(stream.type) }]}>
          <Text style={styles.typeText}>{getTypeLabel(stream.type)}</Text>
        </View>
        
        <View style={styles.viewerBadge}>
          <Text style={styles.viewerText}>
            {stream.viewerCount > 1000 
              ? `${(stream.viewerCount / 1000).toFixed(1)}k` 
              : stream.viewerCount
            }
          </Text>
        </View>
      </View>
      
      <View style={styles.streamInfo}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: stream.avatar }}
            style={styles.avatar}
            contentFit='cover'
          />
          <View style={styles.textInfo}>
            <Text style={styles.username} numberOfLines={1}>{stream.username}</Text>
            <Text style={styles.title} numberOfLines={2}>{stream.title}</Text>
          </View>
        </View>
        
        <View style={styles.stats}>
          <Text style={styles.likes}>
            ❤️ {stream.likes > 1000 
              ? `${(stream.likes / 1000).toFixed(1)}k` 
              : stream.likes
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Show create screen as overlay when create tab is active
  if (activeNavTab === "create") {
    return <CreateScreen />;
  }

  const renderLiveContent = () => (
    <View style={styles.liveContainer}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.streamsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshStreams}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.streamsGrid}>
          {streams.map(renderStreamCard)}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        activeTab={activeContentTab} 
        onTabChange={setActiveContentTab}
        showBackButton={false}
      />
      

      
      {/* Content based on active tab */}
      {activeContentTab === "live" ? (
        renderLiveContent()
      ) : activeContentTab === "forYou" ? (
        <VideoGrid 
          videos={videos}
          onVideoPress={handleVideoPress}
        />
      ) : activeContentTab === "following" ? (
        <VideoGrid 
          videos={videos}
          onVideoPress={handleVideoPress}
        />
      ) : (
        <UserGrid 
          users={users} 
          onFollow={followUser} 
        />
      )}
      
      <BottomNavigation 
        activeTab={activeNavTab} 
        onTabChange={setActiveNavTab} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  liveContainer: {
    flex: 1,
  },
  description: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  legendContainer: {
    marginTop: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  streamsContainer: {
    paddingBottom: 20,
  },
  streamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  streamCard: {
    width: cardWidth,
    height: cardHeight + 90,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 4,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  thumbnailContainer: {
    position: 'relative',
    height: cardHeight,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  typeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  viewerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  viewerText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  streamInfo: {
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  textInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  stats: {
    alignItems: 'flex-end',
  },
  likes: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statColumn: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  profileInfo: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  postsSection: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 1,
  },
  postItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  durationText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  eventsSection: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  discoverSection: {
    padding: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
    gap: 8,
  },
  categoryButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});