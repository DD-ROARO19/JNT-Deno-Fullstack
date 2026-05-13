import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { advance_order, basic_search, composed_order, fts_search, get_all } from "../statements/tags.ts";
import type { bindObject } from "../../types.ts";
import type { SQLInputValue } from "node:sqlite";

const tags = new Hono();

tags.get('/', (c) => {
    const stmt = get_all + ' LIMIT 8';
    try {
        const res = db.prepare(stmt).all()
        // return res ? c.json(res) : c.json({ msg: 'Tag not found!' }, 404)
        return c.json(res)
    } catch (err) {
        console.error(err)
        return c.json({ err, stmt }, 500);
    }
})

tags.get('/:tag', (c) => {
    const tag = c.req.param('tag');
    
    // const stmt = fts_search;
    const stmt = ((tag.length <= 2) ? basic_search : fts_search + ' ORDER BY s.rank ') + ' LIMIT 8';

    // console.debug('tag search => ', {stmt, tag});
    try {
        const res = db.prepare(stmt).all(tag)
        // return res ? c.json(res) : c.json({ msg: 'Tag not found!', tag: tag }, 404)
        return c.json(res);
    } catch (err) {
        console.error(err)
        return c.json({err, stmt, tag:tag}, 500);
    }
})

export default tags;