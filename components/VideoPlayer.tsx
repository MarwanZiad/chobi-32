import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Platform,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Plus,
} from 'lucide-react-native';
import { Video as VideoType } from '@/types/video';
import colors from '@/constants/colors';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerProps {
  video: VideoType;
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  onFollow: () => void;
}

export default function VideoPlayer({
  video,
  isActive,
  onLike,
  onComment,
  onFollow,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showHeart, setShowHeart] = useState<boolean>(false);
  const doubleTapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartAnimation = useRef(new Animated.Value(0)).current;
  const [localLiked, setLocalLiked] = useState<boolean>(video.isLiked);
  const [localLikes, setLocalLikes] = useState<number>(video.likes);
  const [localFollowing, setLocalFollowing] = useState<boolean>(video.isFollowing);
  const [hasInteracted, setHasInteracted] = useState<boolean>(Platform.OS !== 'web');
  const [muted, setMuted] = useState<boolean>(Platform.OS === 'web');

  useEffect(() => {
    console.log('[VideoPlayer] isActive changed', { isActive, hasInteracted, platform: Platform.OS });
    if (isActive) {
      if (Platform.OS === 'web') {
        if (hasInteracted) {
          videoRef.current?.playAsync();
          setIsPlaying(true);
        } else {
          videoRef.current?.pauseAsync();
          setIsPlaying(false);
        }
      } else {
        videoRef.current?.playAsync();
        setIsPlaying(true);
      }
    } else {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive, hasInteracted]);

  const handlePlayPause = () => {
    console.log('[VideoPlayer] handlePlayPause', { isPlaying, hasInteracted, platform: Platform.OS });
    if (Platform.OS === 'web' && !hasInteracted) {
      setHasInteracted(true);
      setMuted(false);
      videoRef.current?.playAsync();
      setIsPlaying(true);
      return;
    }
    if (isPlaying) {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = () => {
    if (doubleTapRef.current) {
      clearTimeout(doubleTapRef.current);
      doubleTapRef.current = null;
      
      if (!localLiked) {
        handleLike();
      }
      
      setShowHeart(true);
      Animated.sequence([
        Animated.timing(heartAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(200),
        Animated.timing(heartAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowHeart(false));
    } else {
      doubleTapRef.current = setTimeout(() => {
        handlePlayPause();
        doubleTapRef.current = null;
      }, 300);
    }
  };

  const handleLike = () => {
    setLocalLiked(!localLiked);
    setLocalLikes(localLiked ? localLikes - 1 : localLikes + 1);
    onLike();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `شاهد هذا الفيديو من ${video.user.username}: ${video.description}`,
        url: video.uri,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleFollow = () => {
    setLocalFollowing(!localFollowing);
    onFollow();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleDoubleTap}
        testID="video-touch-overlay"
      >
        <Video
          ref={videoRef}
          source={{ uri: video.uri }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={Platform.OS !== 'web' ? isActive : isActive && hasInteracted}
          isMuted={muted}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if ('isLoaded' in status && status.isLoaded) {
              setIsPlaying(status.isPlaying ?? false);
            }
          }}
        />

        {showHeart && (
          <Animated.View
            style={[
              styles.heartAnimation,
              {
                opacity: heartAnimation,
                transform: [
                  {
                    scale: heartAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
              },
            ]}
          >
            <Heart size={100} color={colors.white} fill={colors.white} />
          </Animated.View>
        )}
        {Platform.OS === 'web' && !hasInteracted && (
          <View style={styles.webPlayOverlay} pointerEvents="none">
            <Text style={styles.webPlayText}>اضغط للتشغيل</Text>
          </View>
        )}
      </TouchableOpacity>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* User Info & Description */}
      <View style={styles.bottomInfo}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => router.push(`/user/${video.user.id}`)}
        >
          <Image source={{ uri: video.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>@{video.user.username}</Text>
          {video.user.verified && <Text style={styles.verified}>✓</Text>}
        </TouchableOpacity>

        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>

        <View style={styles.hashtagsContainer}>
          {video.hashtags.map((tag, index) => (
            <TouchableOpacity key={index}>
              <Text style={styles.hashtag}>{tag} </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.musicInfo}>
          <Music size={14} color={colors.white} />
          <Text style={styles.musicText} numberOfLines={1}>
            {video.music.name} - {video.music.artist}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike} testID="like-button">
          <Heart
            size={32}
            color={localLiked ? '#FF4458' : colors.white}
            fill={localLiked ? '#FF4458' : 'transparent'}
            strokeWidth={2}
          />
          <Text style={styles.actionText}>{formatNumber(localLikes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment} testID="comment-button">
          <MessageCircle size={32} color={colors.white} strokeWidth={2} />
          <Text style={styles.actionText}>{formatNumber(video.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare} testID="share-button">
          <Share2 size={32} color={colors.white} strokeWidth={2} />
          <Text style={styles.actionText}>{formatNumber(video.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Bookmark
            size={32}
            color={video.isSaved ? '#FFD700' : colors.white}
            fill={video.isSaved ? '#FFD700' : 'transparent'}
            strokeWidth={2}
          />
          <Text style={styles.actionText}>{formatNumber(video.saves)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.musicDisc} testID="music-disc">
          <Image source={{ uri: video.music.cover }} style={styles.musicCover} />
        </TouchableOpacity>
      </View>

      {/* Follow Button */}
      {!localFollowing && (
        <TouchableOpacity
          style={styles.followButton}
          onPress={handleFollow}
          testID="follow-button"
        >
          <Plus size={16} color={colors.white} strokeWidth={3} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: colors.background,
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 80,
    left: 12,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  verified: {
    color: '#20D5EC',
    fontSize: 14,
    marginLeft: 4,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  hashtag: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  musicText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 6,
    maxWidth: 180,
  },
  actions: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  musicDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: 20,
  },
  musicCover: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  followButton: {
    position: 'absolute',
    right: 12,
    bottom: 440,
    backgroundColor: '#FF4458',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  webPlayText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
});