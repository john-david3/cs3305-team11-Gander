-- Sample data for categories
INSERT INTO categories (category_name) VALUES 
('Gaming'),
('Music'),
('Art'),
('Education'),
('Sports');

-- Sample data for users
INSERT INTO users (username, password, email, num_followers, bio) VALUES 
('GamerDude', 'password123', 'gamerdude@example.com', 500, 'Streaming my gaming adventures!'),
('MusicLover', 'music4life', 'musiclover@example.com', 1200, 'I share my favorite tunes.'),
('ArtFan', 'artistic123', 'artfan@example.com', 300, 'Exploring the world of art.'),
('EduGuru', 'learn123', 'eduguru@example.com', 800, 'Teaching everything I know.'),
('SportsStar', 'sports123', 'sportsstar@example.com', 2000, 'Join me for live sports updates!');

-- Sample data for streamers
INSERT INTO streamers (user_id, streamer_id, since, stream_key, isPartnered) VALUES 
(1, 101, '2023-01-01', '1234', 1),
(2, 102, '2022-05-15', '2345', 0),
(3, 103, '2023-03-20', '3456', 0),
(4, 104, '2021-11-05', '4567', 1),
(5, 105, '2020-07-18', '5678', 1);

-- Sample data for streams
INSERT INTO streams (streamer_id, stream_id, title, start_time, num_viewers, isLive, vod_id, category_id) VALUES 
(101, 1001, 'Epic Gaming Session', '2025-01-25 18:00:00', 150, 1, NULL, 1),
(102, 1002, 'Live Music Jam', '2025-01-25 20:00:00', 350, 1, NULL, 2),
(103, 1003, 'Sketching Live', '2025-01-24 15:00:00', 80, 0, 201, 3),
(104, 1004, 'Math Made Easy', '2025-01-23 10:00:00', 400, 0, 202, 4),
(105, 1005, 'Sports Highlights', '2025-01-25 12:00:00', 500, 1, NULL, 5);

-- Sample data for follows
INSERT INTO follows (user_id, streamer_id, since) VALUES 
(1, 102, '2024-12-01'),
(2, 101, '2024-11-15'),
(3, 103, '2024-10-20'),
(4, 104, '2024-09-12'),
(5, 105, '2024-08-30');

-- Sample data for user_preferences
INSERT INTO user_preferences (user_id, category_id, favourability) VALUES 
(1, 1, 10),
(2, 2, 9),
(3, 3, 8),
(4, 4, 7),
(5, 5, 10);

-- Sample data for subscribes
INSERT INTO subscribes (user_id, streamer_id, since, expires) VALUES 
(1, 101, '2024-12-01', '2025-01-01'),
(2, 102, '2024-11-15', '2025-02-15'),
(3, 103, '2024-10-20', '2025-01-20'),
(4, 104, '2024-09-12', '2025-01-12'),
(5, 105, '2024-08-30', '2025-02-28');
