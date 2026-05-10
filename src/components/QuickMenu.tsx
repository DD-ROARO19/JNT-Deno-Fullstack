// @ts-types="solid-js"
import { 
    For, 
    Show, 
    createSignal,
    createSelector,
    createEffect,
    onCleanup,
    Switch,
    Match
} from "solid-js"; 
import { createStore } from "solid-js/store";
import { Arrow, SettingSVG } from "../assets/svgs.tsx";
import { twMerge } from "tailwind-merge";
import type { path_list, quickButtons, quickOptions, typeOfInputs } from "../types.tsx";

import { addInput, changeInput, updateStore, eraseInput, copyToClipboard } from "../helpers.tsx";


type qMenu_config = {
    // path: (string | number)[];
    options: quickOptions[],
    type: typeOfInputs
}
type quick_menu_options = {
    primitive:  qMenu_config,
    object:     qMenu_config, 
    Adder:      qMenu_config,
}
type menu_key_options = keyof quick_menu_options;
type quick_menu_params = {
    coords: { x: number, y: number };   path: path_list;
    show_menu: boolean;                 active_menu: menu_key_options; 
    type: typeOfInputs;
}
// Discriminated Unions to ascertain data.
type qPrimitive_config =    quick_menu_params & { active_menu: 'primitive', type: Extract<typeOfInputs, 'string' | 'number' | 'boolean'> }
type qObject_config =       quick_menu_params & { active_menu: 'object', type: Extract<typeOfInputs, 'object' | 'array'> }
type qAdder_config =        quick_menu_params & { active_menu: 'Adder', type: Extract<typeOfInputs, 'null'> }
type qMenu_params = qPrimitive_config | qObject_config | qAdder_config;

const [quickMenuConfig, set_quickMenuConfig] = createStore<qMenu_params>({
    path: [],
    show_menu: false,
    coords: { x: 0, y: 0 },
    active_menu: 'Adder',
    type: 'null'
})
const quickMenu_store: quick_menu_options = {
    primitive: { type: 'string', options: [
        { title: 'Change Input', render: 'collapse_menu', buttons: [
            { text: 'String',   action: () => changeInput(quickMenuConfig.path, 'string') },
            { text: 'Number',   action: () => changeInput(quickMenuConfig.path, 'number') },
            { text: 'Boolean',  action: () => changeInput(quickMenuConfig.path, 'boolean') },
            { text: 'Array',    action: () => changeInput(quickMenuConfig.path, 'array') },
            { text: 'Object',   action: () => changeInput(quickMenuConfig.path, 'object') }
        ] }
    ] },
    object: { type: 'object', options: [
        { title: 'Add Input', render: 'collapse_menu', buttons: [
            { text: 'String',   action: () => addInput(quickMenuConfig.path, 'string') },
            { text: 'Number',   action: () => addInput(quickMenuConfig.path, 'number') },
            { text: 'Boolean',  action: () => addInput(quickMenuConfig.path, 'boolean') },
            { text: 'Array',    action: () => addInput(quickMenuConfig.path, 'array') },
            { text: 'Object',   action: () => addInput(quickMenuConfig.path, 'object') }
        ] },
        { title: 'Change Input', render: 'collapse_menu', buttons: [
            { text: 'String',   action: () => changeInput(quickMenuConfig.path, 'string') },
            { text: 'Number',   action: () => changeInput(quickMenuConfig.path, 'number') },
            { text: 'Boolean',  action: () => changeInput(quickMenuConfig.path, 'boolean') },
            { text: 'Array',    action: () => changeInput(quickMenuConfig.path, 'array') },
            { text: 'Object',   action: () => changeInput(quickMenuConfig.path, 'object') }
        ] }
    ] },
    Adder: { type: 'null', options: 
        [{ title: 'Add Input', buttons: [
            { text: 'String',   action: () => addInput(quickMenuConfig.path, 'string') },
            { text: 'Number',   action: () => addInput(quickMenuConfig.path, 'number') },
            { text: 'Boolean',  action: () => addInput(quickMenuConfig.path, 'boolean') },
            { text: 'Array',    action: () => addInput(quickMenuConfig.path, 'array') },
            { text: 'Object',   action: () => addInput(quickMenuConfig.path, 'object') }
        ], render: 'same_menu' 
    }] }
} as const;

const [lastClicked, setLastClicked] = createSignal<HTMLButtonElement>()

type QuickMenuBtn_Params = {
    class?: string;
    text?: string;
    icon?: (Parameters<typeof SettingSVG>)[0];
    type: typeOfInputs;
    path: path_list;
}

