import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Play, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Video } from '@/mocks/videos';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';

interface VideoGridProps {
  videos: Video[];
  onVideoPress?: (video: Video) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
const cardHeight = cardWidth * 1.5;

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onVideoPress }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const renderVideoCard = (video: Video) => (
    <TouchableOpacity 
      key={video.id} 
      style={styles.videoCard}
      onPress={() => onVideoPress?.(video)}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
          contentFit='cover'
        />
        
        {/* Play button overlay */}
        <View style={styles.playOverlay}>
          <Play color={colors.white} size={24} fill={colors.white} />
        </View>
        
        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        
        {/* Views badge */}
        <View style={styles.viewsBadge}>
          <Text style={styles.viewsText}>
            {formatNumber(video.views)} مشاهدة
          </Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <View style={styles.authorInfo}>
          <UserAvatar 
            userId={video.author.id}
            imageUrl={video.author.avatar}
            size={24}
            testID={`video-author-avatar-${video.id}`}
          />
          <View style={styles.textInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
            <UserName 
              userId={video.author.id}
              username={video.author.name}
              isVerified={video.author.isVerified}
              textStyle={styles.authorName}
              testID={`video-author-name-${video.id}`}
            />
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal color={colors.textSecondary} size={16} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Heart color={colors.textSecondary} size={14} />
            <Text style={styles.statText}>{formatNumber(video.likes)}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle color={colors.textSecondary} size={14} />
            <Text style={styles.statText}>{formatNumber(video.comments)}</Text>
          </View>
          <View style={styles.statItem}>
            <Share color={colors.textSecondary} size={14} />
            <Text style={styles.statText}>{formatNumber(video.shares)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.videosGrid}>
        {videos.map(renderVideoCard)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  videoCard: {
    width: cardWidth,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
    height: cardHeight * 0.7,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  viewsBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  viewsText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  textInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 16,
    marginBottom: 4,
  },

  authorName: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },

  moreButton: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default VideoGrid;