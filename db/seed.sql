-- One restaurant: Ludhiana Burrito, Indian, Sector 32.
-- The seed is rerun-safe: every insert has a guard so a second run cannot create duplicates.

INSERT INTO restaurants (name, cuisine, area)
SELECT 'Ludhiana Burrito', 'Indian', 'Sector 32'
WHERE NOT EXISTS (SELECT 1 FROM restaurants WHERE name = 'Ludhiana Burrito');

-- Three reviews, created_at spread days apart so "latest" is meaningful.

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 5, 'Paneer burrito is unreal', NOW() - INTERVAL '8 days'
FROM restaurants r
WHERE r.name = 'Ludhiana Burrito'
  AND NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.restaurant_id = r.id AND reviews.comment = 'Paneer burrito is unreal'
  );

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 4, 'Good, but slow service', NOW() - INTERVAL '6 days'
FROM restaurants r
WHERE r.name = 'Ludhiana Burrito'
  AND NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.restaurant_id = r.id AND reviews.comment = 'Good, but slow service'
  );

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, 4, 'Solid. Would repeat.', NOW() - INTERVAL '2 days'
FROM restaurants r
WHERE r.name = 'Ludhiana Burrito'
  AND NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.restaurant_id = r.id AND reviews.comment = 'Solid. Would repeat.'
  );
