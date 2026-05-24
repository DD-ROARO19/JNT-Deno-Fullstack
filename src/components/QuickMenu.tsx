// @ts-types="solid-js"
import { 
    For, 
    Show, 
    createSignal,
    createSelector,
    createEffect,
    onCleanup,
    Switch,
    Match,
    createMemo } from "solid-js"; 
import { createStore } from "solid-js/store";
import { Arrow, SettingSVG } from "../assets/svgs.tsx";
import { twMerge } from "tailwind-merge";
import { addInput, changeInput, eraseInput, copyToClipboard } from "../helpers.tsx";
import { computePosition, flip, shift, autoUpdate, autoPlacement } from "@floating-ui/dom"

import type { JSONPrimitive, LineContent, path_list, quickButtons, quickOptions, typeOfInputs } from "../types.tsx";



interface qMenu_config {
    // path: (string | number)[];
    options: quickOptions[],
    // type: typeOfInputs
}
interface quick_menu_options {
    primitive:  qMenu_config,
    object:     qMenu_config, 
    Adder:      qMenu_config,
    tags:       qMenu_config,
}
type menu_key_options = keyof quick_menu_options;
interface quick_menu_params {
    path: path_list;                    // coords: { x: number, y: number };   
    show_menu: boolean;                 active_menu: menu_key_options; 
    type: typeOfInputs;                 data: JSONPrimitive | LineContent[];
}
// Discriminated Unions to ascertain data.
type qPrimitive_config =    quick_menu_params & { active_menu: 'primitive', type: Extract<typeOfInputs, 'string' | 'number' | 'boolean'> }
type qObject_config =       quick_menu_params & { active_menu: 'object', type: Extract<typeOfInputs, 'object' | 'array'> }
type qAdder_config =        quick_menu_params & { active_menu: 'Adder', type: Extract<typeOfInputs, 'null'> }
type qTags_config =         quick_menu_params & { active_menu: 'tags', type: Extract<typeOfInputs, 'null'> }
type qMenu_params = qPrimitive_config | qObject_config | qAdder_config | qTags_config;

