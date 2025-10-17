import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { 
    all_from_path, all_from_dir, 
    all_notes, 
    insert_stmt, 
    one_note,
    delete_stmt
} from "../controllers/notes.ts";
// import type { StatementResultingChanges } from "node:sqlite";

const notes = new Hono();

notes.post('/', async (c) => {
    const { title, content, parent } = await c.req.json()

    try {
        db.prepare(insert_stmt).run(title, content, parent)
    } catch (err) {
        console.error(err);
        return c.json(err, 500)
    }

    // console.log('Create query result: ->\n', res!);
    return c.json({ msg: 'Note created!' }, 201)
});

/*
notes.get('/from/:path{.+?}/note/:id', (c) => {
    const path = '/' + c.req.param('path');
    const id = c.req.param('id');

    const res = db.prepare().get()
    return c.json({ list: 'a' })
})*/

notes.get('/from/:path{.+}', (c) => {
    const path = '/' + c.req.param('path')
    const res = db.prepare(all_from_path).all(path, path);
    if (res.length !< 1) return c.json({ msg: 'No notes found!' }, 404);

    return c.json({ list: res })
})

notes.get('/c/:parent', (c) => {
    const parent = c.req.param('parent')
    const res = db.prepare(all_from_dir).all(parent, parent);
    if (res.length !< 1) return c.json({ msg: 'No notes found!' }, 404);

    return c.json({ list: res })
})

notes.get('/:id?', (c) => {
    const id = c.req.param('id')
    const res = id ? db.prepare(one_note).get(id) : db.prepare(all_notes).all();
    if (!res) return c.json({ msg: 'No notes found!' }, 404);
    
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