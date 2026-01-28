import db from "../database/db_start.ts";
import { dir_id, insert_stmt } from "../statements/directories.ts";

export function createDirectory(alias: string, parent_id: number | null) {
    return db.prepare(insert_stmt).run(alias, parent_id).lastInsertRowid as number
}

// Fun recursion idea (not really necessary!).
/** Recursive version of `getDir_byPath`.
 *  Looks for the ID id the last directory on a path,
 *  and if it doesn't exist it creates it.
 *  (ej. "/dogs/small" would give you the id for "small"). */
export function getParent_byPath(path: string[], parent_id: number | null) {
    if (path.length > 1) {
        const first_item = path.shift();
        const find = db.prepare(dir_id).get(parent_id, first_item!)
        // console.debug('FIND: ', find, `<- FROM: (${parent_id}, ${first_item}) - Path: `, path,);

        let id: number;
        if (!find) {
            // create
            id = createDirectory(first_item!, parent_id)
        } else id = find.id as number

        return getParent_byPath(path, id)
    }

    // console.debug('PATH: ', path, ' || '+path[0]);
    const result = db.prepare(dir_id).get(parent_id, path[0])
    return (!result) ? createDirectory(path[0], parent_id) : result.id
}

/** Looks for the ID id the last directory on a path,
 *  and if it doesn't exist it creates it.
 *  (ej. "/dogs/small" would give you the id for "small"). */
export function getDir_byPath(path: string[]) {
    let parent_id = null;
    for (let index = 0; index < path.length; index++) {
        const alias = path[index];
        const find = db.prepare(dir_id).get(parent_id, alias);
        // console.debug('find: ', find, ' from: ', parent_id, ' + ', alias);
        
        if (!find) { // if the directory does not exist, then create it.
            parent_id = createDirectory(alias, parent_id);
        } 
        else parent_id = find.id as number;
    }
    // console.debug('dir_id: ', parent_id);
    return parent_id;
}