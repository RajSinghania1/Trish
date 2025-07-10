/*
  # Populate gifts catalog

  1. New Data
    - Sample gifts across multiple categories (flowers, food, general)
    - 10 diverse gift options with realistic pricing
    - High-quality Pexels images for each gift
    - Detailed descriptions for each item

  2. Categories
    - flowers: Rose and sunflower bouquets
    - food: Chocolates, coffee, tea, wine & cheese, cupcakes
    - general: Plants, candles, spa sets

  3. Features
    - Prevents duplicate entries if migration runs multiple times
    - Uses conditional INSERT to avoid conflicts
    - Maintains data integrity
*/

-- Insert sample gifts with conditional logic to prevent duplicates
DO $$
BEGIN
  -- Only insert if the gifts table is empty or specific gifts don't exist
  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Red Roses Bouquet') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Red Roses Bouquet', 45, 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400', 'flowers', 'Beautiful red roses arranged in an elegant bouquet');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Artisan Chocolate Box') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Artisan Chocolate Box', 35, 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', 'Premium chocolate collection from local artisans');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Coffee & Pastry Set') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Coffee & Pastry Set', 25, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', 'Gourmet coffee beans with fresh pastries');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Succulent Plant') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Succulent Plant', 20, 'https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&w=400', 'general', 'Low-maintenance succulent in a decorative pot');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Luxury Candle Set') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Luxury Candle Set', 40, 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=400', 'general', 'Scented candles with relaxing aromatherapy blends');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Gourmet Tea Collection') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Gourmet Tea Collection', 30, 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', 'Premium tea selection from around the world');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Sunflower Bouquet') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Sunflower Bouquet', 35, 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=400', 'flowers', 'Bright and cheerful sunflowers to brighten their day');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Wine & Cheese Set') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Wine & Cheese Set', 55, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', 'Curated selection of fine wine and artisan cheese');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Spa Gift Set') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Spa Gift Set', 60, 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=400', 'general', 'Relaxing spa essentials for a perfect self-care day');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM gifts WHERE name = 'Gourmet Cupcakes') THEN
    INSERT INTO gifts (name, price, image, category, description) VALUES
      ('Gourmet Cupcakes', 28, 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400', 'food', 'Delicious handcrafted cupcakes with premium frosting');
  END IF;

END $$;