export function QuickMenu() {
    let optionsMenuRef: HTMLDivElement | undefined;
    const options_config = quickMenu_store[quickMenuConfig.active_menu]

    createEffect(() => {
        // const menuRef = inputMenuRef();
        const handleOutClick = (e: Event) => {
            // console.log(e.target);
            if (!optionsMenuRef || optionsMenuRef.contains(e.target as Node) ||
                (e.target as HTMLElement).classList.contains('InputMenuButton')) {
                return;
            }

            // if (showInputMenu()) { openInputMenu(false) }
            if (quickMenuConfig.show_menu) { set_quickMenuConfig("show_menu", false) }
        }

        document.addEventListener('click', handleOutClick);
        onCleanup(() => document.removeEventListener('click', handleOutClick));
    });


    const MenuItem = (props: quickButtons & { class?: string } ) => {
        return (
            <option role="menuitem" class={twMerge(`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
            hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-gray-400 
            list-item list-inside`, props.class)} 
            onClick={() => { props.action(); set_quickMenuConfig("show_menu", false); }} >
                {props.text}
            </option>
        )
    }
    function MenuTitle(opt: quickOptions) { 
        return (
        <Switch>
        <Match when={opt.render === 'another_menu'}> <></> </Match>
        <Match when={opt.render === 'same_menu'}> <div>
            <span class="flex hover:text-gray-900 dark:hover:text-gray-400" >
                <option role="menuitem" class="block pl-4 py-2 text-sm font-bold italic text-gray-700 dark:text-gray-300 
                group-hover/submenu:text-gray-900 dark:group-hover/submenu:text-gray-400">
                    {opt.title}
                </option>
                {/* <Arrow class="rotate-270 place-self-center 
                group-hover/submenu:fill-gray-900 dark:group-hover/submenu:fill-gray-400" /> */}
            </span>
            <For each={opt.buttons}>{ (option) => <MenuItem {...option} /> }</For>
        </div> </Match>
        <Match when={opt.render === 'collapse_menu'}>{(_) => {
        const [isOpen, setOpen] = createSignal(false);
        return <div>
            <span class="flex hover:text-gray-900 dark:hover:text-gray-400" 
            classList={{ "group/submenu hover:bg-gray-100 dark:hover:bg-slate-700" : !isOpen() }}
            onclick={() => setOpen(p => !p)}>
                <option role="menuitem" class="block pl-4 py-2 text-sm font-bold italic text-gray-700 dark:text-gray-300 
                group-hover/submenu:text-gray-900 dark:group-hover/submenu:text-gray-400">
                    {opt.title}
                </option>
                <Arrow class="rotate-270 place-self-center 
                group-hover/submenu:fill-gray-900 dark:group-hover/submenu:fill-gray-400" />
            </span>
            <div class="h-auto grid transition-[grid-template-columns] duration-100 ease-in-out grid-cols-[0fr]"
            classList={{ "grid-cols-[1fr]": isOpen() }}>
                <div class="overflow-hidden">
                    {/* <Show when={isOpen}>
                    </Show> */}
                    <For each={opt.buttons}>{ (option) => <MenuItem {...option} /> }</For>
                </div>
            </div>
        </div>}}</Match>
        </Switch>
    )}


    return (
        <div ref={optionsMenuRef}
            id="InputMenu"
            class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 
            ring-black ring-opacity-5 focus:outline-none dark:bg-stone-800 "
            style={{
                top: `${quickMenuConfig.coords.y}px`,
                left: `${quickMenuConfig.coords.x}px`,
                visibility: quickMenuConfig.show_menu ? 'visible' : 'hidden',
                // display: quickMenuConfig.show_menu ? 'block' : 'none'
            }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
        >
            <div class="py-1 select-none" role="none">
                <For each={options_config.options}>{ (option) => <MenuTitle {...option} /> }</For>
            </div>
        </div>
    )
}


export function QuickMenuBtn(props: QuickMenuBtn_Params) {
    const isLastClicked = createSelector(lastClicked); // Should add some performace (?)
    let selectButtonRef: HTMLButtonElement | undefined;

    // const store = quickMenu_store[props.store]

    function updateConfig() {
        if (selectButtonRef) {
            const rect = selectButtonRef.getBoundingClientRect();
            set_quickMenuConfig({ 
                coords: { x: (rect.right - 224), y: (rect.top + selectButtonRef.offsetHeight) },
                show_menu: true,
                path: props.path
            })
            switch (props.type) {
                case "string": 
                    set_quickMenuConfig({ type: props.type, active_menu: 'primitive' })
                break;
                case "number":
                    set_quickMenuConfig({ type: props.type, active_menu: 'primitive' })
                break;
                case "boolean":
                    set_quickMenuConfig({ type: props.type, active_menu: 'primitive' })
                break;
                case "object":
                    set_quickMenuConfig({ type: props.type, active_menu: 'object' })
                break;
                case "null":
                    set_quickMenuConfig({ type: props.type, active_menu: 'Adder' })
                break;
                case "array":
                    set_quickMenuConfig({ type: props.type, active_menu: 'object' })
                break;
            
                default: (props.type) satisfies never;
                break;
            }
        }
    }

    function handleClick(e: Event) {
        const target = e.target as HTMLButtonElement;

        if (target.classList.contains('InputMenuButton')) {
            if (isLastClicked(target)) {
                set_quickMenuConfig("show_menu", p => !p)
            } else { updateConfig() }
            // set_quickMenuConfig("active_menu", 'none'); // # TODO: Maybe another variable for submenu control?
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

export {
    set_quickMenuConfig, setLastClicked
}