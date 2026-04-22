import {
    createSignal,
    Show,
    For,
    Switch,
    Match
} from "solid-js";

import type { Accessor, Setter, JSXElement } from "solid-js";
import type {
    inputsProps, JSONPrimitive, LineContent, lineMenu,
    lineMenuParams,
    listsProps, typeOfInputs
} from "../types.tsx";

// import { Toggle } from "./Toggle.tsx";
import { NewLine2 } from "./RowLines.tsx";
import { addInput, updateStore, changeInput, eraseInput, copyToClipboard } from "../helpers.tsx";
import { DownArrow } from "../assets/svgs.tsx";
import { InputButton } from "./Select.tsx";
import { LineSettingsBtn,
    MA_settingsBtn, Obj_settingsBtn, Prim_settingsBtn 
} from "./LineSettingsBtn.tsx";




// function lineConfig(path: (string | number)[], data: JSONPrimitive | LineContent[], type: typeOfInputs): lineMenu {
//     return {
//         primary_inputs: {
//             title: 'Change type',
//             buttons: [
//                 { text: 'String', action: () => changeInput(path, 'string') },
//                 { text: 'Number', action: () => changeInput(path, 'number') },
//                 { text: 'Boolean', action: () => changeInput(path, 'boolean') },
//                 { text: 'Array', action: () => changeInput(path, 'array') },
//                 { text: 'Object', action: () => changeInput(path, 'object') }
//             ]
//         },
//         extra_options: [
//             { text: 'Erase item', action: () => eraseInput(path) },
//             { text: 'Copy value', action: () => copyToClipboard(data, type, path) },
//         ]
//     }
// }


type keyProps = inputsProps & { value: string; }

function KeyComp(props: keyProps) {
    return (
        <>
            <input value={props.value} type="text" placeholder="Key name"
                onChange={e => updateStore(props.path, e.currentTarget.value)}
                style="field-sizing: content"
                class="KeyInput text-wrap max-w-64 focus:outline-none focus:bg-app-base 
                rounded-md self-start text-app-property"/>
            <h2 class=":_Space mx-1">:</h2>
        </>
    )
}

type basicProps = inputsProps & { key?: string }

type primitiveProps = basicProps

/** Component to display text. */
export function StringType(props: primitiveProps & { data: string }) {

    if (props.key === undefined) {
        return <span>No metadata for key</span>
    }

    return (
        <span class="StringType group/s-line flex-1 flex relative hover:bg-app-active/5 min-w-3/4">
            <KeyComp value={props.key.toString()} path={props.path.with(-1, 'key')} />
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
            <Prim_settingsBtn config={[props.path, props.data, 'string']}
                hover_class="group-hover/s-line:visible" />
        </span>
    )
}

/** Component to display numbers */
function NumberType(props: primitiveProps & { data: number }) {

    if (props.key === undefined) {
        return <span>No metadata for key</span>
    }

    return (
        <span class="NumberType group/n-line flex-1 flex relative hover:bg-app-active/5">
            <KeyComp value={props.key.toString()} path={props.path.with(-1, 'key')} />
            <input type="number" placeholder="0, 1 or more (or less)!"
                value={(props.data || props.data === 0 || typeof props.data === 'boolean') ? Number(props.data) : ''}
                onChange={e => updateStore(props.path, Number(e.currentTarget.value))}
                class="NumberType flex-1 outline-none focus:bg-app-base rounded-md mr-8
                text-app-number no-spin"
            />
            <Prim_settingsBtn config={[props.path, props.data, 'number']}
                hover_class="group-hover/n-line:visible" />
        </span>
    )
}

/** Component that displays a boolean value in diferent styles depending on its key. */
function BooleanType(props: primitiveProps & { data: boolean }) {

    if (props.key === undefined) {
        return <span>No metadata for key</span>
    }

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
            <KeyComp value={props.key.toString()} path={props.path.with(-1, 'key')} />
            <span class="flex gap-2 text-app-keyword items-center">
                <Switch fallback={<BoolSwitch />}>
                    <Match when={props.key.endsWith('check')}><BoolCheck /></Match>
                    <Match when={props.key.endsWith('radio')}><BoolRadio /></Match>
                </Switch>
            </span>
            <Prim_settingsBtn config={[props.path, props.data, 'boolean']}
                hover_class="group-hover/b-line:visible" />
        </span>
    )
}


function Toggle(props: {
    class: string,
    text: string, config: lineMenuParams; end?: boolean, show: boolean;
    isOpen: Accessor<boolean>, setOpen: Setter<boolean>,
    key?: JSXElement
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
                    <Obj_settingsBtn config={props.config}
                        hover_class="group-hover:visible" />
                </Show>

            </span>
        </>
    )
}




// ##  OBJECT COMPONENTS  ##

type objectProps = basicProps & listsProps;

