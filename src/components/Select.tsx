import { Arrow, SettingSVG } from '../assets/svgs.tsx';
import { twMerge } from "tailwind-merge";
import type { Accessor, Setter } from 'solid-js';
import {
    For,
    createEffect,
    onCleanup,
    Show,
} from 'solid-js';

export const types_of_inputs = {
    string: 'string',
    number: 'number',
    array: 'array',
    object: 'object'
}


import {
    menuCoords, setMenuCoords,
    showInputMenu, openInputMenu,
    lineMenuConfig,
    menuOpen, setMenuOpen
} from "../signals.tsx";
import type { menuOption } from "../types.tsx";

export function OptionsMenu() {
    let optionsMenuRef: HTMLDivElement | undefined;

    createEffect(() => {
        // const menuRef = inputMenuRef();
        const handleOutClick = (e: Event) => {
            // console.log(e.target);
            if (!optionsMenuRef || optionsMenuRef.contains(e.target as Node) ||
                (e.target as HTMLElement).classList.contains('InputMenuButton')) {
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

    type optionProps = {
        text: string;
        class?: string;
        action: () => void;
    }

    const MenuItem = (props: optionProps ) => {
        const c = `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900
        dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-gray-400`;
        return (
            <option role="menuitem" class={twMerge(c, props.class)} 
            onClick={() => { props.action(); openInputMenu(false); }} >
                {props.text}
            </option>
        )
    }

    function MenuTitle(props: menuOption ) { 
        
        return (
        <>
            <span class={`flex ${props.open ? '':'group/submenu hover:bg-gray-100 dark:hover:bg-slate-700'} 
            hover:text-gray-900 dark:hover:text-gray-400
            `} 
            onclick={() => setMenuOpen(pre => (pre == props.title) ? 'none': props.title)}>
                <option role="menuitem" class="block pl-4 py-2 text-sm font-bold italic text-gray-700 dark:text-gray-300 
                group-hover/submenu:text-gray-900 dark:group-hover/submenu:text-gray-400">
                    {props.title}
                </option>
                <Arrow class="rotate-270 place-self-center 
                group-hover/submenu:fill-gray-900 dark:group-hover/submenu:fill-gray-400" />
            </span>
            <Show when={props.open || props.title === menuOpen()}>
                <For each={props.buttons}>{(option) =>
                    <MenuItem {...option} class="list-item list-inside" />
                }</For>
            </Show>
        </>
    )}


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
                {/* {props.children} */}
                <Show when={lineMenuConfig().extra_options} >
                    <For each={lineMenuConfig().extra_options}>{(option) =>
                        <MenuItem {...option} />
                    }</For>
                </Show>
                <MenuTitle {...lineMenuConfig().primary_inputs} />

            </div>
        </div>
    )
}


import {
    lastClicked, setLastClicked,
    setLineMenuConfig
} from '../signals.tsx'
import { createSelector } from 'solid-js'

import type { lineMenu } from "../types.tsx";
type inputBtn_props = {
    class?: string;
    text?: string;
    icon?: (Parameters<typeof SettingSVG>)[0];
    config: lineMenu;
}
export function InputButton(props: inputBtn_props) {
    const isLastClicked = createSelector(lastClicked); // Should add some performace (?)
    let selectButtonRef: HTMLButtonElement | undefined;

    function updateConfig() {
        if (selectButtonRef) {
            const rect = selectButtonRef.getBoundingClientRect();
            setMenuCoords({ x: (rect.right - 224), y: (rect.top + selectButtonRef.offsetHeight) });
            setLineMenuConfig(props.config);
            openInputMenu(true);
        }
    }

    function handleClick(e: Event) {
        const target = e.target as HTMLButtonElement;

        if (target.classList.contains('InputMenuButton')) {
            if (isLastClicked(target)) {
                openInputMenu(!showInputMenu())
            } else { updateConfig() }
            setMenuOpen('none');
            setLastClicked(selectButtonRef)
        }
    }

    return (
        <button type="button" ref={selectButtonRef} onClick={handleClick}
            class={twMerge("cursor-pointer InputMenuButton select-none", props.class)}
        >
            <Show when={props.icon} fallback={<>{props.text || '+'}</>}>
                <SettingSVG {...props.icon!} /> 
            </Show>
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