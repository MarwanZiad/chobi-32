import { publicProcedure } from '../../../create-context';

export const getAvailableGiftsProcedure = publicProcedure
  .query(async () => {
    // Mock available gifts
    const gifts = [
      {
        id: 'gift_rose',
        name: 'وردة حمراء',
        emoji: '🌹',
        price: 10,
        category: 'flowers',
        animation: 'rose_animation',
        rarity: 'common' as const,
      },
      {
        id: 'gift_heart',
        name: 'قلب',
        emoji: '❤️',
        price: 5,
        category: 'love',
        animation: 'heart_animation',
        rarity: 'common' as const,
      },
      {
        id: 'gift_diamond',
        name: 'ماسة',
        emoji: '💎',
        price: 100,
        category: 'luxury',
        animation: 'diamond_animation',
        rarity: 'rare' as const,
      },
      {
        id: 'gift_crown',
        name: 'تاج',
        emoji: '👑',
        price: 500,
        category: 'luxury',
        animation: 'crown_animation',
        rarity: 'epic' as const,
      },
      {
        id: 'gift_rocket',
        name: 'صاروخ',
        emoji: '🚀',
        price: 1000,
        category: 'special',
        animation: 'rocket_animation',
        rarity: 'legendary' as const,
      },
      {
        id: 'gift_cake',
        name: 'كعكة',
        emoji: '🎂',
        price: 25,
        category: 'celebration',
        animation: 'cake_animation',
        rarity: 'common' as const,
      },
      {
        id: 'gift_star',
        name: 'نجمة',
        emoji: '⭐',
        price: 50,
        category: 'special',
        animation: 'star_animation',
        rarity: 'uncommon' as const,
      },
      {
        id: 'gift_fire',
        name: 'نار',
        emoji: '🔥',
        price: 75,
        category: 'energy',
        animation: 'fire_animation',
        rarity: 'uncommon' as const,
      },
    ];
    
    // Group gifts by category
    const categories = {
      flowers: gifts.filter(g => g.category === 'flowers'),
      love: gifts.filter(g => g.category === 'love'),
      luxury: gifts.filter(g => g.category === 'luxury'),
      special: gifts.filter(g => g.category === 'special'),
      celebration: gifts.filter(g => g.category === 'celebration'),
      energy: gifts.filter(g => g.category === 'energy'),
    };
    
    return {
      gifts,
      categories,
      totalGifts: gifts.length,
    };
  });