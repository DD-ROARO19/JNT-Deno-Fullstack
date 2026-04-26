// @ts-types="solid-js"
import { createSignal } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import type { LineContent, lineMenuParams, noteFrame, searchParamsType } from "./types.tsx";
import type { SetStoreFunction } from "solid-js/store";
import { popoverMenu } from "./components/popover.tsx";
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

export const [menuStore, updateMenuStore] = createStore({
    primitives: popoverMenu(
        (path, data, type) => ({
            primary_inputs: {
                title: 'Change type',
                buttons: [
                    { text: 'String', action: () => changeInput(path, 'string') },
                    { text: 'Number', action: () => changeInput(path, 'number') },
                    { text: 'Boolean', action: () => changeInput(path, 'boolean') },
                    { text: 'Array', action: () => changeInput(path, 'array') },
                    { text: 'Object', action: () => changeInput(path, 'object') }
                ]
            },
            extra_options: [
                { text: 'Erase item', action: () => eraseInput(path) },
                { text: 'Copy value', action: () => copyToClipboard(data, type, path) },
            ]
        })
    ),
    objects: popoverMenu(
        (path, data, type) => ({
            primary_inputs: {
                title: 'Add input',
                buttons: [
                    { text: 'String', action: () => addInput(path, 'string') },
                    { text: 'Number', action: () => addInput(path, 'number') },
                    { text: 'Boolean', action: () => addInput(path, 'boolean') },
                    { text: 'Array', action: () => addInput(path, 'array') },
                    { text: 'Object', action: () => addInput(path, 'object') },
                ]
            },
            extra_options: [
                { text: 'Erase item', action: () => eraseInput(path) },
                { text: 'Copy value', action: () => copyToClipboard(data, type, path) },
                {
                    text: 'Change type',
                    action: () => { },
                    subButtons: [
                        { text: 'String', action: () => changeInput(path, 'string') },
                        { text: 'Number', action: () => changeInput(path, 'number') },
                        { text: 'Boolean', action: () => changeInput(path, 'boolean') },
                        { text: 'Array', action: () => changeInput(path, 'array') },
                        { text: 'Object', action: () => changeInput(path, 'object') }
                    ]
                }
            ]
        })
    ),
    mainAddBtn: popoverMenu(
        () => ({
            primary_inputs: {
                title: 'Add input',
                buttons: [
                    { text: 'String', action: () => addInput(['content'], 'string') },
                    { text: 'Number', action: () => addInput(['content'], 'number') },
                    { text: 'Boolean', action: () => addInput(['content'], 'boolean') },
                    { text: 'Array', action: () => addInput(['content'], 'array') },
                    { text: 'Object', action: () => addInput(['content'], 'object') },
                ],
                open: true
            }
        })
    ),
});