import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from "react-native";
import { Search, Crown, Bell, Mail, X, User, Settings, Radio, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import colors from "@/constants/colors";
import { useChat } from "@/hooks/use-chat-store";
import { useNotificationBadge } from "@/hooks/use-notifications";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, showBackButton = false, onBackPress }) => {
  const router = useRouter();
  const { chats, users, notifications, createChat } = useChat();
  const { unreadCount: notificationUnreadCount, shouldShowBadge } = useNotificationBadge();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Calculate unread counts
  const unreadMessagesCount = chats.reduce((total, chat) => total + chat.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStartChat = async (userId: string) => {
    const chat = await createChat(userId);
    setShowSearch(false);
    setSearchQuery('');
    router.push(`/chat/${chat.id}`);
  };
  
  const handleOpenMessages = () => {
    router.push('/chats');
  };
  
  const handleOpenNotifications = () => {
    router.push('/notifications');
  };
  
  const renderUserItem = ({ item: user }: { item: any }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleStartChat(user.id)}
    >
      <View style={styles.userAvatarContainer}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.userAvatar}
          contentFit='cover'
        />
        {user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userStatus}>
          {user.isOnline ? 'متصل الآن' : 'غير متصل'}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderNotificationItem = ({ item: notification }: { item: any }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationBody}>{notification.body}</Text>
        <Text style={styles.notificationTime}>
          {notification.timestamp.toLocaleTimeString('ar', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.leftIcons}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={onBackPress || (() => router.back())}
            >
              <ArrowLeft color={colors.white} size={24} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setShowSearch(true)}
            >
              <Search color={colors.white} size={24} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Radio color={colors.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/crown-stories')}
          >
            <Crown color={colors.white} size={24} />
          </TouchableOpacity>

        </View>
        
        <Text style={styles.logo}>CHOBI</Text>
        
        <View style={styles.rightIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleOpenNotifications}
          >
            <Bell color={colors.white} size={24} />
            {shouldShowBadge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleOpenMessages}
          >
            <Mail color={colors.white} size={24} />
            {unreadMessagesCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => onTabChange("live")}
          testID="tab-live"
        >
          <Text style={styles.tabText}>قائمة مباشر</Text>
          {activeTab === "live" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => onTabChange("following")}
          testID="tab-following"
        >
          <Text style={styles.tabText}>أتابعه</Text>
          {activeTab === "following" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => onTabChange("forYou")}
          testID="tab-forYou"
        >
          <Text style={styles.tabText}>لك</Text>
          {activeTab === "forYou" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      {/* Search Modal */}
      <Modal
        visible={showSearch}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>البحث عن المستخدمين</Text>
            <TouchableOpacity onPress={() => setShowSearch(false)}>
              <X color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Search color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder='ابحث عن مستخدم...'
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            style={styles.usersList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
      
      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>الإشعارات</Text>
            <TouchableOpacity onPress={() => setShowNotifications(false)}>
              <X color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Bell color={colors.textSecondary} size={48} />
                <Text style={styles.emptyText}>لا توجد إشعارات</Text>
              </View>
            }
          />
        </View>
      </Modal>
      
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: 25,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 12,
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  logo: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "100%",
    backgroundColor: colors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  userStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default Header;