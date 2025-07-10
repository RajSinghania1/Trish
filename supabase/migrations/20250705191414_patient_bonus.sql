/*
  # Auto-matching system for likes and gifts

  1. New Tables
    - `matches` - Store matched users
      - `id` (uuid, primary key)
      - `user1_id` (uuid, references profiles)
      - `user2_id` (uuid, references profiles)
      - `match_type` (text, 'like' or 'gift')
      - `created_at` (timestamp)

  2. Functions
    - `create_match_on_like()` - Trigger function for likes
    - `create_match_on_gift()` - Trigger function for gifts
    - `create_conversation_on_match()` - Create conversation when match is created

  3. Triggers
    - Auto-create matches when users like each other
    - Auto-create matches when gifts are sent
    - Auto-create conversations when matches are created

  4. Security
    - Enable RLS on matches table
    - Add policies for users to view their own matches
*/

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_type text NOT NULL DEFAULT 'like' CHECK (match_type IN ('like', 'gift')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS matches_user1_id_idx ON matches(user1_id);
CREATE INDEX IF NOT EXISTS matches_user2_id_idx ON matches(user2_id);
CREATE INDEX IF NOT EXISTS matches_created_at_idx ON matches(created_at);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policies for matches
CREATE POLICY "Users can view their own matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

-- Function to create match on like
CREATE OR REPLACE FUNCTION create_match_on_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create match for 'like' interactions
  IF NEW.interaction_type = 'like' THEN
    -- Insert match (ignore if already exists due to UNIQUE constraint)
    INSERT INTO matches (user1_id, user2_id, match_type)
    VALUES (
      LEAST(NEW.sender_id, NEW.recipient_id),
      GREATEST(NEW.sender_id, NEW.recipient_id),
      'like'
    )
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create match on gift
CREATE OR REPLACE FUNCTION create_match_on_gift()
RETURNS TRIGGER AS $$
BEGIN
  -- Create match when gift is sent
  INSERT INTO matches (user1_id, user2_id, match_type)
  VALUES (
    LEAST(NEW.sender_id, NEW.recipient_id),
    GREATEST(NEW.sender_id, NEW.recipient_id),
    'gift'
  )
  ON CONFLICT (user1_id, user2_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create conversation on match
CREATE OR REPLACE FUNCTION create_conversation_on_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Create conversation when match is created
  INSERT INTO conversations (user1_id, user2_id, last_message, last_message_at)
  VALUES (
    NEW.user1_id,
    NEW.user2_id,
    CASE 
      WHEN NEW.match_type = 'gift' THEN 'You have a new gift! 🎁'
      ELSE 'You have a new match! 💕'
    END,
    NEW.created_at
  )
  ON CONFLICT (user1_id, user2_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_create_match_on_like ON user_interactions;
CREATE TRIGGER trigger_create_match_on_like
  AFTER INSERT ON user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_like();

DROP TRIGGER IF EXISTS trigger_create_match_on_gift ON sent_gifts;
CREATE TRIGGER trigger_create_match_on_gift
  AFTER INSERT ON sent_gifts
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_gift();

DROP TRIGGER IF EXISTS trigger_create_conversation_on_match ON matches;
CREATE TRIGGER trigger_create_conversation_on_match
  AFTER INSERT ON matches
  FOR EACH ROW
  EXECUTE FUNCTION create_conversation_on_match();