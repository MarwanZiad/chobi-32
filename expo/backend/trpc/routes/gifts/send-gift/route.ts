import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const sendGiftSchema = z.object({
  sessionId: z.string(),
  giftId: z.string(),
  recipientId: z.string(), // host or specific user
  quantity: z.number().min(1).max(100).default(1),
  message: z.string().optional(),
});

export const sendGiftProcedure = publicProcedure
  .input(sendGiftSchema)
  .mutation(async ({ input, ctx }) => {
    const { sessionId, giftId, recipientId, quantity, message } = input;
    const senderId = ctx.userId || `guest_${Date.now()}`;
    
    // Mock gift data (in production, fetch from database)
    const giftData = {
      id: giftId,
      name: 'وردة حمراء',
      emoji: '🌹',
      price: 10,
      animation: 'rose_animation',
    };
    
    // Calculate total cost
    const totalCost = giftData.price * quantity;
    
    // Check user balance (mock)
    const userBalance = 1000; // Mock user balance
    if (userBalance < totalCost) {
      throw new Error('رصيدك غير كافي لإرسال هذه الهدية');
    }
    
    // Create gift transaction
    const giftTransaction = {
      id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      senderId,
      senderName: ctx.userName || 'مستخدم ضيف',
      recipientId,
      giftId,
      giftName: giftData.name,
      giftEmoji: giftData.emoji,
      quantity,
      totalCost,
      message,
      timestamp: new Date(),
      animation: giftData.animation,
    };
    
    console.log('Gift sent:', giftTransaction);
    
    // In production:
    // 1. Deduct coins from sender
    // 2. Add coins to recipient
    // 3. Save transaction to database
    // 4. Broadcast gift animation to session viewers
    
    return {
      success: true,
      transaction: giftTransaction,
      newBalance: userBalance - totalCost,
      message: 'تم إرسال الهدية بنجاح! 🎁'
    };
  });