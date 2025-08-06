import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const getNotificationsSchema = z.object({
  type: z.enum(['all', 'follow', 'gift', 'comment', 'stream', 'system']).default('all'),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  unreadOnly: z.boolean().default(false),
});

export const getNotificationsProcedure = publicProcedure
  .input(getNotificationsSchema)
  .query(async ({ input, ctx }) => {
    const { type, limit, offset, unreadOnly } = input;
    const userId = ctx.userId;
    
    if (!userId) {
      throw new Error('يجب تسجيل الدخول لعرض الإشعارات');
    }
    
    // Mock notifications data
    const mockNotifications = [
      {
        id: 'notif_1',
        userId,
        type: 'follow' as const,
        title: 'متابع جديد',
        message: 'أحمد محمد بدأ بمتابعتك',
        data: {
          followerId: 'user_1',
          followerName: 'أحمد محمد',
          followerAvatar: 'https://picsum.photos/100/100?random=1',
        },
        isRead: false,
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: 'notif_2',
        userId,
        type: 'gift' as const,
        title: 'هدية جديدة',
        message: 'فاطمة علي أرسلت لك وردة حمراء 🌹',
        data: {
          senderId: 'user_2',
          senderName: 'فاطمة علي',
          senderAvatar: 'https://picsum.photos/100/100?random=2',
          giftId: 'gift_rose',
          giftName: 'وردة حمراء',
          giftEmoji: '🌹',
          sessionId: 'session_1',
        },
        isRead: false,
        createdAt: new Date(Date.now() - 600000), // 10 minutes ago
      },
      {
        id: 'notif_3',
        userId,
        type: 'comment' as const,
        title: 'تعليق جديد',
        message: 'محمد حسن علق على فيديوك: "محتوى رائع!"',
        data: {
          commenterId: 'user_3',
          commenterName: 'محمد حسن',
          commenterAvatar: 'https://picsum.photos/100/100?random=3',
          videoId: 'video_1',
          videoTitle: 'أجمل الأغاني العربية',
          comment: 'محتوى رائع!',
        },
        isRead: true,
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      {
        id: 'notif_4',
        userId,
        type: 'stream' as const,
        title: 'بث مباشر',
        message: 'سارة أحمد بدأت بثاً مباشراً: "رحلة في الطبيعة"',
        data: {
          streamerId: 'user_4',
          streamerName: 'سارة أحمد',
          streamerAvatar: 'https://picsum.photos/100/100?random=4',
          sessionId: 'session_2',
          sessionTitle: 'رحلة في الطبيعة',
        },
        isRead: true,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: 'notif_5',
        userId,
        type: 'system' as const,
        title: 'تحديث التطبيق',
        message: 'تم إضافة ميزات جديدة! تحديث التطبيق متاح الآن',
        data: {
          version: '2.1.0',
          features: ['فلاتر جديدة', 'تحسينات الأداء', 'إصلاح الأخطاء'],
        },
        isRead: false,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
    ];
    
    // Filter notifications
    let filteredNotifications = mockNotifications;
    
    if (type !== 'all') {
      filteredNotifications = filteredNotifications.filter(notif => notif.type === type);
    }
    
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(notif => !notif.isRead);
    }
    
    // Apply pagination
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);
    
    // Count unread notifications
    const unreadCount = mockNotifications.filter(notif => !notif.isRead).length;
    
    return {
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount,
      hasMore: offset + limit < filteredNotifications.length,
    };
  });