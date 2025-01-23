DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    username VARCHAR(50) NOT NULL,
    password VARCHAR(256) NOT NULL,
    email VARCHAR(64) NOT NULL,
    num_followers INTEGER NOT NULL,
    isPartenered BOOLEAN NOT NULL DEFAULT 0,
    bio TEXT,
    PRIMARY KEY (username)
);

SELECT * FROM users;


DROP TABLE IF EXISTS streams;
CREATE TABLE streams
(
    stream_id INTEGER AUTOINCREMENT,
    title TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    num_viewers INT NOT NULL DEFAULT 0,
    isLive BOOLEAN NOT NULL DEFAULT 0,
    vod_id INT,
    streamer_id VARCHAR NOT NULL,
    PRIMARY KEY (stream_id),
    FOREIGN KEY (streamer_id) REFERENCES users(username) ON DELETE CASCADE
);

DROP TABLE IF EXISTS follows;
CREATE TABLE follows
(
    username VARCHAR(50) NOT NULL,
    following_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (username, following_id),
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(username) ON DELETE CASCADE
);

DROP TABLE IF EXISTS chat;
CREATE TABLE chat
(
    message_id INT AUTOINCREMENT,
    chatter_id VARCHAR(50) NOT NULL,
    stream_id INT NOT NULL,
    message VARCHAR(256) NOT NULL,
    time_sent DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id),
    FOREIGN KEY (chatter_id) REFERENCES users(username),
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE CASCADE
);

CREATE INDEX chatter_index ON chat(chatter_id);