/*
  # Add match_type to conversations table

  1. Changes
    - Add `match_type` column to conversations table
    - Update the create_conversation_on_match function to set match_type
    - Update existing conversations to have a default match_type

  2. Security
    - No changes to RLS policies needed
*/

-- Add match_type column to conversations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'match_type'
  ) THEN
    ALTER TABLE conversations ADD COLUMN match_type text DEFAULT 'like' CHECK (match_type IN ('like', 'gift'));
  END IF;
END $$;

-- Update existing conversations to have a default match_type
UPDATE conversations SET match_type = 'like' WHERE match_type IS NULL;

-- Update the create_conversation_on_match function to set match_type
CREATE OR REPLACE FUNCTION create_conversation_on_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Create conversation when match is created
  INSERT INTO conversations (user1_id, user2_id, match_type, last_message, last_message_at)
  VALUES (
    NEW.user1_id,
    NEW.user2_id,
    NEW.match_type,
    CASE 
      WHEN NEW.match_type = 'gift' THEN 'You have a new gift! 🎁'
      ELSE 'You have a new match! 💕'
    END,
    NEW.created_at
  )
  ON CONFLICT (user1_id, user2_id) DO UPDATE SET
    match_type = EXCLUDED.match_type,
    last_message = EXCLUDED.last_message,
    last_message_at = EXCLUDED.last_message_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;