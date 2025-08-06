// Database Models for Chobi Live
// In production, these would be actual database schemas (Prisma, TypeORM, etc.)

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  level: number;
  experience: number;
  coins: number;
  diamonds: number;
  followers: number;
  following: number;
  totalStreams: number;
  totalViewTime: number;
  isVerified: boolean;
  isOnline: boolean;
  lastActive: Date;
  preferences: {
    language: 'ar' | 'en';
    theme: 'light' | 'dark';
    notifications: {
      newFollower: boolean;
      giftReceived: boolean;
      streamStarted: boolean;
      comments: boolean;
    };
    privacy: {
      showOnlineStatus: boolean;
      allowDirectMessages: boolean;
      showStats: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseStreamingSession {
  id: string;
  hostId: string;
  title: string;
  description?: string;
  type: 'video' | 'audio';
  category?: string;
  isPrivate: boolean;
  maxViewers?: number;
  status: 'waiting' | 'live' | 'ended';
  thumbnail?: string;
  tags: string[];
  streamKey: string;
  rtmpUrl: string;
  playbackUrl: string;
  viewerCount: number;
  peakViewers: number;
  totalMessages: number;
  totalGifts: number;
  totalRevenue: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt: Date;
}

export interface DatabaseChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  message: string;
  type: 'text' | 'emoji' | 'gift';
  giftId?: string;
  isHighlighted: boolean;
  createdAt: Date;
}

export interface DatabaseGift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: string;
  animation: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseGiftTransaction {
  id: string;
  sessionId: string;
  senderId: string;
  recipientId: string;
  giftId: string;
  quantity: number;
  totalCost: number;
  recipientEarning: number;
  message?: string;
  createdAt: Date;
}

export interface DatabaseVideo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail: string;
  videoUrl: string;
  duration: number;
  isPrivate: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  status: 'processing' | 'ready' | 'failed';
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseNotification {
  id: string;
  userId: string;
  type: 'follow' | 'gift' | 'comment' | 'stream' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface DatabaseFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface DatabaseUserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface DatabaseBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirements: any;
  isActive: boolean;
  createdAt: Date;
}

export interface DatabaseUserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface DatabaseAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: any;
  points: number;
  isActive: boolean;
  createdAt: Date;
}

export interface DatabaseViewerSession {
  id: string;
  sessionId: string;
  userId: string;
  role: 'viewer' | 'co-host';
  joinedAt: Date;
  leftAt?: Date;
  watchTime: number;
  messagesSent: number;
  giftsSent: number;
}

export interface DatabaseVideoComment {
  id: string;
  videoId: string;
  userId: string;
  comment: string;
  parentId?: string; // for replies
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseVideoLike {
  id: string;
  videoId: string;
  userId: string;
  type: 'like' | 'dislike';
  createdAt: Date;
}

export interface DatabaseReport {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedSessionId?: string;
  reportedVideoId?: string;
  reportedCommentId?: string;
  type: 'spam' | 'harassment' | 'inappropriate_content' | 'copyright' | 'other';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseAnalytics {
  id: string;
  sessionId?: string;
  userId?: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  device?: string;
}

// PK Challenge Models
export interface DatabasePKChallenge {
  id: string;
  challengerId: string;
  challengedUserIds: string[];
  type: '1v1' | '4player';
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled' | 'expired';
  title: string;
  description?: string;
  duration: number; // in seconds
  startTime?: Date;
  endTime?: Date;
  scores: Record<string, number>; // userId -> score
  winnerId?: string;
  winnerTeam?: string;
  teamAssignments?: Record<string, 'team1' | 'team2'>; // for team-based challenges
  settings: {
    allowGifts: boolean;
    allowComments: boolean;
    customRules?: string;
    pointsPerGift: Record<string, number>; // giftId -> points
  };
  sessionId?: string; // linked streaming session
  viewerCount: number;
  totalGifts: number;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabasePKInvitation {
  id: string;
  challengeId: string;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
}

export interface DatabasePKGiftTransaction {
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

export interface DatabasePKEvent {
  id: string;
  challengeId: string;
  type: 'start' | 'end' | 'gift_sent' | 'score_update' | 'user_joined' | 'user_left';
  userId?: string;
  data: any;
  timestamp: Date;
}

// Mock Database Class
export class MockDatabase {
  private users = new Map<string, DatabaseUser>();
  private sessions = new Map<string, DatabaseStreamingSession>();
  private messages = new Map<string, DatabaseChatMessage[]>();
  private gifts = new Map<string, DatabaseGift>();
  private giftTransactions = new Map<string, DatabaseGiftTransaction>();
  private videos = new Map<string, DatabaseVideo>();
  private notifications = new Map<string, DatabaseNotification[]>();
  private follows = new Map<string, DatabaseFollow[]>();
  private badges = new Map<string, DatabaseBadge>();
  private achievements = new Map<string, DatabaseAchievement>();
  private pkChallenges = new Map<string, DatabasePKChallenge>();
  private pkInvitations = new Map<string, DatabasePKInvitation>();
  private pkGiftTransactions = new Map<string, DatabasePKGiftTransaction>();
  private pkEvents = new Map<string, DatabasePKEvent[]>();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize virtual users from mocks
    this.initializeVirtualUsers();
    
