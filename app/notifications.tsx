import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Trash2,
  Settings,
  CheckCheck
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useNotifications } from '@/hooks/use-notifications';
import UserAvatar from '@/components/UserAvatar';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    formatTimestamp,
    getNotificationIcon 
  } = useNotifications();

  const handleNotificationPress = (notificationId: string) => {
    markAsRead(notificationId);
    // Navigate to relevant screen based on notification type
    console.log('Notification pressed:', notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'حذف الإشعار',
      'هل أنت متأكد من حذف هذا الإشعار؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => deleteNotification(notificationId) }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'مسح جميع الإشعارات',
      'هل أنت متأكد من مسح جميع الإشعارات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مسح الكل', style: 'destructive', onPress: clearAllNotifications }
      ]
    );
  };

  const renderNotification = (notification: any) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationLeft}>
          {notification.userAvatar && notification.userId ? (
            <UserAvatar 
              userId={notification.userId}
              imageUrl={notification.userAvatar}
              size={40}
              testID={`notification-avatar-${notification.id}`}
            />
          ) : (
            <View style={styles.iconContainer}>
              <Text style={styles.notificationEmoji}>
                {getNotificationIcon(notification.type)}
              </Text>
            </View>
          )}
          
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>
              {formatTimestamp(notification.timestamp)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => handleDeleteNotification(notification.id)}
        >
          <MoreHorizontal color={colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>الإشعارات</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck 
              color={unreadCount > 0 ? colors.primary : colors.textSecondary} 
              size={20} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/notification-settings')}
          >
            <Settings color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🔔</Text>
            <Text style={styles.emptyStateTitle}>لا توجد إشعارات</Text>
            <Text style={styles.emptyStateMessage}>
              ستظهر هنا جميع إشعاراتك الجديدة
            </Text>
          </View>
        ) : (
          <>
            {/* Quick Actions */}
            {notifications.length > 0 && (
              <View style={styles.quickActions}>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck 
                    color={unreadCount > 0 ? colors.primary : colors.textSecondary} 
                    size={16} 
                  />
                  <Text style={[
                    styles.quickActionText,
                    { color: unreadCount > 0 ? colors.primary : colors.textSecondary }
                  ]}>
                    تحديد الكل كمقروء
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={handleClearAll}
                >
                  <Trash2 color={colors.error} size={16} />
                  <Text style={[styles.quickActionText, { color: colors.error }]}>
                    مسح الكل
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Notifications List */}
            <View style={styles.notificationsList}>
              {notifications.map(renderNotification)}
            </View>
          </>
        )}
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  headerBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationsList: {
    paddingVertical: 8,
  },
  notificationItem: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: colors.cardBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationEmoji: {
    fontSize: 20,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});