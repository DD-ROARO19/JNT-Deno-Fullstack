import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { 
    on_folder_id, on_folder_path, 
    all_notes, 
    insert_stmt, 
    one_note,
    delete_stmt
} from "../statements/notes.ts";
import type { Note } from "../../types.ts";
import { getDir_byPath } from "../controllers/dir_controller.ts";
import { create_note } from "../controllers/notes_controller.ts";
import { JSONObject } from '../../src/types.tsx';
import type { SQLInputValue } from "node:sqlite";
// import type { StatementResultingChanges } from "node:sqlite";
type bindObject = {
    [key: string]: string | number | undefined;
}

const notes = new Hono();



notes.post('/create', async (c) => {
    try {
        create_note(await c.req.json())
    } catch (err) {
        console.error(err);
        return c.json(err, 500)
    }

    // console.log('Create query result: ->\n', res!);
    return c.json({ msg: 'Note created!' }, 201)
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
        id: c.req.query('id'), // ID of the directory to search.
        depth: c.req.query('depth'), // Depth allow to explore for notes (all or directly where you 'are').
        tags: c.req.queries('tags') // Tags used to filter notes.
    };
    
    const filter: bindObject = {}
    let stmt = '';

    try {
        if (!(q.id) && !(q.path) ) {
            throw Error('NO PATH OR ID TO FOLDER!') // (FOR LATER): Create it's own error type.
        }
        
    
        filter.id = (q.path) ? q.path : q.id;
        
        const stmt_options = (q.path) ? on_folder_path : on_folder_id;
        stmt = (q.depth === 'directly') ? stmt_options.directly : stmt_options.total;
    
        if (q.tags && q.tags.length > 0) {
            for (let i = 0; i < q.tags.length; i++) {
                const keyName = 'tag_'+i;
                stmt += ` AND (SELECT 1 FROM json_each(n.tags) WHERE UPPER(value) IS UPPER($${keyName}))`;
                filter[keyName] = q.tags[i];
            }
        }
    
        if (q.search) {
            filter.search = q.search;
            
            stmt = stmt.replace('--%%', ", snippet(notes_fts, -1, '<b>', '</b>', '...', 15) AS snippet ");
            stmt = stmt.replace('--@@',' JOIN notes_fts($search) AS s ON s.rowid = n.id ');
            stmt += ' ORDER BY s.rank';
            
            console.log('change!: ', stmt);
        }

        const query_result = db.prepare(stmt).all(filter as unknown as SQLInputValue)
        return c.json(query_result, 200);
        // return c.json({debugg: {result: query_result, tried: { stmt: stmt, bind: filter }}}, 200)
    } catch (err) {
        console.error(err);
        return c.json({ attempt: {req: q, stmt: stmt, bind: filter }, error: err}, 500)
    }
})

/*
notes.get('/from/:path{.+?}/note/:id', (c) => {
    const path = '/' + c.req.param('path');
    const id = c.req.param('id');

    const res = db.prepare().get()
    return c.json({ list: 'a' })
})*/

notes.get('/from/:path{.+}', (c) => {
    const path = '/' + c.req.param('path')
    const res = db.prepare(on_folder_path.total).all(path);
    if (res.length !< 1) return c.json({ msg: 'No notes found!' }, 404);

    return c.json({ list: res })
})

notes.get('/c/:parent', (c) => {
    const parent = c.req.param('parent')
    const res = db.prepare(on_folder_id.total).all(parent);
    if (res.length !< 1) return c.json({ msg: 'No notes found!' }, 404);

    return c.json({ list: res })
})

notes.get('/:id?', (c) => {
    const id = c.req.param('id')
    const res = id ? db.prepare(one_note).get(id) : db.prepare(all_notes).all();
    if (!res) return c.json({ msg: 'No notes found!', path: id }, 404);
    
    return c.json({ list: res })
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

notes.put('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    
    let stmt = `UPDATE notes SET `;
    if (body.title)     { stmt += 'title = $title ' }
    if (body.content)   { stmt += 'content = $content ' }
    if (body.parent)    { stmt += 'parent = $parent ' }
    stmt += 'WHERE id = ?';

    try {
        db.prepare(stmt).run(id, body)
    } catch (err) {
        console.error(err);
    }
    
    return c.json({ msg: 'Successfully updated' })
})

export default notes;