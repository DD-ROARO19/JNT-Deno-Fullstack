import { produce, unwrap } from "solid-js/store";
import type { SetStoreFunction } from "solid-js/store";
import { currentSetter, newNote, setNewNote } from "./stores.tsx";
import type {
    JSONValue, typeOfInputs, LineContent, JSONPrimitive,
    JSONArray,
    JSONObject,
    noteFrame
} from "./types.tsx";
import { toast } from "./components/notifications.tsx";
import type { Note } from "../types.ts"


// # Update store values # //
//
export function updateStore(path: (string | number)[], change: JSONPrimitive) {
    const setter = currentSetter()

    console.group('updateStore')
    console.debug('# UPDATE', { path, change });
    console.groupEnd()

    // @ts-ignore: Don't know how else I could "unpack" the 'path' array
    setter(...path, change);
}
export function addInput(path: (string | number)[], input_type: typeOfInputs) {
    const setter = currentSetter()

    // console.groupCollapsed('Action Functions') // For later testing (ERASE)
    console.group('addInput')
    console.debug('add to path:', path);
    console.debug('type: ', input_type);
    console.groupEnd()

    // @ts-ignore: May I get some path, pls?
    setter(...path, list => [...list, {
        type: input_type, key: '',
        value: (input_type == 'array' || input_type === 'object') ? [] : ''
    }])
}
export function eraseInput(path: (string | number)[]) {
    const setter = currentSetter()

    console.debug('erase in path', path);
    const listPath = path.slice(0, -2), index = path.at(-2)

    // @ts-ignore: 'Need to unbox that path brotha'
    setter(...listPath, list => list.filter((_, i) => i != index))
}
export function changeInput(path: (string | number)[], new_type: typeOfInputs) {
    const setter = currentSetter()

    console.debug('change type in path', path, '\nto: ', new_type);

    // @ts-ignore: Path!?1!
    setter(...path.slice(0, -1), 'type', new_type)
}
//


// # Extract values from the store # //
//

export class ObjectCheckError extends Error {
    constructor(
        public path: (string | number)[],
        public code: 'EMPTY_KEY' | 'DUPLICATE_KEY',
        message: string
    ) {
        super(message);
        this.name = "ObjectCheckError";
        console.error(this, { ...this });
        toast().newNotification(this.message)
    }
}

/** Extracts the given `LineContent` value & returns it in the correct JSON format. 
 * @param data Value stored to be copied.
 * @param type Specify type of the value.
 * @param path Path taken to get to the value.
*/
export function extractValue(data: JSONPrimitive | LineContent[], type: typeOfInputs, path: (string | number)[]): JSONValue {
    switch (type) {
        case 'array':
            return (data as LineContent[]).map((item, index) => extractValue(item.value, item.type, [...path, index]))

        case 'object': {
            const seenKeys = new Set<string | number>();

            return (data as LineContent[]).reduce((acc, item, index) => {

                if (item.key === "" || item.key === null || item.key === undefined) {
                    const newPath = [...path, `item #${++index}`];
                    throw new ObjectCheckError(newPath, 'EMPTY_KEY', `Empty key found in: ${newPath.join('> ')}`);
                }
                if (seenKeys.has(item.key)) {
                    const newPath = [...path, `item #${++index}`];
                    throw new ObjectCheckError(newPath, 'DUPLICATE_KEY', `Duplicate key found in: ${newPath.join('> ')}`);
                }
                seenKeys.add(item.key);

                acc[item.key] = extractValue(item.value, item.type, [...path, item.key]);
                return acc;
            }, {} as Record<string, JSONValue>);
        }

        default:
            return data as JSONValue
    }
}

class NoteValError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'NoteValError';
        console.error(this);
        toast().newNotification(this.message)
    }
}

/** Returns the current stored note in JSON format. */
export function extractNote(note: noteFrame) {
    const { metadata, content } = unwrap(note);

    if (metadata.title.trim() === '') throw new NoteValError('Note title is empty!')    // Validation of metadata for errors!!

    return {
        ...metadata,
        content: extractValue(content, 'object', [])
    }
}
/** Copies the current note on store to clipboard.
 * @param data Value stored to be copied.
 * @param type Specify type of the value.
 * @param path Path taken to get to the value.
 */
export function copyToClipboard(data: JSONPrimitive | LineContent[], type: typeOfInputs, path: (string | number)[]) {
    try {
        const dataValue = extractValue(data, type, path);
        switch (type) {
            case 'object':
                navigator.clipboard.writeText(JSON.stringify(dataValue, undefined, 2))
                break;
            case 'array': {
                // const arr = (dataValue as JSONArray)
                navigator.clipboard.writeText(
                    (dataValue as JSONArray).map(item => {
                        if (Array.isArray(item)) return `[${item.join(',')}]`;
                        else if (typeof item === 'object') return JSON.stringify(item);
                        else return item;
                    }).join('\t')
                )
            } break;

            default:
                navigator.clipboard.writeText(dataValue as string)
                break;
        }
        toast().newNotification('Copied to clipboard.');
    } catch (err) {
        if (err instanceof ObjectCheckError) return;
        throw err
    }
}


