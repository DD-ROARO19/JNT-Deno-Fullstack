// @ts-types="solid-js"
import { onMount, createSignal } from "solid-js";
import { CardList } from "../components/cards.tsx";
// import SearchBar from "../components/SearchBar.tsx";

import type { Note } from '../../types.ts';

export default function StartPage() {
    const [list, setList] = createSignal<Note[]>([])

    onMount(async () => {
        const res = await fetch('/api/notes', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await res.json() as { list: Note[] };
        setList(data.list);
    });

    return (
        <>
            {/* <SearchBar /> */}
            <CardList list={list()} />
        </>
    );
}