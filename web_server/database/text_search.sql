/* Full text search queries for categories */
DROP TABLE IF EXISTS category_fts;
CREATE VIRTUAL TABLE category_fts
USING fts5 (category_id, category_name);

INSERT INTO category_fts (category_id, category_name)
SELECT category_id, category_name
FROM categories;

-- Triggers that inserts new titles into category_fts
DROP TRIGGER IF EXISTS insert_category_fts;
CREATE TRIGGER insert_category_fts
AFTER INSERT ON categories
BEGIN
    INSERT INTO category_fts(category_id, category_name)
    VALUES (NEW.category_id, NEW.category_name);
END;

DROP TRIGGER IF EXISTS update_category_fts;
CREATE TRIGGER update_category_fts
AFTER UPDATE ON categories
BEGIN
    UPDATE category_fts
    SET
        category_id = NEW.category_id,
        category_name = NEW.category_name
    WHERE category_id = NEW.category_id;
END;

DROP TRIGGER IF EXISTS delete_category_fts;
CREATE TRIGGER delete_category_fts
AFTER DELETE ON categories
BEGIN
    DELETE FROM category_fts
    WHERE category_id = OLD.category_id;
END;

/* Full text search queries for users */
DROP TABLE IF EXISTS user_fts;
CREATE VIRTUAL TABLE user_fts
USING fts5 (user_id, username, is_live);

INSERT INTO user_fts (user_id, username, is_live)
SELECT user_id, username, is_live
FROM users;

-- Triggers that inserts new titles into user_fts
DROP TRIGGER IF EXISTS insert_user_fts;
CREATE TRIGGER insert_user_fts
AFTER INSERT ON users
BEGIN
    INSERT INTO user_fts(user_id, username, is_live)
    VALUES (NEW.user_id, NEW.username, NEW.is_live);
END;

DROP TRIGGER IF EXISTS update_user_fts;
CREATE TRIGGER update_user_fts
AFTER UPDATE ON users
BEGIN
    UPDATE user_fts
    SET
        user_id = NEW.user_id,
        username = NEW.username,
        is_live = NEW.is_live
    WHERE user_id = NEW.user_id;
END;

DROP TRIGGER IF EXISTS delete_user_fts;
CREATE TRIGGER delete_user_fts
AFTER DELETE ON users
BEGIN
    DELETE FROM user_fts
    WHERE user_id = OLD.user_id;
END;


/* Full text search queries for users */
DROP TABLE IF EXISTS stream_fts;
CREATE VIRTUAL TABLE stream_fts
USING fts5 (user_id, title, num_viewers, category_id);

INSERT INTO stream_fts (user_id, title, num_viewers, category_id)
SELECT user_id, title, num_viewers, category_id
FROM streams;

-- Triggers that inserts new titles into stream_fts
DROP TRIGGER IF EXISTS insert_stream_fts;
CREATE TRIGGER insert_stream_fts
AFTER INSERT ON streams
BEGIN
    INSERT INTO stream_fts(user_id, title, num_viewers, category_id)
    VALUES (NEW.user_id, NEW.title, NEW.num_viewers, NEW.category_id);
END;

DROP TRIGGER IF EXISTS update_stream_fts;
CREATE TRIGGER update_stream_fts
AFTER UPDATE ON streams
BEGIN
    UPDATE stream_fts
    SET
        user_id = NEW.user_id,
        title = NEW.title,
        num_viewers = NEW.num_viewers,
        category_id = NEW.category_id
    WHERE user_id = NEW.user_id;
END;

DROP TRIGGER IF EXISTS delete_stream_fts;
CREATE TRIGGER delete_stream_fts
AFTER DELETE ON streams
BEGIN
    DELETE FROM stream_fts
    WHERE user_id = OLD.user_id;
END;