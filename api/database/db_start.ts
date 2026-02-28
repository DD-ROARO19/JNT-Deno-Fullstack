// DB definition.
const dir_path = Deno.cwd()+'/api/database/';
const db = new DatabaseSync(dir_path+"notebook.db");
const initialQuery = Deno.readTextFileSync(dir_path+'inital.sql')

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


if (db.prepare(all_notes).all().length < 1) { // trying to create the wellcome guide.
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
			tags: ['test']
		}
		console.debug(create_note(wellcome), 'Wellcome guide created.');
		create_note({ ...testNote, path: '/', title: 'Hello!!', tags: [], content: { text: 'A WARM WELLCOME TO THE APP! THIS IS A SIMPLE TEXT!!1!.' } })
		create_note({ ...testNote, path: '/', title: 'X-Note Test', content: {} })
		create_note({ ...testNote, path: '/', title: 'Peoples test', content: {list:[{name:'Anon', age:20}, {name:'jane', age:21}]} })
		create_note({ ...testNote, path: '/Mexico/Cats', title: 'Orange Cat', content: { description: 'Orange', caracteristics: ['Dumb', 'Crazy', 'Lazy'] }, tags: ['Mexico', 'test', 'cats']})
		create_note({ ...testNote, path: '/Mexico/Dogs', title: 'Doggos', content: {UniversalTruth:'Dogs are cute!'}, tags: ['Mexico', 'dogs', 'truth'] })
		create_note({ ...testNote, path: '/Mexico/Dogs/Small/Chihuahuas', title: 'Long path test', tags: ['Mexico', 'test', 'dogs', 'Chihuahuas'],
			content: {description:'El chihuahua, también conocido como chihuahueño, es una raza de perro originaria de México, una de las razas de perros más antiguas del continente americano, además de ser el perro más pequeño del mundo.'}
		})
		create_note({ ...testNote, path: '/Mexico/Dogs/Small/MiniToy', title: 'Another test', tags: ['Mexico', 'test', 'dogs', 'mini'],
			content: {'¿que son?':'Una raza de perro mini toy es una categoría de perros que son muy pequeños en tamaño, tanto en términos de altura como de peso. El término «toy» alude a que, por sus reducidas dimensiones, estos perros se asemejan a un juguete. Esta etiqueta, junto con los términos “mini” o “miniatura”, se utiliza para describir razas específicas que han sido criadas para mantener una estatura reducida o variantes minúsculas de razas estándar.'}
		})
		
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