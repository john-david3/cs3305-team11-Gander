DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(256),
    email VARCHAR(128) NOT NULL,
    num_followers INTEGER NOT NULL DEFAULT 0,
    stream_key VARCHAR(60) NOT NULL,
    is_partnered BOOLEAN NOT NULL DEFAULT 0,
    is_live BOOLEAN NOT NULL DEFAULT 0,
    bio VARCHAR(1024) DEFAULT 'This user does not have a Bio.',
    is_admin BOOLEAN NOT NULL DEFAULT 0,

    current_stream_title VARCHAR(100) DEFAULT 'Stream',
    current_selected_category_id INTEGER DEFAULT 1
);

SELECT * FROM users;

DROP TABLE IF EXISTS follows;
CREATE TABLE follows
(
    user_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,   
    since DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, followed_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS user_preferences;
CREATE TABLE user_preferences
(
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    favourability INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS subscribes;
CREATE TABLE subscribes
(
    user_id INTEGER NOT NULL,
    subscribed_id INTEGER NOT NULL,
    since DATETIME NOT NULL,
    expires DATETIME NOT NULL,
    PRIMARY KEY (user_id, subscribed_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subscribed_id) REFERENCES users(user_id) ON DELETE CASCADE   
);

DROP TABLE IF EXISTS followed_categories;
CREATE TABLE followed_categories
(
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);