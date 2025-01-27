-- View all tables in the database
SELECT name FROM sqlite_master WHERE type='table';

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(128) NOT NULL,
    num_followers INTEGER NOT NULL,
    bio VARCHAR(1024)
);

SELECT * FROM users;

DROP TABLE IF EXISTS follows;
CREATE TABLE follows
(
    user_id INTEGER NOT NULL,
    streamer_id INTEGER NOT NULL,   
    since DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, streamer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (streamer_id) REFERENCES streamers(streamer_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS user_preferences;
CREATE TABLE user_preferences
(
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    favourability INT NOT NULL DEFAULT 0,
    PRIMARY KEY(user_id, category_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS subscribes;
CREATE TABLE subscribes
(
    user_id INTEGER NOT NULL,
    streamer_id INTEGER NOT NULL,
    since DATETIME NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (user_id,streamer_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(streamer_id) REFERENCES streamers(streamer_id) ON DELETE CASCADE   
);

