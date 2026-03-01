import { unwrap } from "solid-js/store";
import { newNote, setNewNote } from "./stores.tsx";
import type {
    JSONValue, typeOfInputs, LineContent, JSONPrimitive,
    JSONArray
} from "./types.tsx";
import { toast } from "./components/notifications.tsx";


// # Update store values #
//
export function updateStore(path: (string | number)[], change: JSONPrimitive) {
    // @ts-ignore: Don't know how else I could "unpack" the 'path' array
    setNewNote(...path, change);
}
export function addInput(path: (string | number)[], input_type: typeOfInputs) {
    console.debug('add to path', path);

    // @ts-ignore: May I get some path, pls?
    setNewNote(...path, list => {
        console.debug('Old list: ', list);
        const newList: LineContent[] = [...list, { type: input_type, key: '', value: '' }];
        console.debug('New list: ', newList);
        return newList;
    })
}
export function eraseInput(path: (string | number)[]) {
    console.debug('erase in path', path);
    const listPath = path.slice(0, -2), index = path.at(-2)

    // @ts-ignore: 'Need to unbox that path brotha'
    setNewNote(...listPath, list => list.filter((_, i) => i != index))
}
export function changeInput(path: (string | number)[], new_type: typeOfInputs) {
    console.debug('change type in path', path, '\nto: ', new_type);

    // @ts-ignore: Path!?1!
    setNewNote(...path.slice(0, -1), 'type', new_type)
}
//


// Extract values from the store
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

/** Returns value with the correct format dependant of the content  */
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
            }, {} as Record<string | number, JSONValue>);
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

/** Returns the current stored note as a common json object. */
export function extractNewNote() {
    const { metadata, content } = unwrap(newNote);

    if (metadata.title.trim() === '') throw new NoteValError('Note title is empty!')    // Validation of metadata for errors!!

    return {
        ...metadata,
        content: extractValue(content, 'object', [])
    }
}
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
    } catch (err) {
        if (err instanceof ObjectCheckError) return null;
        throw err
    }
}
//


// API interactions
//
export async function SaveNote() {
    try {
        const value = extractNewNote();

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

        toast().newNotification((await res.json() as { msg: string }).msg)
    } catch (err) {
        if (err instanceof ObjectCheckError) return null;
        if (err instanceof NoteValError) return null;
        throw err
    }
}
//