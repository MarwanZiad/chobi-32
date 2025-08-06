import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";

// Streaming routes
import { createSessionProcedure } from "./routes/streaming/create-session/route";
import { joinSessionProcedure } from "./routes/streaming/join-session/route";
import { endSessionProcedure } from "./routes/streaming/end-session/route";
import { getActiveSessionsProcedure } from "./routes/streaming/get-active-sessions/route";

// Chat routes
import { sendMessageProcedure } from "./routes/chat/send-message/route";
import { getMessagesProcedure } from "./routes/chat/get-messages/route";

// Gift routes
import { getAvailableGiftsProcedure } from "./routes/gifts/get-available-gifts/route";
import { sendGiftProcedure } from "./routes/gifts/send-gift/route";

// User routes
import { getProfileProcedure } from "./routes/users/get-profile/route";
import { updateProfileProcedure } from "./routes/users/update-profile/route";
import { getAllUsersProcedure, searchUsersProcedure } from "./routes/users/get-all-users/route";

// Video routes
import { uploadVideoProcedure } from "./routes/videos/upload-video/route";
import { getVideosProcedure } from "./routes/videos/get-videos/route";

// Notification routes
import { getNotificationsProcedure } from "./routes/notifications/get-notifications/route";
import { markAsReadProcedure } from "./routes/notifications/mark-as-read/route";

// Analytics routes
import { getStreamStatsProcedure } from "./routes/analytics/get-stream-stats/route";

// PK Challenge routes
import { createChallengeProcedure } from "./routes/pk/create-challenge/route";
import { respondInvitationProcedure } from "./routes/pk/respond-invitation/route";
import { sendGiftProcedure as sendPKGiftProcedure } from "./routes/pk/send-gift/route";
import { getChallengeProcedure } from "./routes/pk/get-challenge/route";
import { getInvitationsProcedure } from "./routes/pk/get-invitations/route";
import { getActiveChallengesProcedure } from "./routes/pk/get-active-challenges/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  
  // Streaming API
  streaming: createTRPCRouter({
    createSession: createSessionProcedure,
    joinSession: joinSessionProcedure,
    endSession: endSessionProcedure,
    getActiveSessions: getActiveSessionsProcedure,
  }),
  
  // Chat API
  chat: createTRPCRouter({
    sendMessage: sendMessageProcedure,
    getMessages: getMessagesProcedure,
  }),
  
  // Gifts API
  gifts: createTRPCRouter({
    getAvailableGifts: getAvailableGiftsProcedure,
    sendGift: sendGiftProcedure,
  }),
  
  // Users API
  users: createTRPCRouter({
    getProfile: getProfileProcedure,
    updateProfile: updateProfileProcedure,
    getAllUsers: getAllUsersProcedure,
    searchUsers: searchUsersProcedure,
  }),
  
  // Videos API
  videos: createTRPCRouter({
    uploadVideo: uploadVideoProcedure,
    getVideos: getVideosProcedure,
  }),
  
  // Notifications API
  notifications: createTRPCRouter({
    getNotifications: getNotificationsProcedure,
    markAsRead: markAsReadProcedure,
  }),
  
  // Analytics API
  analytics: createTRPCRouter({
    getStreamStats: getStreamStatsProcedure,
  }),
  
  // PK Challenge API
  pk: createTRPCRouter({
    createChallenge: createChallengeProcedure,
    respondInvitation: respondInvitationProcedure,
    sendGift: sendPKGiftProcedure,
    getChallenge: getChallengeProcedure,
    getInvitations: getInvitationsProcedure,
    getActiveChallenges: getActiveChallengesProcedure,
  }),
});

export type AppRouter = typeof appRouter;