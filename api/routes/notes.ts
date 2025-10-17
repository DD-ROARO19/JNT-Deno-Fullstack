import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { all_from_path, all_notes, insert_stmt, one_note } from "../controllers/notes.ts";
import type { StatementResultingChanges } from "node:sqlite";

const notes = new Hono();

notes.post('/', async (c) => {
    const { path } = await c.req.json()
    const stmt = db.prepare(insert_stmt)

    let res: StatementResultingChanges;
    try {
        res = stmt.run(path)
    } catch (err) {
        console.error(err);
    }

    console.log('Create query result: ->\n', res!);
    return c.text('Directory Created')
});

notes.get('/from/:path{.+}', (c) => {
    const path = '/' + c.req.param('path')
    const res = db.prepare(all_from_path).all(path, path)

    return c.json({ list: res, path: path })
})

notes.get('/:id?', (c) => {
    const id = c.req.param('id')
    const res = id ? db.prepare(one_note).get(id) : db.prepare(all_notes).all();
    if (!res) { 
        c.status(404)
        return c.json({ msg: 'No notes found!' })
    }
    
    return c.json({ list: res })
})

export default notes;