const insert_stmt = 
`--sql
    INSERT INTO directories (
        path
    ) VALUES (
        ?
    )
`;

const update_stmt =
`--sql
    UPDATE directories SET
        path = ?
    WHERE id = ?
`

const all_dirs = `SELECT * FROM directories`;
const one_dir =  `SELECT * FROM directories WHERE id = ?`;

const all_ctgs = `SELECT * FROM categories`;
const one_ctg =  `SELECT * FROM categories WHERE id = ?`;

const delete_stmt = `DELETE FROM directories WHERE id = ?`

export { 
    insert_stmt,
    update_stmt,
    delete_stmt,
    all_dirs, one_dir,
    all_ctgs, one_ctg
}