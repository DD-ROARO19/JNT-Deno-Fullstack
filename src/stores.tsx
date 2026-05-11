// @ts-types="solid-js"
import { createSignal } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import type { LineContent, lineMenuParams, noteFrame, searchParamsType } from "./types.tsx";
import type { SetStoreFunction } from "solid-js/store";
import { changeInput, copyToClipboard, eraseInput, addInput } from "./helpers.tsx";


export const [newNote, setNewNote] = createStore<noteFrame>({
    metadata: {
        title: '',
        author: "User",
        path: "/",
        tags: []
    },
    content: [
        // ##  Example  ##
        // { type:"string", key: 'Text', value: 'Sample' },
        // { type:"string", key: '', value: 'Vacio!' },
        // { type:"number", key: 'Number', value: 21 },
        // { type:"array", key: 'array?', value: [
        //     { type:"string", key: 0, value: 'Bruh' },
        //     { type:"number", key: 1, value: 67 },
        //     { type:"array", key: 2, value: [{ type:"string", key: 0, value: 'xD' }] },
        // ] },
        // { type:"object", key: 'object?', value: [
        //     { type:"boolean", key: 'mode_switch', value: false },
        //     { type:"boolean", key: 'has_check', value: true },
        //     { type:"boolean", key: 'has_radio', value: true },
        // ] },
    ]
})

// Signals for Helper functions control
export const [currentSetter, setSetter] = createSignal<SetStoreFunction<noteFrame>>(setNewNote)

// ##  Search Panel Store
export const [searchParams, upd_searchParams] = createStore<searchParamsType>()
export function reset_searchParams() { upd_searchParams(reconcile({})) };

// ##  Settings Menus  ##
