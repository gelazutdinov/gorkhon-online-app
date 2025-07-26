export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  text?: TextElement[];
  stickers?: StickerElement[];
  music?: MusicElement;
  timestamp: Date;
  viewed: boolean;
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  style: 'classic' | 'modern' | 'neon' | 'typewriter' | 'shadow' | 'gradient';
  color: string;
  size: 'small' | 'medium' | 'large';
  animation?: 'fade' | 'slide' | 'pulse' | 'rotate' | 'zoom';
}

export interface StickerElement {
  id: string;
  type: 'emoji' | 'location' | 'time' | 'weather' | 'poll' | 'mention' | 'hashtag' | 'gif';
  content: string;
  x: number;
  y: number;
  size: number;
  rotation?: number;
}

export interface MusicElement {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number;
}

export interface AdvancedInstagramStoriesProps {
  currentUser?: any;
}