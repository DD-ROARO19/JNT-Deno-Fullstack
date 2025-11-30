import { createStore } from "solid-js/store";
import type { JSONValue, JSONObject, LineContent } from "./types.tsx";

type newNote = {
    metadata: {
        author: string;
        path: string;
        tags: string[] | undefined;
    };
    content: LineContent[];
}
export const [newNote, setNewNote] = createStore<newNote>({
    metadata: {
        author: "User",
        path: "/",
        tags: undefined
    },
    content: [
        { type:"string", key: 'Text', value: 'Sample' },
        { type:"string", key: '', value: 'Vacio!' },
        { type:"number", key: 'Number', value: 21 },
        { type:"array", key: 'array?', value: ['bruh', 67, ['xd', 'hello!']] },
    ]
})