import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { pkChallengeService } from '../../../../services/pk-challenge-service';

const createChallengeSchema = z.object({
  challengedUserIds: z.array(z.string()).min(1).max(3),
  type: z.enum(['1v1', '4player']),
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string().optional(),
  duration: z.number().min(60).max(1800).optional(), // 1 minute to 30 minutes
  sessionId: z.string().optional(),
});

export const createChallengeProcedure = publicProcedure
  .input(createChallengeSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      console.log('Creating PK challenge:', input);
      
      const challengerId = ctx.userId || 'user_demo'; // Demo user for testing
      
      const result = await pkChallengeService.createChallenge({
        challengerId,
        challengedUserIds: input.challengedUserIds,
        type: input.type,
        title: input.title,
        description: input.description,
        duration: input.duration,
        sessionId: input.sessionId,
      });

      return {
        success: true,
        challenge: result.challenge,
        invitations: result.invitations,
        message: 'تم إنشاء التحدي وإرسال الدعوات بنجاح',
      };
    } catch (error) {
      console.error('Error creating PK challenge:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ في إنشاء التحدي',
      };
    }
  });