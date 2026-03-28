import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import type { PKChallenge, PKInvitation, PKParticipant } from '@/types/pk-challenge';

export const [PKProvider, usePK] = createContextHook(() => {
  const [activeChallenges, setActiveChallenges] = useState<PKChallenge[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PKInvitation[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<PKChallenge | null>(null);
  const [challengeParticipants, setChallengeParticipants] = useState<PKParticipant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Queries
  const activeChallengesQuery = trpc.pk.getActiveChallenges.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const invitationsQuery = trpc.pk.getInvitations.useQuery(undefined, {
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Mutations
  const createChallengeMutation = trpc.pk.createChallenge.useMutation();
  const respondInvitationMutation = trpc.pk.respondInvitation.useMutation();
  const sendGiftMutation = trpc.pk.sendGift.useMutation();

  // Update state when queries change
  useEffect(() => {
    if (activeChallengesQuery.data?.success) {
      setActiveChallenges(activeChallengesQuery.data.challenges);
    }
  }, [activeChallengesQuery.data]);

  useEffect(() => {
    if (invitationsQuery.data?.success && invitationsQuery.data.invitations) {
      const mappedInvitations: PKInvitation[] = invitationsQuery.data.invitations.map(inv => ({
        ...inv,
        challenge: inv.challenge || undefined,
        inviter: inv.inviter || undefined
      }));
      setPendingInvitations(mappedInvitations);
    }
  }, [invitationsQuery.data]);

  // Create a new PK challenge
  const createChallenge = async (challengeData: {
    challengedUserIds: string[];
    type: '1v1' | '4player';
    title: string;
    description?: string;
    duration?: number;
    sessionId?: string;
  }) => {
    setIsLoading(true);
    try {
      const result = await createChallengeMutation.mutateAsync(challengeData);
      if (result.success) {
        // Refresh active challenges and invitations
        await activeChallengesQuery.refetch();
        await invitationsQuery.refetch();
        return result;
      }
      throw new Error(result.error || 'Failed to create challenge');
    } finally {
      setIsLoading(false);
    }
  };

  // Respond to a PK invitation
  const respondToInvitation = async (invitationId: string, response: 'accept' | 'reject') => {
    setIsLoading(true);
    try {
      const result = await respondInvitationMutation.mutateAsync({
        invitationId,
        response,
      });
      if (result.success) {
        // Refresh invitations and active challenges
        await invitationsQuery.refetch();
        await activeChallengesQuery.refetch();
        return result;
      }
      throw new Error(result.error || 'Failed to respond to invitation');
    } finally {
      setIsLoading(false);
    }
  };

  // Send a gift during PK challenge
  const sendPKGift = async (challengeId: string, recipientId: string, giftId: string, quantity: number = 1) => {
    try {
      const result = await sendGiftMutation.mutateAsync({
        challengeId,
        recipientId,
        giftId,
        quantity,
      });
      if (result.success) {
        // Update current challenge scores if it's the active one
        if (currentChallenge?.id === challengeId) {
          setCurrentChallenge(prev => prev ? {
            ...prev,
            scores: result.newScores,
          } : null);
        }
        return result;
      }
      throw new Error(result.error || 'Failed to send gift');
    } catch (error) {
      console.error('Error sending PK gift:', error);
      throw error;
    }
  };

  // Get detailed challenge information
  const getChallengeDetails = async (challengeId: string) => {
    try {
      // This function is not used in the current implementation
      // Challenge details are fetched directly in components using trpc.pk.getChallenge.useQuery
      console.log('Getting challenge details for:', challengeId);
      return null;
    } catch (error) {
      console.error('Error getting challenge details:', error);
      throw error;
    }
  };

  // Helper functions
  const getTimeRemaining = (challenge: PKChallenge): number => {
    if (!challenge.endTime) return 0;
    return Math.max(0, new Date(challenge.endTime).getTime() - Date.now());
  };

  const formatTimeRemaining = (timeMs: number): string => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isParticipant = (challenge: PKChallenge, userId: string): boolean => {
    return challenge.challengerId === userId || challenge.challengedUserIds.includes(userId);
  };

  const getParticipantTeam = (challenge: PKChallenge, userId: string): 'team1' | 'team2' | null => {
    if (challenge.type === '1v1') return null;
    return challenge.teamAssignments?.[userId] || null;
  };

  const getTeamScore = (challenge: PKChallenge, team: 'team1' | 'team2'): number => {
    if (challenge.type === '1v1') return 0;
    return Object.entries(challenge.teamAssignments || {})
      .filter(([_, userTeam]) => userTeam === team)
      .reduce((sum, [userId]) => sum + (challenge.scores[userId] || 0), 0);
  };

  return {
    // State
    activeChallenges,
    pendingInvitations,
    currentChallenge,
    challengeParticipants,
    isLoading: isLoading || activeChallengesQuery.isLoading || invitationsQuery.isLoading,

    // Actions
    createChallenge,
    respondToInvitation,
    sendPKGift,
    getChallengeDetails,

    // Helpers
    getTimeRemaining,
    formatTimeRemaining,
    isParticipant,
    getParticipantTeam,
    getTeamScore,

    // Refresh functions
    refreshActiveChallenges: activeChallengesQuery.refetch,
    refreshInvitations: invitationsQuery.refetch,
  };
});