import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

interface UserNameProps {
  userId: string;
  username: string;
  arabicUsername?: string;
  isVerified?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  testID?: string;
}

export default function UserName({ 
  userId, 
  username, 
  arabicUsername,
  isVerified = false,
  disabled = false,
  style,
  textStyle,
  testID 
}: UserNameProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!disabled) {
      console.log('Navigating to user profile:', userId);
      router.push(`/user/${userId}`);
    }
  };

  const displayName = arabicUsername || username;

  if (disabled) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        <Text style={[styles.username, textStyle]}>
          {displayName}
        </Text>
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[styles.container, style]}
      testID={testID}
    >
      <Text style={[styles.username, textStyle]}>
        {displayName}
      </Text>
      {isVerified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  verifiedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});