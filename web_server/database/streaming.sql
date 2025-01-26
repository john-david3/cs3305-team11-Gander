DROP TABLE IF EXISTS tags;
CREATE TABLE tags
(
    tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_name VARCHAR(25)
);

DROP TABLE IF EXISTS stream_tags;
CREATE TABLE stream_tags
(
    stream_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id),
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS chat;
CREATE TABLE chat
(
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    stream_id INTEGER NOT NULL,
    chatter_id VARCHAR(50) NOT NULL,
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

DROP TABLE IF EXISTS streams;
CREATE TABLE streams
(
    streamer_id INTEGER NOT NULL,
    stream_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    num_viewers INTEGER NOT NULL DEFAULT 0,
    isLive BOOLEAN NOT NULL DEFAULT 0,
    vod_id INTEGER,
    category_id NOT NULL,
    PRIMARY KEY (streamer_id, stream_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (streamer_id) REFERENCES streamers(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS streamers;
CREATE TABLE streamers
(
    user_id INTEGER PRIMARY KEY NOT NULL,
    streamer_id INTEGER NOT NULL,
    since DATETIME,
    isPartnered BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
