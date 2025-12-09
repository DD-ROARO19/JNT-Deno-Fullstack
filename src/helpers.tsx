import { setNewNote } from "./stores.tsx";
import type { JSONValue, typeOfInputs } from "./types.tsx";

export function updateStore(path: (string | number)[], change: JSONValue) {
    // @ts-ignore: Don't know how else I could "unpack" the 'path' array
    setNewNote(...path, change);
}

export function addInput(path: (string | number)[], input_type: typeOfInputs) {
    console.debug('add to path', path);
    
    // @ts-ignore: May I get some path, pls?
    setNewNote(...path, list => [...list, { type: input_type, key: '', value: '' }])
}
export function EraseInput(path: (string | number)[], index: number) {
    // @ts-ignore: 'Need to unbox that path brotha'
    setNewNote(...path, list => list.filter((_, i) => i != index))
}
export function changeInput(path: (string | number)[], new_type: typeOfInputs) {
    // @ts-ignore: Path!?1!
    setNewNote(...path, 'key', new_type)
}