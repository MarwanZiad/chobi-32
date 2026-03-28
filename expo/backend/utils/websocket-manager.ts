// WebSocket Manager - handles real-time connections
import { WebSocketMessage } from '../types/api-types';

export class WebSocketManager {
  private connections = new Map<string, any>(); // userId -> WebSocket connection
  private sessionConnections = new Map<string, Set<string>>(); // sessionId -> Set of userIds
  private userSessions = new Map<string, Set<string>>(); // userId -> Set of sessionIds

  // Connect user to WebSocket
  connectUser(userId: string, connection: any) {
    this.connections.set(userId, connection);
    console.log(`WebSocketManager: User ${userId} connected`);

    // Setup connection handlers
    connection.on('close', () => {
      this.disconnectUser(userId);
    });

    connection.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        this.handleMessage(userId, message);
      } catch (error) {
        console.error('WebSocketManager: Invalid message format', error);
      }
    });
  }

  // Disconnect user from WebSocket
  disconnectUser(userId: string) {
    // Remove from all sessions
    const userSessionSet = this.userSessions.get(userId);
    if (userSessionSet) {
      for (const sessionId of userSessionSet) {
        this.leaveSession(userId, sessionId);
      }
      this.userSessions.delete(userId);
    }

    // Remove connection
    this.connections.delete(userId);
    console.log(`WebSocketManager: User ${userId} disconnected`);
  }

  // Join user to a session
  joinSession(userId: string, sessionId: string) {
    // Add to session connections
    const sessionUsers = this.sessionConnections.get(sessionId) || new Set();
    sessionUsers.add(userId);
    this.sessionConnections.set(sessionId, sessionUsers);

    // Add to user sessions
    const userSessions = this.userSessions.get(userId) || new Set();
    userSessions.add(sessionId);
    this.userSessions.set(userId, userSessions);

    console.log(`WebSocketManager: User ${userId} joined session ${sessionId}`);

    // Notify other users in session
    this.broadcastToSession(sessionId, {
      type: 'viewer_joined',
      sessionId,
      userId,
      data: { userId },
      timestamp: new Date(),
    }, [userId]); // Exclude the joining user
  }

  // Remove user from a session
  leaveSession(userId: string, sessionId: string) {
    // Remove from session connections
    const sessionUsers = this.sessionConnections.get(sessionId);
    if (sessionUsers) {
      sessionUsers.delete(userId);
      if (sessionUsers.size === 0) {
        this.sessionConnections.delete(sessionId);
      }
    }

    // Remove from user sessions
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      userSessions.delete(sessionId);
      if (userSessions.size === 0) {
        this.userSessions.delete(userId);
      }
    }

    console.log(`WebSocketManager: User ${userId} left session ${sessionId}`);

    // Notify other users in session
    this.broadcastToSession(sessionId, {
      type: 'viewer_left',
      sessionId,
      userId,
      data: { userId },
      timestamp: new Date(),
    });
  }

  // Send message to specific user
  sendToUser(userId: string, message: WebSocketMessage) {
    const connection = this.connections.get(userId);
    if (connection && connection.readyState === 1) { // WebSocket.OPEN
      try {
        connection.send(JSON.stringify(message));
        console.log(`WebSocketManager: Sent message to user ${userId}`, message.type);
      } catch (error) {
        console.error(`WebSocketManager: Failed to send message to user ${userId}`, error);
      }
    }
  }

  // Broadcast message to all users in a session
  broadcastToSession(sessionId: string, message: WebSocketMessage, excludeUsers: string[] = []) {
    const sessionUsers = this.sessionConnections.get(sessionId);
    if (!sessionUsers) return;

    let sentCount = 0;
    for (const userId of sessionUsers) {
      if (!excludeUsers.includes(userId)) {
        this.sendToUser(userId, message);
        sentCount++;
      }
    }

    console.log(`WebSocketManager: Broadcasted ${message.type} to ${sentCount} users in session ${sessionId}`);
  }

  // Broadcast message to all connected users
  broadcastToAll(message: WebSocketMessage, excludeUsers: string[] = []) {
    let sentCount = 0;
    for (const userId of this.connections.keys()) {
      if (!excludeUsers.includes(userId)) {
        this.sendToUser(userId, message);
        sentCount++;
      }
    }

    console.log(`WebSocketManager: Broadcasted ${message.type} to ${sentCount} users`);
  }

  // Handle incoming messages from clients
  private handleMessage(userId: string, message: any) {
    console.log(`WebSocketManager: Received message from user ${userId}`, message);

    switch (message.type) {
      case 'join_session':
        if (message.sessionId) {
          this.joinSession(userId, message.sessionId);
        }
        break;

      case 'leave_session':
        if (message.sessionId) {
          this.leaveSession(userId, message.sessionId);
        }
        break;

      case 'ping':
        this.sendToUser(userId, {
          type: 'notification',
          data: { type: 'pong' },
          timestamp: new Date(),
        });
        break;

      default:
        console.log(`WebSocketManager: Unknown message type: ${message.type}`);
    }
  }

  // Get connection statistics
  getStats() {
    return {
      totalConnections: this.connections.size,
      activeSessions: this.sessionConnections.size,
      averageUsersPerSession: this.sessionConnections.size > 0 
        ? Array.from(this.sessionConnections.values()).reduce((sum, users) => sum + users.size, 0) / this.sessionConnections.size 
        : 0,
    };
  }

  // Get users in a session
  getSessionUsers(sessionId: string): string[] {
    const users = this.sessionConnections.get(sessionId);
    return users ? Array.from(users) : [];
  }

  // Get sessions for a user
  getUserSessions(userId: string): string[] {
    const sessions = this.userSessions.get(userId);
    return sessions ? Array.from(sessions) : [];
  }

  // Check if user is connected
  isUserConnected(userId: string): boolean {
    const connection = this.connections.get(userId);
    return connection && connection.readyState === 1;
  }

  // Clean up inactive connections
  cleanupInactiveConnections() {
    let cleanedCount = 0;
    
    for (const [userId, connection] of this.connections.entries()) {
      if (connection.readyState !== 1) { // Not OPEN
        this.disconnectUser(userId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`WebSocketManager: Cleaned up ${cleanedCount} inactive connections`);
    }

    return cleanedCount;
  }
}

// Singleton instance
export const webSocketManager = new WebSocketManager();