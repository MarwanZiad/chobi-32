import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const joinSessionSchema = z.object({
  sessionId: z.string(),
  role: z.enum(['viewer', 'co-host']).default('viewer'),
});

export const joinSessionProcedure = publicProcedure
  .input(joinSessionSchema)
  .mutation(async ({ input, ctx }) => {
    const { sessionId, role } = input;
    const userId = ctx.userId || `guest_${Date.now()}`;
    
    // Validate session exists and is active
    // In production, check database
    const sessionExists = true; // Mock validation
    
    if (!sessionExists) {
      throw new Error('جلسة البث غير موجودة أو منتهية');
    }
    
    // Generate viewer token
    const viewerToken = `viewer_${userId}_${sessionId}_${Date.now()}`;
    
    // Create viewer session
    const viewerSession = {
      sessionId,
      userId,
      role,
      token: viewerToken,
      joinedAt: new Date(),
      permissions: {
        canChat: true,
        canSendGifts: true,
        canRequestCoHost: role === 'viewer',
        canModerate: role === 'co-host',
      }
    };
    
    console.log('User joined session:', viewerSession);
    
    return {
      success: true,
      viewerSession,
      playbackUrl: `https://live.chobi.app/hls/${sessionId}/index.m3u8`,
      chatEndpoint: `wss://chat.chobi.app/ws/${sessionId}`,
      message: 'تم الانضمام للبث بنجاح'
    };
  });