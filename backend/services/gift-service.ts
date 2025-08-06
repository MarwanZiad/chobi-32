// Gift Service - handles virtual gifts and transactions
export class GiftService {
  private giftCatalog = new Map<string, any>();
  private userBalances = new Map<string, number>();
  private giftTransactions = new Map<string, any[]>();

  constructor() {
    this.initializeGiftCatalog();
    this.initializeMockBalances();
  }

  private initializeGiftCatalog() {
    const gifts = [
      {
        id: 'gift_rose',
        name: 'وردة حمراء',
        emoji: '🌹',
        price: 10,
        category: 'flowers',
        animation: 'rose_animation',
        rarity: 'common',
      },
      {
        id: 'gift_heart',
        name: 'قلب',
        emoji: '❤️',
        price: 5,
        category: 'love',
        animation: 'heart_animation',
        rarity: 'common',
      },
      {
        id: 'gift_diamond',
        name: 'ماسة',
        emoji: '💎',
        price: 100,
        category: 'luxury',
        animation: 'diamond_animation',
        rarity: 'rare',
      },
      {
        id: 'gift_crown',
        name: 'تاج',
        emoji: '👑',
        price: 500,
        category: 'luxury',
        animation: 'crown_animation',
        rarity: 'epic',
      },
      {
        id: 'gift_rocket',
        name: 'صاروخ',
        emoji: '🚀',
        price: 1000,
        category: 'special',
        animation: 'rocket_animation',
        rarity: 'legendary',
      },
    ];

    gifts.forEach(gift => {
      this.giftCatalog.set(gift.id, gift);
    });
  }

  private initializeMockBalances() {
    // Mock user balances
    this.userBalances.set('user_1', 1000);
    this.userBalances.set('user_2', 500);
    this.userBalances.set('user_3', 2000);
    this.userBalances.set('user_4', 750);
  }

  // Get available gifts
  getAvailableGifts() {
    const gifts = Array.from(this.giftCatalog.values());
    
    // Group by category
    const categories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = [];
      }
      acc[gift.category].push(gift);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      gifts,
      categories,
      totalGifts: gifts.length,
    };
  }

  // Send a gift
  async sendGift(senderId: string, recipientId: string, giftId: string, sessionId: string, quantity = 1, message?: string) {
    const gift = this.giftCatalog.get(giftId);
    if (!gift) {
      throw new Error('Gift not found');
    }

    const totalCost = gift.price * quantity;
    const senderBalance = this.userBalances.get(senderId) || 0;

    if (senderBalance < totalCost) {
      throw new Error('Insufficient balance');
    }

    // Deduct from sender
    this.userBalances.set(senderId, senderBalance - totalCost);

    // Add to recipient (70% of gift value)
    const recipientEarning = Math.floor(totalCost * 0.7);
    const recipientBalance = this.userBalances.get(recipientId) || 0;
    this.userBalances.set(recipientId, recipientBalance + recipientEarning);

    // Create transaction record
    const transaction = {
      id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      recipientId,
      sessionId,
      giftId,
      giftName: gift.name,
      giftEmoji: gift.emoji,
      quantity,
      totalCost,
      recipientEarning,
      message,
      timestamp: new Date(),
      animation: gift.animation,
    };

    // Store transaction
    const userTransactions = this.giftTransactions.get(senderId) || [];
    userTransactions.push(transaction);
    this.giftTransactions.set(senderId, userTransactions);

    const recipientTransactions = this.giftTransactions.get(recipientId) || [];
    recipientTransactions.push({ ...transaction, type: 'received' });
    this.giftTransactions.set(recipientId, recipientTransactions);

    console.log('GiftService: Gift sent', transaction.id);

    // In production, broadcast gift animation to session viewers
    this.broadcastGiftAnimation(sessionId, transaction);

    return {
      transaction,
      newSenderBalance: this.userBalances.get(senderId),
      newRecipientBalance: this.userBalances.get(recipientId),
    };
  }

  // Get user balance
  getUserBalance(userId: string) {
    return this.userBalances.get(userId) || 0;
  }

  // Get user gift transactions
  getUserTransactions(userId: string, limit = 20) {
    const transactions = this.giftTransactions.get(userId) || [];
    return transactions.slice(-limit).reverse();
  }

  // Get gift statistics for a session
  getSessionGiftStats(sessionId: string) {
    const allTransactions = Array.from(this.giftTransactions.values()).flat();
    const sessionTransactions = allTransactions.filter(t => t.sessionId === sessionId);

    const totalGifts = sessionTransactions.length;
    const totalValue = sessionTransactions.reduce((sum, t) => sum + t.totalCost, 0);

    // Group by gift type
    const giftCounts = sessionTransactions.reduce((acc, t) => {
      acc[t.giftId] = (acc[t.giftId] || 0) + t.quantity;
      return acc;
    }, {} as Record<string, number>);

    const topGifts = Object.entries(giftCounts)
      .map(([giftId, count]) => {
        const gift = this.giftCatalog.get(giftId);
        return {
          giftId,
          name: gift?.name || 'Unknown',
          count,
          value: count * (gift?.price || 0),
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalGifts,
      totalValue,
      topGifts,
    };
  }

  // Add coins to user balance (for purchases)
  addCoins(userId: string, amount: number) {
    const currentBalance = this.userBalances.get(userId) || 0;
    this.userBalances.set(userId, currentBalance + amount);
    
    console.log(`GiftService: Added ${amount} coins to user ${userId}`);
    return this.userBalances.get(userId);
  }

  private broadcastGiftAnimation(sessionId: string, transaction: any) {
    // In production, broadcast to all session viewers via WebSocket
    console.log(`GiftService: Broadcasting gift animation to session ${sessionId}`, {
      type: 'gift_animation',
      data: transaction,
    });
  }
}

// Singleton instance
export const giftService = new GiftService();