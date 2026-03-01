import { Hono } from "@hono/hono";
import db from "../database/db_start.ts"
import { 
    update_stmt, delete_stmt, insert_stmt,
    detail_dir_query, 
} from "../statements/directories.ts";
// import type { StatementResultingChanges } from "node:sqlite";

import type { Category, CategoryNode } from '../../types.ts'

const catgs = new Hono();


catgs.post('/create', async (c) => {
    const { alias, parent_id } = await c.req.json()

    try {
        const result = db.prepare(insert_stmt).run(alias, parent_id);
        
            // console.log('Create query result: ->\n', res!);
        return c.json({ msg: 'Directory Created', id: result.lastInsertRowid }, 201);
    } catch (err) {
        console.error(err);
        return c.json(err, 500);
    }
});

catgs.get('/tree', (c) => {
    // console.time('---- tree');

    const map = new Map<Pick<Category, 'id'>['id'], CategoryNode>();
    
    try {
        const flat_foldersList = db.prepare(detail_dir_query).all() as unknown as Category[];

        if (flat_foldersList.length < 1) {
            return c.json({ msg: 'No Folders found!' }, 404);
        }
        
        for (let i = 0; i < flat_foldersList.length; i++) {
            const node: CategoryNode = { ...flat_foldersList[i], childs: [] };
            map.set(node.id, node);

            if (node.parent_id != null) {
                map.get(node.parent_id)!.childs.push(node);
            }
        }
        
        // return c.json({debugg: { tried: { req: q } }}, 200);
        // console.timeEnd('---- tree');
        return c.json(map.get(1), 200);
    } catch (err) {
        console.error(err);
        return c.json(err, 500);
    }
})

catgs.get('/list', (c) => {
    // console.time('---- list');
    const list: (CategoryNode | Category)[] = [];
    const map = new Map<Pick<Category, 'parent_id'>['parent_id'], CategoryNode>();

    try {
        const categoryFlat = db.prepare(detail_dir_query).all() as unknown as Category[];
        // console.log('categoryFlat ->', categoryFlat);

        if (categoryFlat.length < 1) {
            return c.json({ msg: 'List not found!' }, 404)
        }
    
        list.push(categoryFlat[0]);
    
        for (let i = 0; i < categoryFlat.length; i++) {
            const node: CategoryNode = { ...categoryFlat[i], childs: [] }
            map.set(node.id, node);

            const parent = map.get(node.parent_id);
            
            if (parent) {
                parent.childs.push(node);
            }

            if (node.parent_id === 1) {
                list.push(node);
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
    
        // console.timeEnd('---- list');
        // console.log({ tree: tree, map: map });
        return c.json(list)
    } catch (err) {
        console.error(err);
        return c.json(err, 500);
    }
})

catgs.get('/query', (c) => {
    const q = {
        id: c.req.query('id'),
        path: c.req.query('path'),
        parent_id: c.req.query('parent_id'),
    }

    let stmt = detail_dir_query;
    const bind = [];

    if (q.id) { stmt += ' WHERE c.id IS ?'; bind.push(q.id); }
    else if (q.path) { stmt += ' WHERE p.full_path IS ?'; bind.push(q.path); }
    else if (q.parent_id) { stmt += ' WHERE c.parent_id IS ?'; bind.push(q.parent_id); }

    try {
        const res = db.prepare(stmt).all(...bind);
        
        if (res.length < 1) return c.json({ mgs: 'No directories found!' }, 404)
    
        return c.json(res)
    } catch (err) {
        console.error({debug: {error: err, tried: { req: q, stmt, bind }}});
        return c.json(err, 500);
    }
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