    // Initialize mock gifts
    const mockGifts: DatabaseGift[] = [
      {
        id: 'gift_rose',
        name: 'وردة حمراء',
        emoji: '🌹',
        price: 10,
        category: 'flowers',
        animation: 'rose_animation',
        rarity: 'common',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'gift_heart',
        name: 'قلب',
        emoji: '❤️',
        price: 5,
        category: 'love',
        animation: 'heart_animation',
        rarity: 'common',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'gift_diamond',
        name: 'ماسة',
        emoji: '💎',
        price: 100,
        category: 'luxury',
        animation: 'diamond_animation',
        rarity: 'rare',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockGifts.forEach(gift => {
      this.gifts.set(gift.id, gift);
    });

    // Initialize mock badges
    const mockBadges: DatabaseBadge[] = [
      {
        id: 'verified',
        name: 'موثق',
        icon: '✅',
        description: 'حساب موثق',
        requirements: { verified: true },
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'top_streamer',
        name: 'مبدع مميز',
        icon: '🌟',
        description: 'من أفضل المبدعين',
        requirements: { totalStreams: 50, averageViewers: 100 },
        isActive: true,
        createdAt: new Date(),
      },
    ];

    mockBadges.forEach(badge => {
      this.badges.set(badge.id, badge);
    });

    console.log('MockDatabase: Initialized with mock data');
  }

  private async initializeVirtualUsers() {
    // Import users from mocks
    const { users } = await import('@/mocks/users');
    
    // Convert User interface to DatabaseUser interface for virtual accounts
    const virtualUsers = users.filter(user => user.accountType === 'virtual');
    
    for (const user of virtualUsers) {
      const dbUser: DatabaseUser = {
        id: user.id,
        username: user.username,
        email: `${user.handle.replace('@', '')}@chobi.app`,
        displayName: user.username,
        avatar: user.imageUrl,
        bio: user.bio || '',
        level: user.level || 1,
        experience: (user.level || 1) * 100,
        coins: Math.floor(Math.random() * 1000) + 500,
        diamonds: Math.floor(Math.random() * 100) + 50,
        followers: user.followers || 0,
        following: Math.floor(Math.random() * 200) + 50,
        totalStreams: Math.floor(Math.random() * 100) + 10,
        totalViewTime: Math.floor(Math.random() * 10000) + 1000,
        isVerified: (user.level ?? 0) > 25,
        isOnline: user.isOnline || false,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random within last 24h
        preferences: {
          language: 'ar',
          theme: 'dark',
          notifications: {
            newFollower: true,
            giftReceived: true,
            streamStarted: true,
            comments: true,
          },
          privacy: {
            showOnlineStatus: true,
            allowDirectMessages: true,
            showStats: true,
          },
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)), // Random within last year
        updatedAt: new Date(),
      };
      
      this.users.set(dbUser.id, dbUser);
    }
    
    console.log(`MockDatabase: Initialized ${virtualUsers.length} virtual users`);
  }

