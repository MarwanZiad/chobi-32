import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import colors from '@/constants/colors';
import UserAvatar from '@/components/UserAvatar';
import UserName from '@/components/UserName';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed?: boolean;
}

interface StoriesBarProps {
  showAddStory?: boolean;
  currentUserAvatar?: string;
}

const mockStories: Story[] = [
  {
    id: '1',
    username: 'مروان',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    hasStory: true,
    isViewed: false,
  },
  {
    id: '2',
    username: 'أحمد',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    hasStory: true,
    isViewed: true,
  },
  {
    id: '3',
    username: 'فاطمة',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    hasStory: true,
    isViewed: false,
  },
  {
    id: '4',
    username: 'محمد',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    hasStory: true,
    isViewed: false,
  },
  {
    id: '5',
    username: 'سارة',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    hasStory: true,
    isViewed: true,
  },
];

export default function StoriesBar({ showAddStory = false, currentUserAvatar }: StoriesBarProps) {
  const renderStoryItem = (story: Story) => (
    <View key={story.id} style={styles.storyItem}>
      <TouchableOpacity style={[
        styles.storyContainer,
        story.hasStory && !story.isViewed && styles.unviewedStoryBorder,
        story.hasStory && story.isViewed && styles.viewedStoryBorder,
      ]}>
        <UserAvatar 
          userId={story.id}
          imageUrl={story.avatar}
          size={56}
          testID={`story-avatar-${story.id}`}
        />
      </TouchableOpacity>
      <UserName 
        userId={story.id}
        username={story.username}
        style={styles.usernameContainer}
        textStyle={styles.storyUsername}
        testID={`story-username-${story.id}`}
      />
    </View>
  );

  const renderAddStory = () => (
    <TouchableOpacity style={styles.storyItem}>
      <View style={styles.addStoryContainer}>
        <Image 
          source={{ uri: currentUserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' }}
          style={styles.storyAvatar}
          contentFit='cover'
        />
        <View style={styles.addStoryButton}>
          <Plus color={colors.white} size={16} />
        </View>
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        قصتك
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showAddStory && renderAddStory()}
        {mockStories.map(renderStoryItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 70,
  },
  storyContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unviewedStoryBorder: {
    backgroundColor: '#8B5CF6', // Purple color
  },
  viewedStoryBorder: {
    backgroundColor: colors.textSecondary,
  },
  usernameContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.background,
  },
  addStoryContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  storyUsername: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
});