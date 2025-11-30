import { DownArrow } from '../assets/svgs.tsx';
import { twMerge } from "tailwind-merge";
import type { ParentProps, Accessor, Setter } from 'solid-js';
import {
    For,
    createEffect,
    onCleanup,
    createSignal,
    Show,
    onMount
} from 'solid-js';

export const types_of_inputs = {
    string: 'string',
    number: 'number',
    array: 'array',
    object: 'object'
}


export function Selector(props: ParentProps & { align: string }) {
    const [isOpen, setOpen] = createSignal(false)
    let dropdownRef: HTMLDivElement | undefined;

    createEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef && !dropdownRef.contains(event?.target as Node)) {
                setOpen(false)
            }
        }

        if (isOpen()) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        onCleanup(() => {
            document.removeEventListener('mousedown', handleClickOutside)
        })
    });

    return (
        <div class="relative inline-block text-left">

            <div>
                <button type="button" onClick={() => setOpen(!isOpen())}
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 
                text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                hover:bg-gray-50"
                    aria-expanded={isOpen()}
                    aria-haspopup="true"
                >
                    +
                    <svg
                        class="-mr-1 h-5 w-5 text-gray-400 transition-transform duration-200"
                        classList={{ 'rotate-180': isOpen() }} // Dynamically rotate icon
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            <Show when={isOpen()}>
                <div
                    class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    classList={{
                        'right-0': props.align === 'right' || !props.align, // Default to right
                        'left-0': props.align === 'left',
                    }}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div class="py-1" role="none">
                        {/* The menu items passed as children will appear here */}
                        {/* {props.children} */}
                        <option selected>Type of input</option>
                        <For each={Object.keys(types_of_inputs)}>{(type) =>
                            <option class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem" value={type}>{type}</option>
                        }</For>

                    </div>
                </div>
            </Show>

        </div>
    )
}


import {
    menuCoords, setMenuCoords,
    showInputMenu, openInputMenu,
    lineConfig
} from "../signals.tsx";

export function OptionsMenu() {
    let optionsMenuRef: HTMLDivElement | undefined;

    createEffect(() => {
        // const menuRef = inputMenuRef();
        const handleOutClick = (e: Event) => {
            if (!optionsMenuRef || optionsMenuRef.contains(e.target as Node) ||
                (e.target as HTMLButtonElement).className.includes('InputMenuButton')) {
                return;
            }

            if (showInputMenu()) { openInputMenu(false) }
        }

        document.addEventListener('click', handleOutClick);
        onCleanup(() => document.removeEventListener('click', handleOutClick));
    });

    function visibility() { // console.log('isOptionsOpen', showInputMenu());
        return showInputMenu() ? 'visible' : 'hidden';
    }

    const MenuItem = (props: { text: string; class?: string; val: string }) => {
        const c = `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
        dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-gray-400`;
        return (
            <option role="menuitem" class={twMerge(c, props.class)} value={props.val}>
                {props.text}
            </option>
        )
    }

    const MenuTitle = (props: { text: string }) => (
        <option role="menuitem" class="block px-4 py-2 text-sm font-bold italic text-gray-700
        dark:text-gray-300">
            {props.text}
        </option>
    )


    return (
        <div ref={optionsMenuRef}
            id="InputMenu"
            class={`absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 
            ring-black ring-opacity-5 focus:outline-none dark:bg-stone-800`}
            style={{
                top: `${menuCoords().y}px`,
                left: `${menuCoords().x}px`,
                visibility: visibility()
            }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
        >
            <div class="py-1 select-none" role="none">
                {/* The menu items passed as children will appear here */}
                {/* {props.children} */}
                <Show when={lineConfig().extra_buttons} >
                    <For each={lineConfig().extra_buttons}>{(option) =>
                        <MenuItem text={option.text} val={option.text} />
                    }</For>
                </Show>
                <MenuTitle text={lineConfig().inputs_titles} />
                <For each={Object.keys(types_of_inputs)}>{(type) =>
                    <MenuItem class="list-item list-inside" text={type} val={type} />
                }</For>

            </div>
        </div>
    )
}


import {
    lastClicked, setLastClicked,
    setLineConfig
} from '../signals.tsx'
import { createSelector } from 'solid-js'

import type { lineMenuConfig } from "../types.tsx";
type inputBtn_props = {
    class?: string
    text?: string
    path: string
    config: lineMenuConfig
}
export function InputButton(props: inputBtn_props) {
    const isLastClicked = createSelector(lastClicked); // Should add some performace (?)
    let selectButtonRef: HTMLButtonElement | undefined;

    function updateHeight() {
        if (selectButtonRef) {
            const rect = selectButtonRef.getBoundingClientRect();
            setMenuCoords({ x: (rect.right - 224), y: (rect.top + selectButtonRef.offsetHeight) });
            setLineConfig(props.config);
            openInputMenu(true);
        }
    }

    function handleClick(e: Event) {
        const target = e.target as HTMLButtonElement;

        if (target.classList.contains('InputMenuButton')) {
            if (isLastClicked(target)) {
                openInputMenu(!showInputMenu())
            } else { updateHeight() }
            setLastClicked(selectButtonRef)
        }
    }

    return (
        <button type="button" ref={selectButtonRef} onClick={handleClick}
            class={twMerge("cursor-pointer InputMenuButton select-none", props.class)}
        >
            {props.text || '+'}
        </button>
    )
}

export function InputType(props: { keyList: string[], selected: Accessor<string>, setSelected: Setter<string> }) {
    // const [isOpen, setOpen] = createSignal(false)
    // let dropdownRef: HTMLDivElement | undefined;

    /*onMount(() => {
        function handleClickOutside(event: MouseEvent) {
            console.log('dropdownRef:', dropdownRef, '\ntarget:', event.target);
            if (dropdownRef && !dropdownRef.contains(event?.target as Node)) {
                setOpen(false)
            }
        }

        if (isOpen()) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        onCleanup(() => {
            document.removeEventListener('mousedown', handleClickOutside)
        })
    }) /**/

    return (
        <div>
            <select
                value={props.selected()}
                onInput={(e) => props.setSelected(e.currentTarget.value)}
            >
                <For each={props.keyList}>{(type) =>
                    <option value={type}>{type}</option>
                }</For>
            </select>
        </div>
    )
}