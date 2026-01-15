// DB definition.
const db = new DatabaseSync("notebook.db");
const initialQuery = Deno.readTextFileSync(Deno.cwd()+'/api/database/inital.sql')

db.exec(initialQuery);
export default db;

// TYPES
import type { NewNote } from "../../types.ts";

// For DB file definition.
import { DatabaseSync } from "node:sqlite";

// Controller Import for initial seeding.
import { create_note } from "../controllers/notes_controller.ts";
// import { insert_stmt as ctg_stmt } from "../statements/directories.ts";
import { all_notes } from "../statements/notes.ts";


if (true) { // trying to create the wellcome guide.
	// Initial testing
	try {
		const wellcome: NewNote = {
			title: 'Wellcome guide!',
			author: 'JNT App',
			path: '/Guides',
			tags: ['Guide'],
			content: {
				use: `This app was made purely because I really liked the Json format & got this idea stuck 
				through university of a way to facilitate the creation of my minecraft mod lists lmao.`,
				examples: [
					`This is an array! it is the object you'll use for storing a list of any number items. 
					(including object as seen here and even more arrays)`,
					{
						"Text example": "Hello new user!",
						"A little explication": `By using the "String" data type you\'ll be capable of:
						- Inputing text values.
						- & using markup for decorating text. (working on this)`,
					},
					{
						"Numbers!": 69,
						Description: "Just some simple type of input for saving a numerical value."
					},
					{
						"Booleans (default)": false,
						"check_boolean": true,
						"(radio) bool": true,
						Explication: `Input used for storing boolean values (true of false, haha).
						I liked the idea of adding some decoration for thise ones, so adding the next strings
						to the key will change them!
						- "check" (for a simple switch).
						- "radio" (shows a group of two radio buttons to represent values).
						If no decoration key word is used it'll default to only a string. 
						(recomendations are valued!)`
					},
					{
						empty_object: {},
						Description: `It saves pairs of both key (alias to use for the data) & value (the data!).`
					},
					{
						empty_array: [],
						Description: `It saves a list of values with outkeys. 
						Planned features, object only lists, to add:
						- Allow format definition of objects; so all objects can have the same parameters.
						- Display formated object lists as tables.`
					}
				],
	
			}
		}
		const testNote: Omit<NewNote, 'path' | 'title'> = {
			author: 'Testing',
			content: {},
			tags: []
		}
		console.debug(create_note(wellcome), 'Wellcome guide created.');
		create_note({ ...testNote, path: '/', title: 'X-Note Test'})
		create_note({ ...testNote, path: '/Cats', title: 'Short path test'})
		create_note({ ...testNote, path: '/Mexico/Dogs/Small/Chihuahuas', title: 'Long path test'})
		
		// ---- OLD WAY ----
		// const insert_cat = db.prepare(ctg_stmt);
		// insert_cat.run('/Gatos')
		// insert_cat.run('/Perros')
		// insert_cat.run('/Perros/Pequeños')
		// insert_cat.run('/Perros/Grandes')
	
		// const insert_note = db.prepare(note_stmt);
		// insert_note.run('Salchicha', '{desc:"Larguito"}', 2)
		// insert_note.run('Chihuahua', '{desc:"Pequeñito"}', 3)
		// insert_note.run('Husky', '{desc:"Pequeñito"}', 4)
	} catch (err) {
		console.error(err);
	}
}

// export { db };
// export default db;