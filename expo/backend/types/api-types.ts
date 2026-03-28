// API Types for Chobi Live Backend

// Streaming Types
export interface StreamingSession {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  title: string;
  description?: string;
  type: 'video' | 'audio';
  category?: string;
  isPrivate: boolean;
  maxViewers?: number;
  viewerCount: number;
  status: 'waiting' | 'live' | 'ended';
  thumbnail?: string;
  tags: string[];
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  streamKey: string;
  rtmpUrl: string;
  playbackUrl: string;
}

export interface ViewerSession {
  sessionId: string;
  userId: string;
  role: 'viewer' | 'co-host';
  token: string;
  joinedAt: Date;
  permissions: {
    canChat: boolean;
    canSendGifts: boolean;
    canRequestCoHost: boolean;
    canModerate: boolean;
  };
}

// Chat Types
export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  type: 'text' | 'emoji' | 'gift';
  giftId?: string;
  timestamp: Date;
  isHighlighted: boolean;
}

// Gift Types
export interface Gift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: string;
  animation: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface GiftTransaction {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  giftId: string;
  giftName: string;
  giftEmoji: string;
  quantity: number;
  totalCost: number;
  message?: string;
  timestamp: Date;
  animation: string;
}

// User Types
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  coins: number;
  diamonds: number;
  followers: number;
  following: number;
  totalStreams: number;
  totalViewTime: number;
  badges: UserBadge[];
  achievements: UserAchievement[];
  stats: UserStats;
  preferences: UserPreferences;
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
  currentStreamId?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  icon: string;
}

export interface UserStats {
  totalStreamTime: number;
  averageViewers: number;
  peakViewers: number;
  totalGiftsReceived: number;
  totalGiftsSent: number;
  favoriteCategory: string;
}

export interface UserPreferences {
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
}

// Video Types
export interface Video {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
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

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'gift' | 'comment' | 'stream' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// Analytics Types
export interface StreamStats {
  overview: {
    totalStreams: number;
    totalViewTime: number;
    totalViewers: number;
    averageViewers: number;
    peakViewers: number;
    totalGiftsReceived: number;
    totalRevenue: number;
  };
  viewersByHour: Array<{
    hour: number;
    viewers: number;
  }>;
  topCountries: Array<{
    country: string;
    viewers: number;
    percentage: number;
  }>;
  deviceTypes: Array<{
    type: 'mobile' | 'desktop' | 'tablet';
    viewers: number;
    percentage: number;
  }>;
  giftStats: {
    totalGifts: number;
    totalValue: number;
    topGifts: Array<{
      giftId: string;
      name: string;
      count: number;
      value: number;
    }>;
  };
  engagementMetrics: {
    averageWatchTime: number;
    chatMessagesPerMinute: number;
    giftsPerHour: number;
    returnViewerRate: number;
    shareRate: number;
  };
  recentStreams: Array<{
    id: string;
    title: string;
    date: Date;
    duration: number;
    peakViewers: number;
    totalGifts: number;
    revenue: number;
  }>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'new_message' | 'gift_animation' | 'viewer_joined' | 'viewer_left' | 'session_ended' | 'notification';
  sessionId?: string;
  userId?: string;
  data: any;
  timestamp: Date;
}