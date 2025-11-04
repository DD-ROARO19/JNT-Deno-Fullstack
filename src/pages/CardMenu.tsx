// @ts-types="solid-js"
import {
    createMemo,
    createResource,
    createSignal,
    onMount as _onMount
} from "solid-js";
import { useLocation } from "@solidjs/router";

import type { Note } from "../../types.ts";

import { CardList } from "../components/cards.tsx";
import SearchBar from "../components/SearchBar.tsx";


const fetchNotesByPath = async (path: string) => {
        const res = await fetch('/api/notes/from' + path, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await res.json() as { list: Note[] };
        return data.list
    };


export default function CardMenu() {
    // const [list, setList] = createSignal<Note[]>([])

    const location = useLocation();
    // const location = globalThis.location;
    // console.log('location', location);

    function parseCategory(path: string) {
        return path.slice(9)
    }

    const catPath = createMemo(() => parseCategory(location.pathname))
    // const catPath = parseCategory(useLocation().pathname)
    // console.log('path', catPath());


    const [list] = createResource(() => catPath(), fetchNotesByPath);


    return (
        <>
            <SearchBar />
            {/* {list.loading && <div>Loading...</div>} */}
            {list.error && <div>Error while loading notes.</div>}
            
            <CardList list={list() || []} />
        </>
    );
}