// #  Data Form Manipulation  #
//
/** Get the approximate `typeOfInputs` type of a value. 
 * @param v Value to compare type.
*/
function askMyType(v: unknown): typeOfInputs {
    const myType = typeof v;

    console.groupCollapsed('askMyType')
    console.log('v:', v);
    console.log('type:', myType);
    console.groupEnd()

    switch (myType) {
        case 'bigint': return 'number';
        case 'function': return 'string';
        case 'symbol': return 'string';
        case 'undefined': return 'null';
        case 'object':
            if (Array.isArray(v)) return 'array';
            return 'object';

        default: return myType;
    }
}


export function formatValue(
    val: JSONValue,
    key?: string | number
): LineContent {
    //  ## When is Array
    if (Array.isArray(val)) {
        if (val.length < 1) {
            return {
                type: "array",
                key: key!,
                value: []
            }
        }
        return {
            type: "array",
            key: key!,
            value: val.map((v, i) => formatValue(v, i.toString()))
        }
    }

    //  ## When Object
    else if (typeof val == "object") {
        // if (!key) {
        //     return Object.entries(val).map(([k, v]) => formatValue(v, k))
        // }

        if (val == null) {
            return {
                type: 'object',
                key: key!,
                value: []
            }
        }
        return {
            type: 'object',
            key: key!,
            value: Object.entries(val).map(([k, v]) => formatValue(v, k))
        }
    }

    //  ## Anything else ( String || Number || Boolean )
    else return {
        type: askMyType(val),
        key: key!,
        value: val
    }
}

type frameAllowed = (keyof noteFrame)[];
/** Is this object a frame for one JNT Note? @returns true or false */
function isJNTnoteFrame(o: unknown): o is noteFrame {
    if (typeof o !== 'object' || o === null) return false;

    const onlyAllowed: frameAllowed = ['metadata', 'content'];
    if (Object.keys(o).length !== onlyAllowed.length) return false;

    for (const k of onlyAllowed) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) return false;
    }

    return true;
}
type noteAllowed = (keyof Note)[];
/** Is this object a frame for one JNT Note? @returns true or false */
function isJNTnote(o: unknown): o is Note {
    if (typeof o !== 'object' || o === null) return false;

    const onlyAllowed: noteAllowed = [
        'author', 'content', 'created_at',
        'directory_id', 'id', 'last_updated',
        'tags', 'title'];
    if (Object.keys(o).length !== onlyAllowed.length) return false;

    for (const k of onlyAllowed) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) return false;
    }

    return true;
}

/** Sets a given object on the `newNote` Store to display it. 
 * @param jv Parsed JSON object.
*/
export function json2Note(jv: JSONObject): void {
    const setter = currentSetter()

    if (isJNTnoteFrame(jv)) {
        setter(jv)
        return;
    }

    if (isJNTnote(jv)) {
        setter('metadata', {
            id: jv.id,
            directory_id: jv.directory_id,
            title: jv.title,
            author: jv.author,
            tags: JSON.parse(jv.tags),
            created_at: jv.created_at,
            last_updated: jv.last_updated
        });
        setter('content', formatValue(JSON.parse(jv.content)).value as LineContent[]);
        return;
    }

    setter('content', formatValue(jv).value as LineContent[])
}
//


// # API interactions # //
//
export async function SaveNote(note: noteFrame) {
    try {
        const value = extractNote(note);

        const res = await fetch('/api/notes/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(value)
        })

        if (!res.ok) {
            console.error(`${res.status}: ${res.statusText}`, res) // Create error handle for endpoints?
        }

        const data = await res.json() as { msg: string, id: string }

        toast().newNotification(data.msg)
    } catch (err) {
        if (err instanceof ObjectCheckError) return;
        if (err instanceof NoteValError) return;
        throw err
    }
}
export async function UpdateNote(note: noteFrame) {
    try {
        const value = extractNote(note);

        const res = await fetch('/api/notes/', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(value)
        })

        if (!res.ok) {
            console.error(`${res.status}: ${res.statusText}`, res) // Create error handle for endpoints?
        }

        const data = await res.json() as { msg: string }

        toast().newNotification(data.msg)
    } catch (err) {
        if (err instanceof ObjectCheckError) return;
        if (err instanceof NoteValError) return;
        throw err
    }
}
export async function DeleteNote(id: number | undefined) {
    if (!id) {
        throw new NoteValError('No id provided')
    }

    try {
        const res = await fetch('/api/notes/' + id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (!res.ok) {
            console.error(`${res.status}: ${res.statusText}`, res) // Create error handle for endpoints?
        }

        toast().newNotification((await res.json()).msg as string)
        globalThis.history.back()
    } catch (err) {
        if (err instanceof ObjectCheckError) return;
        if (err instanceof NoteValError) return;
        throw err
    }
}
//