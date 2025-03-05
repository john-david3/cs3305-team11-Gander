-- Sample Data for users
INSERT INTO users (username, password, email, num_followers, stream_key, is_partnered, bio, is_live, is_admin) VALUES 
('GamerDude', 'password123', 'gamerdude@example.com', 500, '1234', 0, 'Streaming my gaming adventures!', 1, 0),
('MusicLover', 'music4life', 'musiclover@example.com', 1200, '2345', 0, 'I share my favorite tunes.', 1, 0),
('ArtFan', 'artistic123', 'artfan@example.com', 300, '3456', 0, 'Exploring the world of art.', 1, 0),
('EduGuru', 'learn123', 'eduguru@example.com', 800, '4567', 0, 'Teaching everything I know.', 1, 0),
('SportsStar', 'sports123', 'sportsstar@example.com', 2000, '5678', 0, 'Join me for live sports updates!', 1, 0),
('TechEnthusiast', NULL, 'techenthusiast@example.com', 1500, '6789', 0, 'All about the latest tech news!', 1, 0),
('ChefMaster', NULL, 'chefmaster@example.com', 700, '7890', 0, 'Cooking live and sharing recipes.', 1, 0),
('TravelExplorer', NULL, 'travelexplorer@example.com', 900, '8901', 0, 'Exploring new places every day!', 1, 0),
('BookLover', NULL, 'booklover@example.com', 450, '9012', 0, 'Sharing my thoughts on every book I read.', 1, 0),
('FitnessFan', NULL, 'fitnessfan@example.com', 1300, '0123', 0, 'Join my fitness journey!', 1, 0),
('NatureLover', NULL, 'naturelover@example.com', 1100, '2346', 0, 'Live streaming nature walks and hikes.', 1, 0),
('MovieBuff', NULL, 'moviebuff@example.com', 800, '3457', 0, 'Sharing movie reviews and recommendations.', 1, 0),
('ScienceGeek', NULL, 'sciencegeek@example.com', 950, '4568', 0, 'Exploring the wonders of science.', 1, 0),
('Comedian', NULL, 'comedian@example.com', 650, '5679', 0, 'Bringing laughter with live stand-up comedy.', 1, 0),
('Fashionista', NULL, 'fashionista@example.com', 1200, '6780', 0, 'Join me for live fashion tips and trends.', 1, 0),
('HealthGuru', NULL, 'healthguru@example.com', 1400, '7891', 0, 'Live streaming health and wellness advice.', 1, 0),
('CarLover', NULL, 'carlove@example.com', 1700, '8902', 0, 'Streaming car reviews and automotive content.', 1, 0),
('PetLover', NULL, 'petlover@example.com', 1000, '9013', 0, 'Join me for fun and cute pet moments!', 1, 0),
('Dancer', NULL, 'dancer@example.com', 2000, '0124', 0, 'Sharing live dance performances.', 1, 0),
('Photographer', NULL, 'photographer@example.com', 1300, '1235', 0, 'Live streaming photography tutorials.', 1, 0),
('Motivator', NULL, 'motivator@example.com', 850, '2347', 0, 'Join me for daily motivation and positivity.', 1, 0),
('LanguageLearner', NULL, 'languagelearner@example.com', 950, '3458', 0, 'Live streaming language learning sessions.', 1, 0),
('HistoryBuff', NULL, 'historybuff@example.com', 750, '4569', 0, 'Exploring history live and in depth.', 1, 0),
('Blogger', NULL, 'blogger@example.com', 1200, '5670', 0, 'Sharing my experiences through live blogging.', 1, 0),
('DIYer', NULL, 'diyer@example.com', 1300, '6781', 0, 'Live streaming DIY projects and tutorials.', 1, 0),
('SportsAnalyst', NULL, 'sportsanalyst@example.com', 1400, '7892', 0, 'Live commentary and analysis on sports events.', 1, 0),
('LBozo', NULL, 'lbozo@example.com', 0, '250', 0, 'I like taking Ls.', 1, 0);

INSERT INTO users (username, password, email, num_followers, stream_key, is_partnered, bio, is_live, is_admin) VALUES 
('GamerDude2', 'password123', 'gamerdude3@gmail.com', 3200, '7890', 0, 'Streaming my gaming adventures!', 0, 0),
('dev', 'scrypt:32768:8:1$avr94c5cplosNUDc$f2ba0738080facada51a1ed370bf869199e121e547fe64a7094ef0330b5db2ab7fff87700898729977f4cd24f17c17b9e8c0c93e7241dcdf9aa522d5d1732626', 'dev@gmail.com', 1, '8080', 0, 'A test account to save that tedious signup each time!', 0, 0);

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
('Sports'),
('League of Legends'),
('Fortnite'),
('Minecraft'),
('Call of Duty'),
('Counter-Strike 2'),
('Valorant'),
('Dota 2'),
('Apex Legends'),
('Grand Theft Auto V'),
('The Legend of Zelda: Breath of the Wild'),
('The Legend of Zelda: Tears of the Kingdom'),
('Elden Ring'),
('Red Dead Redemption 2'),
('Cyberpunk 2077'),
('Super Smash Bros. Ultimate'),
('Overwatch 2'),
('Genshin Impact'),
('World of Warcraft'),
('Rocket League'),
('EA Sports FC 25'),
('The Sims 4'),
('Among Us'),
('Dead by Daylight'),
('Hogwarts Legacy');

DELETE FROM categories WHERE category_name = 'Gaming';
UPDATE streams SET category_id = 6 WHERE category_id = 1;


-- Sample Data for streams
INSERT INTO streams (user_id, title, start_time, category_id) VALUES
(1, 'Game on!', '2025-02-16 17:00:00', 1),
(2, 'Live Music Jam', '2025-01-25 20:00:00', 2),
(3, 'Sketching Live', '2025-01-24 15:00:00', 3),
(4, 'Math Made Easy', '2025-01-23 10:00:00', 4),
(5, 'Sports Highlights', '2025-02-15 23:00:00', 5),
(6, 'Genshin1', '2025-02-17 18:00:00', 6),
(7, 'Genshin2', '2025-02-18 19:00:00', 7),
(8, 'Genshin3', '2025-02-19 20:00:00', 8),
(9, 'Genshin4', '2025-02-20 14:00:00', 9),
(10, 'Genshin5', '2025-02-21 09:00:00', 10),
(11, 'Genshin6', '2025-02-22 11:00:00', 11),
(12, 'Genshin7', '2025-02-23 21:00:00', 12),
(13, 'Genshin8', '2025-02-24 16:00:00', 13),
(14, 'Genshin9', '2025-02-25 22:00:00', 14),
(15, 'Genshin10', '2025-02-26 18:30:00', 15),
(16, 'Genshin11', '2025-02-27 17:00:00', 16),
(17, 'Genshin12', '2025-02-28 15:00:00', 17),
(18, 'Genshin13', '2025-03-01 10:00:00', 18),
(19, 'Genshin14', '2025-03-02 20:00:00', 19),
(20, 'Genshin15', '2025-03-03 13:00:00', 20),
(21, 'Genshin16', '2025-03-04 09:00:00', 21),
(22, 'Genshin17', '2025-03-05 12:00:00', 22),
(23, 'Genshin18', '2025-03-06 14:00:00', 23),
(24, 'Genshin19', '2025-03-07 16:00:00', 24),
(25, 'Genshin20', '2025-03-08 19:00:00', 25),
(26, 'Genshin21', '2025-03-09 21:00:00', 26),
(27, 'Genshin22', '2025-03-10 17:00:00', 27);

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
