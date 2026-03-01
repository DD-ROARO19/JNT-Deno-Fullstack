// ---- INSERT ----

const insert_stmt = 
`INSERT INTO directories ( alias, parent_id ) VALUES ( ?, ? )`;


// ---- UPDATE ----

const update_stmt =
`--sql
UPDATE directories SET
    alias = ?,
    parent_id = ?,
    last_updated = ?
WHERE id = ?
`;


// ---- SELECT ----

// -- Simples
const all_dirs = `SELECT * FROM directories`;
const one_dir =  `SELECT * FROM directories WHERE id = ?`;
const dir_id =  `SELECT id FROM directories WHERE parent_id IS ? AND LOWER(alias) is LOWER(?)`;
//
// const all_ctgs = `SELECT * FROM categories`;
// const one_ctg =  `SELECT * FROM categories WHERE id = ?`;
const all_folders = `SELECT * FROM v_note_counts`;
const one_folder = `SELECT * FROM v_note_counts`;

// -- Advance selects

/** It sould return a detailed array of every directory / folder. 
 * This could, for example, have the required data for creating a tree... */
const detail_dir_query = `--sql
    SELECT c.*, p.full_path FROM v_note_count AS c
    JOIN v_dir_paths AS p 
        ON c.id = p.id
`;

// ---- DELETE ----

const delete_stmt = `DELETE FROM directories WHERE id = ?`


// ---- EXPORTS ----

export { 
    insert_stmt,
    update_stmt,
    delete_stmt,
    all_dirs, one_dir, dir_id,
    // all_ctgs, one_ctg
    all_folders, one_folder,
    detail_dir_query
}