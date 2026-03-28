export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
  isTemporary?: boolean;
  expiresAt?: Date;
  replyTo?: string;
  isDeleted?: boolean;
  deletedFor?: 'sender' | 'everyone';
  mediaUrl?: string;
  mediaThumbnail?: string;
  duration?: number; // for audio/video
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  participants: string[];
  name?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Call {
  id: string;
  type: 'audio' | 'video';
  callerId: string;
  receiverId: string;
  status: 'ringing' | 'active' | 'ended' | 'missed' | 'declined';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface Notification {
  id: string;
  type: 'message' | 'call' | 'system';
  title: string;
  body: string;
  data?: any;
  timestamp: Date;
  isRead: boolean;
  userId: string;
}