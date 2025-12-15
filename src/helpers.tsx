import { unwrap } from "solid-js/store";
import { newNote, setNewNote } from "./stores.tsx";
import type { 
    JSONValue, typeOfInputs, LineContent, JSONPrimitive
} from "./types.tsx";

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
    console.debug('change type in path', path, '\nto: ',new_type);
    
    // @ts-ignore: Path!?1!
    setNewNote(...path.slice(0, -1), 'type', new_type)
}

export function extractValue(data: JSONPrimitive | LineContent[], type: typeOfInputs): JSONValue {
    switch (type) {
        case 'array':
            return (data as LineContent[]).map(item => extractValue(item.value, item.type))
            
        case 'object':
            return (data as LineContent[]).reduce((acc, item) => {
                acc[item.key] = extractValue(item.value, item.type);
                return acc;
            }, {} as Record<string | number, JSONValue>)
    
        default:
        return data
    }
}

export function extractNewNote() {
    const rawData = unwrap(newNote);

    return {
        metadata: rawData.metadata,
        content: extractValue(rawData.content, 'object')
    }
}