const [quickMenuConfig, set_quickMenuConfig] = createStore<qMenu_params>({
    path: [],
    show_menu: false,
    // coords: { x: 0, y: 0 },
    active_menu: 'Adder',
    type: 'null',
    data: null
})
export const [tagsStore, update_tagStore] = createStore<qMenu_config>({ options: [{ title: 'Tags', render: 'same_menu', buttons: [] }] });
const [quickMenu_store] = createStore<quick_menu_options>({
    primitive: { options: [
        { title: '', render: 'same_menu', buttons: [
            { text: 'Copy',     action: () => copyToClipboard(quickMenuConfig.data, quickMenuConfig.type, quickMenuConfig.path) },
            { text: 'Remove',   action: () => eraseInput(quickMenuConfig.path) },
        ] },
        { title: 'Change Input', render: 'collapse_menu', buttons: [
            { text: 'String',   action: () => changeInput(quickMenuConfig.path, 'string') },
            { text: 'Number',   action: () => changeInput(quickMenuConfig.path, 'number') },
            { text: 'Boolean',  action: () => changeInput(quickMenuConfig.path, 'boolean') },
            { text: 'Array',    action: () => changeInput(quickMenuConfig.path, 'array') },
            { text: 'Object',   action: () => changeInput(quickMenuConfig.path, 'object') }
        ] }
    ] },
    object: { options: [
        { title: '', render: 'same_menu', buttons: [
            { text: 'Copy',     action: () => copyToClipboard(quickMenuConfig.data, quickMenuConfig.type, quickMenuConfig.path) },
            { text: 'Remove',   action: () => eraseInput(quickMenuConfig.path) },
        ] },
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
    Adder: { options: 
        [{ title: 'Add Input', buttons: [
            { text: 'String',   action: () => addInput(quickMenuConfig.path, 'string') },
            { text: 'Number',   action: () => addInput(quickMenuConfig.path, 'number') },
            { text: 'Boolean',  action: () => addInput(quickMenuConfig.path, 'boolean') },
            { text: 'Array',    action: () => addInput(quickMenuConfig.path, 'array') },
            { text: 'Object',   action: () => addInput(quickMenuConfig.path, 'object') }
        ], render: 'same_menu' 
    }] },
    tags: tagsStore
});

const [lastTouched, setLastTouched] = createSignal<HTMLElement>()
const [contentRef, setContentRef] = createSignal<HTMLDivElement>()

interface QuickMenuBtn_Params {
    class?: string;
    text?: string;
    icon?: (Parameters<typeof SettingSVG>)[0];
    type: typeOfInputs;
    path: path_list;
    data: JSONPrimitive | LineContent[]
}

export function QuickMenu() {
    let quickMenuRef: HTMLDivElement | undefined;
    const [openSubMenu, set_openSubMenu] = createSignal<string>();

    createEffect(() => {
        const referenceEl = lastTouched()
        const contentDivRef = contentRef()
        if(!quickMenuRef || !referenceEl || !contentDivRef || !quickMenuConfig.show_menu) return;
        // console.log('lastTouched = ', referenceEl);
        
        function updatePosition() {
            if(!quickMenuRef || !referenceEl || !contentDivRef) return;

            computePosition(referenceEl, quickMenuRef, {
                placement: 'bottom',
                strategy: 'fixed',
                middleware: [
                    flip({ boundary: contentDivRef,/**/ crossAxis: false, fallbackPlacements: ["left-start","left-end","top"], fallbackStrategy: 'initialPlacement', padding: 16 }),
                    shift({ boundary: contentDivRef, crossAxis: false }),
                    // autoPlacement({ boundary: contentDivRef, allowedPlacements: ["bottom", "left-end", "top"] })
                ]
            }).then( (config) => {
                Object.assign(quickMenuRef.style, {
                    top: `${config.y}px`,
                    left: `${config.x}px`,
                    position: config.strategy
                })
            })
        }
        
        const handleOutClick = (e: Event) => {
            // console.log('# targer:', e.target);
            if (!quickMenuRef 
                || quickMenuRef.contains(e.target as Node) 
                || (e.target as HTMLElement).classList.contains('InputMenuButton')
                || (e.target as HTMLElement).classList.contains('TagInput')
            ) {
                return;
            }
            // if (quickMenuConfig.show_menu) { set_quickMenuConfig("show_menu", false) }
            set_quickMenuConfig("show_menu", false);
        }

        document.addEventListener('pointerdown', handleOutClick);
        const cleanup = autoUpdate(referenceEl, quickMenuRef, updatePosition)
        
        onCleanup(() => {
            document.removeEventListener('pointerdown', handleOutClick);
            cleanup()
        });
    });

    createEffect(() => {
        const _lastestElement = lastTouched()
        set_openSubMenu(undefined)
    })


    const MenuButtons = (props: quickButtons & { class?: string } ) => {
        return (
            <option role="menuitem" class={twMerge(`px-4 py-2 text-sm text-app-text/70 rounded-md
            hover:bg-app-active/20 hover:text-app-text`, props.class)} 
            onMouseDown={e => e.preventDefault()}
            onClick={() => { props.action(); 
                set_quickMenuConfig("show_menu", false); 
                // set_openSubMenu(undefined)
            }} >
                {props.text}
            </option>
        )
    }
    function MenuSection(opt: quickOptions) { 
        return (
        <Switch>
        <Match when={opt.render === 'another_menu'}> <></> </Match>

        <Match when={opt.render === 'same_menu'}> 
            <div>   <Show when={opt.title.trim() !== ''}>
                <label class="block pl-4 py-2 text-sm font-bold italic text-app-text">
                    {opt.title}
                </label>
            </Show>
            <For each={opt.buttons}>{ (option) => <MenuButtons {...option} /> }</For>   </div> 
        </Match>

        <Match when={opt.render === 'collapse_menu'}>{(_) => {
        const isOpen = createMemo(() => openSubMenu() === opt.title);
        
        
        return <div class="h-auto">
            <span class="group/submenu flex hover:bg-app-active/20 rounded-md"
            classList={{ "bg-app-active/10": isOpen() }} 
            onClick={() => set_openSubMenu(isOpen() ? undefined : opt.title) }>
                <button type="button" role="menuitemcheckbox" class={`block pl-4 py-2 text-sm font-bold italic group-hover/submenu:text-app-text
                ${isOpen() ? 'text-app-active/70' : 'text-app-text/70'}`}>
                    {opt.title}
                </button>
                <Arrow class={`place-self-center transition-[rotate] duration-100 ease-in group-hover/submenu:fill-app-text 
                ${isOpen() ? 'rotate-360 fill-app-active/70' : 'rotate-270 fill-app-text/70'}`} />
            </span>
            <div class="h-auto grid transition-[grid-template-rows] duration-200 ease-in-out grid-rows-[0fr]"
            classList={{ "grid-rows-[1fr]": isOpen() }}>
                <div class="overflow-hidden">
                    {/* <Show when={isOpen}>
                    </Show> */}
                    <For each={opt.title === 'Change Input' ? opt.buttons.filter((v) => v.text.toLocaleLowerCase() !== quickMenuConfig.type) : opt.buttons}>
                        { (option) => <MenuButtons class="list-item list-inside" {...option} /> }</For>
                </div>
            </div>
        </div>}}</Match>
        </Switch>
    )}


    return (
        <div ref={quickMenuRef}
            id="QuickMenu"
            class="absolute h-auto w-56 origin-top-right rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none 
            ring-app-sidebar/50 bg-app-surface select-none
            "
            style={{
                // top: `${quickMenuConfig.coords.y}px`,
                // left: `${quickMenuConfig.coords.x}px`,
                // visibility: quickMenuConfig.show_menu ? 'visible' : 'hidden',
                "z-index": quickMenuConfig.active_menu === 'tags' ? 3 : 1,
                "display": quickMenuConfig.show_menu ? 'block' : 'none'
            }}
            role="menu"
            aria-orientation="vertical"
            // aria-labelledby="menu-button"
        >
            <For each={quickMenu_store[quickMenuConfig.active_menu].options}>{ (option) => <MenuSection {...option} /> }</For>
            {/* <div class="py-1 h-auto" role="none" >
            </div> */}
        </div>
    )
}


export function QuickMenuBtn(props: QuickMenuBtn_Params) {
    const isLastClicked = createSelector(lastTouched); // Should add some performace (?)
    let selectButtonRef: HTMLButtonElement | undefined;

    // const store = quickMenu_store[props.store]

    function updateConfig() {
        if (selectButtonRef) {
            // const rect = selectButtonRef.getBoundingClientRect();
            set_quickMenuConfig({ 
                // coords: { x: (rect.right - 224), y: (rect.top + selectButtonRef.offsetHeight) },
                show_menu: true,
                path: props.path,
                data: props.data
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
                case "array":
                    set_quickMenuConfig({ type: props.type, active_menu: 'object' })
                break;
                case "null":
                    set_quickMenuConfig({ type: props.type, active_menu: 'Adder' })
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
            setLastTouched(selectButtonRef)
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
    quickMenuConfig, set_quickMenuConfig, lastTouched, setLastTouched, setContentRef
}