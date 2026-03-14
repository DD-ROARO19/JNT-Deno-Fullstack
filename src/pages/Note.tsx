// @ts-types="solid-js"
import {
    createResource,
    Switch,
    Match
} from "solid-js";
import { useParams } from "@solidjs/router";
import { createStore } from "solid-js/store";

import type { Note } from "../../types.ts";
import type { noteFrame } from "../types.tsx";

import { setSetter } from "../stores.tsx";
import { copyToClipboard, DeleteNote, json2Note, SaveNote, UpdateNote } from "../helpers.tsx";
import { ObjectType } from "../components/InputTypes.tsx";
import Title from "../components/Title.tsx";
import { OptionsMenu } from "../components/Select.tsx";
import { toast } from "../components/notifications.tsx";

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

    const [res, { refetch }] = createResource(() => param.id, getNote)

    return (
        <Switch>
            <Match when={res.loading}>
                <></>
            </Match>
            <Match when={res()}>
                <OptionsMenu />
                <Toast />
                <div class="m-4 dark:bg-cyan-800 w-3/4 max-w-215 rounded-2xl p-2 flex flex-col 
                                hover:text-white place-self-center">
                    {/* Title */}
                    <Title titleSetter={setNote}
                        onSave={() => UpdateNote(note)}
                        onCopy={() => copyToClipboard(note.content, 'object', [])}
                        onErase={() => DeleteNote(note.metadata.id)}
                    />

                    {/* Content */}
                    <div class="NoteContent bg-stone-800/75 rounded-lg py-3 text-stone-300 pl-8">
                        <ObjectType data={note.content} path={["content"]} no_config full_addButton />
                    </div>

                </div>
            </Match>
        </Switch>
    )
}