import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const endSessionSchema = z.object({
  sessionId: z.string(),
});

export const endSessionProcedure = publicProcedure
  .input(endSessionSchema)
  .mutation(async ({ input, ctx }) => {
    const { sessionId } = input;
    const userId = ctx.userId;
    
    // Validate user is the host
    // In production, check database
    const isHost = true; // Mock validation
    
    if (!isHost) {
      throw new Error('غير مسموح لك بإنهاء هذه الجلسة');
    }
    
    // End streaming session
    const endedSession = {
      sessionId,
      endedAt: new Date(),
      finalStats: {
        totalViewers: Math.floor(Math.random() * 1000),
        peakViewers: Math.floor(Math.random() * 500),
        duration: Math.floor(Math.random() * 3600), // seconds
        totalMessages: Math.floor(Math.random() * 200),
        totalGifts: Math.floor(Math.random() * 50),
      }
    };
    
    console.log('Session ended:', endedSession);
    
    return {
      success: true,
      stats: endedSession.finalStats,
      message: 'تم إنهاء البث بنجاح'
    };
  });