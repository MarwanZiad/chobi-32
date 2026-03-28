import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { pkChallengeService } from '../../../../services/pk-challenge-service';

const sendGiftSchema = z.object({
  challengeId: z.string(),
  recipientId: z.string(),
  giftId: z.string(),
  quantity: z.number().min(1).max(100).default(1),
});

export const sendGiftProcedure = publicProcedure
  .input(sendGiftSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      console.log('Sending PK gift:', input);
      
      const senderId = ctx.userId || 'user_demo'; // Demo user for testing
      
      const result = await pkChallengeService.sendPKGift(
        input.challengeId,
        senderId,
        input.recipientId,
        input.giftId,
        input.quantity
      );

      return {
        success: true,
        transaction: result.transaction,
        newScores: result.newScores,
        message: 'تم إرسال الهدية بنجاح',
      };
    } catch (error) {
      console.error('Error sending PK gift:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ في إرسال الهدية',
      };
    }
  });