const insert_stmt = 
`--sql
    INSERT INTO notes (
        title, content, parent
    ) VALUES (
        ?, ?, ?
    )
`;

const update_title =   `UPDATE notes SET title = ? WHERE id = ?`
const update_content = `UPDATE notes SET content = ? WHERE id = ?`
const update_parent =  `UPDATE notes SET parent = ? WHERE id = ?`

const all_notes =    `SELECT * FROM notes`;
const all_from_dir = `SELECT * FROM notes WHERE parent = ?`;
const one_note =     `SELECT * FROM notes WHERE id = ?`;

const all_from_path = 
`SELECT 
    n.*, d.path
FROM notes AS n
JOIN directories AS d
    ON d.id = n.parent
WHERE 
    LOWER(d.path) = LOWER(?) 
    OR LOWER(d.path) LIKE LOWER(?) || '/%';
`;

const delete_stmt = `DELETE FROM notes WHERE id = ?`

export { 
    insert_stmt,
    update_title, update_content, update_parent,
    delete_stmt,
    all_from_dir, all_from_path, all_notes, one_note
}