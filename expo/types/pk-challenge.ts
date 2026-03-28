export interface PKChallenge {
  id: string;
  challengerId: string;
  challengedUserIds: string[];
  type: '1v1' | '4player';
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled' | 'expired';
  title: string;
  description?: string;
  duration: number;
  startTime?: Date;
  endTime?: Date;
  scores: Record<string, number>;
  winnerId?: string;
  winnerTeam?: string;
  teamAssignments?: Record<string, 'team1' | 'team2'>;
  settings: {
    allowGifts: boolean;
    allowComments: boolean;
    customRules?: string;
    pointsPerGift: Record<string, number>;
  };
  sessionId?: string;
  viewerCount: number;
  totalGifts: number;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PKInvitation {
  id: string;
  challengeId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  challenge?: {
    id: string;
    title: string;
    description?: string;
    type: '1v1' | '4player';
    duration: number;
  };
  inviter?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    level: number;
    isVerified: boolean;
  };
}

export interface PKParticipant {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  isVerified: boolean;
}

export interface PKGiftTransaction {
  id: string;
  challengeId: string;
  senderId: string;
  recipientId: string;
  giftId: string;
  quantity: number;
  points: number;
  totalCost: number;
  message?: string;
  createdAt: Date;
}

export interface PKEvent {
  id: string;
  challengeId: string;
  type: 'start' | 'end' | 'gift_sent' | 'score_update' | 'user_joined' | 'user_left';
  userId?: string;
  data: any;
  timestamp: Date;
}

export interface PKLeaderboard {
  userId: string;
  score: number;
}

export interface PKTeamLeaderboard {
  team1: { score: number };
  team2: { score: number };
  individual: PKLeaderboard[];
}