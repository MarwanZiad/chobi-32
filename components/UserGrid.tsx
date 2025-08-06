import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Plus } from "lucide-react-native";
import colors from "@/constants/colors";
import { User } from "@/types/user";
import UserAvatar from "@/components/UserAvatar";
import UserName from "@/components/UserName";

interface UserGridProps {
  users: User[];
  onFollow: (userId: string) => void;
}

const UserCard: React.FC<{ user: User; onFollow: (userId: string) => void }> = ({ user, onFollow }) => {
  return (
    <View style={styles.userCard}>
      <View style={styles.imageContainer}>
        <UserAvatar 
          userId={user.id}
          imageUrl={user.imageUrl}
          size={120}
          testID={`user-avatar-${user.id}`}
        />
      </View>
      <UserName 
        userId={user.id}
        username={user.username}
        arabicUsername={user.arabicUsername}
        isVerified={user.accountType === 'verified'}
        style={styles.usernameContainer}
        textStyle={styles.username}
        testID={`user-name-${user.id}`}
      />
      <TouchableOpacity 
        style={styles.followButton}
        onPress={() => onFollow(user.id)}
        testID={`follow-button-${user.id}`}
      >
        <Plus color={colors.white} size={16} />
        <Text style={styles.followButtonText}>متابعة</Text>
      </TouchableOpacity>
    </View>
  );
};

const UserGrid: React.FC<UserGridProps> = ({ users, onFollow }) => {
  const renderItem = ({ item }: { item: User }) => (
    <UserCard user={item} onFollow={onFollow} />
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    paddingBottom: 80, // Space for bottom navigation
  },
  userCard: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  usernameContainer: {
    marginBottom: 8,
  },
  username: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "center",
  },
  followButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "80%",
  },
  followButtonText: {
    color: colors.white,
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default UserGrid;