// function addButtonConfig(path: (string | number)[], data: LineContent[], type: typeOfInputs): lineMenu {
//     return {
//         primary_inputs: {
//             title: 'Add input',
//             buttons: [
//                 { text: 'String', action: () => addInput(path, 'string') },
//                 { text: 'Number', action: () => addInput(path, 'number') },
//                 { text: 'Boolean', action: () => addInput(path, 'boolean') },
//                 { text: 'Array', action: () => addInput(path, 'array') },
//                 { text: 'Object', action: () => addInput(path, 'object') },
//             ]
//         },
//         extra_options: [
//             { text: 'Erase item', action: () => eraseInput(path) },
//             { text: 'Copy value', action: () => copyToClipboard(data, type, path) },
//             {
//                 text: 'Change type',
//                 action: () => { },
//                 subButtons: [
//                     { text: 'String', action: () => changeInput(path, 'string') },
//                     { text: 'Number', action: () => changeInput(path, 'number') },
//                     { text: 'Boolean', action: () => changeInput(path, 'boolean') },
//                     { text: 'Array', action: () => changeInput(path, 'array') },
//                     { text: 'Object', action: () => changeInput(path, 'object') }
//                 ]
//             }
//         ]
//     }
// }

function AddItemBtn(props: { config: lineMenu, isFullWidth: boolean | undefined }) {
    return (
        <div class="w-full group" classList={{ 'hover:bg-app-active/5': props.isFullWidth != true }}>
            <InputButton config={props.config} text={props.isFullWidth ? undefined : '+1'}
                class={`rounded-xl border-2 border-app-muted/50 
                    hover:border-app-property/30 active:border-app-muted active:bg-app-surface-secondary
                    ${props.isFullWidth ? 'w-[95%]' : 'w-15 group-hover:border-app-property/10'}
                `}
            />
        </div>
    )
}

/** Component for rendering an list of values. */
export function ArrayType(props: Omit<objectProps, 'no_config' | 'full_addButton'>) {
    const [showList, setList] = createSignal(true);

    if (props.key === undefined) {
        return <span>No metadata for key</span>
    }

    return (
        <>
            <Show when={showList()}
                fallback={<Toggle text={`[${props.data?.length}]`} isOpen={showList} setOpen={setList}
                    config={[props.path, props.data, 'array']} show
                    class="text-app-keyword" key={
                        <KeyComp value={props.key!} path={props.path.with(-1, 'key')} />}
                />}
            >
                <Toggle text="[" isOpen={showList} setOpen={setList} class="text-app-keyword"
                    config={[props.path, props.data, 'array']} show
                    key={<KeyComp value={props.key!} path={props.path.with(-1, 'key')} />} />
                <div class="Brake w-full" />

                <div class="ArrayType w-full pl-8 border-l-1 border-app-muted my-1 
                text-app-text focus-within:border-app-active-secondary/50">
                    <For each={props.data}>{(item, index) => {
                        updateStore([...props.path, index(), 'key'], index().toString())
                        return <NewLine2 path={props.path} index={index()}
                            type={item.type} data={item.value} key={index().toString()} />
                    }}</For>
                </div>

                <Toggle text="]" isOpen={showList} setOpen={setList} class="text-app-keyword"
                    config={[props.path, props.data, 'array']} show end />
            </Show>
        </>
    )
}

/** Component to render groups of `key` - `value` pairs. */
export function ObjectType(props: objectProps) {
    const [isShowing, setShow] = createSignal(true);

    if (props.key === undefined && props.no_config != true) {
        return <span>No metadata for key</span>
    }

    const add = {
        primary_inputs: {
            open: true,
            title: 'Add input',
            buttons: [
                { text: 'String', action: () => addInput(props.path, 'string') },
                { text: 'Number', action: () => addInput(props.path, 'number') },
                { text: 'Boolean', action: () => addInput(props.path, 'boolean') },
                { text: 'Array', action: () => addInput(props.path, 'array') },
                { text: 'Object', action: () => addInput(props.path, 'object') },
            ]
        }
    }

    return (
        <>
            <Show when={isShowing()} fallback={
                <Toggle text={`{${props.data?.length}}`} isOpen={isShowing} setOpen={setShow}
                    config={[props.path, props.data, 'object']} show={!props.no_config}
                    class="text-app-function"
                    key={<Show when={!(props.no_config)}>
                        <KeyComp value={props.key!} path={props.path.with(-1, 'key')} />
                    </Show>} />
            }>
                <Toggle text="{" isOpen={isShowing} setOpen={setShow} class="text-app-function"
                    config={[props.path, props.data, 'object']} show={!props.no_config}
                    key={<Show when={!(props.no_config)}>
                        <KeyComp value={props.key!} path={props.path.with(-1, 'key')} />
                    </Show>} />
                <div class="Brake w-full" />

                <div class="ObjectType w-full pl-8 border-l-1 border-app-muted my-1 
                text-app-text focus-within:border-app-active-secondary/50">
                    <For each={props.data}>{(item, index) =>
                        <NewLine2 path={props.path} index={index()}
                            type={item.type} data={item.value} key={item.key} />
                    }</For>

                    <Show when={props.full_addButton}>
                        <AddItemBtn config={add} isFullWidth={props.full_addButton} />
                        <MA_settingsBtn config={[props.path, props.data, 'object']} />
                    </Show>
                </div>

                <Toggle text="}" isOpen={isShowing} setOpen={setShow} class="text-app-function"
                    config={[props.path, props.data, 'object']} show={!props.no_config} end />
            </Show>
        </>
    )
}


export const statics = {
    string: StringType,
    number: NumberType,
    array: ArrayType,
    object: ObjectType,
    boolean: BooleanType,
    null: () => <span>null</span>,
};