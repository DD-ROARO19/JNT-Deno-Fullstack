import { Dynamic } from "solid-js/web"
import type { ParentProps } from 'solid-js';
import type { lineProps, JSONPrimitive, LineContent, typeOfInputs } from "../types.tsx";
import { inputs } from "./InputTypes.tsx";

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
