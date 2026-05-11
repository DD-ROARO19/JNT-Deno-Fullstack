import { 
    Show
} from "solid-js";

import type { Accessor, JSXElement, Setter } from "solid-js";
import type { JSONPrimitive, LineContent, lineMenu, path_list, typeOfInputs } from "../types.tsx";

import { DownArrow } from "../assets/svgs.tsx";
import { QuickMenuBtn } from "./QuickMenu.tsx";
import { twMerge } from "tailwind-merge/es5";
// import { LineSettingsBtn } from "./LineSettingsBtn.tsx";


export function LineSettingsBtn(props: { path: path_list, type: typeOfInputs, data: JSONPrimitive | LineContent[], hover_class?: string, text?: string }) {
    return (
        <QuickMenuBtn type={props.type} path={props.path} data={props.data}
            icon={{ option: 1, class: 'w-3.5 h-3.5 fill-stone-300' }}
            class={twMerge(`w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm 
            invisible hover:border-slate-600 active:border-slate-600/80 absolute`, props.hover_class)} 
        />
    )
}


/** Button to hide or open the contents of object components. */
export function Toggle(props: {
    // config: lineMenu; 
    text: string; class?: string;
    end?: boolean, show: boolean;
    isOpen: Accessor<boolean>, setOpen: Setter<boolean>,
    path: path_list, type: 'object' | 'array', data: LineContent[]
    key?: JSXElement;
}) {
    // console.log('toggle props: ', props);

    return (
        <>
            <span class="Bracket flex-1 flex group relative"
                classList={{ 'hover:bg-app-active/5': props.show }}>

                {props.key}

                <h2 class={props.class}>{props.text}</h2>
                <Show when={props.show}>
                    <DownArrow isDown={props.isOpen} setArrow={props.setOpen} class={`w-3.5 h-3.5 
                    ${(props.end) ? 'invisible group-hover:visible' : ''} `}
                        svg_class="fill-app-text/80 hover:fill-app-text active:fill-app-text/50 w-4 h-4"
                    />
                    <LineSettingsBtn path={props.path} type={props.type} data={props.data}
                        hover_class="group-hover:visible" />
                </Show>

            </span>
        </>
    )
}