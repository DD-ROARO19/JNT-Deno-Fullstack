// @ts-types="solid-js"
import { For, Show, createSignal } from "solid-js"
// import { newNote, setNewNote } from "../stores.tsx"
import type { lineMenuConfig } from "../types.tsx";
import { DownArrow } from "../assets/svgs.tsx";
import { InputButton } from "./Select.tsx";
import type { JSONValue, JSONArray, ArrayContent } from "../types.tsx"
import { Dynamic } from "solid-js/web"

import type { typeOfInputs } from "../types.tsx";

type inputsProps = {
    // index: number;
    // path: string;
    value: string | number;
    updateVal: (value: string) => void;
    config: lineMenuConfig;
}

export function StringType(props: inputsProps) {
    return (
        <span class="group/s-line flex-1 flex">
            <textarea placeholder="Bla Bla Bla..."
                value={props.value}
                onInput={e => props.updateVal(e.currentTarget.value)}
                // value={newNote['content'][props.index].value?.toString()}
                // onInput={e => setNewNote('content', props.index, 'value', e.currentTarget.value)}
                class="StringType flex-1 focus:outline-none focus:bg-stone-800 rounded-md mr-8
                min-h-6 field-sizing-content text-[#CE9178]"
            ></textarea>
            <InputButton path={`test`} text="#" config={props.config}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible group-hover/s-line:visible hover:border-slate-600 
            active:border-slate-600/80 absolute"/>
        </span>
    )
}

export function NumberType(props: inputsProps) {
    return (
        <span class="group/n-line flex-1 flex">
            <input type="number" placeholder="0, 1 or more (or less)!"
                value={props.value}
                onInput={e => props.updateVal(e.currentTarget.value)}
                // value={newNote['content'][props.index].value?.toString()}
                // onInput={e => setNewNote('content', props.index, 'value', e.currentTarget.value)}
                class="NumberType flex-1 focus:outline-none focus:bg-stone-800 rounded-md mr-8
                text-[#DCDCAA]"
            />
            <InputButton path={`test`} text="#" config={props.config}
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

export function ArrayType(props: { value: JSONArray }) {
    const [showList, setList] = createSignal(true);
    // const content_list = ['bruh', 'sample', 'test']

    const Toggle = (props: { text: string, start: boolean }) => (
        <span class="Bracket flex group/bracket">
            <Show when={!props.start}><h2>{props.text}</h2></Show>
            <DownArrow isDown={showList} setArrow={setList}
                class={`hover:bg-white/0 active:bg-white/0 w-4 h-4 
                ${props.start ? '' : 'invisible group-hover/bracket:visible'}
            `}
                svg_class="dark:fill-stone-300 hover:fill-white active:fill-stone-500 w-4 h-4" />
            <Show when={props.start}><h2>{props.text}</h2></Show>
        </span>
    )

    const addConfig: lineMenuConfig = {
        inputs_titles: 'Change type',
        extra_buttons: [
            { text: 'Erase item', action: () => { } }
        ]
    }

    return (
        <>
            <InputButton path={`test`} text="[ ]" config={addConfig}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
                    invisible group-hover/line:visible hover:border-slate-600 
                    active:border-slate-600/80 absolute"/>
            <Show when={showList()}
                fallback={<Toggle start text={`[${props.value.length}]`} />}
            >
                <Toggle text="[" start />
                <span class="ArrayType w-full relative flex flex-col pl-6 border-l border-slate-700/50 my-1">
                    <For each={props.value}>{(value, index) =>
                        <span class="w-full flex group/array_line justify-between">
                            <h2 class="mr-2">{index()}.</h2>
                            <span class="flex-1">
                                <Dynamic component={inputs[getType(value)]} value={value}
                                    config={addConfig}
                                />
                            </span>
                            {/* <InputButton path={`test`} text="#" config={addConfig}
                                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
                            invisible group-hover/array_line:visible hover:border-slate-600 
                            active:border-slate-600/80 absolute"/> */}
                        </span>
                    }</For>
                    <InputButton path="" config={{ inputs_titles: 'Add item' }}
                        class="w-15 rounded-xl border-2 border-slate-700 hover:border-slate-600 
                    active:border-slate-700"/>
                </span>
                <Toggle text="]" start={false} />
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

const inputs = {
    string: StringType,
    number: NumberType,
    array: ArrayType,
    object: ObjectType,
    null: () => <span>Replace</span>,
    boolean: () => <span>Replace</span>,
};