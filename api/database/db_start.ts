import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("notes.db");
const initialQuery = Deno.readTextFileSync(Deno.cwd()+'/api/database/inital.sql')
const testInsert = Deno.readTextFileSync(Deno.cwd()+'/api/database/entry_test.sql')

db.exec(initialQuery);

// Insert Test
try {
	db.exec(testInsert);
} catch (err) {
	console.error(err);
}

// export { db };
export default db;