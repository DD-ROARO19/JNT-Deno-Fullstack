import { createSignal } from "solid-js";
import { Dynamic } from "solid-js/web"
import { createStore } from "solid-js/store";

import type { ParentProps } from 'solid-js';
// import { NoteContent } from "../types.tsx";

import { InputButton } from "./Select.tsx";
import { ArrayType, NumberType, ObjectType, StringType } from "./InputTypes.tsx";
import type { lineMenuConfig } from "../types.tsx";

export function Listin(props: { number: number }) {
    return (
        <div class="PlaceListin w-6.5 h-6.5 text-center">
            {props.number || '0'}.
        </div>
    )
}


const inputs = {
    string: StringType,
    number: NumberType,
    array: ArrayType,
    object: ObjectType,
    null: () => <span>Replace</span>,
    boolean: () => <span>Replace</span>,
}
import type { typeOfInputs } from "../types.tsx";

const addConfig: lineMenuConfig = {
    inputs_titles: 'Change type', 
    extra_buttons: [
        { text: 'Erase line', action: () => {} },
        { text: 'Add new item', action: () => {} },
        // { text: 'Erase line', action: () => {} },
    ]
}


export function NewLineOne(props: ParentProps & { place?: number, level?: number }) {

    return (
        <span class="NewLine border-white border-1 text-stone-300 flex 
        ">
            <Listin number={props.place || 1} />
            <span class={`flex-1 ml-[${(props.level || 1) * 2}rem]`}>
                {props.children}
            </span>
            {/* <InputButton isNewLine={false} text="#" class="w-6.5 h-6.5" 
            /> */}
        </span>
    )
}

type lineProps = {
    level?: number;
    type: typeOfInputs;
    path: string;
    index: number;
}
import { newNote, setNewNote } from "../stores.tsx"; 

export function NewLineTwo(props: ParentProps & lineProps) {
    // const [line, setLine] = createStore({ key: "", value: undefined })
    // const [key, setKey] = createSignal<string>("")s

    function updatePrimitives(change: string) {
        setNewNote('content', props.index, 'value', change)
    }

    return (
        <span class="NewLine text-stone-300 flex group/line relative">
            <span class="Bruh w-full flex-1 ml-[8%] flex flex-wrap">
                <input value={newNote['content'][props.index].key} onInput={e => setNewNote('content', props.index, 'key', e.currentTarget.value)}
                    type="text" placeholder="Key name" style="field-sizing: content"
                    class="KeyInput max-w-30 focus:outline-none focus:bg-stone-800 rounded-md 
                    self-start text-sky-300"
                />
                <h2 class=":_Space mx-1">:</h2>
                <Dynamic component={inputs[props.type]} 
                    value={newNote.content[props.index].value}
                    updateVal={updatePrimitives}
                    config={addConfig}
                    // index={props.index} path={props.path} 
                >
                    {props.children}
                </Dynamic>
            </span>
            {/* <InputButton path={`${props.path}.${newNote['content'][props.index].key}`} text="#" config={addConfig}
            class="w-6.5 h-6.5 border-2 border-slate-800 rounded-sm absolute right-1
            invisible group-hover/line:visible hover:border-slate-600 active:border-slate-600/80"/> */}
        </span>
    )
}
