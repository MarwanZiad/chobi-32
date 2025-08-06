// Notification Service - handles push notifications and in-app notifications
export class NotificationService {
  private userNotifications = new Map<string, any[]>();
  private notificationSettings = new Map<string, any>();

  constructor() {
    this.initializeMockNotifications();
  }

  private initializeMockNotifications() {
    // Mock notifications for testing
    const mockNotifications = [
      {
        id: 'notif_1',
        userId: 'user_1',
        type: 'follow',
        title: 'متابع جديد',
        message: 'أحمد محمد بدأ بمتابعتك',
        data: {
          followerId: 'user_2',
          followerName: 'أحمد محمد',
        },
        isRead: false,
        createdAt: new Date(Date.now() - 300000),
      },
      {
        id: 'notif_2',
        userId: 'user_1',
        type: 'gift',
        title: 'هدية جديدة',
        message: 'فاطمة علي أرسلت لك وردة حمراء 🌹',
        data: {
          senderId: 'user_3',
          giftId: 'gift_rose',
        },
        isRead: false,
        createdAt: new Date(Date.now() - 600000),
      },
    ];

    mockNotifications.forEach(notif => {
      const userNotifs = this.userNotifications.get(notif.userId) || [];
      userNotifs.push(notif);
      this.userNotifications.set(notif.userId, userNotifs);
    });
  }

  // Send notification to user
  async sendNotification(userId: string, notification: {
    type: 'follow' | 'gift' | 'comment' | 'stream' | 'system';
    title: string;
    message: string;
    data?: any;
  }) {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...notification,
      isRead: false,
      createdAt: new Date(),
    };

    // Store notification
    const userNotifs = this.userNotifications.get(userId) || [];
    userNotifs.push(notif);
    this.userNotifications.set(userId, userNotifs);

    // Check user notification settings
    const settings = this.notificationSettings.get(userId);
    const shouldSend = this.shouldSendNotification(notification.type, settings);

    if (shouldSend) {
      // In production, send push notification
      await this.sendPushNotification(userId, notif);
      
      // Send real-time notification via WebSocket
      await this.sendRealtimeNotification(userId, notif);
    }

    console.log('NotificationService: Notification sent', notif.id);
    return notif;
  }

  // Get user notifications
  getUserNotifications(userId: string, filters?: {
    type?: string;
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const notifications = this.userNotifications.get(userId) || [];
    
    let filtered = notifications;
    
    if (filters?.type && filters.type !== 'all') {
      filtered = filtered.filter(n => n.type === filters.type);
    }
    
    if (filters?.unreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    const paginated = filtered.slice(offset, offset + limit);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
      notifications: paginated,
      total: filtered.length,
      unreadCount,
      hasMore: offset + limit < filtered.length,
    };
  }

  // Mark notifications as read
  markAsRead(userId: string, notificationIds?: string[], markAll = false) {
    const notifications = this.userNotifications.get(userId) || [];
    let updatedCount = 0;

    if (markAll) {
      notifications.forEach(notif => {
        if (!notif.isRead) {
          notif.isRead = true;
          updatedCount++;
        }
      });
    } else if (notificationIds) {
      notifications.forEach(notif => {
        if (notificationIds.includes(notif.id) && !notif.isRead) {
          notif.isRead = true;
          updatedCount++;
        }
      });
    }

    this.userNotifications.set(userId, notifications);
    console.log(`NotificationService: Marked ${updatedCount} notifications as read for user ${userId}`);
    
    return updatedCount;
  }

  // Update user notification settings
  updateNotificationSettings(userId: string, settings: {
    newFollower?: boolean;
    giftReceived?: boolean;
    streamStarted?: boolean;
    comments?: boolean;
    pushEnabled?: boolean;
  }) {
    const currentSettings = this.notificationSettings.get(userId) || {};
    const updatedSettings = { ...currentSettings, ...settings };
    
    this.notificationSettings.set(userId, updatedSettings);
    console.log(`NotificationService: Updated settings for user ${userId}`, updatedSettings);
    
    return updatedSettings;
  }

  // Get user notification settings
  getNotificationSettings(userId: string) {
    return this.notificationSettings.get(userId) || {
      newFollower: true,
      giftReceived: true,
      streamStarted: true,
      comments: true,
      pushEnabled: true,
    };
  }

  // Send bulk notifications (for system announcements)
  async sendBulkNotification(userIds: string[], notification: {
    type: 'system';
    title: string;
    message: string;
    data?: any;
  }) {
    const promises = userIds.map(userId => 
      this.sendNotification(userId, notification)
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`NotificationService: Sent bulk notification to ${successful}/${userIds.length} users`);
    return { successful, total: userIds.length };
  }

  private shouldSendNotification(type: string, settings?: any) {
    if (!settings) return true;

    switch (type) {
      case 'follow':
        return settings.newFollower !== false;
      case 'gift':
        return settings.giftReceived !== false;
      case 'stream':
        return settings.streamStarted !== false;
      case 'comment':
        return settings.comments !== false;
      case 'system':
        return true; // Always send system notifications
      default:
        return true;
    }
  }

  private async sendPushNotification(userId: string, notification: any) {
    // In production, integrate with push notification service (FCM, APNS, etc.)
    console.log(`NotificationService: Sending push notification to user ${userId}`, {
      title: notification.title,
      body: notification.message,
    });
  }

  private async sendRealtimeNotification(userId: string, notification: any) {
    // In production, send via WebSocket
    console.log(`NotificationService: Sending realtime notification to user ${userId}`, notification);
  }

  // Clean up old notifications (run periodically)
  cleanupOldNotifications(daysToKeep = 30) {
    const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000));
    let totalCleaned = 0;

    for (const [userId, notifications] of this.userNotifications.entries()) {
      const filtered = notifications.filter(n => n.createdAt > cutoffDate);
      const cleaned = notifications.length - filtered.length;
      
      if (cleaned > 0) {
        this.userNotifications.set(userId, filtered);
        totalCleaned += cleaned;
      }
    }

    console.log(`NotificationService: Cleaned up ${totalCleaned} old notifications`);
    return totalCleaned;
  }
}

// Singleton instance
export const notificationService = new NotificationService();