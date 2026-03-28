// Chat Service - handles real-time chat functionality
export class ChatService {
  private sessionMessages = new Map<string, any[]>();
  private connectedUsers = new Map<string, Set<string>>();

  // Send a message to a session
  async sendMessage(sessionId: string, userId: string, messageData: any) {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      ...messageData,
      timestamp: new Date(),
    };

    // Store message
    const messages = this.sessionMessages.get(sessionId) || [];
    messages.push(message);
    this.sessionMessages.set(sessionId, messages);

    // In production, broadcast to all connected users via WebSocket
    this.broadcastToSession(sessionId, {
      type: 'new_message',
      data: message,
    });

    console.log('ChatService: Message sent', message.id);
    return message;
  }

  // Get messages for a session
  getMessages(sessionId: string, limit = 50, before?: string) {
    const messages = this.sessionMessages.get(sessionId) || [];
    
    let filteredMessages = messages;
    if (before) {
      const beforeIndex = messages.findIndex(msg => msg.id === before);
      if (beforeIndex > 0) {
        filteredMessages = messages.slice(0, beforeIndex);
      }
    }

    return {
      messages: filteredMessages.slice(-limit),
      hasMore: filteredMessages.length > limit,
    };
  }

  // Connect user to session chat
  connectUser(sessionId: string, userId: string) {
    const users = this.connectedUsers.get(sessionId) || new Set();
    users.add(userId);
    this.connectedUsers.set(sessionId, users);

    console.log(`ChatService: User ${userId} connected to session ${sessionId}`);
  }

  // Disconnect user from session chat
  disconnectUser(sessionId: string, userId: string) {
    const users = this.connectedUsers.get(sessionId);
    if (users) {
      users.delete(userId);
      if (users.size === 0) {
        this.connectedUsers.delete(sessionId);
      }
    }

    console.log(`ChatService: User ${userId} disconnected from session ${sessionId}`);
  }

  // Broadcast message to all connected users in a session
  private broadcastToSession(sessionId: string, data: any) {
    const connectedUsers = this.connectedUsers.get(sessionId);
    if (connectedUsers) {
      // In production, use WebSocket to broadcast to all connected users
      console.log(`ChatService: Broadcasting to ${connectedUsers.size} users in session ${sessionId}`, data);
      
      // Mock WebSocket broadcast
      // for (const userId of connectedUsers) {
      //   webSocketManager.sendToUser(userId, data);
      // }
    }
  }

  // Clear messages for a session (when session ends)
  clearSessionMessages(sessionId: string) {
    this.sessionMessages.delete(sessionId);
    this.connectedUsers.delete(sessionId);
    console.log(`ChatService: Cleared messages for session ${sessionId}`);
  }

  // Get chat statistics
  getChatStats(sessionId: string) {
    const messages = this.sessionMessages.get(sessionId) || [];
    const connectedUsers = this.connectedUsers.get(sessionId) || new Set();

    return {
      totalMessages: messages.length,
      connectedUsers: connectedUsers.size,
      messagesPerMinute: this.calculateMessagesPerMinute(messages),
    };
  }

  private calculateMessagesPerMinute(messages: any[]) {
    if (messages.length === 0) return 0;

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentMessages = messages.filter(msg => 
      new Date(msg.timestamp).getTime() > oneMinuteAgo
    );

    return recentMessages.length;
  }
}

// Singleton instance
export const chatService = new ChatService();