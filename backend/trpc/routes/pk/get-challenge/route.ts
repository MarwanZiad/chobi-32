import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { pkChallengeService } from '../../../../services/pk-challenge-service';
import { mockDatabase } from '../../../../database/models';

const getChallengeSchema = z.object({
  challengeId: z.string(),
});

export const getChallengeProcedure = publicProcedure
  .input(getChallengeSchema)
  .query(async ({ input }) => {
    try {
      console.log('Getting PK challenge:', input.challengeId);
      
      // Get challenge from database
      const challenge = await mockDatabase.getPKChallengeById(input.challengeId);
      if (!challenge) {
        return {
          success: false,
          error: 'التحدي غير موجود',
        };
      }

      // Get real-time data if challenge is active
      const activeChallenge = pkChallengeService.getActiveChallenge(input.challengeId);
      const leaderboard = pkChallengeService.getChallengeLeaderboard(input.challengeId);

      // Get participant details
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

      // Get recent events
      const events = await mockDatabase.getPKEvents(input.challengeId);
      const recentEvents = events.slice(-10); // Last 10 events

      return {
        success: true,
        challenge: {
          ...challenge,
          realTimeScores: activeChallenge?.realTimeScores || challenge.scores,
        },
        participants: participants.filter(Boolean),
        leaderboard,
        recentEvents,
        isActive: challenge.status === 'active',
      };
    } catch (error) {
      console.error('Error getting PK challenge:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ في جلب التحدي',
      };
    }
  });