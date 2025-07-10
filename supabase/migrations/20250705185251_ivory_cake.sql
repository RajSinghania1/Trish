/*
  # Create gifts, sent_gifts, conversations, and messages tables

  1. New Tables
    - `gifts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (numeric)
      - `image` (text)
      - `category` (text)
      - `description` (text)
      - `created_at` (timestamp)
    - `sent_gifts`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to profiles)
      - `recipient_id` (uuid, foreign key to profiles)
      - `gift_id` (uuid, foreign key to gifts)
      - `message` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
    - `conversations`
      - `id` (uuid, primary key)
      - `user1_id` (uuid, foreign key to profiles)
      - `user2_id` (uuid, foreign key to profiles)
      - `last_message` (text)
      - `last_message_at` (timestamp)
      - `created_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key to conversations)
      - `sender_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `message_type` (text, default 'text')
      - `gift_id` (uuid, foreign key to gifts, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  image text,
  category text DEFAULT 'general',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create sent_gifts table
CREATE TABLE IF NOT EXISTS sent_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gift_id uuid NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  message text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message text DEFAULT '',
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'gift')),
  gift_id uuid REFERENCES gifts(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for gifts (public read access)
CREATE POLICY "Anyone can view gifts"
  ON gifts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for sent_gifts
CREATE POLICY "Users can view gifts sent to them"
  ON sent_gifts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Users can send gifts"
  ON sent_gifts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update gift status"
  ON sent_gifts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Policies for conversations
CREATE POLICY "Users can view their conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS sent_gifts_recipient_id_idx ON sent_gifts(recipient_id);
CREATE INDEX IF NOT EXISTS sent_gifts_sender_id_idx ON sent_gifts(sender_id);
CREATE INDEX IF NOT EXISTS sent_gifts_created_at_idx ON sent_gifts(created_at);
CREATE INDEX IF NOT EXISTS conversations_user1_id_idx ON conversations(user1_id);
CREATE INDEX IF NOT EXISTS conversations_user2_id_idx ON conversations(user2_id);
CREATE INDEX IF NOT EXISTS conversations_last_message_at_idx ON conversations(last_message_at);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- Insert some sample gifts
INSERT INTO gifts (name, price, image, category, description) VALUES
  ('Red Rose', 5.99, 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400', 'flowers', 'A beautiful red rose to show your affection'),
  ('Chocolate Box', 12.99, 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=400', 'sweets', 'Premium chocolate collection'),
  ('Teddy Bear', 19.99, 'https://images.pexels.com/photos/236230/pexels-photo-236230.jpeg?auto=compress&cs=tinysrgb&w=400', 'toys', 'Cute and cuddly teddy bear'),
  ('Coffee', 4.99, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', 'drinks', 'Premium coffee blend'),
  ('Jewelry', 49.99, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400', 'accessories', 'Beautiful jewelry piece')
ON CONFLICT DO NOTHING;