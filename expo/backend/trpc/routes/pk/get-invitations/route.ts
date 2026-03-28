import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { mockDatabase } from '../../../../database/models';

export const getInvitationsProcedure = publicProcedure
  .query(async ({ ctx }) => {
    try {
      const userId = ctx.userId || 'user_demo'; // Demo user for testing
      console.log('Getting PK invitations for user:', userId);
      
      // Get pending invitations for the user
      const invitations = await mockDatabase.getUserPKInvitations(userId);
      
      // Get challenge and inviter details for each invitation
      const detailedInvitations = await Promise.all(
        invitations.map(async (invitation) => {
          const challenge = await mockDatabase.getPKChallengeById(invitation.challengeId);
          const inviter = await mockDatabase.getUserById(invitation.inviterId);
          
          return {
            ...invitation,
            challenge: challenge ? {
              id: challenge.id,
              title: challenge.title,
              description: challenge.description,
              type: challenge.type,
              duration: challenge.duration,
            } : null,
            inviter: inviter ? {
              id: inviter.id,
              username: inviter.username,
              displayName: inviter.displayName,
              avatar: inviter.avatar,
              level: inviter.level,
              isVerified: inviter.isVerified,
            } : null,
          };
        })
      );

      return {
        success: true,
        invitations: detailedInvitations.filter(inv => inv.challenge && inv.inviter),
      };
    } catch (error) {
      console.error('Error getting PK invitations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ في جلب الدعوات',
        invitations: [],
      };
    }
  });