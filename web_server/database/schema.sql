DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(64) NOT NULL,
    num_followers INTEGER NOT NULL,
    isPartenered BOOLEAN NOT NULL DEFAULT 0,
    bio TEXT
);

SELECT * FROM users;


DROP TABLE IF EXISTS streams;
CREATE TABLE streams
(
    stream_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    num_viewers INT NOT NULL DEFAULT 0,
    isLive BOOLEAN NOT NULL DEFAULT 0,
    vod_id INT,
    streamer_id VARCHAR NOT NULL,
    FOREIGN KEY (streamer_id) REFERENCES users(username) ON DELETE CASCADE
);

DROP TABLE IF EXISTS follows;
CREATE TABLE follows
(
    user_id INT NOT NULL,
    following_id INT NOT NULL,
    PRIMARY KEY (user_id, following_id),
    FOREIGN KEY (user_id) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(username) ON DELETE CASCADE
);