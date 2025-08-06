import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Users, 
  Heart, 
  MessageCircle,
  Share,
  Play,
  UserPlus,
  UserMinus,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '@/constants/colors';
import { getVideosForTab, Video } from '@/mocks/videos';
import { users } from '@/mocks/users';
import { User } from '@/types/user';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      // Find user by ID
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
        setIsFollowing(foundUser.isFollowing);
        
        // Load user's videos
        const videos = getVideosForTab('profile', 12);
        setUserVideos(videos);
      }
    }
  }, [id]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الملف الشخصي</Text>
          <View style={styles.headerActions} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    console.log(`${isFollowing ? 'Unfollowed' : 'Followed'} user:`, user.username);
  };

  const handleMessage = () => {
    console.log('Message user:', user.username);
    router.push(`/chat/${user.id}`);
  };

  const handleVideoPress = (video: Video) => {
    console.log('Video pressed:', video.title);
    // TODO: Navigate to video player
  };

  const renderVideoPost = (video: Video, index: number) => (
    <TouchableOpacity 
      key={video.id} 
      style={styles.postItem}
      onPress={() => handleVideoPress(video)}
    >
      <Image 
        source={{ uri: video.thumbnail }}
        style={styles.postImage}
        contentFit='cover'
      />
      
      {/* Play button overlay */}
      <View style={styles.playOverlay}>
        <Play color={colors.white} size={20} fill={colors.white} />
      </View>
      
      {/* Duration badge */}
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{video.duration}</Text>
      </View>
      
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Heart color={colors.white} size={14} />
            <Text style={styles.statText}>{formatNumber(video.likes)}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle color={colors.white} size={14} />
            <Text style={styles.statText}>{formatNumber(video.comments)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{user.arabicUsername || user.username}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: user.imageUrl }}
              style={styles.profileAvatar}
              contentFit='cover'
            />
            
            <View style={styles.statsContainer}>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{userVideos.length}</Text>
                <Text style={styles.statLabel}>منشور</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{formatNumber(user.followers || 0)}</Text>
                <Text style={styles.statLabel}>متابع</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{formatNumber(Math.floor(Math.random() * 500) + 100)}</Text>
                <Text style={styles.statLabel}>يتابع</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>{user.arabicUsername || user.username}</Text>
              {user.accountType === 'verified' && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.profileUsername}>{user.handle}</Text>
            {user.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
            {user.level && (
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>المستوى {user.level}</Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollowToggle}
            >
              {isFollowing ? (
                <UserMinus color={colors.text} size={16} />
              ) : (
                <UserPlus color={colors.white} size={16} />
              )}
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={handleMessage}
            >
              <MessageSquare color={colors.text} size={16} />
              <Text style={styles.messageButtonText}>رسالة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Videos Grid */}
        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الفيديوهات ({userVideos.length})</Text>
          </View>
          <View style={styles.postsGrid}>
            {userVideos.map(renderVideoPost)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  verifiedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  levelContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  followingButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  followingButtonText: {
    color: colors.text,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  postsSection: {
    flex: 1,
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
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 6,
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
  postOverlay: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
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
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});