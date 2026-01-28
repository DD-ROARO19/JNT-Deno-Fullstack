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
// const on_folder = {
//     total_byID: `--sql 
//         SELECT n.* FROM v_descendant AS d 
//         JOIN notes AS notes
//             ON n.directory_id IS d.child_id 
//         WHERE d.root_id = ?`,
//     directly_byID: `--sql 
//         SELECT * FROM notes
//         WHERE directory_id = ?`,
//     total_byPath: `--sql 
//         SELECT n.* FROM v_descendants AS d
//         JOIN v_dir_paths AS p
//             ON d.root_id = p.id
//         JOIN notes AS n
//             ON n.directory_id = d.child_id
//         WHERE p.full_path IS ?`,
//     directly_byPath: `--sql 
//         SELECT n.* from v_dir_paths AS p 
//         JOIN notes AS n
//             ON n.directory_id = p.id
//         WHERE p.full_path IS ?`
// }
// Should I divide `on_folder`? (either by total/directly or byID/byPath or each it's own const)

const on_folder_id = {
    total: `--sql 
        SELECT n.* --%% -->change to add more cols
            FROM notes AS n 
        --@@ -->change to expand query
        JOIN v_descendants AS d
            ON n.directory_id IS d.child_id 
        WHERE d.root_id = $id`,
    directly: `--sql 
        SELECT n.* --%% 
            FROM notes AS n
        --@@
        WHERE n.directory_id = $id`
}
const on_folder_path = {
    total: `--sql 
        SELECT n.* --%% 
            FROM notes AS n
        --@@
        JOIN v_descendants AS d
            ON n.directory_id = d.child_id
        JOIN v_dir_paths AS p
            ON d.root_id = p.id
        WHERE p.full_path IS $id`,
    directly: `--sql 
        SELECT n.* --%% 
            FROM notes AS n 
        --@@
        JOIN v_dir_paths AS p
            ON n.directory_id = p.id
        WHERE p.full_path IS $id`
}
// , snippet(notes_fts, content, '<b>', '</b>', '...', 20) AS snippet
// JOIN notes_fts(?) AS s
//     ON s.rowid = n.id

// ---- DELETE ----
const delete_stmt = `DELETE FROM notes WHERE id = ?`


// ---- EXPORTS ----
export {
    insert_stmt, update_stmt,
    update_title, update_content, update_directory as update_parent,
    delete_stmt,
    all_notes, one_note,
    on_folder_id, on_folder_path
}