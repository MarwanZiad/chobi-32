import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const doubleTapRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartAnimation = useRef(new Animated.Value(0)).current;
  const [localLiked, setLocalLiked] = useState(video.isLiked);
  const [localLikes, setLocalLikes] = useState(video.likes);
  const [localFollowing, setLocalFollowing] = useState(video.isFollowing);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    } else {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
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
      >
        <Video
          ref={videoRef}
          source={{ uri: video.uri }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={isActive}
          isMuted={false}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
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
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart
            size={32}
            color={localLiked ? '#FF4458' : colors.white}
            fill={localLiked ? '#FF4458' : 'transparent'}
            strokeWidth={2}
          />
          <Text style={styles.actionText}>{formatNumber(localLikes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <MessageCircle size={32} color={colors.white} strokeWidth={2} />
          <Text style={styles.actionText}>{formatNumber(video.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
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

        <TouchableOpacity style={styles.musicDisc}>
          <Image source={{ uri: video.music.cover }} style={styles.musicCover} />
        </TouchableOpacity>
      </View>

      {/* Follow Button */}
      {!localFollowing && (
        <TouchableOpacity
          style={styles.followButton}
          onPress={handleFollow}
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
});