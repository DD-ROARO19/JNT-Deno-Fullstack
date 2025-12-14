// @ts-types="solid-js"
import { For, Show, createSignal } from "solid-js"
// import { newNote, setNewNote } from "../stores.tsx"
import type { LineContent, lineMenu } from "../types.tsx";
import { DownArrow } from "../assets/svgs.tsx";
import { InputButton } from "./Select.tsx";
import type { JSONValue, JSONArray } from "../types.tsx"
import { Dynamic } from "solid-js/web"

import type { typeOfInputs } from "../types.tsx";
import type { ParentProps, Accessor, Setter } from "solid-js";
import { addInput, changeInput, updateStore } from "../helpers.tsx";
import { NewLine } from '../components/Edit_Lines.tsx'
// @ts-types="solid-js"
import { Switch } from "solid-js";
// @ts-types="solid-js"
import { Match } from "solid-js";

type inputsProps = {
    path: (string | number)[];
    config: lineMenu;
    index?: number | null;
}

function lineConfig(path: (string | number)[]): lineMenu {
    return {
        primary_inputs: {
            title: 'Change type',
            buttons: [
                { text: 'str', action: () => changeInput(path, 'string') },
                { text: 'num', action: () => changeInput(path, 'number') },
                { text: 'boo', action: () => changeInput(path, 'boolean') },
                { text: 'arr', action: () => changeInput(path, 'array') },
                { text: 'obj', action: () => changeInput(path, 'object') }
            ]
        },
        extra_options: [
            { text: 'Erase item', action: () => { } }
        ]
    }
}

