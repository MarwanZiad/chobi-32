// PK Challenge Service - handles PK challenge logic and real-time events
import { mockDatabase } from '../database/models';
import type { DatabasePKChallenge, DatabasePKInvitation, DatabaseUser } from '../database/models';

export class PKChallengeService {
  private activeChallenges = new Map<string, any>();
  private challengeTimers = new Map<string, NodeJS.Timeout>();

  // Create a new PK challenge
  async createChallenge(challengeData: {
    challengerId: string;
    challengedUserIds: string[];
    type: '1v1' | '4player';
    title: string;
    description?: string;
    duration?: number;
    sessionId?: string;
  }) {
    console.log('PKChallengeService: Creating challenge', challengeData);

    // Validate challenge type and participants
    if (challengeData.type === '1v1' && challengeData.challengedUserIds.length !== 1) {
      throw new Error('1v1 challenges require exactly 1 opponent');
    }
    if (challengeData.type === '4player' && challengeData.challengedUserIds.length !== 3) {
      throw new Error('4-player challenges require exactly 3 opponents');
    }

    // Check if users are online and available
    const challenger = await mockDatabase.getUserById(challengeData.challengerId);
    if (!challenger) {
      throw new Error('Challenger not found');
    }

    const challengedUsers: DatabaseUser[] = [];
    for (const userId of challengeData.challengedUserIds) {
      const user = await mockDatabase.getUserById(userId);
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }
      if (!user.isOnline) {
        throw new Error(`User ${user.username} is not online`);
      }
      challengedUsers.push(user);
    }

    // Create the challenge
    const challenge = await mockDatabase.createPKChallenge({
      challengerId: challengeData.challengerId,
      challengedUserIds: challengeData.challengedUserIds,
      type: challengeData.type,
      title: challengeData.title,
      description: challengeData.description,
      duration: challengeData.duration || 300, // 5 minutes default
      sessionId: challengeData.sessionId,
      status: 'pending',
      scores: {},
      settings: {
        allowGifts: true,
        allowComments: true,
        pointsPerGift: {
          'gift_heart': 1,
          'gift_rose': 2,
          'gift_diamond': 10,
        },
      },
    });

    // Send invitations to all challenged users
    const invitations = [];
    for (const user of challengedUsers) {
      const invitation = await mockDatabase.createPKInvitation({
        challengeId: challenge.id,
        inviterId: challengeData.challengerId,
        inviteeId: user.id,
        message: `${challenger.username} تحداك في PK ${challengeData.type}!`,
        expiresAt: new Date(Date.now() + 60000), // 1 minute to respond
      });
      invitations.push(invitation);

      // Create notification for the invited user
      await mockDatabase.createNotification({
        userId: user.id,
        type: 'system',
        title: 'تحدي PK جديد!',
        message: `${challenger.username} تحداك في PK ${challengeData.type}`,
        data: {
          type: 'pk_invitation',
          challengeId: challenge.id,
          invitationId: invitation.id,
        },
      });
    }

    // Set expiration timer for the challenge
    this.setInvitationTimer(challenge.id);

