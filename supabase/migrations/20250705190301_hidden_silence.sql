/*
  # Add User Interactions and Superlikes

  1. New Tables
    - `user_interactions`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to profiles)
      - `recipient_id` (uuid, foreign key to profiles)
      - `interaction_type` (text, 'like', 'pass', 'superlike')
      - `created_at` (timestamp)

  2. Profile Updates
    - Add `superlikes_count` column to profiles table (integer, default 5)
    - Add `gender` column for enhanced profile features
    - Add `sexual_orientation` column
    - Add `height` column (integer, in cm)
    - Add `ethnicity` column
    - Add `drinking_habits` column
    - Add `smoking_habits` column
    - Add `exercise_frequency` column
    - Add `has_pets` column (boolean)
    - Add `has_children` column (boolean)
    - Add `wants_children` column (boolean)
    - Add `religion` column
    - Add `education_level` column
    - Add `occupation` column
    - Add `relationship_goals` column

  3. New Tables for Profile Enhancement
    - `profile_prompts` table for icebreaker questions

  4. Security
    - Enable RLS on new tables
    - Add appropriate policies for user interactions
    - Add policies for profile prompts
*/

-- Add superlikes_count and enhanced profile fields to profiles table
DO $$
BEGIN
  -- Add superlikes_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'superlikes_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN superlikes_count integer DEFAULT 5 NOT NULL;
  END IF;

  -- Add gender column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
  END IF;

  -- Add sexual_orientation column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'sexual_orientation'
  ) THEN
    ALTER TABLE profiles ADD COLUMN sexual_orientation text;
  END IF;

  -- Add height column (in cm)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'height'
  ) THEN
    ALTER TABLE profiles ADD COLUMN height integer;
  END IF;

  -- Add ethnicity column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'ethnicity'
  ) THEN
    ALTER TABLE profiles ADD COLUMN ethnicity text;
  END IF;

  -- Add drinking_habits column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'drinking_habits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN drinking_habits text;
  END IF;

  -- Add smoking_habits column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'smoking_habits'
  ) THEN
    ALTER TABLE profiles ADD COLUMN smoking_habits text;
  END IF;

  -- Add exercise_frequency column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'exercise_frequency'
  ) THEN
    ALTER TABLE profiles ADD COLUMN exercise_frequency text;
  END IF;

  -- Add has_pets column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'has_pets'
  ) THEN
    ALTER TABLE profiles ADD COLUMN has_pets boolean DEFAULT false;
  END IF;

  -- Add has_children column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'has_children'
  ) THEN
    ALTER TABLE profiles ADD COLUMN has_children boolean DEFAULT false;
  END IF;

  -- Add wants_children column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'wants_children'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wants_children boolean;
  END IF;

  -- Add religion column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'religion'
  ) THEN
    ALTER TABLE profiles ADD COLUMN religion text;
  END IF;

  -- Add education_level column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'education_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN education_level text;
  END IF;

  -- Add occupation column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'occupation'
  ) THEN
    ALTER TABLE profiles ADD COLUMN occupation text;
  END IF;

  -- Add relationship_goals column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'relationship_goals'
  ) THEN
    ALTER TABLE profiles ADD COLUMN relationship_goals text;
  END IF;
END $$;

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'pass', 'superlike')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(sender_id, recipient_id)
);

-- Create profile_prompts table
CREATE TABLE IF NOT EXISTS profile_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_question text NOT NULL,
  prompt_answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_prompts ENABLE ROW LEVEL SECURITY;

-- Policies for user_interactions
CREATE POLICY "Users can view interactions they sent or received"
  ON user_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create their own interactions"
  ON user_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Policies for profile_prompts
CREATE POLICY "Users can view all profile prompts"
  ON profile_prompts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own prompts"
  ON profile_prompts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_interactions_sender_id_idx ON user_interactions(sender_id);
CREATE INDEX IF NOT EXISTS user_interactions_recipient_id_idx ON user_interactions(recipient_id);
CREATE INDEX IF NOT EXISTS user_interactions_created_at_idx ON user_interactions(created_at);
CREATE INDEX IF NOT EXISTS profile_prompts_user_id_idx ON profile_prompts(user_id);

-- Update existing test profiles with superlikes and some enhanced profile data
UPDATE profiles SET 
  superlikes_count = 5,
  gender = CASE 
    WHEN name IN ('Emma', 'Sophia', 'Maya', 'Zoe') THEN 'woman'
    ELSE 'man'
  END,
  sexual_orientation = 'straight',
  height = CASE 
    WHEN name = 'Emma' THEN 165
    WHEN name = 'Alex' THEN 175
    WHEN name = 'Sophia' THEN 160
    WHEN name = 'James' THEN 180
    WHEN name = 'Maya' THEN 168
    WHEN name = 'Ryan' THEN 178
    WHEN name = 'Zoe' THEN 162
    WHEN name = 'David' THEN 182
    ELSE 170
  END,
  drinking_habits = 'socially',
  smoking_habits = 'never',
  exercise_frequency = 'regularly',
  has_pets = CASE WHEN name IN ('Emma', 'Sophia', 'Maya') THEN true ELSE false END,
  has_children = false,
  wants_children = CASE WHEN name IN ('James', 'David', 'Maya') THEN true ELSE false END,
  relationship_goals = 'long-term'
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

-- Insert some sample profile prompts
INSERT INTO profile_prompts (user_id, prompt_question, prompt_answer) VALUES
  ('11111111-1111-1111-1111-111111111111', 'My perfect Sunday', 'Sleeping in, farmers market, painting in the park, and ending with a cozy movie night'),
  ('11111111-1111-1111-1111-111111111111', 'Two truths and a lie', 'I speak three languages, I once met a celebrity at a coffee shop, I have never broken a bone'),
  ('22222222-2222-2222-2222-222222222222', 'Best travel story', 'Got lost in Tokyo and discovered the most amazing ramen shop in a tiny alley'),
  ('33333333-3333-3333-3333-333333333333', 'Life motto', 'Be present, be kind, and always choose growth over comfort'),
  ('44444444-4444-4444-4444-444444444444', 'Favorite way to unwind', 'Walking through historic neighborhoods with a good podcast and a craft beer afterwards'),
  ('55555555-5555-5555-5555-555555555555', 'Dream adventure', 'Swimming with whale sharks in the Maldives while documenting marine life'),
  ('66666666-6666-6666-6666-666666666666', 'Perfect first date', 'Hiking to a scenic viewpoint followed by craft beer and sharing adventure stories'),
  ('77777777-7777-7777-7777-777777777777', 'Creative inspiration', 'Vintage shops, old movies, and the way light hits objects at golden hour'),
  ('88888888-8888-8888-8888-888888888888', 'Fun fact about me', 'I can salsa dance, speak four languages, and make a mean Cuban sandwich')
ON CONFLICT DO NOTHING;