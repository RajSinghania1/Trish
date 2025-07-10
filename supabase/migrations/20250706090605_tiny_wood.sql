/*
  # Fix RLS policy for matches table

  1. Security
    - Add INSERT policy for matches table to allow authenticated users to create matches
    - This fixes the RLS violation when triggers attempt to insert into matches table

  2. Changes
    - Add policy for users to insert matches where they are either user1_id or user2_id
*/

-- Add INSERT policy for matches table
CREATE POLICY "Users can create matches for themselves"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.uid() = user1_id) OR (auth.uid() = user2_id));