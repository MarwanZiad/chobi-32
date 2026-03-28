// Streaming Service - handles live streaming logic
export class StreamingService {
  private activeSessions = new Map<string, any>();
  private viewers = new Map<string, Set<string>>();

  // Create a new streaming session
  async createSession(sessionData: any) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      ...sessionData,
      status: 'waiting',
      viewerCount: 0,
      createdAt: new Date(),
      streamKey: `stream_${sessionId}`,
      rtmpUrl: `rtmp://live.chobi.app/live/${sessionId}`,
      playbackUrl: `https://live.chobi.app/hls/${sessionId}/index.m3u8`,
    };

    this.activeSessions.set(sessionId, session);
    this.viewers.set(sessionId, new Set());

    console.log('StreamingService: Created session', sessionId);
    return session;
  }

  // Join a streaming session
  async joinSession(sessionId: string, userId: string) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const sessionViewers = this.viewers.get(sessionId) || new Set();
    sessionViewers.add(userId);
    this.viewers.set(sessionId, sessionViewers);

    // Update viewer count
    session.viewerCount = sessionViewers.size;
    this.activeSessions.set(sessionId, session);

    console.log(`StreamingService: User ${userId} joined session ${sessionId}`);
    return {
      sessionId,
      viewerCount: session.viewerCount,
      playbackUrl: session.playbackUrl,
    };
  }

  // Leave a streaming session
  async leaveSession(sessionId: string, userId: string) {
    const sessionViewers = this.viewers.get(sessionId);
    if (sessionViewers) {
      sessionViewers.delete(userId);
      
      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.viewerCount = sessionViewers.size;
        this.activeSessions.set(sessionId, session);
      }
    }

    console.log(`StreamingService: User ${userId} left session ${sessionId}`);
  }

  // End a streaming session
  async endSession(sessionId: string, hostId: string) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.hostId !== hostId) {
      throw new Error('Only the host can end the session');
    }

    // Calculate final stats
    const finalStats = {
      totalViewers: this.viewers.get(sessionId)?.size || 0,
      duration: Math.floor((Date.now() - session.createdAt.getTime()) / 1000),
      endedAt: new Date(),
    };

    // Clean up
    this.activeSessions.delete(sessionId);
    this.viewers.delete(sessionId);

    console.log(`StreamingService: Session ${sessionId} ended by ${hostId}`);
    return finalStats;
  }

  // Get active sessions
  getActiveSessions(filters?: any) {
    const sessions = Array.from(this.activeSessions.values());
    
    // Apply filters if provided
    let filteredSessions = sessions;
    if (filters?.type && filters.type !== 'all') {
      filteredSessions = sessions.filter(s => s.type === filters.type);
    }
    if (filters?.category) {
      filteredSessions = filteredSessions.filter(s => s.category === filters.category);
    }

    return filteredSessions;
  }

  // Get session details
  getSession(sessionId: string) {
    return this.activeSessions.get(sessionId);
  }

  // Update session status
  updateSessionStatus(sessionId: string, status: 'waiting' | 'live' | 'ended') {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.status = status;
      this.activeSessions.set(sessionId, session);
    }
  }
}

// Singleton instance
export const streamingService = new StreamingService();