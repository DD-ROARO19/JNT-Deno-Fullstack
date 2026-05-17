// @ts-types="solid-js"
import {
    createResource,
    createSignal,
} from "solid-js";
import { CardList } from "../components/cards.tsx";
import SearchBar from "../components/SearchBar.tsx";

import type { Note } from '../../types.ts';
import type { otherFetchParams } from "../types.tsx";


const fetchAllNotes = async (query: otherFetchParams): Promise<Note[]> => {
    let url: `/api/notes/query?directory_id=1&${string}` = '/api/notes/query?directory_id=1&';

    for (const key in query) {
        url += (`${key}=${query[key as keyof otherFetchParams]}&`);
    }

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        console.error(await res.json())
        return [];
    }

    const data = res.json();
    // console.log('data: ', data);
    return data;
}

export default function StartPage() {
    const [searchParams, setSearchParams] = createSignal<otherFetchParams>({})
    
    const [list] = createResource(() => searchParams(), fetchAllNotes);

    return (
        <div class="w-3/4 place-self-center">
            <SearchBar setter={setSearchParams} value={searchParams()?.search} />
            <CardList list={list() || []} param_setter={setSearchParams} />
        </div>
    );
}