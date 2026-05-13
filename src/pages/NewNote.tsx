// import type { Note } from '../../types.ts';
import {
    createSignal,
    onMount,
    onCleanup
} from 'solid-js'

import { newNote, setNewNote, setSetter } from "../stores.tsx";
// import { CopySVG, Edit2, Erase } from '../assets/svgs.tsx'

import { addInput, copyToClipboard, SaveNote } from "../helpers.tsx";




import { OptionsMenu } from "../components/Select.tsx";
import type { lineMenu } from "../types.tsx";
import { ObjectType as SecondObj } from "../components/StaticTypes.tsx";
import { ObjectType } from "../components/InputTypes.tsx";
import { toast } from "../components/notifications.tsx";
import { useParams } from "@solidjs/router";
import Header from "../components/Header.tsx";

export default function NewNote() {
    setSetter(_ => setNewNote)
    const params = useParams();

    setNewNote('metadata', 'path', `/${params.path}`)
    const rootPath = ['content']

    const Toast = () => toast().Content();

    return (
        <>
            <OptionsMenu />
            <Toast  />
            <div class="m-4 bg-app-element w-3/4 max-w-215 rounded-2xl p-2 flex flex-col 
                place-self-center">
                {/* Title */}
                <Header storeSetter={setNewNote} metadata={newNote.metadata.title}
                    onSave={() => SaveNote(newNote)} 
                    onCopy={() => copyToClipboard(newNote.content, 'object', [])} 
                    onErase={() => {setNewNote("metadata", "title", ""); setNewNote("content", [])}} 
                />

                {/* Content */}
                <div class="NoteContent bg-app-surface-secondary rounded-lg py-3 pl-8">
                    <SecondObj data={newNote.content} path={["content"]} no_config full_addButton />
                </div>

            </div>
        </>
    )
}