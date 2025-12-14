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

type lineProps = {
    type: typeOfInputs;
    path: (string | number)[];
    index: number;
    data: JSONPrimitive | LineContent[];
    key?: string | number;
}

export function NewLine(props: ParentProps & lineProps) {
    return (
        <>
            {props.children}

            <Dynamic component={inputs[props.type]}
                data={props.data}
                // config={LineConfig}
                path={[...props.path, props.index, 'value']}
                key = { props.key || '' }
            />
            <div class="Brake w-full"></div>
        </>
    )
}
