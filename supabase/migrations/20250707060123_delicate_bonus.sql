/*
  # Fix RLS policy for matches table

  1. Security
    - Drop existing INSERT policy if it exists
    - Add comprehensive INSERT policy for matches table to allow authenticated users to create matches
    - Add SELECT policy to allow users to view their own matches
    - This fixes the RLS violation when triggers attempt to insert into matches table

  2. Changes
    - Drop and recreate INSERT policy for matches table
    - Add SELECT policy for matches table
    - Ensure policies work with database triggers
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create matches for themselves" ON matches;
DROP POLICY IF EXISTS "Users can view their own matches" ON matches;

-- Add INSERT policy for matches table that works with triggers
CREATE POLICY "Users can create matches for themselves"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user1_id) OR 
    (auth.uid() = user2_id) OR
    -- Allow service role (for triggers) to insert matches
    (auth.role() = 'service_role')
  );

-- Add SELECT policy for matches table
CREATE POLICY "Users can view their own matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = user1_id) OR 
    (auth.uid() = user2_id)
  );

-- Ensure RLS is enabled on matches table
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;