import { Dynamic } from "solid-js/web"

import type { ParentProps } from 'solid-js';

// import { InputButton } from "./Select.tsx";
import type { JSONPrimitive, LineContent, lineMenu } from "../types.tsx";
import { changeInput, updateStore } from "../helpers.tsx";

// function Listin(props: { number: number }) {
//     return (
//         <div class="PlaceListin w-6.5 h-6.5 text-center">
//             {props.number || '0'}.
//         </div>
//     )
// }


import type { typeOfInputs } from "../types.tsx";
import { inputs } from "./InputTypes.tsx";

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
    data: JSONPrimitive | LineContent[];
    key?: string | number;
}
import { newNote } from "../stores.tsx";

export function NewLine(props: ParentProps & lineProps) {

    const LineConfig: lineMenu = {
        primary_inputs: {
            title: 'Change type',
            buttons: [
                { text: 'string', action: () => changeInput(props.path, 'string') },
                { text: 'number', action: () => { } },
                { text: 'array', action: () => { } },
                { text: 'object', action: () => { } },
            ]
        },
        extra_options: [
            { text: 'Erase ' + props.type, action: () => { } },
            { text: 'Add new item', action: () => { } },
            // { text: 'Erase line', action: () => {} },
        ]
    }

    // const settings = {
    //     component: inputs[props.type],
    //     data: props.data,
    //     config: LineConfig,
    //     path: [...props.path, props.index, 'value']
    // }
    // props.key ? settings.key = props.key;

    return (
        <>
            {props.children}
            {/* <InputButton path={`${props.path}.${newNote['content'][props.index].key}`} text="#" config={addConfig}
                class="w-6.5 h-6.5 border-2 border-slate-800 rounded-sm absolute right-1
                invisible group-hover/line:visible hover:border-slate-600 active:border-slate-600/80"/> */}

            <Dynamic component={inputs[props.type]}
                data={props.data}
                config={LineConfig}
                path={[...props.path, props.index, 'value']}
                key = { props.key || '' }
            />
            <div class="Brake w-full"></div>
        </>
    )
}
