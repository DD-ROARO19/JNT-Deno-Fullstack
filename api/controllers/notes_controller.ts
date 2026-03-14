// TYPES
import type { newNote, Note } from "../../types.ts";

// DB RELATED IMPORTS
import db from "../database/db_start.ts";
import { // SQL Statements. 
    one_note,
    insert_stmt,
    update_stmt,
} from "../statements/notes.ts";

// HELPER FUNCTIONS
import { getDir_byPath, getParent_byPath } from "./dir_controller.ts";

/** Saves a new note to the db, while also creating the specified directory if it doesn't exists.
 * @param b - Body of the request for creating the note.
 */
export function create_note(b: newNote) {
    // console.time('-- time');
    const directory_id = getDir_byPath(b.path.length > 1 ? b.path.split('/') : [''])
    // const parent_id2 = getParent_byPath(b.path.length > 1 ? b.path.split('/') : [''], null)
    // console.timeEnd('-- time');

    return db.prepare(insert_stmt).run(b.title, b.author, JSON.stringify(b.content), JSON.stringify(b.tags), directory_id)
}

export function getNote(id: number) {
    return db.prepare(one_note).get(id);
}

export function update_note(b: Note) {
    return db.prepare(update_stmt).run(b.directory_id, b.title, JSON.stringify(b.tags), JSON.stringify(b.content), b.id)
}