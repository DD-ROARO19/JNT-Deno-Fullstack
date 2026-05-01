import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { insert_stmt, query_one, update_stmt, delete_stmt } from "../statements/patterns.ts";
import type { bindObject } from "../../types.ts";
import type { SQLInputValue } from "node:sqlite";

const patterns = new Hono();

patterns.post('/new', async (c) => {
    const body = await c.req.json()
    
    try {
        const res = db.prepare(insert_stmt).run(body.title, body.packet_name || '', JSON.stringify(body.keys));
        console.debug(res)
        return c.json({ msg: 'New pattern saved', id: res.lastInsertRowid }, 201);
    } catch (err) {
        console.error(err)
        return c.json(err, 500);
    }
});


patterns.get('/query', (c) => {
    const q = { 
        author: c.req.query('author'),
        search: c.req.query('search'), 
        limit: c.req.query('limit'), 
        skip: c.req.query('skip')
    };

    const binds: bindObject = {};
    let stmt = 'SELECT p.* FROM patterns AS p';

    if (q.search) {
        stmt = `SELECT s.* FROM patterns_fts($search) AS s 
            JOIN patterns AS p ON s.rowid = p.id`;  
        binds['search'] = q.search;
    }
    
    try {
        if(q.limit && typeof Number(q.limit) === 'number') {
            stmt += ' LIMIT $limit';
            binds['limit'] = q.limit;
        }
        if(q.skip && typeof Number(q.skip) === 'number') {
            stmt += ' OFFSET $skip';
            binds['skip'] = q.skip;
        }
        if(q.author) {
            stmt += ' WHERE p.author = $author;'
            binds['author'] = q.author;
        } 
        stmt += ';'

        const query_result = db.prepare(stmt).all(binds as unknown as SQLInputValue);
        return c.json(query_result)
    } catch (err) {
        console.error(err)
        return c.json(err, 500);
    }
})

patterns.get('/:id', (c) => {
    const id = c.req.param('id');

    if(!id) return c.json({ error_msg: 'No id specified!' }, 400);
    
    try {
        const res = db.prepare(query_one).get(id)
        return res ? c.json(res) : c.json({ msg: 'Note not found!', note_id: id }, 404)
    } catch (err) {
        console.error(err)
        return c.json(err, 500);
    }
})


patterns.put('/:id/update', async (c) => {
    const id = c.req.param('id');
    if(!id) return c.json({ error_msg: 'No id specified!' }, 400);
    
    try {
        console.debug(db.prepare(update_stmt).run(await c.req.json()));
    } catch (err) {
        console.error(err)
        return c.json(err, 500);
    }

    return c.json({ msg: 'Successfully updated' });
})


patterns.delete('/:id/erase', (c) => {
    const id = c.req.param('id');
    if(!id) return c.json({ error_msg: 'No id specified!' }, 400);
    
    try {
        console.debug(db.prepare(delete_stmt).run(id));
    } catch (err) {
        console.error(err)
        return c.json(err, 500);
    }

    return c.json({ msg: 'Successfully deleted' });
})


export default patterns;