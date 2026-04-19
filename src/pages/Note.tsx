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
import { copyToClipboard, DeleteNote, extractNote, extractValue, json2Note, SaveNote, UpdateNote } from "../helpers.tsx";
import { ObjectType } from "../components/StaticTypes.tsx";
import Header from "../components/Header.tsx";
import { OptionsMenu } from "../components/Select.tsx";
import { toast } from "../components/notifications.tsx";
import { MenuPopovers } from "../components/LineSettingsBtn.tsx";

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
                <MenuPopovers />
                <OptionsMenu/>
                <Toast />
                <div class="m-4 bg-app-element w-3/4 max-w-215 rounded-2xl p-2 flex flex-col 
                    place-self-center">
                    {/* Title */}
                    <Header titleSetter={setNote} value={note.metadata.title}
                        onSave={() => UpdateNote(note)}
                        onCopy={() => copyToClipboard(note.content, 'object', [])}
                        // onErase={() => DeleteNote(note.metadata.id)}
                        onErase={() => console.log(extractValue(note.content, 'object', ['content']))}
                    />

                    {/* Content */}
                    <div class="NoteContent bg-app-surface-secondary rounded-lg py-3 pl-8">
                        <ObjectType data={note.content} path={["content"]} no_config full_addButton />
                    </div>

                </div>
            </Match>
        </Switch>
    )
}