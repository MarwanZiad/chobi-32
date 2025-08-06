import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { pkChallengeService } from '../../../../services/pk-challenge-service';

const respondInvitationSchema = z.object({
  invitationId: z.string(),
  response: z.enum(['accept', 'reject']),
});

export const respondInvitationProcedure = publicProcedure
  .input(respondInvitationSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      console.log('Responding to PK invitation:', input);
      
      const userId = ctx.userId || 'user_demo'; // Demo user for testing
      
      const result = await pkChallengeService.respondToInvitation(
        input.invitationId,
        userId,
        input.response
      );

      return {
        success: true,
        challenge: result.challenge,
        status: result.status,
        message: input.response === 'accept' 
          ? 'تم قبول التحدي بنجاح' 
          : 'تم رفض التحدي',
      };
    } catch (error) {
      console.error('Error responding to PK invitation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ في الرد على الدعوة',
      };
    }
  });