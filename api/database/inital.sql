---- CONFIGURATION ----
PRAGMA foreign_keys = ON;
-- PRAGMA ENABLE_FTS5 = ON;

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
    directory_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    author TEXT DEFAULT 'No author',
    tags TEXT,
    content TEXT NOT NULL,
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

-- Descendants view || query with a record of what sub_directories every directory has.
CREATE VIEW IF NOT EXISTS v_descendants AS 
WITH RECURSIVE sub_dirs AS (
    SELECT id AS root_id, id AS child_id
    FROM directories

    UNION ALL

    SELECT des.root_id, d.id
    FROM directories AS d
    JOIN sub_dirs AS des
        ON d.parent_id IS des.child_id
)
SELECT * FROM sub_dirs;

-- Notes counts view || total number of notes in the directory & sub_directories. 
CREATE VIEW IF NOT EXISTS v_note_count AS
SELECT
    -- folder.id, folder.parent_id,
    COUNT(n.id) AS note_count,
    folder.*
FROM directories AS folder
JOIN v_descendants AS des 
    ON folder.id IS des.root_id
LEFT JOIN notes AS n 
    ON n.directory_id IS des.child_id
GROUP BY folder.id;

-- Path view || all the existing valid paths.
CREATE VIEW IF NOT EXISTS v_dir_paths AS
WITH RECURSIVE all_paths AS (
    SELECT id, '/' || LOWER(alias) AS full_path, parent_id FROM directories WHERE parent_id IS NULL
    UNION ALL
    SELECT d.id, (CASE WHEN ap.full_path = '/' THEN '' ELSE ap.full_path END) || '/' || LOWER(d.alias), d.parent_id
    FROM directories d JOIN all_paths ap ON d.parent_id = ap.id
)
SELECT * FROM all_paths;

-- A view with all existing tags on all notes.
CREATE VIEW IF NOT EXISTS v_tags AS
SELECT DISTINCT UPPER(j.value) AS tag
FROM notes AS n
JOIN json_each(n.tags) AS j;


---- TRIGGERS ----
-- Craetes a new FTS entry for text search after a notes is inserted into 'notes'.
CREATE TRIGGER IF NOT EXISTS notes_add AFTER INSERT ON notes BEGIN
    INSERT INTO notes_fts(rowid, title, tags, content) 
    VALUES (new.id, new.title, new.tags, new.content);
END;

-- Deletes the FTS entry after a notes is deleted.
CREATE TRIGGER IF NOT EXISTS notes_del AFTER DELETE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, tags, content) 
    VALUES ('delete', old.id, old.title, old.tags, old.content);
END;

-- Updates an FTS entry by deleting and re-inserting the new data.
CREATE TRIGGER IF NOT EXISTS notes_upd AFTER UPDATE ON notes BEGIN
    INSERT INTO notes_fts(notes_fts, rowid, title, tags, content) 
    VALUES ('delete', old.id, old.title, old.tags, old.content);

    INSERT INTO notes_fts(rowid, title, tags, content) 
    VALUES (new.id, new.title, new.tags, new.content);
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