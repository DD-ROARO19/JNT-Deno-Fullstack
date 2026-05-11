// @ts-types="solid-js"
import {
    For, Show, createSignal,
    Switch, Match
} from "solid-js"
import type { inputsProps, JSONPrimitive, LineContent, lineMenu, typeOfInputs, listsProps, quickOptions, path_list } from "../types.tsx";
import type { Accessor, Setter } from "solid-js";

import { DownArrow } from "../assets/svgs.tsx";
import { InputButton } from "./Select.tsx";
import { addInput, changeInput, updateStore, eraseInput, copyToClipboard, extractValue } from "../helpers.tsx";
import { NewLine } from './RowLines.tsx'
import { LineSettingsBtn } from "./Toggle.tsx"; 
import { Toggle } from "./Toggle.tsx";
import { QuickMenuBtn } from "./QuickMenu.tsx";

// function lineConfig(path: path_list, data: JSONPrimitive | LineContent[], type: typeOfInputs): lineMenu {
//     return {
//         primary_inputs: {
//             title: 'Change type',
//             buttons: [
//                 { text: 'str', action: () => changeInput(path, 'string') },
//                 { text: 'num', action: () => changeInput(path, 'number') },
//                 { text: 'boo', action: () => changeInput(path, 'boolean') },
//                 { text: 'arr', action: () => changeInput(path, 'array') },
//                 { text: 'obj', action: () => changeInput(path, 'object') }
//             ]
//         },
//         extra_options: [
//             { text: 'Erase item', action: () => eraseInput(path) },
//             { text: 'Copy value', action: () => copyToClipboard(data, type, path) },
//         ]
//     }
// }

// function LineSettingsBtn(props: { path: path_list, type: typeOfInputs, data: JSONPrimitive | LineContent[], hover_class: string, text?: string }) {
//     return (
//         <QuickMenuBtn type={props.type} path={props.path} data={props.data}
//             icon={{ option: 1, class: 'w-3.5 h-3.5 fill-stone-300' }}
//             class={`w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
//             invisible ${props.hover_class} hover:border-slate-600 
//             active:border-slate-600/80 absolute`} 
//         />
//     )
// }


// ##  PRIMITIVE VALUE COMPONENTS  ##

/** Component to display text. */
export function StringType(props: inputsProps & { data: string }) {
    // console.log('String props: ', props);

    return (
        <span class="StringType group/s-line flex-1 flex relative hover:bg-app-active/5 min-w-3/4">
            <textarea placeholder="Bla Bla Bla..."
                value={
                    (typeof props.data === 'object') ? // is an object?
                    // JSON.stringify(extractValue(props.data, 'object', props.path), undefined, 4) 
                    JSON.stringify(props.data, undefined, 4) 
                    : 
                    props.data
                }
                onChange={e => updateStore(props.path, e.currentTarget.value)}
                class="StringType flex-1 outline-none focus:bg-app-base rounded-md mr-8
                min-h-6 field-sizing-content text-app-string"
            ></textarea>
            <LineSettingsBtn path={props.path} type="string" data={props.data}
            // config={lineConfig(props.path, props.data, 'string')}
                hover_class="group-hover/s-line:visible" />
        </span>
    )
}

/** Component to display numbers */
export function NumberType(props: inputsProps & { data: number }) {
    // console.log('Number props: ', props);

    return (
        <span class="NumberType group/n-line flex-1 flex relative hover:bg-app-active/5">
            <input type="number" placeholder="0, 1 or more (or less)!"
                value={(props.data || props.data === 0) ? Number(props.data) : ''}
                onChange={e => updateStore(props.path, Number(e.currentTarget.value))}
                class="NumberType flex-1 outline-none focus:bg-app-base rounded-md mr-8
                text-app-number no-spin"
            />
            <LineSettingsBtn path={props.path} type="number" data={props.data}
            // config={lineConfig(props.path, props.data, 'number')}
                hover_class="group-hover/n-line:visible" />
        </span>
    )
}

