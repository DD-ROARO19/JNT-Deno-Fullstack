/** ---- Insert a new pattern into the table ----
 * @param {string} title
 * @param {string} author
 * @param {string} pattern
*/
const insert_stmt = `--sql
INSERT INTO patterns (
    author, pattern
) VALUES (?, ?)
`;


/** ---- Update an existing pattern ---- 
 * @param {string} title
 * @param {string} author
 * @param {string} pattern
*/
const update_stmt = `--sql
UPDATE patterns SET
    title = ?, 
    --author = ?,
    pattern = ?, 
    last_updated = datetime('now', 'localtime')
WHERE id = ?
`;


// ---- SELECT ----
const query_all = `SELECT * FROM patterns`;
const query_one = `SELECT * FROM patterns WHERE id = ?`;


/** ---- Deletes a pattern from the table ---- */
const delete_stmt = `DELETE FROM patterns WHERE id = ?`


// ---- EXPORTS ----
export {
    insert_stmt, update_stmt, delete_stmt,
    query_all, query_one
}