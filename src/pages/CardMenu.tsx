// @ts-types="solid-js"
import {
    createResource,
    // createSignal
} from "solid-js";
import { useParams } from "@solidjs/router";

import type { Note } from "../../types.ts";

import { CardList } from "../components/cards.tsx";
import SearchBar from "../components/SearchBar.tsx";


const fetchNotesByPath = async (path: string) => {
    // console.log(path);
    const res = await fetch('/api/notes/from/' + path, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await res.json() as { list: Note[] };
    return data.list
};


export default function CardMenu() {
    const params = useParams();
    const [list] = createResource(() => params.path, fetchNotesByPath);
    // const [path] = createSignal<string>(params.path)

    return (
        <>
            <SearchBar />
            {/* {list.loading && <div>Loading...</div>} */}
            {list.error && <div>Error while loading notes.</div>}

            <CardList list={list() || []} />
        </>
    );
}