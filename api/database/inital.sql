PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS directories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    parent INTEGER NOT NULL,
    FOREIGN KEY (parent) REFERENCES directories (id) ON DELETE CASCADE
);

CREATE VIEW IF NOT EXISTS categories AS
SELECT 
    d.*,
    COUNT(n.parent) AS count
FROM directories AS d
JOIN notes AS n
WHERE d.id = n.parent
GROUP BY d.id;