/*
  # Fix Messages RLS Policy

  1. Security Updates
    - Drop existing restrictive INSERT policy for messages
    - Create new INSERT policy that allows authenticated users to send messages in their conversations
    - Ensure users can only send messages where they are participants in the conversation

  2. Policy Changes
    - Allow INSERT for authenticated users who are participants in the conversation
    - Maintain existing SELECT and UPDATE policies
    - Ensure sender_id matches the authenticated user
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;

-- Create a new INSERT policy that properly allows message sending
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

-- Ensure the SELECT policy allows users to view messages in their conversations
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;

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

-- Ensure the UPDATE policy allows users to update message read status
DROP POLICY IF EXISTS "Users can update message read status in their conversations" ON messages;

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