export interface Video {
  id: string;
  uri: string;
  thumbnail: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  music: {
    name: string;
    artist: string;
    cover: string;
  };
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  hashtags: string[];
  duration: number;
  views: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  replies: Comment[];
  createdAt: Date;
  isLiked: boolean;
}