/** Component that displays a boolean value in diferent styles depending on its key. */
export function BooleanType(props: inputsProps & { data: boolean, key: string }) {

    function BoolCheck() {
        return (
            <>
                <input type="checkbox" checked={props.data}
                    onClick={() => updateStore(props.path, !props.data)} />
                <p class="text-slate-600 select-all">{props.data ? 'true' : 'false'}</p>
            </>
        )
    }
    function BoolRadio() {
        return (
            <>
                <label for="true" class="select-none">True</label>
                <input type="radio" name="bool" checked={props.data}
                    onClick={() => updateStore(props.path, !props.data)}
                />
                <label for="false" class="select-none">False</label>
                <input type="radio" name="bool" checked={props.data == false}
                    onClick={() => updateStore(props.path, !props.data)}
                />
            </>
        )
    }
    function BoolSwitch() {
        return (
            <>
                <button type="button" role="switch" onClick={() => updateStore(props.path, !props.data)}
                    class={`
                relative inline-flex h-5 w-10 items-center rounded-full border-1 transition-colors 
                duration-200 border-app-muted cursor-pointer
                ${props.data ? "bg-app-active-secondary/80" : "bg-app-base"}
                    `} >
                    <span class={`
                    inline-block h-3 w-3 transform rounded-full transition-transform duration-200 
                    ease-in-out bg-white ${props.data ? "translate-x-6" : "translate-x-1"}
                        `} />
                </button>
                <p class="select-all">{props.data ? 'true' : 'false'}</p>
            </>
        )
    }

    return (
        <span class="BooleanType group/b-line flex-1 flex relative hover:bg-app-active/5">
            <span class="flex gap-2 text-app-keyword items-center">
                <Switch fallback={<BoolSwitch />}>
                    <Match when={props.key.endsWith('check')}><BoolCheck /></Match>
                    <Match when={props.key.endsWith('radio')}><BoolRadio /></Match>
                </Switch>
            </span>
            <LineSettingsBtn path={props.path} type="boolean" data={props.data}
            // config={lineConfig(props.path, props.data, 'boolean')}
                hover_class="group-hover/b-line:visible" />
        </span>
    )
}


/** Button to hide or open the contents of object components. */
// function Toggle(props: {
//     // config: lineMenu; 
//     text: string; 
//     end?: boolean, show: boolean;
//     isOpen: Accessor<boolean>, setOpen: Setter<boolean>,
//     path: path_list, type: 'object' | 'array', data: LineContent[]
// }) {
//     // console.log('toggle props: ', props);

//     return (
//         <>
//             <span class="Bracket flex-1 flex group relative"
//             classList={{'hover:bg-gray-700/50': props.show}}>

//                 <h2 class="">{props.text}</h2>
//                 <Show when={props.show}>
//                     <DownArrow isDown={props.isOpen} setArrow={props.setOpen} class={`hover:bg-white/0 
//                 active:bg-white/0 w-3.5 h-3.5 ${(props.end) ? 'invisible group-hover:visible' : ''} `}
//                         svg_class="dark:fill-stone-300 hover:fill-white active:fill-stone-500 w-4 h-4"
//                     />
//                     <LineSettingsBtn path={props.path} type={props.type} data={props.data}
//                         hover_class="group-hover:visible" />
//                 </Show>

//             </span>
//         </>
//     )
// }

// function addButtonConfig(path: (string | number)[]): lineMenu {
//     return {
//         primary_inputs: {
//             open: true,
//             title: 'Add input',
//             buttons: [
//                 { text: 'String', action: () => addInput(path, 'string') },
//                 { text: 'Number', action: () => addInput(path, 'number') },
//                 { text: 'Boolean', action: () => addInput(path, 'boolean') },
//                 { text: 'Array', action: () => addInput(path, 'array') },
//                 { text: 'Object', action: () => addInput(path, 'object') },
//             ]
//         }
//     }
// }

function AddItemBtn(props: { path: path_list, type: 'object' | 'array', isFullWidth: boolean | undefined }) {
    return (
        <div class="w-full group" classList={{ 'hover:bg-gray-700/50': props.isFullWidth != true }}>
            <QuickMenuBtn type="null" path={props.path} text={props.isFullWidth ? undefined : '+1'} data={null}
                class={`rounded-xl border-2 hover:border-slate-600 active:border-slate-700
                    ${props.isFullWidth ? 'w-[95%] border-slate-700' : 'w-15 border-[#293B49] group-hover:border-slate-700'}
                `}
            />
        </div>
    )
}



