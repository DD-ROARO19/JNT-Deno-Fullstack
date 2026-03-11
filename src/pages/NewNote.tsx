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
import { ObjectType } from "../components/InputTypes.tsx";
import { toast } from "../components/notifications.tsx";
import { useParams } from "@solidjs/router";
import Title from "../components/Title.tsx";

export default function NewNote() {
    setSetter(_ => setNewNote)
    const params = useParams();

    setNewNote('metadata', 'path', `/${params.path}`)
    const rootPath = ['content']

    // const addConfig: lineMenu = {
    //     primary_inputs: {
    //         open: true,
    //         title: 'Select type',
    //         buttons: [
    //             { text: 'String', action: () => addInput(rootPath, 'string') },
    //             { text: 'Number', action: () => addInput(rootPath, 'number') },
    //             { text: 'Boolean', action: () => addInput(rootPath, 'boolean') },
    //             { text: 'Array', action: () => addInput(rootPath, 'array') },
    //             { text: 'Object', action: () => addInput(rootPath, 'object') },
    //         ]
    //     }
    // }

    const Toast = () => toast().Content();

    return (
        <>
            <OptionsMenu />
            <Toast  />
            <div class="m-4 dark:bg-cyan-800 w-3/4 max-w-215 rounded-2xl p-2 flex flex-col 
            hover:text-white place-self-center">
                {/* Title */}
                <Title titleSetter={setNewNote} 
                    onSave={() => SaveNote(newNote)} 
                    onCopy={() => copyToClipboard(newNote.content, 'object', [])} 
                    onErase={() => console.log('Not implemented yet, here: ', newNote)} 
                />

                {/* Content */}
                <div class="NoteContent bg-stone-800/75 rounded-lg py-3 text-stone-300 pl-8">
                    <ObjectType data={newNote.content} path={["content"]} no_config full_addButton />
                </div>

            </div>
        </>
    )
}