// ---- INSERT ----

const insert_stmt =
    `--sql
    INSERT INTO notes (
        title, author, content, tags, directory_id
    ) VALUES (
        ?, ?, ?, ?, ?
    )
`;


// ---- UPDATE ----
const update_stmt = `--sql
UPDATE notes SET
    title = ?
    content = ?
    directory_id = ?
    last_updated = ?
WHERE id = ?`;

const update_title = `UPDATE notes SET title = ? WHERE id = ?`
const update_content = `UPDATE notes SET content = ? WHERE id = ?`
const update_directory = `UPDATE notes SET directory_id = ? WHERE id = ?`


// ---- SELECT ----

// -- Simple selects.
const all_notes = `SELECT * FROM notes`;
const one_note = `SELECT * FROM notes WHERE id = ?`;

// -- Advanced selects.
const notes_on_folder = {
    by_id: `--sql WITH RECURSIVE sub_dirs AS (
        SELECT * FROM directories
        WHERE id = ?

        UNION ALL

        SELECT d.* FROM directories AS d
        JOIN sub_dirs AS sb ON d.parent_id = sb.child_id 
    )
    SELECT n.*
    FROM notes AS n
    JOIN sub_dirs AS folder 
        ON n.directory_id = folder.id`,

    by_path: `--sql WITH RECURSIVE path_finder AS (
        SELECT id, alias, alias AS full_path 
        FROM directories
        WHERE id IS NULL

        UNION ALL

        SELECT d.id, d.alias, pf.full_path || d.alias 
        FROM directories AS d
        JOIN path_finder AS pf ON d.parent_id = pf.child_id 
    )
    SELECT * FROM path_finder
    WHERE full_path = ?`
}

const all_from_dir = // -- (OLD) || Query all notes from an id (for a materalized path). 
    `SELECT 
    n.*, d.path
FROM notes AS n
JOIN directories AS d
    ON d.id = n.parent
WHERE 
    LOWER(d.path) = LOWER((SELECT path FROM directories WHERE id = ?)) 
    OR LOWER(d.path) LIKE LOWER((SELECT path FROM directories WHERE id = ?)) || '/%';
`;

const all_from_path = // (OLD) || Query all notes from a materalized path.
    `SELECT 
    n.*, d.path
FROM notes AS n
JOIN directories AS d
    ON d.id = n.parent
WHERE 
    LOWER(d.path) = LOWER(?) 
    OR LOWER(d.path) LIKE LOWER(?) || '/%';
`;


// ---- DELETE ----
const delete_stmt = `DELETE FROM notes WHERE id = ?`


// ---- EXPORTS ----
export {
    insert_stmt, update_stmt,
    update_title, update_content, update_directory as update_parent,
    delete_stmt,
    all_from_dir, all_from_path, all_notes, one_note,
    notes_on_folder
}