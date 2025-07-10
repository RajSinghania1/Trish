export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  images: string[];
  superlikes_count: number;
  gender?: string;
  sexual_orientation?: string;
  height?: number;
  ethnicity?: string;
  drinking_habits?: string;
  smoking_habits?: string;
  exercise_frequency?: string;
  has_pets?: boolean;
  has_children?: boolean;
  wants_children?: boolean;
  religion?: string;
  education_level?: string;
  occupation?: string;
  relationship_goals?: string;
  created_at: string;
  updated_at: string;
}

export interface UserInteraction {
  id: string;
  sender_id: string;
  recipient_id: string;
  interaction_type: 'like' | 'pass' | 'superlike';
  created_at: string;
}

export interface ProfilePrompt {
  id: string;
  user_id: string;
  prompt_question: string;
  prompt_answer: string;
  created_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  transaction_type: string;
  created_at: string;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  created_at: string;
}

export interface SentGift {
  id: string;
  sender_id: string;
  recipient_id: string;
  gift_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  match_type: 'like' | 'gift';
  last_message: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'gift';
  gift_id?: string;
  created_at: string;
}