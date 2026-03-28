import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const sendMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1).max(500),
  type: z.enum(['text', 'emoji', 'gift']).default('text'),
  giftId: z.string().optional(),
});

export const sendMessageProcedure = publicProcedure
  .input(sendMessageSchema)
  .mutation(async ({ input, ctx }) => {
    const { sessionId, message, type, giftId } = input;
    const userId = ctx.userId || `guest_${Date.now()}`;
    
    // Create message object
    const chatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      userName: ctx.userName || 'مستخدم ضيف',
      userAvatar: ctx.userAvatar || 'https://picsum.photos/50/50?random=1',
      message,
      type,
      giftId,
      timestamp: new Date(),
      isHighlighted: type === 'gift',
    };
    
    // In production, broadcast to all session viewers via WebSocket
    console.log('New chat message:', chatMessage);
    
    // Mock broadcasting
    // await broadcastToSession(sessionId, {
    //   type: 'new_message',
    //   data: chatMessage
    // });
    
    return {
      success: true,
      message: chatMessage,
    };
  });