// @ts-types="solid-js"
import { For, Show, createSignal } from "solid-js"
// import { newNote, setNewNote } from "../stores.tsx"
import type { lineMenu } from "../types.tsx";
import { DownArrow } from "../assets/svgs.tsx";
import { InputButton } from "./Select.tsx";
import type { JSONValue, JSONArray } from "../types.tsx"
import { Dynamic } from "solid-js/web"

import type { typeOfInputs } from "../types.tsx";
import type { ParentProps } from "solid-js";
import { addInput, updateStore } from "../helpers.tsx";

type inputsProps = {
    path: (string | number)[];
    config: lineMenu;
}

export function StringType(props: inputsProps & { value: string }) {
    return (
        <span class="group/s-line flex-1 flex">
            <textarea placeholder="Bla Bla Bla..."
                value={props.value}
                onChange={e => updateStore(props.path, e.currentTarget.value)}
                // value={newNote['content'][props.index].value?.toString()}
                // onInput={e => setNewNote('content', props.index, 'value', e.currentTarget.value)}
                class="StringType flex-1 focus:outline-none focus:bg-stone-800 rounded-md mr-8
                min-h-6 field-sizing-content text-[#CE9178]"
            ></textarea>
            <InputButton path={[...props.path]} text="..." config={props.config}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible group-hover/s-line:visible hover:border-slate-600 
            active:border-slate-600/80 absolute"/>
        </span>
    )
}

export function NumberType(props: inputsProps & { value: number }) {
    return (
        <span class="group/n-line flex-1 flex">
            <input type="number" placeholder="0, 1 or more (or less)!"
                value={props.value}
                onChange={e => updateStore(props.path, Number(e.currentTarget.value))}
                // value={newNote['content'][props.index].value?.toString()}
                // onInput={e => setNewNote('content', props.index, 'value', e.currentTarget.value)}
                class="NumberType flex-1 focus:outline-none focus:bg-stone-800 rounded-md mr-8
                text-[#DCDCAA]"
            />
            <InputButton path={[...props.path]} text="#" config={props.config}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible group-hover/n-line:visible hover:border-slate-600 
            active:border-slate-600/80 absolute"/>
        </span>
    )
}


function getType(input: JSONValue) {
    if (Array.isArray(input)) {
        return 'array'
    }

    switch (typeof input) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'object':
            return 'object';

        default:
            return 'null'
    }
}


export function ArrayType(props: inputsProps & { value: JSONArray }) {
    const [showList, setList] = createSignal(true);

    const Toggle = (props: { text: string, end?: boolean }) => (
        <span class="Bracket flex group/bracket flex-1">
            {/* <Show when={!props.start}><h2>{props.text}</h2></Show> */}
            <h2>{props.text}</h2>
            <DownArrow isDown={showList} setArrow={setList}
                class={`hover:bg-white/0 active:bg-white/0 w-4 h-4 
                ${ (props.end) ? 'invisible group-hover/bracket:visible' : ''}`}
                svg_class="dark:fill-stone-300 hover:fill-white active:fill-stone-500 w-4 h-4" />
            {/* <Show when={props.start}><h2>{props.text}</h2></Show> */}
        </span>
    )

    const lineConfig: lineMenu = {
        primary_inputs: {
            title: 'Change type',
            buttons: [
                { text: 'str', action: () => {} },
                { text: 'num', action: () => {} },
                { text: 'arr', action: () => {} },
                { text: 'obj', action: () => {} }
            ]
        },
        extra_options: [
            { text: 'Erase item', action: () => { } }
        ]
    }

    const addItemConfig: lineMenu = {
        primary_inputs: {
            open: true,
            title: 'Add item',
            buttons: [
                { text: 's', action: () => addInput(props.path, 'string') },
                { text: 'n', action: () => addInput(props.path, 'number') },
                { text: 'b', action: () => addInput(props.path, 'boolean') },
                { text: 'a', action: () => addInput(props.path, 'array') },
                { text: 'o', action: () => addInput(props.path, 'object') }
            ]
        }
    }


    return (
        <>
            <InputButton path={[...props.path]} text="[ ]" config={props.config}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
                    invisible group-hover/line:visible hover:border-slate-600 
                    active:border-slate-600/80 absolute"/>
            <Show when={showList()}
                fallback={<Toggle text={`[${props.value.length}]`} />}
            >
                <Toggle text="[" />
                <div class="ArrayType w-full relative flex flex-col pl-6 border-l border-slate-700/50 my-1">
                    <For each={props.value}>{(value, index) =>
                        <div class="w-full flex group/array_line justify-between">
                            <h2 class="mr-2">{index()}.</h2>
                            <span class="flex-1">
                                <Dynamic component={inputs[getType(value)]} value={value}
                                    config={{ ...lineConfig, 
                                        extra_options: [{ text: 'Erase '+getType(value), action: () => {} }] 
                                    }}
                                    path={[...props.path, index()]}
                                />
                            </span>
                        </div>
                    }</For>
                    <InputButton path={[...props.path]} config={addItemConfig} text="+1"
                        class="w-15 rounded-xl border-2 border-slate-700/50 hover:border-slate-600 
                    active:border-slate-700"/>
                </div>
                <Toggle text="]" end />
            </Show>
        </>
    )
}

export function ObjectType() {
    return (
        <>
        </>
    )
}

export const inputs = {
    string: StringType,
    number: NumberType,
    array: ArrayType,
    object: ObjectType,
    null: () => <span>Replace</span>,
    boolean: () => <span>Replace</span>,
};