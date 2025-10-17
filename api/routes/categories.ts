import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { all_ctgs, all_dirs, insert_stmt } from "../controllers/directories.ts";
import type { StatementResultingChanges } from "node:sqlite";

const catgs = new Hono();

catgs.post('/', async (c) => {
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

catgs.get('/', (c) => {
    const res = db.prepare(all_ctgs).all();

    return c.json({ list: res })
})

export default catgs;