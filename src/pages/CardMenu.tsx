// @ts-types="solid-js"
import {
    createResource,
    createSignal
} from "solid-js";
import { useParams } from "@solidjs/router";

import type { Note } from "../../types.ts";
import type { fetchParams, otherFetchParams } from "../types.tsx";

import { CardList } from "../components/cards.tsx";
import SearchBar from "../components/SearchBar.tsx";

const fetchNotesByPath = async (query: fetchParams): Promise<Note[]> => {
    // console.log('Notes List ->', 'Loading');
    // console.log('path:', path);

    let url: `/api/notes/query?${string}` = '/api/notes/query?';

    for(const key in query){
        url += (`${key}=${query[key as keyof fetchParams]}&`);
    }

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = res.json();
    return data;
};


export default function CardMenu() {
    // Query params for the search of notes.
    const params = useParams();
    const [searchParams, setSearchParams] = createSignal<otherFetchParams>({})
    
    const [list] = createResource(() => ({ path: params.path, ...searchParams }), fetchNotesByPath);

    return (
        <>
            <SearchBar setter={setSearchParams} />
            {/* {list.loading && <div>Loading...</div>} */}
            {list.error && <div>Error while loading notes.</div>}

            <CardList list={list() || []} />
        </>
    );
}