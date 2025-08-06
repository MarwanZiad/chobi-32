import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import createContextHook from '@nkzw/create-context-hook';
import { Message, Chat, Call, User, Notification } from '@/types/message';

// Mock current user
const CURRENT_USER_ID = 'current-user';

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'أحمد محمد',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
  },
  {
    id: 'user-2', 
    name: 'فاطمة علي',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 'user-3',
    name: 'محمد حسن',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
  },
];

// Mock chats data
const mockChats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    participants: [CURRENT_USER_ID, 'user-1'],
    unreadCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: 'chat-2',
    type: 'private', 
    participants: [CURRENT_USER_ID, 'user-2'],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];

// Mock messages data
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    chatId: 'chat-1',
    content: 'مرحبا! كيف حالك؟',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isRead: false,
    isDelivered: true,
  },
  {
    id: 'msg-2',
    senderId: CURRENT_USER_ID,
    chatId: 'chat-1', 
    content: 'أهلا وسهلا، بخير والحمد لله',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    isRead: true,
    isDelivered: true,
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    chatId: 'chat-1',
    content: 'هل يمكننا التحدث لاحقاً؟',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
    isDelivered: true,
  },
];

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'رسالة جديدة',
    body: 'أحمد محمد أرسل لك رسالة',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
    userId: 'user-1',
    data: { chatId: 'chat-1' },
  },
  {
    id: 'notif-2',
    type: 'call',
    title: 'مكالمة فائتة',
    body: 'فاطمة علي حاولت الاتصال بك',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    userId: 'user-2',
    data: { callType: 'video' },
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'تحديث التطبيق',
    body: 'يتوفر إصدار جديد من التطبيق',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
    userId: CURRENT_USER_ID,
  },
];

