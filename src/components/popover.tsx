import { twMerge } from "tailwind-merge";
import type { Accessor, Setter, Signal } from 'solid-js';
import {
    For,
    createEffect,
    onCleanup,
    Show,
    createSignal,
    createSelector,
} from 'solid-js';

import { Arrow, SettingSVG } from '../assets/svgs.tsx';
import type {
    menuButtons, menuOption, lineMenu,
    typeOfInputs, JSONPrimitive, LineContent,
    lineMenuParams,
    menuConfig
} from "../types.tsx";
import { MenuItem, MenuTitle } from "./Select.tsx";


// const [doWeCloseAllMenus, showAllMenus] = createSignal(false)
const [lastClicked, setLastClicked] = createSignal<HTMLButtonElement | undefined>();


// type optionsType = lineMenu;
type openBtnParams = {
    class?: string;
    text?: string;
    icon?: (Parameters<typeof SettingSVG>)[0];
    config: lineMenuParams;
}

export function popoverMenu(menu: menuConfig) {
    const [openSubMenu, selectSubOption] = createSignal<string>('none')
    const [coordinates, setCoordinates] = createSignal({ x: 0, y: 0 })
    const [showInputMenu, openInputMenu] = createSignal(false)

    const [params, setParams] = createSignal<lineMenuParams>([[], '', 'null'])
    const menuConfig: lineMenu = menu(...params());

    // private inSgl<T>(s: Signal<T>) {
    //     const [get, set] = s;
    //     return { get: get(), set }
    // }

    // constructor(menu: menuConfig) {
    //     this.menuConfig = menu(...this.params[0]());
    // }

    function updateConfig(
        refElement: HTMLButtonElement | undefined,
        options: lineMenuParams
    ) {
        if (!refElement) return;
        const rect = refElement.getBoundingClientRect();
        let yCoord = (rect.top + refElement.offsetHeight);

        if (yCoord > rect.bottom) {
            yCoord = yCoord - (yCoord - rect.bottom)
        }
        setCoordinates({ x: (rect.right - 224), y: yCoord }) // Set new coordinates for the menu.
        console.log('options: ', options);
        setParams(options) // New values for the menu options.
        openInputMenu(true); // Show this popover menu.
    }

    function MenuComponent() {
        // const [showInputMenu, openInputMenu] = this.showState;
        // const [menuConfig] = this.menuConfig;

        let optionsMenuRef: HTMLDivElement | undefined;

        createEffect(() => { // Handle click outside the menu.
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

        const visibility = () => showInputMenu() ? 'visible' : 'hidden';

        return (
            <div ref={optionsMenuRef}
                id="InputMenu"
                class={`absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 
                    ring-black ring-opacity-5 focus:outline-none dark:bg-stone-800`}
                style={{
                    top: `${coordinates().y}px`,
                    left: `${coordinates().x}px`,
                    visibility: visibility()
                }}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
            >
                <div class="py-1 select-none" role="none">
                    {/* {props.children} */}
                    <Show when={menuConfig.extra_options} >
                        <For each={menuConfig.extra_options}>{(option) =>
                            <MenuItem {...option} />
                        }</For>
                    </Show>
                    <MenuTitle {...menuConfig.primary_inputs} />

                </div>
            </div>
        )
    }


    // open() {
    //     this.showState[1](true);
    // }


    function MenuOpenerBtn(props: openBtnParams) {
        const isLastClicked = createSelector(lastClicked); // Should add some performace (?)
        // const [showInputMenu, openInputMenu] = this.showState;
        // const [, selectSubOption] = this.openSubMenu;
        // const updateConfig = this.config;
        // const [, setMenuCoords] = this.coordinates;
        // const [, configMenu] = this.params;

        let selectButtonRef: HTMLButtonElement | undefined;

        // function updateConfig() {
        //     if (selectButtonRef) {
        //         const rect = selectButtonRef.getBoundingClientRect();
        //         setMenuCoords({ x: (rect.right - 224), y: (rect.top + selectButtonRef.offsetHeight) });
        //         configMenu(props.config); // Set parameters for the options.
        //         openInputMenu(true);
        //     }
        // }

        function handleClick(e: Event) {
            const target = e.target as HTMLButtonElement;

            if (target.classList.contains('InputMenuButton')) {
                if (isLastClicked(target)) {
                    openInputMenu(!showInputMenu())
                } else {
                    updateConfig(selectButtonRef, props.config)
                }
                selectSubOption('none');
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

    return { MenuComponent, MenuOpenerBtn }
}