import { 
    Show
} from "solid-js";

import type { Accessor, Setter } from "solid-js";
import type { lineMenu } from "../types.tsx";

import { DownArrow } from "../assets/svgs.tsx";
import { LineSettingsBtn } from "./LineSettingsBtn.tsx";


/** Button to hide or open the contents of object components. */
export function Toggle(props: {
    class: string,
    text: string, config: lineMenu; end?: boolean, show: boolean;
    isOpen: Accessor<boolean>, setOpen: Setter<boolean>
}) {
    // console.log('toggle props: ', props);

    return (
        <>
            <span class="Bracket flex-1 flex group relative"
                classList={{ 'hover:bg-app-active/5': props.show }}>

                <h2 class={props.class}>{props.text}</h2>
                <Show when={props.show}>
                    <DownArrow isDown={props.isOpen} setArrow={props.setOpen} class={`w-3.5 h-3.5 
                    ${(props.end) ? 'invisible group-hover:visible' : ''} `}
                        svg_class="fill-app-text/80 hover:fill-app-text active:fill-app-text/50 w-4 h-4"
                    />
                    <LineSettingsBtn config={props.config}
                        hover_class="group-hover:visible" />
                </Show>

            </span>
        </>
    )
}