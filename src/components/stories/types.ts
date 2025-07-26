export interface User {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
}

export interface StoryElement {
  id: string;
  type: 'text' | 'sticker' | 'music';
  content: string;
  x: number;
  y: number;
  style?: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    textAlign?: string;
    animation?: string;
    textShadow?: string;
    background?: string;
  };
  stickerType?: string;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: number;
  elements: StoryElement[];
  filter: string;
  music?: {
    title: string;
    artist: string;
    duration: number;
    cover: string;
  };
}

export type ViewType = 'main' | 'create' | 'edit' | 'view';
export type PanelType = 'filters' | 'text' | 'stickers' | 'music' | null;