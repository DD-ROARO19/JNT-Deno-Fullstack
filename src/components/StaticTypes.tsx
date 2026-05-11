import {
    createSignal,
    Show,
    For,
    Switch,
    Match
} from "solid-js";

import type { Accessor, Setter, JSXElement } from "solid-js";
import type {
    inputsProps, JSONPrimitive, LineContent, lineMenu, lineMenuParams, listsProps, typeOfInputs, keyType, path_list
} from "../types.tsx";

import { NewLine2 } from "./RowLines.tsx";
import { updateStore } from "../helpers.tsx";
import { prepareSearchPanel } from "../Search.tsx";
import { LineSettingsBtn, Toggle } from "./Toggle.tsx";
import { QuickMenuBtn } from "./QuickMenu.tsx";

const search_term = "__SEARCH"


type keyProps = inputsProps & { value: keyType; }

function KeyComp(props: keyProps) {
    return (
        <>
            <input value={props.value} type="text" placeholder="Key name"
                disabled={typeof props.value === 'number'}
                onChange={e => updateStore(props.path, e.currentTarget.value)}
                style="field-sizing: content"
                class="KeyInput text-wrap max-w-64 focus:outline-none focus:bg-app-base 
                rounded-md self-start text-app-property"/>
            <h2 class=":_Space mx-1">:</h2>
        </>
    )
}

type basicProps = inputsProps & { key?: KeyType }

type primitiveProps = basicProps

/** Component to display text. */
export function StringType(props: primitiveProps & { data: string }) {

    if (props.key === undefined) {
        return <span>No metadata for key</span>
    }

    return (
        <span class="StringType group/s-line flex-1 flex relative hover:bg-app-active/5 min-w-3/4">
            <KeyComp value={props.key} path={props.path.with(-1, 'key')} />
            <textarea placeholder="Bla Bla Bla..."
                value={
                    (typeof props.data === 'object') ? // is an object?
                        // JSON.stringify(extractValue(props.data, 'object', props.path), undefined, 4) 
                        JSON.stringify(props.data, undefined, 4)
                        : props.data
                }
                onChange={e => { updateStore(props.path, e.currentTarget.value); 
                    if(typeof props.key === 'string' && props.key?.toLocaleUpperCase() === search_term && props.data.toString().trim() !== "") {
                        prepareSearchPanel(e.currentTarget.value, props.path)
                    } 
                }}
                class="StringType flex-1 outline-none focus:bg-app-base rounded-md mr-8
                    min-h-6 field-sizing-content text-app-string"
            ></textarea>
            <LineSettingsBtn path={props.path} type="string" data={props.data} // config={[props.path, props.data, 'string']}
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
            <KeyComp value={props.key} path={props.path.with(-1, 'key')} />
            <input type="number" placeholder="0, 1 or more (or less)!"
                value={(props.data || props.data === 0 || typeof props.data === 'boolean') ? Number(props.data) : ''}
                onChange={e => updateStore(props.path, Number(e.currentTarget.value))}
                class="NumberType flex-1 outline-none focus:bg-app-base rounded-md mr-8
                text-app-number no-spin"
            />
            <LineSettingsBtn path={props.path} type="number" data={props.data} // config={[props.path, props.data, 'number']}
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
            <KeyComp value={props.key} path={props.path.with(-1, 'key')} />
            <span class="flex gap-2 text-app-keyword items-center">
                <Switch fallback={<BoolSwitch />}>
                    <Match when={typeof props.key === 'string' && props.key.endsWith('check')}><BoolCheck /></Match>
                    <Match when={typeof props.key === 'string' && props.key.endsWith('radio')}><BoolRadio /></Match>
                </Switch>
            </span>
            <LineSettingsBtn path={props.path} type="boolean" data={props.data} // config={[props.path, props.data, 'boolean']}
                hover_class="group-hover/b-line:visible" />
        </span>
    )
}


type objectProps = basicProps & listsProps;


function AddItemBtn(props: { path: path_list, type: 'object' | 'array', isFullWidth: boolean | undefined }) {
    return (
        <div class="w-full group" classList={{ 'hover:bg-app-active/5': props.isFullWidth != true }}>
            <QuickMenuBtn text={props.isFullWidth ? undefined : '+1'} path={props.path} type="null" data={null}
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
                    path={props.path} type="array" data={props.data} show
                    class="text-app-keyword" key={
                        <KeyComp value={props.key!} path={props.path.with(-1, 'key')} />}
                />}
            >
                <Toggle text="[" isOpen={showList} setOpen={setList} class="text-app-keyword"
                    path={props.path} type="array" data={props.data} show
                    key={<KeyComp value={props.key!} path={props.path.with(-1, 'key')} />} />
                <div class="Brake w-full" />

                <div class="ArrayType w-full pl-8 border-l-1 border-app-muted my-1 
                text-app-text focus-within:border-app-active-secondary/50">
                    <For each={props.data}>{(item, index) => {
                        updateStore([...props.path, index(), 'key'], index())
                        return <NewLine2 path={props.path} index={index()}
                            type={item.type} data={item.value} key={index()} />
                    }}</For>
                </div>

                <Toggle text="]" isOpen={showList} setOpen={setList} class="text-app-keyword"
                    path={props.path} type="array" data={props.data} show end />
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

    return (
        <>
            <Show when={isShowing()} fallback={
                <Toggle text={`{${props.data?.length}}`} isOpen={isShowing} setOpen={setShow}
                    path={props.path} type="object" data={props.data} show={!props.no_config}
                    class="text-app-function"
                    key={<Show when={!(props.no_config)}>
                        <KeyComp value={props.key!} path={props.path.with(-1, 'key')} />
                    </Show>} />
            }>
                <Toggle text="{" isOpen={isShowing} setOpen={setShow} class="text-app-function"
                    path={props.path} type="object" data={props.data} show={!props.no_config}
                    key={<Show when={!(props.no_config)}>
                        <KeyComp value={props.key!} path={props.path.with(-1, 'key')} />
                    </Show>} />
                <div class="Brake w-full" />

                <div class="ObjectType w-full pl-8 border-l-1 border-app-muted my-1 
                text-app-text focus-within:border-app-active-secondary/50">
                    <For each={props.data}>{(item, index) =>
                        <NewLine2 path={props.path} index={index()}
                            type={item.type} data={item.value} key={item.key?.toString() ?? ''} />
                    }</For>

                    <Show when={props.full_addButton}>
                        <AddItemBtn path={props.path} type="object" isFullWidth={props.full_addButton} />
                        <LineSettingsBtn path={props.path} data={props.data} type="object" // config={[props.path, props.data, 'object']} 
                        />
                    </Show>
                </div>

                <Toggle text="}" isOpen={isShowing} setOpen={setShow} class="text-app-function"
                    path={props.path} type="object" data={props.data} show={!props.no_config} end />
            </Show>
        </>
    )
}

function NullType(props: primitiveProps & { data: string }) {

    if (props.key === undefined) {
        return <span>No metadata for key</span>
    }

    return (
        <span class="StringType group/s-line flex-1 flex relative hover:bg-app-active/5 min-w-3/4">
            <KeyComp value={props.key} path={props.path.with(-1, 'key')} />
            <p
                class="NullType flex-1 outline-none focus:bg-app-base rounded-md mr-8
                    min-h-6 field-sizing-content text-app-keyword"
            >null</p>
            <Prim_settingsBtn config={[props.path, props.data, 'string']}
                hover_class="group-hover/s-line:visible" />
        </span>
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