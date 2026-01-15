---- CONFIGURATION ----
PRAGMA foreign_keys = ON;

---- TABLES ----

-- Directory table || the "folder" that stores the notes.
CREATE TABLE IF NOT EXISTS directories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alias TEXT NOT NULL,
    parent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES directories (id) ON DELETE SET NULL
);

-- Notes table || the note in cuestion.
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT DEFAULT 'No author',
    tags BLOB,
    content TEXT NOT NULL,
    directory_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (directory_id) REFERENCES directories (id) ON DELETE CASCADE
);

-- Virtual table for full-text search on notes.
CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
    title,
    tags,
    content,
    content='notes',
    content_rowid='id'
);


---- INDEXES ----
CREATE UNIQUE INDEX IF NOT EXISTS single_root_check ON directories(parent_id) WHERE parent_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_directories_parent ON directories(parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_alias ON directories(alias, COALESCE(parent_id, -1));
CREATE INDEX IF NOT EXISTS idx_notes_directory ON notes(directory_id);


---- VIEWS ----

-- Notes counts view || total number of notes in the directory & sub_directories. 
CREATE VIEW IF NOT EXISTS v_note_counts AS
WITH RECURSIVE sub_dirs AS (
    SELECT id AS root_id, id AS child_id -- 1. Start as it's own root.
    FROM directories

    UNION ALL

    SELECT sb.root_id, d.id -- 2. Find descendants.
    FROM directories AS d
    JOIN sub_dirs AS sb 
        ON d.parent_id = sb.child_id
)
SELECT
    dir.*,
    COUNT(n.id) AS note_count
FROM directories AS dir
JOIN sub_dirs AS sb 
    ON dir.id = sb.root_id
LEFT JOIN notes AS n 
    ON n.directory_id = sb.child_id
GROUP BY dir.id;


---- TRIGGERS ----
-- Craetes a new FTS entry for text search after a notes is inserted into 'notes'.
CREATE TRIGGER IF NOT EXISTS notes_add AFTER INSERT ON notes BEGIN
    INSERT INTO notes_fts(rowid) VALUES (new.id);
END;

-- Deletes the FTS entry after a notes is deleted.
CREATE TRIGGER IF NOT EXISTS notes_del AFTER DELETE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content) 
    VALUES ('delete', old.id, old.title, old.content);
END;

-- Updates an FTS entry by deleting and re-inserting the new data.
CREATE TRIGGER IF NOT EXISTS notes_upd AFTER UPDATE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, content) 
    VALUES ('delete', old.id, old.title, old.content);

    INSERT INTO notes_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
END;

---- OLD ----

-- CREATE VIEW IF NOT EXISTS categories AS
-- SELECT 
--     d.*,
--     (
--         SELECT COUNT(n.id)
--         FROM notes AS n
--         JOIN directories AS sd 
--             ON sd.id = n.directory_id
--         WHERE 
--             sd.alias = d.alias
--             OR sd.alias LIKE d.alias || '/%'
--     ) AS note_count
-- FROM directories AS d;