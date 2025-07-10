/*
  # Add message status and read receipts

  1. Changes
    - Add `read_at` column to messages table for read receipts
    - Add `status` column to messages table for delivery status
    - Add indexes for better performance
    - Add policies for message status updates

  2. Security
    - Allow users to update read status of messages in their conversations
*/

-- Add read_at column to messages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'read_at'
  ) THEN
    ALTER TABLE messages ADD COLUMN read_at timestamptz;
  END IF;
END $$;

-- Add status column to messages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'status'
  ) THEN
    ALTER TABLE messages ADD COLUMN status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read'));
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS messages_read_at_idx ON messages(read_at);
CREATE INDEX IF NOT EXISTS messages_status_idx ON messages(status);

-- Add policy for updating message read status
CREATE POLICY "Users can update message read status in their conversations"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.user1_id = auth.uid() OR conversations.user2_id = auth.uid())
    )
  );