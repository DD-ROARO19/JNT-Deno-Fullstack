import { DatabaseSync } from "node:sqlite";
import { insert_stmt as ctg_stmt } from "../controllers/directories.ts";
import { insert_stmt as note_stmt } from "../controllers/notes.ts";

const db = new DatabaseSync("notes.db");
const initialQuery = Deno.readTextFileSync(Deno.cwd()+'/api/database/inital.sql')

db.exec(initialQuery);

// Initial testing
try {
	const insert_cat = db.prepare(ctg_stmt);
	insert_cat.run('/Gatos')
	insert_cat.run('/Perros')
	insert_cat.run('/Perros/Pequeños')
	insert_cat.run('/Perros/Grandes')

	const insert_note = db.prepare(note_stmt);
	insert_note.run('Salchicha', '{desc:"Larguito"}', 2)
	insert_note.run('Chihuahua', '{desc:"Pequeñito"}', 3)
	insert_note.run('Husky', '{desc:"Pequeñito"}', 4)
} catch (err) {
	console.error(err);
}

// export { db };
export default db;