import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { mockDatabase } from '../../../../database/models';

export const getActiveChallengesProcedure = publicProcedure
  .query(async () => {
    try {
      console.log('Getting active PK challenges');
      
      // Get all active challenges
      const challenges = await mockDatabase.getActivePKChallenges();
      
      // Get participant details for each challenge
      const detailedChallenges = await Promise.all(
        challenges.map(async (challenge) => {
          const allParticipants = [challenge.challengerId, ...challenge.challengedUserIds];
          const participants = await Promise.all(
            allParticipants.map(async (userId) => {
              const user = await mockDatabase.getUserById(userId);
              return user ? {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                level: user.level,
                isVerified: user.isVerified,
              } : null;
            })
          );

          return {
            ...challenge,
            participants: participants.filter(Boolean),
            timeRemaining: challenge.endTime 
              ? Math.max(0, challenge.endTime.getTime() - Date.now()) 
              : 0,
          };
        })
      );

      return {
        success: true,
        challenges: detailedChallenges,
      };
    } catch (error) {
      console.error('Error getting active PK challenges:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ في جلب التحديات النشطة',
        challenges: [],
      };
    }
  });