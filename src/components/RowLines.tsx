import { Dynamic } from "solid-js/web"

import { inputs } from "./InputTypes.tsx";
import { statics } from "./StaticTypes.tsx";

import type { ParentProps , ValidComponent } from 'solid-js';
import type { lineProps, JSONPrimitive, LineContent, typeOfInputs } from "../types.tsx";

// function Listin(props: { number: number }) {
//     return (
//         <div class="PlaceListin w-6.5 h-6.5 text-center">
//             {props.number || '0'}.
//         </div>
//     )
// }

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
export function NewLine2(props: ParentProps & lineProps) {
    return (
        <>
            <Dynamic component={statics[props.type || 'null'] as ValidComponent}
                data={props.data}
                index={props.index}
                path={[...props.path, props.index, 'value']}
                key={props.key}
            />
            <div class="Brake w-full"></div>
        </>
    )
}
