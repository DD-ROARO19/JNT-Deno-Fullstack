import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { 
    on_folder_id, on_folder_path, 
    all_notes, 
    insert_stmt, 
    one_note,
    delete_stmt,
    update_stmt
} from "../statements/notes.ts";
import type { Note } from "../../types.ts";
import { getDir_byPath } from "../controllers/dir_controller.ts";
import { create_note, update_note } from "../controllers/notes_controller.ts";
import { JSONObject } from '../../src/types.tsx';
import type { SQLInputValue } from "node:sqlite";
// import type { StatementResultingChanges } from "node:sqlite";
type bindObject = {
    [key: string]: string | number | undefined;
}

const notes = new Hono();



notes.post('/create', async (c) => {
    try {
        const res = create_note(await c.req.json())
        console.log(res);

        // console.log('Create query result: ->\n', res!);
        return c.json({ msg: 'Note created', id: res.lastInsertRowid }, 201)
    } catch (err) {
        console.error(err);
        return c.json(err, 500)
    }

});

// notes.get('/', (c) => { // (FOR TESTING || ERASE LATER!!)
//     try {
//         const allNotes = db.prepare(all_notes).all();
//         return c.json({msg: 'ERASE LATER!!!', list: allNotes}, 200);
//     } catch (err) {
//         console.error(err);
//         return c.json(err, 500)
//     }
// })

notes.get('/query', (c) => {
    const q = {
        search: c.req.query('search'), // Text to search on the note.
        path: c.req.query('path'), // Path of the directory to search for notes.
        directory_id: c.req.query('directory_id'), // ID of the directory to search.
        directOnly: c.req.query('directOnly'), // Depth allow to explore for notes (all or directly where you 'are').
        tags: c.req.queries('tags') // Tags used to filter notes.
    };
    
    const binds: bindObject = {}
    let stmt = '';

    try {
        if (!(q.directory_id) && !(q.path) ) {
            throw Error('NO PATH OR ID TO FOLDER!') // (FOR LATER): Create it's own error type.
        }
        
    
        binds.id = (q.path) ? q.path : q.directory_id;
        
        const stmt_options = (q.path) ? on_folder_path : on_folder_id;
        stmt = (q.directOnly) ? stmt_options.directly : stmt_options.total;
    
        if (q.tags && q.tags.length > 0) {
            for (let i = 0; i < q.tags.length; i++) {
                const keyName = 'tag_'+i;
                stmt += ` AND (SELECT 1 FROM json_each(n.tags) WHERE UPPER(value) IS UPPER($${keyName}))`;
                binds[keyName] = q.tags[i];
            }
        }
    
        if (q.search) {
            binds.search = q.search;
            
            stmt = stmt.replace('--%%', ", snippet(notes_fts, -1, '<b>', '</b>', '...', 15) AS snippet ");
            stmt = stmt.replace('--@@',' JOIN notes_fts($search) AS s ON s.rowid = n.id ');
            stmt += ' ORDER BY s.rank';
            
            // console.log('change!: ', stmt);
        }

        const query_result = db.prepare(stmt).all(binds as unknown as SQLInputValue)
        return c.json(query_result, 200);
        // return c.json({debugg: {result: query_result, tried: { stmt: stmt, bind: filter }}}, 200)
    } catch (err) {
        console.error(err);
        if (err instanceof Error) return c.json({ attempt: {req: q, stmt, binds }, error: err.message}, 500)
        return c.text('How did we get here?', 500)
    }
})

notes.get('/:id', (c) => {
    const id = c.req.param('id')
    if (!id) {
        return c.json({error_msg: 'No id specified!'}, 400)
    }

    try {
        const res = db.prepare(one_note).get(id)
        if (!res) return c.json({ msg: 'Note not found!', note_id: id }, 404);
        
        return c.json(res, 200)
    } catch (err) {
        console.error(err);
        return c.json(err, 500);
    }
})

notes.delete('/:id', (c) => {
    const id = c.req.param('id')

    try {
        db.prepare(delete_stmt).run(id)
    } catch (err) {
        console.error(err);
    }

    return c.json({ msg: 'Successfully deleted' })
})

notes.put('/', async (c) => {
    try {
        console.debug(update_note(await c.req.json()));
    } catch (err) {
        console.error(err);
    }
    
    return c.json({ msg: 'Successfully updated' })
})

export default notes;