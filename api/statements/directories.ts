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
const dir_id =  `SELECT id FROM directories WHERE parent_id IS ? AND alias is ?`;
//
// const all_ctgs = `SELECT * FROM categories`;
// const one_ctg =  `SELECT * FROM categories WHERE id = ?`;
const all_folders = `SELECT * FROM v_note_counts`;
const one_folder = `SELECT * FROM v_note_counts`;

// -- Advance selects



// ---- DELETE ----

const delete_stmt = `DELETE FROM directories WHERE id = ?`


// ---- EXPORTS ----

export { 
    insert_stmt,
    update_stmt,
    delete_stmt,
    all_dirs, one_dir, dir_id,
    // all_ctgs, one_ctg
    all_folders, one_folder
}