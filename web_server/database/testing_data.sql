-- Sample Data for users
INSERT INTO users (username, password, email, num_followers, stream_key, is_partnered, bio, is_live, current_stream_title, current_selected_category_id) VALUES 
('GamerDude', 'password123', 'gamerdude@example.com', 500, '1234', 0, 'Streaming my gaming adventures!', 1, 'Game On!', 1),
('MusicLover', 'music4life', 'musiclover@example.com', 1200, '2345', 0, 'I share my favorite tunes.', 1, 'Live Music Jam', 2),
('ArtFan', 'artistic123', 'artfan@example.com', 300, '3456', 0, 'Exploring the world of art.', 1, 'Sketching Live', 3),
('EduGuru', 'learn123', 'eduguru@example.com', 800, '4567', 0, 'Teaching everything I know.', 1, 'Math Made Easy', 4),
('SportsStar', 'sports123', 'sportsstar@example.com', 2000, '5678', 0, 'Join me for live sports updates!', 1, 'Sports Highlights', 5);

INSERT INTO users (username, password, email, num_followers, stream_key, is_partnered, bio) VALUES 
('GamerDude2', 'password123', 'gamerdude3@gmail.com', 3200, '7890', 0, 'Streaming my gaming adventures!'),
('dev', 'scrypt:32768:8:1$avr94c5cplosNUDc$f2ba0738080facada51a1ed370bf869199e121e547fe64a7094ef0330b5db2ab7fff87700898729977f4cd24f17c17b9e8c0c93e7241dcdf9aa522d5d1732626', 'dev@gmail.com', 1, '8080', 0, 'A test account to save that tedious signup each time!');

-- Sample Data for follows
INSERT INTO follows (user_id, followed_id, since) VALUES 
(1, 2, '2024-12-01'),
(2, 3, '2024-11-15'),
(1, 3, '2024-11-15'),
(3, 4, '2024-10-20'),
(4, 5, '2024-09-12'),
(5, 1, '2024-08-30');


-- Sample Data for user_preferences
INSERT INTO user_preferences (user_id, category_id, favourability) VALUES 
(1, 1, 10),
(2, 2, 9),
(3, 3, 8),
(4, 4, 7),
(5, 5, 10);

-- Sample Data for subscribes
INSERT INTO subscribes (user_id, subscribed_id, since, expires) VALUES 
(1, 2, '2024-12-01', '2025-01-01'),
(2, 3, '2024-11-15', '2025-02-15'),
(3, 4, '2024-10-20', '2025-01-20'),
(4, 5, '2024-09-12', '2025-01-12'),
(5, 1, '2024-08-30', '2025-02-28');

-- Sample Data for followed_categories
INSERT INTO followed_categories (user_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Sample Data for categories
INSERT INTO categories (category_name) VALUES 
('Gaming'),
('Music'),
('Art'),
('Education'),
('Sports');

-- Sample Data for streams
INSERT INTO streams (user_id, title, start_time, num_viewers, category_id) VALUES
(1, 'Game on!', '2025-02-16 17:00:00', 5, 1),
(2, 'Live Music Jam', '2025-01-25 20:00:00', 350, 2),
(3, 'Sketching Live', '2025-01-24 15:00:00', 80, 3),
(4, 'Math Made Easy', '2025-01-23 10:00:00', 400, 4),
(5, 'Sports Highlights', '2025-02-15 23:00:00', 210, 5);

-- Sample Data for vods
INSERT INTO vods (user_id, title, datetime, category_id, length, views) VALUES 
(1, 'Epic Gaming Session', '2025-01-23 18:00:00', 1, 120, 500),
(2, 'Live Music Jam', '2025-01-21 20:00:00', 2, 180, 800),
(3, 'Sketching Live', '2025-01-22 15:00:00', 3, 90, 300),
(4, 'Math Made Easy', '2025-01-21 10:00:00', 4, 150, 600),
(5, 'Sports Highlights', '2025-01-19 12:00:00', 5, 210, 700);

-- Sample Data for tags
INSERT INTO tags(tag_name) VALUES
('English'),
('Gaming'),
('LGBTQIA+');

-- Sample Data for stream_tags
INSERT INTO stream_tags (user_id, tag_id) VALUES
(1, 3),
(1, 1),
(2, 1),
(2, 2);

-- Sample Data for vod_tags
INSERT INTO vod_tags (vod_id, tag_id) VALUES
(1, 3),
(1, 1),
(2, 1),
(2, 2);

-- Sample Data for chat
INSERT INTO chat (stream_id, chatter_id, message) VALUES
(1, 1, 'Hey everyone, loving the stream!'),
(1, 1, 'This stream is crazy man'),
(1, 2, 'Woah, cannot believe that');


INSERT INTO follows (user_id, followed_id, since) VALUES 
(7, 1, '2024-08-30'),
(7, 2, '2024-08-30'),
(7, 3, '2024-08-30');

INSERT INTO followed_categories (user_id, category_id) VALUES
(7, 1),
(7, 2),
(7, 3);

INSERT INTO subscribes (user_id, subscribed_id, since, expires) VALUES 
(7, 1, '2024-08-30', '2025-02-28 12:00:00'),
(7, 2, '2024-08-30', '2025-02-15');

SELECT * FROM users;
SELECT * FROM follows;
SELECT * FROM user_preferences;
SELECT * FROM subscribes;
SELECT * FROM categories;
SELECT * FROM streams;
SELECT * FROM chat;
SELECT * FROM tags;
SELECT * FROM stream_tags;

-- To see all tables in the database
SELECT name FROM sqlite_master WHERE type='table';

-- UPDATE users SET is_live = 0 WHERE user_id = 1;

SELECT users.user_id, streams.title, streams.num_viewers, users.username
FROM streams JOIN users 
ON streams.user_id = users.user_id
WHERE users.user_id IN
(SELECT followed_id FROM follows WHERE user_id = 1)
AND users.is_live = 1;

SELECT categories.category_id, categories.category_name, SUM(streams.num_viewers) AS total_viewers
FROM streams
JOIN categories ON streams.category_id = categories.category_id
GROUP BY categories.category_name
ORDER BY SUM(streams.num_viewers) DESC
LIMIT 10;
