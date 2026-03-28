export interface User {
  id: string;
  username: string;
  arabicUsername?: string;
  handle: string;
  imageUrl: string;
  isFollowing: boolean;
  accountType?: 'regular' | 'virtual' | 'verified';
  isOnline?: boolean;
  level?: number;
  followers?: number;
  bio?: string;
}