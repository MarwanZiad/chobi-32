import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const getProfileSchema = z.object({
  userId: z.string().optional(), // if not provided, get current user
});

export const getProfileProcedure = publicProcedure
  .input(getProfileSchema)
  .query(async ({ input, ctx }) => {
    const targetUserId = input.userId || ctx.userId || 'anonymous';
    
    // Mock user profile data
    const userProfile = {
      id: targetUserId,
      username: 'أحمد محمد',
      displayName: 'Ahmed Mohamed',
      avatar: 'https://picsum.photos/200/200?random=1',
      bio: 'مبدع محتوى ومحب للموسيقى العربية الأصيلة 🎵',
      level: 15,
      experience: 2450,
      nextLevelExp: 3000,
      coins: 1250,
      diamonds: 45,
      followers: 1234,
      following: 567,
      totalStreams: 89,
      totalViewTime: 156780, // in seconds
      badges: [
        {
          id: 'verified',
          name: 'موثق',
          icon: '✅',
          description: 'حساب موثق',
        },
        {
          id: 'top_streamer',
          name: 'مبدع مميز',
          icon: '🌟',
          description: 'من أفضل المبدعين',
        },
        {
          id: 'music_lover',
          name: 'عاشق الموسيقى',
          icon: '🎵',
          description: 'محب للموسيقى',
        },
      ],
      achievements: [
        {
          id: 'first_stream',
          name: 'البث الأول',
          description: 'أكمل أول بث مباشر',
          unlockedAt: new Date('2024-01-15'),
          icon: '🎬',
        },
        {
          id: 'hundred_followers',
          name: '100 متابع',
          description: 'وصل إلى 100 متابع',
          unlockedAt: new Date('2024-02-20'),
          icon: '👥',
        },
        {
          id: 'gift_receiver',
          name: 'محبوب',
          description: 'تلقى 50 هدية',
          unlockedAt: new Date('2024-03-10'),
          icon: '🎁',
        },
      ],
      stats: {
        totalStreamTime: 45600, // seconds
        averageViewers: 125,
        peakViewers: 456,
        totalGiftsReceived: 234,
        totalGiftsSent: 89,
        favoriteCategory: 'music',
      },
      preferences: {
        language: 'ar',
        theme: 'dark',
        notifications: {
          newFollower: true,
          giftReceived: true,
          streamStarted: true,
          comments: true,
        },
        privacy: {
          showOnlineStatus: true,
          allowDirectMessages: true,
          showStats: true,
        },
      },
      joinedAt: new Date('2024-01-01'),
      lastActive: new Date(),
      isOnline: true,
      currentStreamId: null,
    };
    
    return {
      profile: userProfile,
      isOwnProfile: targetUserId === ctx.userId,
    };
  });