import type { ParentProps, Accessor, Setter } from 'solid-js';
import {
    Show,
    createSignal,
    For
} from 'solid-js';
// import { twMerge } from 'tailwind-merge';

import { DownArrow } from '../assets/svgs.tsx';



function Keyline(props: ParentProps & { isOpen: Accessor<boolean>, setOpen: Setter<boolean> }) {
    return (
        <span class="flex items-center group/keyline">
            <DownArrow isDown={props.isOpen} setArrow={props.setOpen}
                class="invisible group-hover/keyline:visible
                hover:bg-white/0 active:bg-white/0
                "
                svg_class="dark:fill-stone-300
                hover:fill-white active:fill-stone-500
                "
            />
            {props.children}
        </span>
    )
}


export function Keys(props: ParentProps & { class?: string }) {
    const [isOpen, setOpen] = createSignal(true)

    const start_cover = "{"; const end_cover = "}";

    return (
        <div class="bg-stone-800/75 rounded-lg py-3 text-stone-300">
            <Show when={isOpen()}

                // Fallback when close
                fallback={
                    <Keyline isOpen={isOpen} setOpen={setOpen}>
                        <h2>{start_cover + end_cover}</h2>
                    </Keyline>
                }>

                {/* Opennin key "{" */}
                <Keyline isOpen={isOpen} setOpen={setOpen}>
                    <h2>{start_cover}</h2>
                </Keyline>


                {/* JSON content of the note */}
                <span class="flex flex-col">
                    {props.children}
                </span>


                {/* Clossin key "}" */}
                <Keyline isOpen={isOpen} setOpen={setOpen}>
                    <h2>{end_cover}</h2>
                </Keyline>

            </Show>
        </div>
    )
}