import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'gift' | 'stream' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  userAvatar?: string;
  userName?: string;
  data?: any;
}

interface NotificationSettings {
  enabled: boolean;
  likes: boolean;
  comments: boolean;
  follows: boolean;
  gifts: boolean;
  streams: boolean;
  system: boolean;
  sound: boolean;
  vibration: boolean;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  likes: true,
  comments: true,
  follows: true,
  gifts: true,
  streams: true,
  system: true,
  sound: true,
  vibration: true,
};

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        title: 'إعجاب جديد',
        message: 'أعجب أحمد بفيديوك الأخير',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        userId: 'user1',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        userName: 'أحمد محمد',
      },
      {
        id: '2',
        type: 'comment',
        title: 'تعليق جديد',
        message: 'علقت فاطمة على فيديوك: "رائع جداً!"',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        userId: 'user2',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        userName: 'فاطمة الزهراء',
      },
      {
        id: '3',
        type: 'follow',
        title: 'متابع جديد',
        message: 'بدأ محمد بمتابعتك',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: true,
        userId: 'user3',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        userName: 'محمد علي',
      },
      {
        id: '4',
        type: 'gift',
        title: 'هدية جديدة',
        message: 'أرسلت لك سارة وردة 🌹',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: true,
        userId: 'user4',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        userName: 'سارة خالد',
      },
      {
        id: '5',
        type: 'stream',
        title: 'بث مباشر',
        message: 'بدأ عبدالله بثاً مباشراً الآن',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        userId: 'user5',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        userName: 'عبدالله حسن',
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Add new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show alert if notifications are enabled
    if (settings.enabled && settings[notification.type as keyof NotificationSettings]) {
      Alert.alert(notification.title, notification.message);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Update notification settings
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Get notifications by type
  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(notification => notification.timestamp > oneDayAgo);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    
    return timestamp.toLocaleDateString('ar-SA');
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']): string => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'gift': return '🎁';
      case 'stream': return '📺';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  return {
    notifications,
    settings,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    getNotificationsByType,
    getRecentNotifications,
    formatTimestamp,
    getNotificationIcon,
  };
});

// Helper hook for notification badge
export const useNotificationBadge = () => {
  const { unreadCount } = useNotifications();
  
  const getBadgeText = (): string => {
    if (unreadCount === 0) return '';
    if (unreadCount > 99) return '99+';
    return unreadCount.toString();
  };

  const shouldShowBadge = (): boolean => {
    return unreadCount > 0;
  };

  return {
    unreadCount,
    badgeText: getBadgeText(),
    shouldShowBadge: shouldShowBadge(),
  };
};