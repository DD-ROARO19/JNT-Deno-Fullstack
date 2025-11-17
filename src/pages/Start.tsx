// @ts-types="solid-js"
import { 
    // onMount, createSignal, 
    createResource 
} from "solid-js";
import { CardList } from "../components/cards.tsx";
import SearchBar from "../components/SearchBar.tsx";

import type { Note } from '../../types.ts';


const fetchAllNotes = async () => {
    const res = await fetch('/api/notes', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await res.json() as { list: Note[] };
    return data.list;
}

export default function StartPage() {
    const [list] = createResource(() => fetchAllNotes());
    
    /*const [list, setList] = createSignal<Note[]>([])

    onMount(async () => {
        setList(fetchAllNotes());
    }); /**/

    return (
        <>
            <SearchBar />
            <CardList list={list() || []} />
        </>
    );
}