  // User operations
  async createUser(userData: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const user: DatabaseUser = {
      id: userData.id || `user_${Date.now()}`,
      username: userData.username || 'user',
      email: userData.email || 'user@example.com',
      displayName: userData.displayName || 'User',
      avatar: userData.avatar,
      bio: userData.bio,
      level: userData.level || 1,
      experience: userData.experience || 0,
      coins: userData.coins || 100,
      diamonds: userData.diamonds || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      totalStreams: userData.totalStreams || 0,
      totalViewTime: userData.totalViewTime || 0,
      isVerified: userData.isVerified || false,
      isOnline: userData.isOnline || false,
      lastActive: userData.lastActive || new Date(),
      preferences: userData.preferences || {
        language: 'ar',
        theme: 'dark',
        notifications: {
          newFollower: true,
          giftReceived: true,
          streamStarted: true,
          comments: true,
        },
        privacy: {
          showOnlineStatus: true,
          allowDirectMessages: true,
          showStats: true,
        },
      },
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async getUserById(userId: string): Promise<DatabaseUser | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<DatabaseUser[]> {
    return Array.from(this.users.values());
  }

  async searchUsers(query: string): Promise<DatabaseUser[]> {
    const allUsers = Array.from(this.users.values());
    return allUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Session operations
  async createSession(sessionData: Partial<DatabaseStreamingSession>): Promise<DatabaseStreamingSession> {
    const session: DatabaseStreamingSession = {
      id: sessionData.id || `session_${Date.now()}`,
      hostId: sessionData.hostId || 'unknown',
      title: sessionData.title || 'Untitled Stream',
      description: sessionData.description,
      type: sessionData.type || 'video',
      category: sessionData.category,
      isPrivate: sessionData.isPrivate || false,
      maxViewers: sessionData.maxViewers,
      status: sessionData.status || 'waiting',
      thumbnail: sessionData.thumbnail,
      tags: sessionData.tags || [],
      streamKey: sessionData.streamKey || `stream_${sessionData.id}`,
      rtmpUrl: sessionData.rtmpUrl || `rtmp://live.chobi.app/live/${sessionData.id}`,
      playbackUrl: sessionData.playbackUrl || `https://live.chobi.app/hls/${sessionData.id}/index.m3u8`,
      viewerCount: sessionData.viewerCount || 0,
      peakViewers: sessionData.peakViewers || 0,
      totalMessages: sessionData.totalMessages || 0,
      totalGifts: sessionData.totalGifts || 0,
      totalRevenue: sessionData.totalRevenue || 0,
      createdAt: sessionData.createdAt || new Date(),
      startedAt: sessionData.startedAt,
      endedAt: sessionData.endedAt,
      updatedAt: new Date(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  async getSessionById(sessionId: string): Promise<DatabaseStreamingSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async getActiveSessions(): Promise<DatabaseStreamingSession[]> {
    return Array.from(this.sessions.values()).filter(s => s.status === 'live');
  }

  // Gift operations
  async getGifts(): Promise<DatabaseGift[]> {
    return Array.from(this.gifts.values()).filter(g => g.isActive);
  }

  async createGiftTransaction(transactionData: Partial<DatabaseGiftTransaction>): Promise<DatabaseGiftTransaction> {
    const transaction: DatabaseGiftTransaction = {
      id: transactionData.id || `gift_${Date.now()}`,
      sessionId: transactionData.sessionId || '',
      senderId: transactionData.senderId || '',
      recipientId: transactionData.recipientId || '',
      giftId: transactionData.giftId || '',
      quantity: transactionData.quantity || 1,
      totalCost: transactionData.totalCost || 0,
      recipientEarning: transactionData.recipientEarning || 0,
      message: transactionData.message,
      createdAt: transactionData.createdAt || new Date(),
    };

    this.giftTransactions.set(transaction.id, transaction);
    return transaction;
  }

  // Notification operations
  async createNotification(notificationData: Partial<DatabaseNotification>): Promise<DatabaseNotification> {
    const notification: DatabaseNotification = {
      id: notificationData.id || `notif_${Date.now()}`,
      userId: notificationData.userId || '',
      type: notificationData.type || 'system',
      title: notificationData.title || '',
      message: notificationData.message || '',
      data: notificationData.data,
      isRead: notificationData.isRead || false,
      createdAt: notificationData.createdAt || new Date(),
    };

    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.push(notification);
    this.notifications.set(notification.userId, userNotifications);

    return notification;
  }

  async getUserNotifications(userId: string): Promise<DatabaseNotification[]> {
    return this.notifications.get(userId) || [];
  }

  // Analytics operations
  async logAnalyticsEvent(eventData: Partial<DatabaseAnalytics>): Promise<void> {
    // In production, this would save to analytics database
    console.log('Analytics event:', eventData);
  }

  // PK Challenge operations
  async createPKChallenge(challengeData: Partial<DatabasePKChallenge>): Promise<DatabasePKChallenge> {
    const challenge: DatabasePKChallenge = {
      id: challengeData.id || `pk_${Date.now()}`,
      challengerId: challengeData.challengerId || '',
      challengedUserIds: challengeData.challengedUserIds || [],
      type: challengeData.type || '1v1',
      status: challengeData.status || 'pending',
      title: challengeData.title || 'PK Challenge',
      description: challengeData.description,
      duration: challengeData.duration || 300, // 5 minutes default
      startTime: challengeData.startTime,
      endTime: challengeData.endTime,
      scores: challengeData.scores || {},
      winnerId: challengeData.winnerId,
      winnerTeam: challengeData.winnerTeam,
      teamAssignments: challengeData.teamAssignments,
      settings: challengeData.settings || {
        allowGifts: true,
        allowComments: true,
        pointsPerGift: {
          'gift_heart': 1,
          'gift_rose': 2,
          'gift_diamond': 10,
        },
      },
      sessionId: challengeData.sessionId,
      viewerCount: challengeData.viewerCount || 0,
      totalGifts: challengeData.totalGifts || 0,
      totalRevenue: challengeData.totalRevenue || 0,
      createdAt: challengeData.createdAt || new Date(),
      updatedAt: new Date(),
    };

    this.pkChallenges.set(challenge.id, challenge);
    return challenge;
  }

  async getPKChallengeById(challengeId: string): Promise<DatabasePKChallenge | null> {
    return this.pkChallenges.get(challengeId) || null;
  }

  async updatePKChallenge(challengeId: string, updates: Partial<DatabasePKChallenge>): Promise<DatabasePKChallenge | null> {
    const challenge = this.pkChallenges.get(challengeId);
    if (!challenge) return null;

    const updatedChallenge = { ...challenge, ...updates, updatedAt: new Date() };
    this.pkChallenges.set(challengeId, updatedChallenge);
    return updatedChallenge;
  }

  async getActivePKChallenges(): Promise<DatabasePKChallenge[]> {
    return Array.from(this.pkChallenges.values()).filter(c => c.status === 'active');
  }

  async getUserPKChallenges(userId: string): Promise<DatabasePKChallenge[]> {
    return Array.from(this.pkChallenges.values()).filter(c => 
      c.challengerId === userId || c.challengedUserIds.includes(userId)
    );
  }

  async createPKInvitation(invitationData: Partial<DatabasePKInvitation>): Promise<DatabasePKInvitation> {
    const invitation: DatabasePKInvitation = {
      id: invitationData.id || `inv_${Date.now()}`,
      challengeId: invitationData.challengeId || '',
      inviterId: invitationData.inviterId || '',
      inviteeId: invitationData.inviteeId || '',
      status: invitationData.status || 'pending',
      message: invitationData.message,
      expiresAt: invitationData.expiresAt || new Date(Date.now() + 60000), // 1 minute default
      respondedAt: invitationData.respondedAt,
      createdAt: invitationData.createdAt || new Date(),
    };

    this.pkInvitations.set(invitation.id, invitation);
    return invitation;
  }

  async getPKInvitationById(invitationId: string): Promise<DatabasePKInvitation | null> {
    return this.pkInvitations.get(invitationId) || null;
  }

  async updatePKInvitation(invitationId: string, updates: Partial<DatabasePKInvitation>): Promise<DatabasePKInvitation | null> {
    const invitation = this.pkInvitations.get(invitationId);
    if (!invitation) return null;

    const updatedInvitation = { ...invitation, ...updates };
    this.pkInvitations.set(invitationId, updatedInvitation);
    return updatedInvitation;
  }

  async getUserPKInvitations(userId: string): Promise<DatabasePKInvitation[]> {
    return Array.from(this.pkInvitations.values()).filter(i => 
      i.inviteeId === userId && i.status === 'pending' && i.expiresAt > new Date()
    );
  }

  async createPKGiftTransaction(transactionData: Partial<DatabasePKGiftTransaction>): Promise<DatabasePKGiftTransaction> {
    const transaction: DatabasePKGiftTransaction = {
      id: transactionData.id || `pkgift_${Date.now()}`,
      challengeId: transactionData.challengeId || '',
      senderId: transactionData.senderId || '',
      recipientId: transactionData.recipientId || '',
      giftId: transactionData.giftId || '',
      quantity: transactionData.quantity || 1,
      points: transactionData.points || 0,
      totalCost: transactionData.totalCost || 0,
      message: transactionData.message,
      createdAt: transactionData.createdAt || new Date(),
    };

    this.pkGiftTransactions.set(transaction.id, transaction);
    return transaction;
  }

  async getPKGiftTransactions(challengeId: string): Promise<DatabasePKGiftTransaction[]> {
    return Array.from(this.pkGiftTransactions.values()).filter(t => t.challengeId === challengeId);
  }

  async createPKEvent(eventData: Partial<DatabasePKEvent>): Promise<DatabasePKEvent> {
    const event: DatabasePKEvent = {
      id: eventData.id || `pkevent_${Date.now()}`,
      challengeId: eventData.challengeId || '',
      type: eventData.type || 'start',
      userId: eventData.userId,
      data: eventData.data || {},
      timestamp: eventData.timestamp || new Date(),
    };

    const challengeEvents = this.pkEvents.get(event.challengeId) || [];
    challengeEvents.push(event);
    this.pkEvents.set(event.challengeId, challengeEvents);

    return event;
  }

  async getPKEvents(challengeId: string): Promise<DatabasePKEvent[]> {
    return this.pkEvents.get(challengeId) || [];
  }

  // Cleanup operations
  async cleanupOldData(): Promise<void> {
    // Clean up old sessions, messages, notifications, etc.
    console.log('MockDatabase: Cleanup completed');
  }
}

// Singleton instance
export const mockDatabase = new MockDatabase();