export function StringType(props: inputsProps & { data: string }) {
    // console.log('String props: ', props);

    return (
        <span class="StringType group/s-line flex-1 flex relative">
            <textarea placeholder="Bla Bla Bla..."
                value={props.data}
                onChange={e => updateStore(props.path, e.currentTarget.value)}
                class="StringType flex-1 focus:outline-none focus:bg-stone-800 rounded-md mr-8
                min-h-6 field-sizing-content text-[#CE9178]"
            ></textarea>
            <InputButton text="#" config={lineConfig(props.path)}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible group-hover/s-line:visible hover:border-slate-600 
            active:border-slate-600/80 absolute"/>
        </span>
    )
}

export function NumberType(props: inputsProps & { data: number }) {
    // console.log('Number props: ', props);

    return (
        <span class="NumberType group/n-line flex-1 flex relative">
            <input type="number" placeholder="0, 1 or more (or less)!"
                value={props.data}
                onChange={e => updateStore(props.path, Number(e.currentTarget.value))}
                class="NumberType flex-1 focus:outline-none focus:bg-stone-800 rounded-md mr-8
                text-[#DCDCAA] no-spin"
            />
            <InputButton text="#" config={lineConfig(props.path)}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible group-hover/n-line:visible hover:border-slate-600 
            active:border-slate-600/80 absolute"/>
        </span>
    )
}


// function getType(input: JSONValue) {
//     if (Array.isArray(input)) {
//         return 'array'
//     }

//     switch (typeof input) {
//         case 'string':
//             return 'string';
//         case 'number':
//             return 'number';
//         case 'boolean':
//             return 'boolean';
//         case 'object':
//             return 'object';

//         default:
//             return 'null'
//     }
// }

function Toggle(props: {
    text: string, config: lineMenu; end?: boolean, show: boolean;
    isOpen: Accessor<boolean>, setOpen: Setter<boolean>
}) {
    // console.log('toggle props: ', props);

    return (
        <>
            <span class="Bracket flex-1 flex group/bracket relative">

                <h2>{props.text}</h2>
                <DownArrow isDown={props.isOpen} setArrow={props.setOpen} class={`hover:bg-white/0 
            active:bg-white/0 w-4 h-4 ${(props.end) ? 'invisible group-hover/bracket:visible' : ''} `}
                    svg_class="dark:fill-stone-300 hover:fill-white active:fill-stone-500 w-4 h-4"
                />
                <Show when={props.show}>
                    <InputButton text="#" config={props.config}
                        class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
                invisible group-hover/bracket:visible hover:border-slate-600 
                active:border-slate-600/80 absolute"/>
                </Show>

            </span>
        </>
    )
}

function addButtonConfig(path: (string | number)[]): lineMenu {
    return {
        primary_inputs: {
            open: true,
            title: 'Add input',
            buttons: [
                { text: 'String', action: () => addInput(path, 'string') },
                { text: 'Number', action: () => addInput(path, 'number') },
                { text: 'Boolean', action: () => addInput(path, 'boolean') },
                { text: 'Array', action: () => addInput(path, 'array') },
                { text: 'Object', action: () => addInput(path, 'object') },
            ]
        }
    }
}

type listsProps = {
    data: LineContent[];
    no_config?: boolean;
    full_addButton?: boolean;
}

export function ArrayType(props: inputsProps & listsProps) {
    // console.log('Array props: ', props);
    const [showList, setList] = createSignal(true);


    return (
        <>
            <InputButton text="[ ]" config={props.config}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
                    invisible group-hover/line:visible hover:border-slate-600 
                    active:border-slate-600/80 absolute"/>
            <Show when={showList()}
                fallback={<Toggle text={`[${props.data?.length}]`} isOpen={showList} setOpen={setList}
                    config={lineConfig(props.path)} show={!props.no_config} />}
            >
                <Toggle text="[" isOpen={showList} setOpen={setList} config={lineConfig(props.path)}
                    show={!props.no_config} />

                <div class="ArrayType w-full relative flex flex-col pl-6
                border-l-1 border-[#293B49] my-1">
                    <For each={props.data}>{(item, index) => {
                        updateStore([...props.path, index(), 'key'], index())

                        return (
                            <div class="w-full flex justify-between">
                                <h2 class="mr-2">{index()}.</h2>
                                <span class="flex-1">
                                    <NewLine type={item.type} index={index()}
                                        path={props.path} data={item.value} />
                                </span>
                            </div>
                        )
                    }}</For>
                    <InputButton config={addButtonConfig(props.path)} text={props.full_addButton ? undefined : '+1'}
                        class={`rounded-xl border-2 hover:border-slate-600 active:border-slate-700
                        ${props.full_addButton ? 'w-[95%] border-slate-700':'w-15 border-[#293B49]'}
                    `}
                    />
                </div>

                <Toggle text="]" isOpen={showList} setOpen={setList} config={lineConfig(props.path)}
                    show={!props.no_config} end />
            </Show>
        </>
    )
}

export function ObjectType(props: inputsProps & listsProps) {
    // console.log('Object Props: ', props);
    const [isShowing, setShow] = createSignal(true);


    return (
        <>
            <Show when={isShowing()} fallback={
                <Toggle text={`{${props.data?.length}}`} isOpen={isShowing} setOpen={setShow}
                    config={lineConfig(props.path)} show={!props.no_config} />
            }>
                <Toggle text="{" isOpen={isShowing} setOpen={setShow} config={lineConfig(props.path)}
                    show={!props.no_config} />

                <div class="ObjectType w-full flex flex-wrap pl-8 border-l-1 border-[#293B49] my-1">
                    <For each={props.data}>{(item, index) => {

                        return (
                            <NewLine path={props.path} type={item.type}
                                index={index()} data={item.value} key={item.key} >
                                <span class="Key flex justify-between">
                                    <input value={item.key} type="text" placeholder="Key name"
                                        onChange={e =>
                                            updateStore([...props.path, index(), 'key'], e.currentTarget.value)
                                        }
                                        style="field-sizing: content"
                                        class="KeyInput max-w-30 focus:outline-none focus:bg-stone-800 
                                    rounded-md self-start text-sky-300"/>
                                    <h2 class=":_Space mx-1">:</h2>
                                </span>
                            </NewLine>
                        )
                    }}</For>
                <InputButton config={addButtonConfig(props.path)} text={props.full_addButton ? undefined : '+1'}
                    class={`rounded-xl border-2 hover:border-slate-600 active:border-slate-700
                        ${props.full_addButton ? 'w-[95%] border-slate-700':'w-15 border-[#293B49]'}
                    `}
                    />
                    {/* mx-8 my-1  */}
                </div>

                <Toggle text="}" isOpen={isShowing} setOpen={setShow} config={lineConfig(props.path)}
                    show={!props.no_config} end />
            </Show>
        </>
    )
}

export function BooleanType(props: inputsProps & { data: boolean, key: string }) {

    function BoolCheck() { 
        return (
            <>
                <input type="checkbox" checked={props.data} 
                onClick={() => updateStore(props.path, !props.data)} />
                <p class="text-slate-600 select-all">{ props.data ? 'true' : 'false' }</p>
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
                duration-200 border-gray-600 cursor-pointer
                ${props.data ? "bg-[#4878F6]" : "bg-transparent"}
                    `} >
                    <span class={`
                    inline-block h-3 w-3 transform rounded-full transition-transform duration-200 
                    ease-in-out bg-white ${props.data ? "translate-x-6" : "translate-x-1"}
                        `} />
                </button>
                <p class="select-all">{ props.data ? 'true' : 'false' }</p>
            </>
        )
    }

    return (
        <span class="BooleanType group/n-line flex-1 flex relative">
            <span class="flex gap-2 text-[#9980FF] items-center">
                <Switch fallback={<BoolSwitch />}>
                    <Match when={props.key.endsWith('check')}><BoolCheck /></Match>
                    <Match when={props.key.endsWith('radio')}><BoolRadio /></Match>
                </Switch>
            </span>
            <InputButton text="#" config={lineConfig(props.path)}
                class="w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible group-hover/n-line:visible hover:border-slate-600 
            active:border-slate-600/80 absolute"/>
        </span>
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