// @ts-types="solid-js"
import {
    createSignal,
    createResource,
    Switch,
    Match,
    Show,
} from "solid-js";
import { useParams } from "@solidjs/router";
import { createStore } from "solid-js/store";

// import type { Note } from "../../types.ts";
import type { noteFrame } from "../types.tsx";

import { reset_searchParams, setSetter } from "../stores.tsx";
import { lateralSetter, setObjectsClosed } from "../signals.tsx";
import { DeleteNote, extractValue, json2Note, UpdateNote } from "../helpers.tsx";

// import { NewLine2 } from "../components/RowLines.tsx";
import Header from "../components/Header.tsx";
import { ObjectType } from "../components/StaticTypes.tsx";
import { toast } from "../components/notifications.tsx";
import { SearchPanel } from "../components/LateralPanels.tsx";
import { QuickMenu, setContentRef } from "../components/QuickMenu.tsx";
import { Loading } from "../assets/svgs.tsx";

async function getNote(id: string): Promise<true> {
    console.log('ID: ', id);

    const res = await fetch('/api/notes/' + id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        throw new Error(await res.json())
    }

    const note = await res.json()
    console.log('getNote func: ', note);

    try {
        json2Note(note);
    } catch (err) {
        if (err instanceof Error) console.error(err);
    }

    return true;
}

export default function Note() {
    const Toast = () => toast().Content();

    const param = useParams();
    // console.log('ID: ', param.id);

    const [note, setNote] = createStore<noteFrame>({
        content: [],
        metadata: { author: '', path: '', tags: [], title: '' }
    })
    setSetter(_ => setNote)
    reset_searchParams();

    const [res] = createResource(() => param.id, getNote)

    const [advCard, advCardSet] = createSignal(false)
    lateralSetter(_ => advCardSet);

    setObjectsClosed(true);

    return (
        <Switch>
            <Match when={res.loading}>
                <div class="w-full flex justify-center"> <Loading class="h-16 w-16 mt-4" option={4} /> </div>
            </Match>
            <Match when={res()}>
                <QuickMenu />
                <Toast />
                <div class="flex h-max">
                    <aside class="w-1/20 flex-none" />
                    <span class="flex-1 shrink-10 transition-discrete delay-75 duration-100 ease-in"
                        classList={{ "grow-0": advCard() }} />
                    <div class="m-4 bg-app-element rounded-2xl p-2 flex flex-col 
                    flex-3 shrink-0 h-max" >
                        {/* Title */}
                        <Header storeSetter={setNote} store_data={note}
                        onSave={() => UpdateNote(note)}
                        // onCopy={() => copyToClipboard(note.content, 'object', [])}
                        // onErase={() => DeleteNote(note.metadata.id)}
                        onErase={() => console.log(extractValue(note.content, 'object', ['content']))}
                        fixed_title
                        />

                        {/* Content */}
                        <div ref={setContentRef} id='NoteContent' class="bg-app-surface-secondary rounded-lg py-3 pl-8">
                            <ObjectType data={note.content} path={["content"]} no_config full_addButton />
                        </div>

                    </div>
                    <div class="flex-1 transition-discrete delay-75 duration-100 ease-in
                    sticky top-0 h-fit max-h-[calc(100vh)] overflow-y-auto pb-4"
                    classList={{ "grow-2": advCard() }}
                    ><Show when={advCard()}> <SearchPanel /> </Show></div>
                    <aside class="w-1/20 flex-none" />
                </div>
            </Match>
        </Switch>
    )
}