import {
    createSignal,
    onMount,
    onCleanup,
    Show } from 'solid-js'

import { newNote, setNewNote, setSetter } from "../stores.tsx";
import { useParams } from "@solidjs/router";

import { addInput, copyToClipboard, SaveNote } from "../helpers.tsx";
import { lateralSetter, setObjectsClosed } from "../signals.tsx";

import Header from "../components/Header.tsx";
import { ObjectType as SecondObj } from "../components/StaticTypes.tsx";
import { ObjectType } from "../components/InputTypes.tsx";
import { toast } from "../components/notifications.tsx";
import { QuickMenu } from "../components/QuickMenu.tsx";
import { SearchPanel } from "../components/LateralPanels.tsx";


export default function NewNote() {
    setSetter(_ => setNewNote)
    const params = useParams();

    setNewNote('metadata', 'path', `/${params.path}`)
    const rootPath = ['content']

    const Toast = () => toast().Content();

    const [advCard, advCardSet] = createSignal(false)
    lateralSetter(_ => advCardSet);

    setObjectsClosed(true);

    return (
        <>
            <QuickMenu />
            <Toast />
            <div class="flex h-max">
                <aside class="w-1/20 flex-none" />
                <span class="flex-1 shrink-10 transition-discrete delay-75 duration-100 ease-in"
                    classList={{ "grow-0": advCard() }} />
                <div class="m-4 bg-app-element rounded-2xl p-2 flex flex-col 
                flex-3 shrink-0 h-max" >
                    {/* Title */}
                    <Header storeSetter={setNewNote} store_data={newNote}
                    onSave={() => SaveNote(newNote)}
                    onCopy={() => copyToClipboard(newNote.content, 'object', [])}
                    onErase={() => {setNewNote("metadata", "title", ""); setNewNote("content", [])}} 
                    />

                    {/* Content */}
                    <div class="NoteContent bg-app-surface-secondary rounded-lg py-3 pl-8">
                        <SecondObj data={newNote.content} path={["content"]} no_config full_addButton />
                    </div>

                </div>
                <div class="flex-1 transition-discrete delay-75 duration-100 ease-in
                sticky top-0 h-fit max-h-[calc(100vh)] overflow-y-auto scrollbar-thin pb-4"
                classList={{ "grow-2": advCard() }}
                ><Show when={advCard()}> <SearchPanel /> </Show></div>
                <aside class="w-1/20 flex-none" />
            </div>
        </>
        // <>
        //     <OptionsMenu />
        //     <Toast  />
        //     <div class="m-4 bg-app-element w-3/4 max-w-215 rounded-2xl p-2 flex flex-col 
        //         place-self-center">
        //         {/* Title */}
        //         <Header storeSetter={setNewNote} metadata={newNote.metadata}
        //             onSave={() => SaveNote(newNote)} 
        //             onCopy={() => copyToClipboard(newNote.content, 'object', [])} 
        //             onErase={() => {setNewNote("metadata", "title", ""); setNewNote("content", [])}} 
        //         />

        //         {/* Content */}
        //         <div class="NoteContent bg-app-surface-secondary rounded-lg py-3 pl-8">
        //             <SecondObj data={newNote.content} path={["content"]} no_config full_addButton />
        //         </div>

        //     </div>
        // </>
    )
}