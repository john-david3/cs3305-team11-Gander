-- Sample data for categories
INSERT INTO categories (category_name) VALUES 
('Gaming'),
('Music'),
('Art'),
('Education'),
('Sports');

-- Sample data for users
INSERT INTO users (username, password, email, num_followers, stream_key, is_partnered, bio) VALUES 
('GamerDude', 'password123', 'gamerdude@example.com', 500, '1234', 0, 'Streaming my gaming adventures!'),
('MusicLover', 'music4life', 'musiclover@example.com', 1200, '2345', 0, 'I share my favorite tunes.'),
('ArtFan', 'artistic123', 'artfan@example.com', 300, '3456', 0, 'Exploring the world of art.'),
('EduGuru', 'learn123', 'eduguru@example.com', 800, '4567', 0, 'Teaching everything I know.'),
('SportsStar', 'sports123', 'sportsstar@example.com', 2000, '5678', 0, 'Join me for live sports updates!');

-- Sample data for streams
INSERT INTO streams (user_id, title, start_time, num_viewers, isLive, vod_id, category_id) VALUES 
(1, 'Epic Gaming Session', '2025-01-25 18:00:00', 150, 1, NULL, 1),
(2, 'Live Music Jam', '2025-01-25 20:00:00', 350, 1, NULL, 2),
(3, 'Sketching Live', '2025-01-24 15:00:00', 80, 0, 201, 3),
(4, 'Math Made Easy', '2025-01-23 10:00:00', 400, 0, 202, 4),
(5, 'Sports Highlights', '2025-01-25 12:00:00', 500, 1, NULL, 5);

-- Sample data for follows
INSERT INTO follows (user_id, followed_id, since) VALUES 
(1, 2, '2024-12-01'),
(2, 3, '2024-11-15'),
(3, 4, '2024-10-20'),
(4, 5, '2024-09-12'),
(5, 1, '2024-08-30');

-- Sample data for user_preferences
INSERT INTO user_preferences (user_id, category_id, favourability) VALUES 
(1, 1, 10),
(2, 2, 9),
(3, 3, 8),
(4, 4, 7),
(5, 5, 10);

-- Sample data for subscribes
INSERT INTO subscribes (user_id, subscribed_id, since, expires) VALUES 
(1, 101, '2024-12-01', '2025-01-01'),
(2, 102, '2024-11-15', '2025-02-15'),
(3, 103, '2024-10-20', '2025-01-20'),
(4, 104, '2024-09-12', '2025-01-12'),
(5, 105, '2024-08-30', '2025-02-28');

SELECT * FROM users;
SELECT * FROM streams;
SELECT * FROM follows;
SELECT * FROM user_preferences;
SELECT * FROM subscribes;
SELECT * FROM categories;

INSERT INTO streams (user_id, title, start_time, num_viewers, isLive, vod_id, category_id) VALUES 
(6, 'Epic Gaming Session 2', '2025-01-26 18:00:00', 800, 1, NULL, 1);
INSERT INTO users (username, password, email, num_followers, stream_key, is_partnered, bio) VALUES 
('GamerDude2', 'password123', 'gamerdude2@gmail.com', 3200, '6789', 0, 'Streaming my gaming adventures!');
