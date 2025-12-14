import { setNewNote } from "./stores.tsx";
import type { JSONValue, typeOfInputs, LineContent } from "./types.tsx";

export function updateStore(path: (string | number)[], change: JSONValue) {
    // @ts-ignore: Don't know how else I could "unpack" the 'path' array
    setNewNote(...path, change);
}

export function addInput(path: (string | number)[], input_type: typeOfInputs) {
    console.debug('add to path', path);
    
    // @ts-ignore: May I get some path, pls?
    setNewNote(...path, list => { 
        console.log('Old list: ', list); 
        const newList: LineContent[] = [...list, { type: input_type, key: '', value: '' }]; 
        console.log('New list: ', newList); 
        return newList;
    })
}
export function eraseInput(path: (string | number)[], index: number) {
    console.log('erase in path', [...path, index]);
    
    // @ts-ignore: 'Need to unbox that path brotha'
    setNewNote(...path, list => list.filter((_, i) => i != index))
}
export function changeInput(path: (string | number)[], new_type: typeOfInputs) {
    console.debug('change type in path', path, '\nto: ',new_type);
    
    // @ts-ignore: Path!?1!
    setNewNote(...path, 'type', new_type)
}