export const [ChatProvider, useChat] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTyping, setIsTyping] = useState<{ [chatId: string]: string[] }>({});

  const loadInitialData = useCallback(async () => {
    try {
      // Load from AsyncStorage or use mock data
      const storedChats = await AsyncStorage.getItem('chats');
      const storedMessages = await AsyncStorage.getItem('messages');
      const storedUsers = await AsyncStorage.getItem('users');
      const storedNotifications = await AsyncStorage.getItem('notifications');

      // Parse and convert date strings back to Date objects
      const parsedChats = storedChats ? JSON.parse(storedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        lastMessage: chat.lastMessage ? {
          ...chat.lastMessage,
          timestamp: new Date(chat.lastMessage.timestamp),
          expiresAt: chat.lastMessage.expiresAt ? new Date(chat.lastMessage.expiresAt) : undefined,
        } : undefined,
      })) : mockChats;

      const parsedMessages = storedMessages ? JSON.parse(storedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        expiresAt: msg.expiresAt ? new Date(msg.expiresAt) : undefined,
      })) : mockMessages;

      const parsedUsers = storedUsers ? JSON.parse(storedUsers).map((user: any) => ({
        ...user,
        lastSeen: user.lastSeen ? new Date(user.lastSeen) : undefined,
      })) : mockUsers;

      const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications).map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp),
      })) : mockNotifications;

      setChats(parsedChats);
      setMessages(parsedMessages);
      setUsers(parsedUsers);
      setNotifications(parsedNotifications);
    } catch (error) {
      console.error('Error loading chat data:', error);
      // Fallback to mock data
      setChats(mockChats);
      setMessages(mockMessages);
      setUsers(mockUsers);
      setNotifications(mockNotifications);
    }
  }, []);

  const setupNotifications = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // Configure notifications
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    }
  }, []);

  // Initialize data - run only once on mount
  useEffect(() => {
    loadInitialData();
    setupNotifications();
  }, []);

  // Add notification
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Save to storage
      AsyncStorage.setItem('notifications', JSON.stringify(updated)).catch(error => {
        console.error('Error saving notification:', error);
      });
      return updated;
    });

    // Send push notification if supported
    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
        trigger: null,
      });
    }

    return newNotification;
  }, []);

  // Send message
  const sendMessage = useCallback(async (chatId: string, content: string, type: Message['type'] = 'text', mediaUrl?: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      chatId,
      content,
      type,
      timestamp: new Date(),
      isRead: false,
      isDelivered: true,
      mediaUrl,
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      // Save to storage
      AsyncStorage.setItem('messages', JSON.stringify(updated)).catch(error => {
        console.error('Error saving message:', error);
      });
      return updated;
    });
    
    // Update chat's last message and timestamp
    setChats(prev => {
      const updated = prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
          : chat
      );
      // Save to storage
      AsyncStorage.setItem('chats', JSON.stringify(updated)).catch(error => {
        console.error('Error updating chat:', error);
      });
      return updated;
    });

    return newMessage;
  }, []);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string, deleteFor: 'sender' | 'everyone' = 'sender') => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isDeleted: true, deletedFor: deleteFor }
          : msg
      );
      // Save to storage
      AsyncStorage.setItem('messages', JSON.stringify(updated)).catch(error => {
        console.error('Error deleting message:', error);
      });
      return updated;
    });
  }, []);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (chatId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.chatId === chatId && msg.senderId !== CURRENT_USER_ID
          ? { ...msg, isRead: true }
          : msg
      );
      // Save to storage
      AsyncStorage.setItem('messages', JSON.stringify(updated)).catch(error => {
        console.error('Error marking messages as read:', error);
      });
      return updated;
    });

    setChats(prev => {
      const updated = prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 }
          : chat
      );
      // Save to storage
      AsyncStorage.setItem('chats', JSON.stringify(updated)).catch(error => {
        console.error('Error updating chat unread count:', error);
      });
      return updated;
    });
  }, []);

  // Start call
  const startCall = useCallback(async (receiverId: string, type: 'audio' | 'video') => {
    const call: Call = {
      id: `call-${Date.now()}`,
      type,
      callerId: CURRENT_USER_ID,
      receiverId,
      status: 'ringing',
      startTime: new Date(),
    };

    setActiveCall(call);
    
    // Simulate call being accepted after 3 seconds for demo
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
    }, 3000);
    
    // Add notification for call
    const newNotification: Notification = {
      type: 'call',
      title: type === 'video' ? 'مكالمة فيديو واردة' : 'مكالمة صوتية واردة',
      body: 'مستخدم يتصل بك',
      userId: receiverId,
      isRead: false,
      data: { callId: call.id, type: 'call' },
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);

    return call;
  }, []);

  // End call
  const endCall = useCallback(() => {
    if (activeCall) {
      const endTime = new Date();
      const duration = endTime.getTime() - (activeCall.startTime?.getTime() || 0);
      
      setActiveCall(prev => prev ? {
        ...prev,
        status: 'ended',
        endTime,
        duration: Math.floor(duration / 1000),
      } : null);

      // Clear active call after a short delay
      setTimeout(() => setActiveCall(null), 2000);
    }
  }, [activeCall]);

  // Set typing indicator
  const setTypingIndicator = useCallback((chatId: string, isTyping: boolean) => {
    setIsTyping(prev => ({
      ...prev,
      [chatId]: isTyping 
        ? [...(prev[chatId] || []), CURRENT_USER_ID]
        : (prev[chatId] || []).filter(id => id !== CURRENT_USER_ID)
    }));
  }, []);

  // Send temporary message
  const sendTemporaryMessage = useCallback(async (chatId: string, content: string, expirationMinutes: number = 5) => {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      chatId,
      content,
      type: 'text',
      timestamp: new Date(),
      isRead: false,
      isDelivered: true,
      isTemporary: true,
      expiresAt,
    };

    setMessages(prev => [...prev, tempMessage]);

    // Auto-delete after expiration
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }, expirationMinutes * 60 * 1000);

    return tempMessage;
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      );
      // Save to storage
      AsyncStorage.setItem('notifications', JSON.stringify(updated)).catch(error => {
        console.error('Error marking notification as read:', error);
      });
      return updated;
    });
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);
    
    try {
      await AsyncStorage.removeItem('notifications');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, []);

  // Get chat messages
  const getChatMessages = useCallback((chatId: string) => {
    return messages
      .filter(msg => msg.chatId === chatId && !msg.isDeleted)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [messages]);

  // Get user by ID
  const getUserById = useCallback((userId: string) => {
    return users.find(user => user.id === userId);
  }, [users]);

  // Create new chat
  const createChat = useCallback(async (participantId: string) => {
    let existingChat: Chat | undefined;
    let newChat: Chat | undefined;
    
    setChats(prev => {
      // Check if chat already exists
      existingChat = prev.find(chat => 
        chat.type === 'private' && 
        chat.participants.includes(participantId) && 
        chat.participants.includes(CURRENT_USER_ID)
      );

      if (existingChat) {
        return prev;
      }

      newChat = {
        id: `chat-${Date.now()}`,
        type: 'private',
        participants: [CURRENT_USER_ID, participantId],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updated = [...prev, newChat];
      // Save to storage
      AsyncStorage.setItem('chats', JSON.stringify(updated)).catch(error => {
        console.error('Error creating chat:', error);
      });
      return updated;
    });

    return existingChat || newChat!;
  }, []);

  // Update user online status
  const updateUserStatus = useCallback(async (userId: string, isOnline: boolean, lastSeen?: Date) => {
    setUsers(prev => {
      const updated = prev.map(user => 
        user.id === userId 
          ? { ...user, isOnline, lastSeen: lastSeen || new Date() }
          : user
      );
      // Save to storage
      AsyncStorage.setItem('users', JSON.stringify(updated)).catch(error => {
        console.error('Error updating user status:', error);
      });
      return updated;
    });
  }, []);

  // Block/Unblock user
  const toggleBlockUser = useCallback(async (userId: string) => {
    // Implementation for blocking/unblocking users
    console.log('Toggle block user:', userId);
  }, []);

  return {
    // State
    chats,
    messages,
    users,
    activeCall,
    notifications,
    isTyping,
    currentUserId: CURRENT_USER_ID,
    
    // Actions
    sendMessage,
    deleteMessage,
    markMessagesAsRead,
    startCall,
    endCall,
    setTypingIndicator,
    sendTemporaryMessage,
    getChatMessages,
    getUserById,
    createChat,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    updateUserStatus,
    toggleBlockUser,
  };
});