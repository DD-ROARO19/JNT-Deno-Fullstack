import { Hono } from "@hono/hono";

const app = new Hono();
// import db from "./database/db_start.ts";

app.get("/", (c) => {
    return c.text("Hello from the Trees!");
});

Deno.serve(app.fetch);
