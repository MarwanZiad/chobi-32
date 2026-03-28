import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

interface UserAvatarProps {
  userId: string;
  imageUrl: string;
  size?: number;
  disabled?: boolean;
  testID?: string;
}

export default function UserAvatar({ 
  userId, 
  imageUrl, 
  size = 40, 
  disabled = false,
  testID 
}: UserAvatarProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!disabled) {
      console.log('Navigating to user profile:', userId);
      router.push(`/user/${userId}`);
    }
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (disabled) {
    return (
      <Image 
        source={{ uri: imageUrl }}
        style={[styles.avatar, avatarStyle]}
        contentFit='cover'
        testID={testID}
      />
    );
  }

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.container}
      testID={testID}
    >
      <Image 
        source={{ uri: imageUrl }}
        style={[styles.avatar, avatarStyle]}
        contentFit='cover'
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
  },
  avatar: {
    backgroundColor: colors.surface,
  },
});