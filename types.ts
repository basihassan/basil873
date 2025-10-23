export interface User {
  id: number;
  username: string;
  avatarUrl: string;
  fullName: string;
  followers: number;
  following: number;
  postsCount: number;
  bio: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  password?: string;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id: number;
  user: User;
  imageUrl: string;
  description: string;
  price?: number;
  likes: number;
  comments: Comment[];
  timestamp: string;
  brand?: string;
  category?: string;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  user: User;
  messages: Message[];
}