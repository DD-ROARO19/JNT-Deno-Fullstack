import { Dynamic } from "solid-js/web"

import type { ParentProps } from 'solid-js';

// import { InputButton } from "./Select.tsx";
import { ArrayType, NumberType, ObjectType, StringType } from "./InputTypes.tsx";
import type { lineMenu } from "../types.tsx";
import { updateStore } from "../helpers.tsx";

// function Listin(props: { number: number }) {
//     return (
//         <div class="PlaceListin w-6.5 h-6.5 text-center">
//             {props.number || '0'}.
//         </div>
//     )
// }


const inputs = {
    string: StringType,
    number: NumberType,
    array: ArrayType,
    object: ObjectType,
    null: () => <span>Replace</span>,
    boolean: () => <span>Replace</span>,
}
import type { typeOfInputs } from "../types.tsx";


// export function NewLineOne(props: ParentProps & { place?: number, level?: number }) {

//     return (
//         <span class="NewLine border-white border-1 text-stone-300 flex 
//         ">
//             <Listin number={props.place || 1} />
//             <span class={`flex-1 ml-[${(props.level || 1) * 2}rem]`}>
//                 {props.children}
//             </span>
//             {/* <InputButton isNewLine={false} text="#" class="w-6.5 h-6.5" 
//             /> */}
//         </span>
//     )
// }

type lineProps = {
    type: typeOfInputs;
    path: (string | number)[];
    index: number;
}
import { newNote } from "../stores.tsx";

export function NewLineTwo(props: ParentProps & lineProps) {

    const addConfig: lineMenu = {
        primary_inputs: {
            title: 'Change type',
            buttons: [
                { text: 'string', action: () => { } },
                { text: 'number', action: () => { } },
                { text: 'array', action: () => { } },
                { text: 'object', action: () => { } },
            ]
        },
        extra_options: [
            { text: 'Erase '+props.type, action: () => { } },
            { text: 'Add new item', action: () => { } },
            // { text: 'Erase line', action: () => {} },
        ]
    }

    return (
        <div class="NewLine text-stone-300 flex group/line relative">
            <span class="Bruh w-full flex-1 ml-[8%] flex flex-wrap">
                <input value={newNote['content'][props.index].key} onChange={e => updateStore([...props.path, 'key'], e.currentTarget.value)}
                    type="text" placeholder="Key name" style="field-sizing: content"
                    class="KeyInput max-w-30 focus:outline-none focus:bg-stone-800 rounded-md 
                    self-start text-sky-300"
                />
                <h2 class=":_Space mx-1">:</h2>
                <Dynamic component={inputs[props.type]}
                    value={newNote.content[props.index].value}
                    config={addConfig}
                    path={[...props.path, 'value']} 
                >
                    {props.children}
                </Dynamic>
            </span>
            {/* <InputButton path={`${props.path}.${newNote['content'][props.index].key}`} text="#" config={addConfig}
            class="w-6.5 h-6.5 border-2 border-slate-800 rounded-sm absolute right-1
            invisible group-hover/line:visible hover:border-slate-600 active:border-slate-600/80"/> */}
        </div>
    )
}
