import { UserProfile } from '@/hooks/useUser';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface UserProfileWithFriendship extends UserProfile {
  friendshipStatus?: 'none' | 'pending_sent' | 'pending_received' | 'friends';
}

export interface SocialNetworkContextType {
  users: UserProfileWithFriendship[];
  friendRequests: FriendRequest[];
  friends: UserProfile[];
  currentUser: UserProfile;
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string, fromUserId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  getAge: (birthDate: string) => number;
}