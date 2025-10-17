import { Hono } from "@hono/hono";
import catgs from "./routes/categories.ts";
import notes from "./routes/notes.ts";

const app = new Hono().basePath('/api')
// import db from "./database/db_start.ts";

app.route('/categories', catgs)
app.route('/notes', notes)

Deno.serve(app.fetch);