    console.log(`PKChallengeService: Created challenge ${challenge.id} with ${invitations.length} invitations`);
    return {
      challenge,
      invitations,
    };
  }

  // Respond to a PK invitation
  async respondToInvitation(invitationId: string, userId: string, response: 'accept' | 'reject') {
    console.log(`PKChallengeService: User ${userId} responding to invitation ${invitationId} with ${response}`);

    const invitation = await mockDatabase.getPKInvitationById(invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.inviteeId !== userId) {
      throw new Error('You are not authorized to respond to this invitation');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation has already been responded to');
    }

    if (invitation.expiresAt < new Date()) {
      throw new Error('Invitation has expired');
    }

    // Update invitation status
    await mockDatabase.updatePKInvitation(invitationId, {
      status: response === 'accept' ? 'accepted' : 'rejected',
      respondedAt: new Date(),
    });

    const challenge = await mockDatabase.getPKChallengeById(invitation.challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (response === 'reject') {
      // If any user rejects, cancel the challenge
      await mockDatabase.updatePKChallenge(challenge.id, {
        status: 'cancelled',
      });
      this.clearChallengeTimer(challenge.id);
      return { challenge: await mockDatabase.getPKChallengeById(challenge.id), status: 'cancelled' };
    }

    // Check if all invitations are accepted
    const allInvitations = await Promise.all(
      challenge.challengedUserIds.map(async (userId) => {
        const invs = await mockDatabase.getUserPKInvitations(userId);
        return invs.find(inv => inv.challengeId === challenge.id);
      })
    );

    const allAccepted = allInvitations.every(inv => inv?.status === 'accepted');

    if (allAccepted) {
      // Start the challenge
      return await this.startChallenge(challenge.id);
    }

    return { challenge: await mockDatabase.getPKChallengeById(challenge.id), status: 'waiting' };
  }

  // Start a PK challenge
  async startChallenge(challengeId: string) {
    console.log(`PKChallengeService: Starting challenge ${challengeId}`);

    const challenge = await mockDatabase.getPKChallengeById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.status !== 'pending') {
      throw new Error('Challenge is not in pending status');
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + challenge.duration * 1000);

    // Initialize scores for all participants
    const scores: Record<string, number> = {};
    scores[challenge.challengerId] = 0;
    challenge.challengedUserIds.forEach(userId => {
      scores[userId] = 0;
    });

    // Assign teams for 4-player challenges
    let teamAssignments: Record<string, 'team1' | 'team2'> | undefined;
    if (challenge.type === '4player') {
      const allUsers = [challenge.challengerId, ...challenge.challengedUserIds];
      teamAssignments = {};
      allUsers.forEach((userId, index) => {
        teamAssignments![userId] = index < 2 ? 'team1' : 'team2';
      });
    }

    // Update challenge status
    const updatedChallenge = await mockDatabase.updatePKChallenge(challengeId, {
      status: 'active',
      startTime,
      endTime,
      scores,
      teamAssignments,
    });

    // Store active challenge in memory
    this.activeChallenges.set(challengeId, {
      ...updatedChallenge,
      realTimeScores: { ...scores },
    });

    // Create start event
    await mockDatabase.createPKEvent({
      challengeId,
      type: 'start',
      data: {
        startTime,
        endTime,
        participants: [challenge.challengerId, ...challenge.challengedUserIds],
        teamAssignments,
      },
    });

    // Set challenge end timer
    this.setChallengeEndTimer(challengeId, challenge.duration);

    console.log(`PKChallengeService: Challenge ${challengeId} started successfully`);
    return { challenge: updatedChallenge, status: 'started' };
  }

  // Send gift during PK challenge
  async sendPKGift(challengeId: string, senderId: string, recipientId: string, giftId: string, quantity: number = 1) {
    console.log(`PKChallengeService: Sending gift in challenge ${challengeId}`);

    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found or not active');
    }

    if (challenge.status !== 'active') {
      throw new Error('Challenge is not active');
    }

    // Validate recipient is a participant
    const allParticipants = [challenge.challengerId, ...challenge.challengedUserIds];
    if (!allParticipants.includes(recipientId)) {
      throw new Error('Recipient is not a participant in this challenge');
    }

    // Get gift details
    const gifts = await mockDatabase.getGifts();
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) {
      throw new Error('Gift not found');
    }

    // Calculate points
    const pointsPerGift = challenge.settings.pointsPerGift[giftId] || 1;
    const totalPoints = pointsPerGift * quantity;
    const totalCost = gift.price * quantity;

    // Create gift transaction
    const transaction = await mockDatabase.createPKGiftTransaction({
      challengeId,
      senderId,
      recipientId,
      giftId,
      quantity,
      points: totalPoints,
      totalCost,
    });

    // Update scores
    challenge.realTimeScores[recipientId] = (challenge.realTimeScores[recipientId] || 0) + totalPoints;

    // Update challenge in database
    await mockDatabase.updatePKChallenge(challengeId, {
      scores: challenge.realTimeScores,
      totalGifts: challenge.totalGifts + quantity,
      totalRevenue: challenge.totalRevenue + totalCost,
    });

    // Create gift event
    await mockDatabase.createPKEvent({
      challengeId,
      type: 'gift_sent',
      userId: senderId,
      data: {
        recipientId,
        giftId,
        quantity,
        points: totalPoints,
        newScore: challenge.realTimeScores[recipientId],
      },
    });

    console.log(`PKChallengeService: Gift sent, new score for ${recipientId}: ${challenge.realTimeScores[recipientId]}`);
    return {
      transaction,
      newScores: challenge.realTimeScores,
    };
  }

  // End a PK challenge
  async endChallenge(challengeId: string) {
    console.log(`PKChallengeService: Ending challenge ${challengeId}`);

    const challenge = await mockDatabase.getPKChallengeById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.status !== 'active') {
      throw new Error('Challenge is not active');
    }

    // Determine winner
    const { winnerId, winnerTeam } = this.determineWinner(challenge);

    // Update challenge status
    const updatedChallenge = await mockDatabase.updatePKChallenge(challengeId, {
      status: 'completed',
      endTime: new Date(),
      winnerId,
      winnerTeam,
    });

    // Clean up active challenge
    this.activeChallenges.delete(challengeId);
    this.clearChallengeTimer(challengeId);

    // Create end event
    await mockDatabase.createPKEvent({
      challengeId,
      type: 'end',
      data: {
        winnerId,
        winnerTeam,
        finalScores: challenge.scores,
        endTime: new Date(),
      },
    });

    // Send notifications to participants
    const allParticipants = [challenge.challengerId, ...challenge.challengedUserIds];
    for (const userId of allParticipants) {
      const isWinner = challenge.type === '1v1' 
        ? userId === winnerId 
        : challenge.teamAssignments?.[userId] === winnerTeam;

      await mockDatabase.createNotification({
        userId,
        type: 'system',
        title: isWinner ? '🎉 فزت في التحدي!' : '😔 انتهى التحدي',
        message: isWinner 
          ? `تهانينا! فزت في تحدي PK "${challenge.title}"`
          : `انتهى تحدي PK "${challenge.title}"`,
        data: {
          type: 'pk_result',
          challengeId,
          isWinner,
          winnerId,
          winnerTeam,
        },
      });
    }

    console.log(`PKChallengeService: Challenge ${challengeId} ended, winner: ${winnerId || winnerTeam}`);
    return updatedChallenge;
  }

  // Get active challenge details
  getActiveChallenge(challengeId: string) {
    return this.activeChallenges.get(challengeId);
  }

  // Get challenge leaderboard
  getChallengeLeaderboard(challengeId: string) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) return null;

    if (challenge.type === '1v1') {
      const participants = [challenge.challengerId, ...challenge.challengedUserIds];
      return participants
        .map(userId => ({
          userId,
          score: challenge.realTimeScores[userId] || 0,
        }))
        .sort((a, b) => b.score - a.score);
    } else {
      // 4-player team-based
      const team1Score = Object.entries(challenge.teamAssignments || {})
        .filter(([_, team]) => team === 'team1')
        .reduce((sum, [userId]) => sum + (challenge.realTimeScores[userId] || 0), 0);

      const team2Score = Object.entries(challenge.teamAssignments || {})
        .filter(([_, team]) => team === 'team2')
        .reduce((sum, [userId]) => sum + (challenge.realTimeScores[userId] || 0), 0);

      return {
        team1: { score: team1Score },
        team2: { score: team2Score },
        individual: Object.entries(challenge.realTimeScores)
          .map(([userId, score]) => ({ userId, score }))
          .sort((a, b) => (typeof b.score === 'number' ? b.score : 0) - (typeof a.score === 'number' ? a.score : 0)),
      };
    }
  }

  // Private helper methods
  private determineWinner(challenge: DatabasePKChallenge) {
    if (challenge.type === '1v1') {
      const participants = [challenge.challengerId, ...challenge.challengedUserIds];
      const winner = participants.reduce((prev, current) => 
        (challenge.scores[current] || 0) > (challenge.scores[prev] || 0) ? current : prev
      );
      return { winnerId: winner, winnerTeam: undefined };
    } else {
      // 4-player team-based
      const team1Score = Object.entries(challenge.teamAssignments || {})
        .filter(([_, team]) => team === 'team1')
        .reduce((sum, [userId]) => sum + (challenge.scores[userId] || 0), 0);

      const team2Score = Object.entries(challenge.teamAssignments || {})
        .filter(([_, team]) => team === 'team2')
        .reduce((sum, [userId]) => sum + (challenge.scores[userId] || 0), 0);

      return { 
        winnerId: undefined, 
        winnerTeam: team1Score > team2Score ? 'team1' : 'team2' 
      };
    }
  }

  private setInvitationTimer(challengeId: string) {
    const timer = setTimeout(async () => {
      console.log(`PKChallengeService: Invitation timer expired for challenge ${challengeId}`);
      await mockDatabase.updatePKChallenge(challengeId, {
        status: 'expired',
      });
    }, 60000); // 1 minute

    this.challengeTimers.set(`invitation_${challengeId}`, timer as unknown as NodeJS.Timeout);
  }

  private setChallengeEndTimer(challengeId: string, duration: number) {
    const timer = setTimeout(async () => {
      console.log(`PKChallengeService: Challenge timer expired for ${challengeId}`);
      await this.endChallenge(challengeId);
    }, duration * 1000);

    this.challengeTimers.set(`challenge_${challengeId}`, timer as unknown as NodeJS.Timeout);
  }

  private clearChallengeTimer(challengeId: string) {
    const invitationTimer = this.challengeTimers.get(`invitation_${challengeId}`);
    const challengeTimer = this.challengeTimers.get(`challenge_${challengeId}`);
    
    if (invitationTimer) {
      clearTimeout(invitationTimer);
      this.challengeTimers.delete(`invitation_${challengeId}`);
    }
    
    if (challengeTimer) {
      clearTimeout(challengeTimer);
      this.challengeTimers.delete(`challenge_${challengeId}`);
    }
  }
}

// Singleton instance
export const pkChallengeService = new PKChallengeService();