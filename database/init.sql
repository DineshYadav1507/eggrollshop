CREATE DATABASE IF NOT EXISTS eggrollshop;
USE eggrollshop;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(80) NOT NULL,
  image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  items_json JSON NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, category, image_url) VALUES
('Classic Egg Roll', 'Egg, onion, capsicum and house sauce wrapped in flaky paratha.', 89.00, 'Classic', 'https://images.unsplash.com/photo-1625398407796-82650a8c2d6b?auto=format&fit=crop&w=900&q=80'),
('Cheesy Egg Roll', 'Double egg roll with melted cheese and spicy mayo.', 119.00, 'Cheesy', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'),
('Chicken Egg Roll', 'Masala egg roll loaded with juicy chicken tikka.', 149.00, 'Chicken', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80'),
('Paneer Egg Roll', 'Paneer tikka, egg, onion and mint chutney.', 129.00, 'Veg', 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=900&q=80');
