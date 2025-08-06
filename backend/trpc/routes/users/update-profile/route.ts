import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().url().optional(),
  preferences: z.object({
    language: z.enum(['ar', 'en']).optional(),
    theme: z.enum(['light', 'dark']).optional(),
    notifications: z.object({
      newFollower: z.boolean().optional(),
      giftReceived: z.boolean().optional(),
      streamStarted: z.boolean().optional(),
      comments: z.boolean().optional(),
    }).optional(),
    privacy: z.object({
      showOnlineStatus: z.boolean().optional(),
      allowDirectMessages: z.boolean().optional(),
      showStats: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

export const updateProfileProcedure = publicProcedure
  .input(updateProfileSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.userId;
    
    if (!userId) {
      throw new Error('يجب تسجيل الدخول لتحديث الملف الشخصي');
    }
    
    // In production, update user profile in database
    const updatedProfile = {
      id: userId,
      ...input,
      updatedAt: new Date(),
    };
    
    console.log('Profile updated:', updatedProfile);
    
    return {
      success: true,
      profile: updatedProfile,
      message: 'تم تحديث الملف الشخصي بنجاح'
    };
  });