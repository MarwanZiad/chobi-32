import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';

interface LiveStream {
  id: string;
  username: string;
  avatar: string;
  isLive: boolean;
  viewerCount?: number;
  type?: 'LIVE' | 'PK' | 'AUDIO';
}

interface LiveStreamsBarProps {
  streams?: LiveStream[];
}

const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    username: 'أحمد',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isLive: true,
    viewerCount: 1250,
    type: 'LIVE',
  },
  {
    id: '2',
    username: 'فاطمة',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isLive: true,
    viewerCount: 890,
    type: 'PK',
  },
  {
    id: '3',
    username: 'محمد',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isLive: true,
    viewerCount: 2100,
    type: 'AUDIO',
  },
  {
    id: '4',
    username: 'سارة',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isLive: true,
    viewerCount: 567,
    type: 'LIVE',
  },
];

export default function LiveStreamsBar({ streams = mockLiveStreams }: LiveStreamsBarProps) {
  const handleStreamPress = (stream: LiveStream) => {
    if (stream.type === 'AUDIO') {
      router.push(`/audio-viewer/${stream.id}`);
    } else {
      router.push(`/live-viewer/${stream.id}`);
    }
  };

  const renderLiveStreamItem = (stream: LiveStream) => (
    <View key={stream.id} style={styles.streamItem}>
      <TouchableOpacity 
        style={styles.streamContainer}
        onPress={() => handleStreamPress(stream)}
      >
        <UserAvatar 
          userId={stream.id}
          imageUrl={stream.avatar}
          size={60}
          testID={`stream-avatar-${stream.id}`}
        />
        {stream.isLive && (
          <View style={[styles.liveIndicator, { backgroundColor: stream.type === 'AUDIO' ? '#8B5CF6' : '#FF4444' }]}>
            <View style={styles.liveIcon} />
            <Text style={styles.liveText}>
              {stream.type === 'AUDIO' ? 'صوتي' : stream.type === 'PK' ? 'PK' : 'LIVE'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <UserName 
        userId={stream.id}
        username={stream.username}
        style={styles.usernameContainer}
        textStyle={styles.streamUsername}
        testID={`stream-username-${stream.id}`}
      />
      {stream.viewerCount && (
        <Text style={styles.viewerCount}>
          {stream.viewerCount > 1000 
            ? `${(stream.viewerCount / 1000).toFixed(1)}k` 
            : stream.viewerCount
          }
        </Text>
      )}
    </View>
  );

  if (streams.length === 0) {
    return null;
  }

  const handleViewAll = () => {
    router.push('/live-streams');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>البث المباشر</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>عرض الكل</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {streams.map(renderLiveStreamItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  streamItem: {
    alignItems: 'center',
    width: 70,
  },
  streamContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  usernameContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.background,
  },
  liveIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 2,
  },
  liveText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  streamUsername: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  viewerCount: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});