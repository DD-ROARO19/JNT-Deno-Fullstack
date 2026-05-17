import { Hono } from "@hono/hono";
import catgs from "./routes/categories.ts";
import notes from "./routes/notes.ts";
import patterns from "./routes/patterns.ts";
import tags from "./routes/tags.ts";

const api = new Hono()
const app = new Hono({ strict: false })
// import db from "./database/db_start.ts";

api.route('/categories', catgs)
api.route('/notes', notes)
api.route('/patterns', patterns)
api.route('/tags', tags)

app.notFound((c) => {
    return c.json({ msg: 'Error! Path not found', paths: c.req.path })
})

app.route('/api', api)

Deno.serve(app.fetch);
