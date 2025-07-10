/*
  # Add fake profiles for testing

  1. New Test Users
    - Creates test users in auth.users table
    - Each user has email and encrypted password
    
  2. Sample Profiles
    - Creates corresponding profiles for each test user
    - Includes realistic data: names, ages, locations, bios, interests, images
    - Uses high-quality Pexels images for profile photos
    
  3. Data Variety
    - Mix of ages (22-35)
    - Different locations across major cities
    - Diverse interests and hobbies
    - Engaging bios that feel authentic
*/

-- Insert test users into auth.users table
-- Note: In production, users would be created through Supabase Auth
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'emma.wilson@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alex.chen@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'sophia.martinez@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'james.thompson@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'maya.patel@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'ryan.johnson@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'zoe.anderson@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'david.kim@example.com',
    '$2a$10$dummy.hash.for.testing.purposes.only',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding profiles
INSERT INTO profiles (
  id,
  email,
  name,
  age,
  location,
  bio,
  interests,
  images
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'emma.wilson@example.com',
    'Emma',
    28,
    'Brooklyn, NY',
    'Artist and coffee enthusiast ☕ Love exploring hidden gems in the city and weekend getaways to the mountains. Always up for trying new restaurants or catching live music!',
    ARRAY['art', 'coffee', 'music', 'travel', 'photography', 'hiking'],
    ARRAY[
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'alex.chen@example.com',
    'Alex',
    26,
    'San Francisco, CA',
    'Software engineer by day, chef by night 👨‍💻🍳 Passionate about sustainable tech and making the perfect ramen. Looking for someone to share adventures and good food with!',
    ARRAY['technology', 'cooking', 'sustainability', 'gaming', 'cycling'],
    ARRAY[
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'sophia.martinez@example.com',
    'Sophia',
    24,
    'Austin, TX',
    'Yoga instructor and nature lover 🧘‍♀️🌿 Believe in mindful living and positive energy. When I''m not teaching, you''ll find me at farmers markets or planning my next camping trip!',
    ARRAY['yoga', 'meditation', 'nature', 'wellness', 'camping', 'organic food'],
    ARRAY[
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'james.thompson@example.com',
    'James',
    31,
    'Chicago, IL',
    'Architect with a passion for design and history 🏛️ Love exploring cities on foot and discovering their stories. Weekends are for museums, craft beer, and good books.',
    ARRAY['architecture', 'history', 'beer', 'books', 'walking', 'museums'],
    ARRAY[
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'maya.patel@example.com',
    'Maya',
    29,
    'Seattle, WA',
    'Marine biologist and ocean advocate 🌊 Spend my days protecting our seas and my free time scuba diving or surfing. Looking for someone who shares my love for adventure and the planet!',
    ARRAY['marine biology', 'scuba diving', 'surfing', 'environmental activism', 'travel', 'photography'],
    ARRAY[
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'ryan.johnson@example.com',
    'Ryan',
    27,
    'Denver, CO',
    'Outdoor enthusiast and craft beer lover 🏔️🍺 Ski instructor in winter, hiking guide in summer. Life''s too short to stay indoors! Let''s explore the Rockies together.',
    ARRAY['skiing', 'hiking', 'beer', 'camping', 'rock climbing', 'snowboarding'],
    ARRAY[
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'zoe.anderson@example.com',
    'Zoe',
    25,
    'Portland, OR',
    'Graphic designer and vintage collector 🎨✨ Love thrift shopping, indie films, and cozy coffee shops. Always working on creative projects and looking for inspiration everywhere!',
    ARRAY['design', 'vintage', 'films', 'coffee', 'thrifting', 'art'],
    ARRAY[
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'david.kim@example.com',
    'David',
    32,
    'Miami, FL',
    'Entrepreneur and salsa dancer 💃🕺 Building the next big thing while keeping life fun and balanced. Love beach volleyball, Latin music, and trying cuisines from around the world!',
    ARRAY['entrepreneurship', 'dancing', 'volleyball', 'music', 'food', 'beach'],
    ARRAY[
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  )
ON CONFLICT (id) DO NOTHING;