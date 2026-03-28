import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Edit3, 
  Users, 
  Heart, 
  MessageCircle,
  Share,
  Settings,
  Play,
  Shield,
  Bell,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { getVideosForTab, Video } from '@/mocks/videos';
import { useAuth } from '@/hooks/use-auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, formatNumber } = useAuth();
  const [userVideos, setUserVideos] = useState<Video[]>([]);

  useEffect(() => {
    const videos = getVideosForTab('profile', 12);
    setUserVideos(videos);
  }, []);

  const currentUser = {
    id: user?.id || 'current-user',
    name: user?.name || 'مروان',
    username: user?.username || '@marwan',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    bio: user?.bio || 'مطور تطبيقات | محب للتكنولوجيا',
    followers: user?.followers || 1250,
    following: user?.following || 890,
    posts: user?.posts || 45,
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
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{currentUser.name}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Share color={colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/settings')}
            testID="settings-button"
          >
            <Settings color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: currentUser.avatar }}
              style={styles.profileAvatar}
              contentFit='cover'
            />
            
            <View style={styles.statsContainer}>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                <Text style={styles.statLabel}>منشور</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                <Text style={styles.statLabel}>متابع</Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statNumber}>{currentUser.following}</Text>
                <Text style={styles.statLabel}>يتابع</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileUsername}>{currentUser.username}</Text>
            <Text style={styles.profileBio}>{currentUser.bio}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Edit3 color={colors.text} size={16} />
              <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
              testID="profile-settings-button"
            >
              <Settings color={colors.text} size={16} />
            </TouchableOpacity>
          </View>

          {/* Quick Settings */}
          <View style={styles.quickSettings}>
            <TouchableOpacity 
              style={styles.quickSettingItem}
              onPress={() => router.push('/privacy-settings')}
            >
              <Shield color={colors.primary} size={20} />
              <Text style={styles.quickSettingText}>الخصوصية والأمان</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickSettingItem}
              onPress={() => router.push('/activities')}
            >
              <Bell color={colors.primary} size={20} />
              <Text style={styles.quickSettingText}>النشاطات والإشعارات</Text>
              <ChevronRight color={colors.textSecondary} size={16} />
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
  shareButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingsButton: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSettings: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickSettingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 12,
  },
});