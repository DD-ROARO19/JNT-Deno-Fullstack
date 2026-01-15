import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { 
    // all_ctgs, one_ctg, 
    update_stmt, delete_stmt, insert_stmt,
    all_folders, one_folder, 
} from "../statements/directories.ts";
// import type { StatementResultingChanges } from "node:sqlite";

import type { Category, CategoryNode } from '../../types.ts'

const catgs = new Hono();


catgs.post('/', async (c) => {
    const { alias, parent_id } = await c.req.json()

    try {
        db.prepare(insert_stmt).run(alias, parent_id)
    } catch (err) {
        console.error(err);
    }

    // console.log('Create query result: ->\n', res!);
    return c.json({ msg: 'Directory Created' })
});

catgs.get('/tree', (c) => {
    const categoryFlat = db.prepare(all_folders).all() as Category[];
    console.log('categoryFlat ->', categoryFlat);
    

    const tree: CategoryNode[] = [];
    const map = new Map<string, CategoryNode>();

    for (const ctg of categoryFlat) {
        const node: CategoryNode = { ...ctg, childs: [], name: '' }
        map.set(node.path, node);

        node.name = node.path.slice(node.path.lastIndexOf('/') + 1);

        const parentPath = node.path.substring(0, node.path.lastIndexOf('/'));
        const parent = map.get(parentPath);
        
        if (parent) {
            parent.childs.push(node);
        } else {
            tree.push(node);
        }

        /*console.log({
            path: node.path,
            ctg: ctg,
            node: node,
            map: map,
            parentPath: parentPath,
            parent: parent
        });/**/
    }

    if (tree.length < 1) {
        return c.json({ msg: 'No list found!' }, 404)
    }

    // console.log({ tree: tree, map: map });
    return c.json({ list: tree })
})

catgs.get('/:id?', (c) => {
    const id = c.req.param('id')
    const res = id ? db.prepare(one_folder).get(id) : db.prepare(all_folders).all();
    if (!res) return c.json({ mgs: 'No directories found!' }, 404)

    return c.json({ list: res })
})

catgs.delete('/:id', (c) => {
    const id = c.req.param('id')

    try {
        db.prepare(delete_stmt).run(id)
    } catch (err) {
        console.error(err);
    }

    return c.json({ msg: 'Successfully deleted' })
})

catgs.put('/:id', (c) => {
    const id = c.req.param('id')

    try {
        db.prepare(update_stmt).run(id)
    } catch (err) {
        console.error(err);
    }

    return c.json({ msg: 'Successfully updated' })
})

export default catgs;