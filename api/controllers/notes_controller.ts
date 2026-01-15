// TYPES
import type { NewNote } from "../../types.ts";

// DB RELATED IMPORTS
import db from "../database/db_start.ts";
import { // SQL Statements. 
    insert_stmt 
} from "../statements/notes.ts";

// HELPER FUNCTIONS
import { getDir_byPath, getParent_byPath } from "./dir_controller.ts";

/** Saves a new note to the db, while also creating the specified directory if it doesn't exists.
 * @param b - Body of the request for creating the note.
 */
export function create_note(b: NewNote) {
    console.time('-- for-loop');
    const parent_id = getDir_byPath(b.path.length > 1 ? b.path.split('/') : [''])
    console.timeEnd('-- for-loop');
    // console.time('-- recur');
    // const parent_id2 = getParent_byPath(b.path.length > 1 ? b.path.split('/') : [''], null)
    // console.timeEnd('-- recur');

    return db.prepare(insert_stmt).run(b.title, b.author, JSON.stringify(b.content), JSON.stringify(b.tags), parent_id2)
}