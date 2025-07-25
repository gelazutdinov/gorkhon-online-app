import { UserProfile } from '@/hooks/useUser';

export interface SocialUser extends UserProfile {
  followers: string[];
  following: string[];
  posts: SocialPost[];
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  images?: string[];
  timestamp: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  isFromVk?: boolean;
  location?: string;
}

export interface Story {
  id: string;
  authorId: string;
  image: string;
  text?: string;
  timestamp: string;
  views: string[];
  isActive: boolean;
}

export interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  image?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: string[];
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const formatTimeAgo = (timestamp: string): string => {
  const now = Date.now();
  const postTime = new Date(timestamp).getTime();
  const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));

  if (diffInMinutes < 1) return 'только что';
  if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч назад`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} дн назад`;
};