// ##  OBJECT COMPONENTS  ##

/** Component for rendering an list of values. */
export function ArrayType(props: inputsProps & listsProps) {
    // console.log('Array props: ', props);
    const [showList, setList] = createSignal(true);


    return (
        <>
            {/* <InputButton text="[ ]" config={props.config}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
                    invisible group-hover/line:visible hover:border-slate-600 
                    active:border-slate-600/80 absolute"/> */}
            <Show when={showList()}
                fallback={<Toggle text={`[${props.data?.length}]`} isOpen={showList} setOpen={setList}
                // config={lineConfig(props.path, props.data, 'array')} 
                path={props.path} type="array" data={props.data}
                show={!props.no_config} />}
            >
                <Toggle text="[" isOpen={showList} setOpen={setList} 
                // config={lineConfig(props.path, props.data, 'array')} 
                path={props.path} type="array" data={props.data}
                show={!props.no_config} />

                <div class="ArrayType w-full relative flex flex-col pl-4
                border-l-1 border-app-muted my-1 focus-within:border-app-active-secondary/50">
                    <For each={props.data}>{(item, index) => {
                        updateStore([...props.path, index(), 'key'], index())

                        return (
                            <div class="w-full flex justify-between">
                                <h2 class="mr-2 text-app-property">{index()}.</h2>
                                <span class="flex-1">
                                    <NewLine type={item.type} index={index()}
                                        path={props.path} data={item.value} >
                                    </NewLine>
                                </span>
                            </div>
                        )
                    }}</For>
                    <AddItemBtn path={props.path} type="array" isFullWidth={props.full_addButton}/>
                </div>

                <Toggle text="]" isOpen={showList} setOpen={setList} 
                // config={lineConfig(props.path, props.data, 'array')} 
                path={props.path} type="array" data={props.data}
                show={!props.no_config} end />
            </Show>
        </>
    )
}

/** Component to render groups of `key` - `value` pairs. */
export function ObjectType(props: inputsProps & listsProps) {
    // console.log('Object Props: ', props);
    const [isShowing, setShow] = createSignal(true);


    return (
        <>
            <Show when={isShowing()} fallback={
                <Toggle text={`{${props.data?.length}}`} isOpen={isShowing} setOpen={setShow}
                // config={lineConfig(props.path, props.data, 'object')} 
                path={props.path} type="object" data={props.data}
                show={!props.no_config} />
            }>
                <Toggle text="{" isOpen={isShowing} setOpen={setShow} 
                // config={lineConfig(props.path, props.data, 'object')} 
                path={props.path} type="object" data={props.data}
                show={!props.no_config} />

                <div class="ObjectType w-full flex flex-wrap pl-8 border-l-1 border-app-muted my-1
                text-app-text focus-within:border-app-active-secondary/50" >
                    <For each={props.data}>{(item, index) => {

                        return (
                            <NewLine path={props.path} type={item.type}
                                index={index()} data={item.value} key={item.key} >
                                <span class="Key flex justify-between hover:bg-app-active/5">
                                    <input value={item.key} type="text" placeholder="Key name"
                                        onChange={e =>
                                            updateStore([...props.path, index(), 'key'],
                                                e.currentTarget.value)
                                        }
                                        style="field-sizing: content"
                                        class="KeyInput text-wrap max-w-64 focus:outline-none focus:bg-app-base 
                                    rounded-md self-start text-app-property"/>
                                    <h2 class=":_Space mx-1">:</h2>
                                </span>
                            </NewLine>
                        )
                    }}</For>
                    <AddItemBtn path={props.path} type="object" isFullWidth={props.full_addButton}/>
                </div>

                <Toggle text="}" isOpen={isShowing} setOpen={setShow} 
                // config={lineConfig(props.path, props.data, 'object')} 
                path={props.path} type="object" data={props.data}
                show={!props.no_config} end />
            </Show>
        </>
    )
}

export const inputs = {
    string: StringType,
    number: NumberType,
    array: ArrayType,
    object: ObjectType,
    boolean: BooleanType,
    null: () => <span>null</span>,
};