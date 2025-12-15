import { createStore } from "solid-js/store";
import type { LineContent } from "./types.tsx";

type newNote = {
    metadata: {
        title: string;
        author: string;
        path: string;
        tags: string[] | undefined;
    };
    content: LineContent[];
}
export const [newNote, setNewNote] = createStore<newNote>({
    metadata: {
        title: '',
        author: "User",
        path: "/",
        tags: undefined
    },
    content: [
        { type:"string", key: 'Text', value: 'Sample' },
        { type:"string", key: '', value: 'Vacio!' },
        { type:"number", key: 'Number', value: 21 },
        { type:"array", key: 'array?', value: [
            { type:"string", key: 0, value: 'Bruh' },
            { type:"number", key: 1, value: 67 },
            { type:"array", key: 2, value: [{ type:"string", key: 0, value: 'xD' }] },
        ] },
        { type:"object", key: 'object?', value: [
            { type:"boolean", key: 'mode_switch', value: false },
            { type:"boolean", key: 'has_check', value: true },
            { type:"boolean", key: 'has_radio', value: true },
        ] },
    ]
})