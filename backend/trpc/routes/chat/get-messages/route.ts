import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const getMessagesSchema = z.object({
  sessionId: z.string(),
  limit: z.number().min(1).max(100).default(50),
  before: z.string().optional(), // message ID for pagination
});

export const getMessagesProcedure = publicProcedure
  .input(getMessagesSchema)
  .query(async ({ input }) => {
    const { sessionId, limit, before } = input;
    
    // Mock chat messages
    const mockMessages = [
      {
        id: 'msg_1',
        sessionId,
        userId: 'user_1',
        userName: 'أحمد محمد',
        userAvatar: 'https://picsum.photos/50/50?random=1',
        message: 'أهلاً وسهلاً بالجميع! 👋',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 300000),
        isHighlighted: false,
      },
      {
        id: 'msg_2',
        sessionId,
        userId: 'user_2',
        userName: 'فاطمة علي',
        userAvatar: 'https://picsum.photos/50/50?random=2',
        message: 'بث رائع! استمر 🔥',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 240000),
        isHighlighted: false,
      },
      {
        id: 'msg_3',
        sessionId,
        userId: 'user_3',
        userName: 'محمد حسن',
        userAvatar: 'https://picsum.photos/50/50?random=3',
        message: 'أرسل هدية: وردة حمراء 🌹',
        type: 'gift' as const,
        giftId: 'gift_rose',
        timestamp: new Date(Date.now() - 180000),
        isHighlighted: true,
      },
      {
        id: 'msg_4',
        sessionId,
        userId: 'user_4',
        userName: 'سارة أحمد',
        userAvatar: 'https://picsum.photos/50/50?random=4',
        message: 'شكراً لك على المحتوى الرائع',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 120000),
        isHighlighted: false,
      },
    ];
    
    // Apply pagination if 'before' is provided
    let filteredMessages = mockMessages;
    if (before) {
      const beforeIndex = mockMessages.findIndex(msg => msg.id === before);
      if (beforeIndex > 0) {
        filteredMessages = mockMessages.slice(0, beforeIndex);
      }
    }
    
    // Apply limit
    const paginatedMessages = filteredMessages.slice(-limit);
    
    return {
      messages: paginatedMessages,
      hasMore: filteredMessages.length > limit,
    };
  });