DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
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
    num_viewers INTEGER NOT NULL DEFAULT 0,
    isLive BOOLEAN NOT NULL DEFAULT 0,
    vod_id INTEGER,
    streamer_id INTEGER NOT NULL,
    FOREIGN KEY (streamer_id) REFERENCES streamers(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS streamers;
CREATE TABLE streamers
(
    user_id INTEGER PRIMARY KEY NOT NULL,
    streamer_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS follows;
CREATE TABLE follows
(
    user_id INTEGER NOT NULL,
    streamer_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, streamer_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (streamer_id) REFERENCES streamers(streamer_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS chat;
CREATE TABLE chat
(
    message_id INTEGER,
    chatter_id VARCHAR(50) NOT NULL,
    stream_id INTEGER NOT NULL,
    message VARCHAR(256) NOT NULL,
    time_sent DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, stream_id),
    FOREIGN KEY (chatter_id) REFERENCES users(user_id),
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE CASCADE
);

CREATE INDEX chatter_index ON chat(chatter_id);

DROP TABLE IF EXISTS categories;
CREATE TABLE categories
(
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(25) NOT NULL
);

DROP TABLE IF EXISTS stream_categories;
CREATE TABLE stream_categories
(
    stream_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    since DATETIME NOT NULL,
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
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
)

DROP TABLE IF EXISTS subscribed;
CREATE TABLE subscribed
(
    user_id INTEGER NOT NULL,
    streamer_id INTEGER NOT NULL,
    since DATETIME NOT NULL,
    ends DATETIME NOT NULL,
    PRIMARY KEY (user_id,streamer_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(streamer_id) REFERENCES streamers(streamer_id) ON DELETE CASCADE   
)

