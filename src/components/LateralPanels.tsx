// @ts-types="solid-js"
import {
    createResource,
    createSignal,
    Show,
    For,
    createEffect,
    Switch,
    Match,
    createMemo
} from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { isLoading, setLoadingState } from "../signals.tsx";
import { reset_searchParams, searchParams, upd_searchParams } from "../stores.tsx";
import { Arrow, Loading, Erase, ReloadArrow, Edit, Shuffle, Cancel } from "../assets/svgs.tsx";
import { ObjectType } from "./StaticTypes.tsx";
import { StringType } from "./InputTypes.tsx"
import { deletePattern, query_patterns, SearchError, searchLink, toggleLateralCard, uploadPattern } from "../Search.ts";
import { addInput, askMyType, formatValue, updateStore } from "../helpers.tsx";
import type { typeOfInputs, JSONValue, JSONObject, patternQuery } from "../types.tsx";
import type { pattern } from "../../types.ts";
import type { SetStoreFunction } from "solid-js/store";
import type { JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";


// type patternStoreType = {
//     pattern: pattern,
//     updater: SetStoreFunction<pattern>
// }
export function SearchPanel() {
    const [selectedMenu, selectMenu] = createSignal<'existing' | 'new' | 'none'>('none');
    const [newPattern, updateNewPattern] = createStore<pattern>({ title: '', keys: [] })
    const [currentStore, changeCurrentStore] = createSignal<pattern>(newPattern)
    const [storeSetter, changeStoreSetter] = createSignal<SetStoreFunction<pattern>>(updateNewPattern)
    const [result, setResult] = createSignal<JSONValue>()
    const [areNewSignal, set_areNewSignal] = createSignal(false)

    const [patterns, { refetch, mutate }] = createResource(() => query_patterns())
    
    createEffect(() => {
        if (patterns.state === 'ready' && patterns().length === 0) selectMenu("new");
    });

    createEffect(() => {
        if(selectedMenu() === 'none') changeCurrentStore({ title: '', keys: [] });
    })

    function reset_panel() { updateNewPattern( reconcile({ title: '', keys: [] }) ); refetch() }

    function addProperty() {
        const updater = storeSetter()
        if(!updater) throw new SearchError("UNDEFINED_STORE");

        updater('keys', list => [...list, { key: "", val: "", type: 'alter' }]) 
    };
    function removeProperty(event: MouseEvent, index: number) { 
        const updater = storeSetter()
        if(!updater) throw new SearchError("UNDEFINED_STORE");

        if (index === -1) {
            updater('keys', list => list.slice(0, -1)) 
        }
        
        if (event.button === 1) {
            event.preventDefault();
            updater('keys', list => list.filter((_, i) => i !== index )) 
        }
    };


    function TabBtn(props: { option: 'new' | 'existing', title: string }) {
        const selected_menu = createMemo(() => selectedMenu() === props.option);

        return (
        <span class="bg-app-element rounded-xl transition-discrete duration-100 ease-in z-1" >
            <button type="button" class="rounded-md active:bg-transparent flex w-full"
            classList={{
                "rounded-xl bg-app-active/60 hover:bg-app-active/80": selected_menu(),
                "hover:bg-app-active/30": !selected_menu(),
                "bg-app-active-secondary/50": areNewSignal() && props.option === 'existing'
            }}
            onclick={() => { selectMenu(p => p === props.option ? 'none' : props.option); if(selected_menu()) set_areNewSignal(false); }} >
                <Arrow class={"fill-app-surface-secondary " + (selected_menu() ? 'rotate-0' : 'rotate-270 fill-app-text/60')} />
                <p class={"font-medium " + (selected_menu() ? 'text-app-surface-secondary' : 'text-app-text/60')} >{props.title}</p>
            </button>
        </span>
        )
    };


    const [saveValidation, toggle_saveValidation] = createSignal<boolean>(false);
    function NewPattern() {
        // const [patternName, setPatternName] = createSignal<string>()

        createEffect(() => { if (selectedMenu() === 'new') {
            changeCurrentStore(newPattern)
            changeStoreSetter(_ => updateNewPattern)
        } })
        
        /** Toggle between fist validating the selection & then saving when re-validated. */
        async function savePattern() {
            if(!saveValidation()) return toggle_saveValidation(p => !p);
            try {
                if (newPattern.title.trim() === "") throw new SearchError("INVALID_PATTERN", 'Please fill a name to save this pattern');
    
                await uploadPattern(newPattern)
    
                console.debug('saved!', newPattern);
                toggle_saveValidation(false);
                // mutate(
                //     prev => prev ? 
                //     [...prev, { id: prev.at(-1)!.id + 1, author: 'USER', title: newPattern.title, pattern: newPattern}] 
                //     : [{ id: 0, author: 'USER', title: newPattern.title, pattern: newPattern}]
                // )
                refetch()
                set_areNewSignal(true)
            } catch (_) {/* not on use */}
        }

        // ### RETURN: `NewPattern()` JSXElement Result
        return (
            <>
                {/* Pattern name */}
                <Show when={saveValidation()}>
                    <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
                    outline-0 mt-2">
                        <input id="pattern_name"
                            type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                        bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                        text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                            placeholder="A name for this new query pattern"
                            autocomplete="off"
                            value={newPattern.title} onChange={e => updateNewPattern('title', e.currentTarget.value)}
                        />
                        <label for="pattern_name"
                            class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-2.5 z-10 origin-[0] 
                        px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                        peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                        peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                        start-1 pointer-events-none text-app-function">New pattern name</label>
                        
                        <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                        onclick={() => updateNewPattern('title', "")}>
                        <Erase class="fill-app-text/30" /></button>
                    </div>
                </Show>
                
                {/* Aditional properties */}
                <For each={newPattern.keys}>{(property, index) => 
                    <span class="flex group" onAuxClick={e => removeProperty(e, index())}>
                        <Dynamic 
                        component={key_elements[property.type]}
                        store_value={property}
                        store_setter={updateNewPattern}
                        index={index()}
                        />
                        {/* # ALT: group-hover:not-group-focus-within:grid-cols-[1fr]  */}
                        <div class="h-auto w-auto mt-2 grid transition-[grid-template-columns] duration-250 ease-in-out grid-cols-[0fr]
                        group-hover:grid-cols-[1fr]">
                            <button type="button" class="overflow-hidden cursor-pointer ps-1" onClick={() => updateNewPattern('keys', index(), 'type', 
                                type => type === 'alter' ? 'unwrap' 
                                : type === 'unwrap' ? 'attach' 
                                : 'alter'
                            )}> 
                                {/* <p class="text-app-text text-center text-xl font-bold">~</p>  */}
                                <Shuffle class="fill-app-text -rotate-90 h-6 w-6" option={1} />
                            </button>
                        </div>
                    </span>
                    // <Key_Renaming store_value={property} index={index()} store_setter={updateNewPattern} remove_fun={removeProperty} />
                }</For>

                <span class="flex mt-2 px-0.5 gap-1.5">
                    <button type="button" class="flex-1 bg-app-surface border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                    active:text-app-surface-secondary
                    text-app-text" onclick={e => removeProperty(e, -1)}>-</button>
                    <button type="button" class="flex-1 bg-app-surface border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                    active:text-app-surface-secondary
                    text-app-text" onclick={addProperty}>+</button>
                    <button type="button" class="flex-1 bg-app-surface border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                    active:text-app-surface-secondary
                    text-app-text" onclick={savePattern} classList={{ "grow-2": saveValidation() }} >{saveValidation() ? 'Confirm Save' : 'Save?'}</button>
                </span>
            </>
        )
    }
    function CurrentPatterns(props: { list: patternQuery[] }) {
        const [filedPattern, updateFiledPattern] = createStore<pattern>({ title: '', keys: [] })

        createEffect(() => { if (selectedMenu() === 'existing') {
            changeCurrentStore(filedPattern)
            changeStoreSetter(_ => updateFiledPattern)
        } })

        console.log('log list => ', props.list);
        const [openedPattern, openPattern] = createSignal<number | undefined>(undefined);

        createEffect(() => { 
            const index = openedPattern();
            (index !== undefined) ? 
                updateFiledPattern(JSON.parse(props.list[index].pattern) as pattern)
                : updateFiledPattern( reconcile({ title: '', keys: [] }) )
        })

        function PatternProperties(p: pattern) {
            // console.log('pattern: ', p);
            // ### RETURN: `PatternProperties()` JSXElement Result - Pattern´s Individual keys
            return (
                <div class="grid grid-cols-1">
                    {/* <p class="text-app-property">Packet Name: {p.packet_name}</p> */}
                    {/* <Show when={p.packet_name && p.packet_name?.trim() !== ""}>
                    </Show> */}
                    <Show when={p.keys && p.keys.length >= 1} fallback={ <h2 class="text-app-keyword ps-2.5">keys: [0]</h2> }>
                        <h2 class="text-app-keyword ps-2.5">keys: [</h2>
                        <For each={p.keys}>{(property) =>
                            <Dynamic 
                            component={static_key_elements[property.type] 
                                || static_key_elements['alter'] // # TEMP (# DELETE): this is only temporary; the next time the db is restarted `type` will be in use.
                            }
                            {...property}
                            />
                            // <Static_Renaming {...property} />
                        }</For>
                        <h2 class="text-app-keyword ps-2.5">]</h2>
                    </Show>
                </div>
            )
        }

        function PatternItem(p: { item: patternQuery, index: number }) {
            const isOpen = createMemo(() => openedPattern() === p.index)
            // const patternValue = createMemo(() => { if(isOpen()) return JSON.parse(item.pattern) as pattern } )
            const [patternValue, set_patternValue] = createSignal<pattern>()
            const [confirm, set_confirmation] = createSignal<'inactive' | 'needed_del' | 'needed_upd'>('inactive')
            const [isEditing, activeEdit] = createSignal(false)
            const [edit_store, set_edit_store] = createStore<pattern>({ title: '', keys: [] })

            function EditProperties(p: pattern) {
                const clone_data = structuredClone(unwrap({...p}));
                set_edit_store(clone_data);
                changeStoreSetter(_ => set_edit_store)
                // ### RETURN: `EditProperties()` JSXElement Result - For editting a pattern´s keys.
                return (
                    <div class="grid grid-cols-1">
                        {/* <p class="text-app-property">Packet Name: {p.packet_name}</p> */}
                        {/* <Show when={p.packet_name && p.packet_name?.trim() !== ""}>
                        </Show> */}
                        <Show when={edit_store.keys && edit_store.keys.length >= 1} fallback={ <h2 class="text-app-keyword ps-2.5">keys: [0]</h2> }>
                            <h2 class="text-app-keyword ps-2.5">keys: [</h2>
                            <For each={edit_store.keys}>{(property, index) =>
                                <span class="flex group ps-2 pe-1 pt-1" onAuxClick={e => removeProperty(e, index())}>
                                    <Dynamic 
                                    component={edit_key_elements[property.type] 
                                        || edit_key_elements['alter'] // # TEMP (# DELETE): this is only temporary; the next time the db is restarted `type` will be in use.
                                    }
                                    index={index()}
                                    store_setter={set_edit_store}
                                    store_value={property}
                                    />
                                    {/* # ALT: group-hover:not-group-focus-within:grid-cols-[1fr]  */}
                                    <div class="h-auto w-auto mt-2 grid transition-[grid-template-columns] duration-250 ease-in-out grid-cols-[0fr]
                                    group-hover:grid-cols-[1fr]">
                                        <button type="button" class="overflow-hidden cursor-pointer ps-1" onClick={() => set_edit_store('keys', index(), 'type', 
                                            type => type === 'alter' ? 'unwrap' 
                                            : type === 'unwrap' ? 'attach' 
                                            : 'alter'
                                        )}> 
                                            {/* <p class="text-app-text text-center text-xl font-bold">~</p>  */}
                                            <Shuffle class="fill-app-text -rotate-90 h-6 w-6" option={1} />
                                        </button>
                                    </div>
                                </span>
                            }</For>
                            <span class="flex mt-1.5 px-2 gap-2">
                                <button type="button" class="flex-1 bg-app-surface-secondary border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                                active:text-app-surface-secondary
                                text-app-text" onclick={e => removeProperty(e, -1)}>-</button>
                                <button type="button" class="flex-1 bg-app-surface-secondary border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                                active:text-app-surface-secondary
                                text-app-text" onclick={addProperty}>+</button>
                            </span>
                            <h2 class="text-app-keyword ps-2.5">]</h2>
                        </Show>
                    </div>
                )
            }

            /** Open one pattern & toggle it if's the same */
            function select_pattern(pattern_index: number, pattern: string) {
                set_confirmation('inactive');
                // activeEdit(false);
                openPattern(p => {
                if (p === pattern_index && p !== undefined) return undefined; 
                // const formated = JSON.parse(pattern) as pattern; 
                // console.log('Formated pattern =>', formated); 
                if (!patternValue()) set_patternValue(JSON.parse(pattern) as pattern); 
                return pattern_index;
            })}

            /** This just make sure the buttons don't trigger a refresh. */
            function handle_action<T>(e: MouseEvent, action?: () => T) {
                e.stopPropagation();
                e.preventDefault();
                if(action) action();
            }

            /** Confirms & deletes one pattern */
            function erase_pattern() { 
                if(confirm() !== 'needed_del') return set_confirmation('needed_del');
                try{ 
                    deletePattern(p.item.id); 
                    console.debug(`Pattern ${p.item.title} (id: ${p.item.id}) deleted!`); 
                    mutate(prev => [...prev!.slice(0, p.index), ...prev!.slice(p.index +1)])
                    openPattern(undefined);
                    set_confirmation('inactive')
                }catch(err){ console.error(err) } 
            };
            /** Handles logic to activate the edition & posterior upload of new values for a recored pattern */
            async function toggle_edit_pattern() {
                if(!isEditing()) return activeEdit(true);
                if(confirm() !== 'needed_upd') return set_confirmation('needed_upd');
                
                await uploadPattern(edit_store, p.item.id)
                console.debug('Edit pattern!')
                set_patternValue(edit_store)
                set_confirmation('inactive'); activeEdit(false);
            };
            function cancel_edit() { activeEdit(false); set_confirmation('inactive') }
            
            const confirmation_strings = {
                inactive: '',
                needed_del: "re-confirm delete: ",
                needed_upd: "re-confirm update: ",
            }
            const Class = `fill-app-text h-4 w-4 group-hover:fill-app-text/50 group-active:fill-app-surface-secondary/50`;
            
            // ### RETURN: `PatternItem()` JSXElement Result - Individual Pattern
            return (
            <div class="relative bg-app-surface border-app-element border-2 rounded-lg text-md font-semibold
            outline-0 mt-2 flex flex-col" >
                <span class="flex w-full hover:not-focus-within:bg-app-active/50 rounded-md" onclick={() => select_pattern(p.index, p.item.pattern) }>
                    <Arrow class={"fill-app-text/60 " + (isOpen() ? 'rotate-0' : 'rotate-270')} />
                    <Show when={isEditing()} fallback={ <h2 class="text-app-function">{patternValue()?.title || p.item.title}</h2> }>
                        <input class="text-app-string placeholder-app-function/75 outline-0 border-0"
                        onClick={e => handle_action(e)}
                        placeholder="Insert pattern name..."
                        value={edit_store.title} onChange={e => set_edit_store('title', e.currentTarget.value)} />
                    </Show>
                    {/* Delete - Edit | Buttons */}
                    <span class="invisible absolute end-0 grid grid-flow-col gap-2 pt-1 pe-2" classList={{
                        "visible": isOpen()
                    }}>
                        <p class="text-sm text-app-text -mb-1" classList={{ "col-start-[none]": confirm() === 'needed_upd' }}>{ confirmation_strings[confirm()] }</p>
                        <Show when={isEditing()} fallback={
                            <button type="button" class="cursor-pointer group" onclick={e => handle_action(e, erase_pattern)}> <Erase class={Class} /> </button> }>
                            <button type="button" class="cursor-pointer group" onclick={e => handle_action(e, cancel_edit)}> <Cancel option={1}  class={Class} /> </button>
                        </Show>
                        <Show when={isEditing()} fallback={
                            <button type="button" class="cursor-pointer group" onclick={e => handle_action(e, toggle_edit_pattern)}> <Edit class={Class} option={1} /> </button> }>
                            <button type="button" class="cursor-pointer group" onclick={e => handle_action(e, toggle_edit_pattern)}> <Edit class={Class} option={2} /> </button>
                        </Show>
                    </span>
                </span>
                <div class="grid transition-[grid-template-rows] duration-250 ease-in-out grid-rows-[0fr] invisible"
                classList={{ "grid-rows-[1fr] visible": isOpen() }}
                >
                    <span class="overflow-hidden" >
                        {/* <textarea class="text-app-string w-full field-sizing-content" 
                        value={p.item.pattern} disabled /> */}
                        <Show when={patternValue()}>
                        { (pattern) => <Show when={isEditing()} fallback={ 
                            <PatternProperties {...pattern()} /> }>
                            <EditProperties {...pattern()} />
                        </Show>
                        }
                        </Show>
                        {/* <Switch>
                            <Match when={patternValue()}>{ (pattern) => <PatternProperties {...pattern()} /> }</Match>
                            <Match when={isEditing()}>{ <PatternProperties {...patternValue()} /> }</Match>
                        </Switch> */}
                    </span>

                </div>
            </div>
            )
        }
        
        return (
            <For each={props.list}>{(item, i) => <PatternItem index={i()} item={item} /> }</For>
        );
    }


    function closeSearch() { selectMenu('none'); toggleLateralCard(); toggle_saveValidation(false); setLoadingState("nope"); reset_searchParams() }
    async function search() {
        setLoadingState("indeed");
        try {
            const store = currentStore();
            if(!store) throw new SearchError("UNDEFINED_STORE");
            
            console.log('Object? ', store);
            if (store.keys.length >= 1) {
                for (let i = 0; i < store.keys.length; i++) {

                    if (store.keys[i].key.toString().trim() === "") { console.debug(store.keys[i]); throw new SearchError("SEARCH_FORM_EMPTY"); }
                }
            }
            // if(storedPattern.keys.length < 1) throw new SearchError("SEARCH_FORM_EMPTY");

            const newObject = await searchLink(store)
            console.log('Resulting Object > ', newObject);
            setResult(newObject)
            setLoadingState("finished");
        } catch (err) {
            // setLoadingState("nope");
            if (err instanceof Error && !(err instanceof SearchError)) console.error(err);
            setLoadingState("nope");
        }
    }

    function add_newline(value: JSONValue | undefined, where: 'on_parent' | 'on_root' = 'on_parent') {
        if(!value) return;
        if(!searchParams.path) throw new SearchError("UNDEFINED_SEARCH_PARAMS", 'Path missing');

        const path = (where === 'on_root') ? ["content"] : searchParams.path.slice(0, -2);
        console.log('NewLine path => ', {path, where, value});

        try {
            const index = addInput(path, askMyType(value)); console.log('index? => ', index);
            if(!index) throw new SearchError("APPLY_ERROR", 'Could get new item index!');

            updateStore([...path, index], formatValue(value));
            updateStore([...path, index, 'key'], searchParams.resultName || currentStore()?.title || '')
            
            const ind = addInput(path, askMyType(null));
            if(!ind) throw new SearchError("APPLY_ERROR", 'Could get new item index!');
            updateStore([...path, ind], formatValue(null));
            updateStore([...path, ind, 'key'], 'null_test')

            // for(const [k, v] of Object.entries(value)) {
            //     console.log('add_nl {} =>', [k, v]);

            //     const index = addInput(path, 'array'); console.log('index? => ', index);
            //     if(!index) throw new SearchError("APPLY_ERROR", 'Could get new item index!')

            //     updateStore([...path, index], formatValue(v))
            //     updateStore([...path, index, 'key'], k)
            // }
        } catch (err) { console.error(err) }
    }
    function applyResult() {
        const res = result();
        console.log("searchParams: ", searchParams.url, searchParams.path);
        
        if(!res) throw new SearchError("UNDEFINED_RESULT");
        if(!searchParams.path) throw new SearchError("UNDEFINED_SEARCH_PARAMS", 'Path missing');
        
        setLoadingState("indeed")
        upd_searchParams("formatedResult", formatValue(res))
        setLoadingState("finished")
        if(!searchParams.formatedResult) throw new SearchError("ERROR_WHILE_FORMATING_RESULT") ;

        updateStore(searchParams.path.slice(0, -1), searchParams.formatedResult);
        if(searchParams.resultName || currentStore()?.title) updateStore(searchParams.path.with(-1, 'key'), searchParams.resultName || currentStore()?.title || '');
        add_newline(searchParams.extra_results);
    }

    // ### RETURN: `SearchPanel()` JSXElement Result
    return (
        // Lateral Panel
        <span class="flex flex-col select-none">
        
        {/* Search Pattern */}
        <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >
            {/* TITLE + Buttons for the panel */}
            <span class="flex place-content-between">
                <h1 class="text-app-function text-xl font-semibold">Search / Patterns</h1>
                <ReloadArrow onclick={reset_panel} class="fill-app-text/60" />
            </span>
            {/* Current URL to search */}
            <input disabled value={searchParams.url} 
            class="text-app-string" />
            
            {/* Seccion for current patterns */}
            <Show when={patterns.state === 'ready' && patterns().length > 0}>
                <TabBtn option="existing" title={"Existing search patterns" + (areNewSignal() ? ' (new patterns!)' : '')} />
                <div class="grid transition-[grid-template-rows] duration-200 ease-in-out grid-rows-[0fr] -mt-3 mb-3"
                classList={{ "grid-rows-[1fr]": selectedMenu() === 'existing' }}>
                    <div class="overflow-hidden">
                        <div class="bg-app-surface-secondary rounded-lg py-3 p-2 pt-4 z-0">
                            <CurrentPatterns list={patterns()!} />
                        </div>
                    </div>
                </div>
            </Show>
            {/* Seccion for new patterns */}
            <TabBtn option="new" title="New search patterns" />
            <div class="grid transition-[grid-template-rows] duration-200 ease-in-out grid-rows-[0fr] -mt-3 mb-3"
            classList={{ "grid-rows-[1fr]": selectedMenu() === 'new' }}>
                <div class="overflow-hidden">
                    <div class="bg-app-surface-secondary rounded-lg p-2 py-3 pt-4 z-0">
                        <NewPattern />
                    </div>
                </div>
            </div>
            
            {/* CANCEL + SEARCH - Buttons */}
            <span class="w-auto flex justify-between mt-1.5 px-5">
                {/* 1st Space */} <span class="flex-1" />

                <button type="button" class="flex-10 shrink bg-app-active rounded-2xl p-0.5 font-medium border-2 
                border-app-muted/50 active:bg-app-active-secondary/70 hover:bg-app-active-secondary text-app-surface-secondary"
                    onclick={closeSearch}
                >Cancel</button>

                {/* 2nd Space */} <span class="flex-6" />

                <button type="button" class="flex-10 shrink bg-app-active rounded-2xl p-0.5 font-medium border-2 
                border-app-muted/50 active:bg-app-active-secondary/70 hover:bg-app-active-secondary text-app-surface-secondary"
                    onclick={search}
                >Search</button>

                {/* 3rd Space */} <span class="flex-1" />
            </span>
        </div>

        {/* Search Result */}
        <Show when={isLoading() !== "nope" }>
            <ResultPanel result={result()} panel_btns={
            () => <>
                <button type="button" 
                class="px-13 bg-app-active rounded-2xl p-0.5 font-medium border-2 
                border-app-muted/50 active:bg-app-active-secondary/70 hover:bg-app-active-secondary 
                text-app-surface-secondary" 
                onclick={applyResult}
                >Apply</button>
                <button type="button" 
                class="px-13 bg-app-active rounded-2xl p-0.5 font-medium border-2 
                border-app-muted/50 active:bg-app-active-secondary/70 hover:bg-app-active-secondary 
                text-app-surface-secondary" 
                onclick={() => add_newline(result())}>New Line</button>
            </>
            } />
        </Show>
        
        </span>
    )
}

/** Renders the result from the search. */
function ResultPanel(props: { result: JSONValue | undefined, sub_title?: string, panel_btns?: () => JSXElement }) {
    // ### RETURN: `ResultPanel()` JSXElement Result
    return (
    <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >

        {/* SubTitle & Button */}
        <span class="flex place-content-between mr-1 mb-2"> 
            <h1 class="text-app-function text-xl font-semibold mt-0.5">{props.sub_title || 'Result'}</h1>
            <Show when={props.result} >{ (_) => {
                const Elmnt = props.panel_btns ? props.panel_btns() : <> </> 
                return Elmnt
            }}</Show>
        </span>

        <div class="search_content bg-app-surface-secondary rounded-lg py-3 pl-8"> {/* Content */}

        <Switch fallback={ <Loading option={1} class="place-self-center h-6 w-6" /> }>
            <Match when={props.result} >
                <textarea disabled rows={10}
                value={JSON.stringify(props.result, undefined, 2)} 
                class="text-app-string w-full"/>
            </Match>
        </Switch>

        </div>
    </div>
    ); 
}


type keyUnit = pattern['keys'][number];
type keyElementParams = {store_value: keyUnit, store_setter: SetStoreFunction<pattern>, index: number};

function Key_Extract(p: keyElementParams) {
    return (
        <div class="relative w-full p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
        outline-0 mt-2">
            <input id="unwrapping_key" type="text" 
                class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
            bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
            text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Object storing the data (empty = result)"
                autocomplete="off"
                value={p.store_value.key || ''} onChange={e => p.store_setter('keys', p.index, 'key', e.currentTarget.value)}
            />
            <label for="unwrapping_key"
                class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-2.5 z-10 origin-[0] 
            px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
            peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
            peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
            start-1 pointer-events-none text-app-property">Unwrap Key</label>

            <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
            onclick={() => p.store_setter('keys', p.index, 'key', "") }>
                <Erase class="fill-app-text/30" />
            </button>
        </div>
    )
}
function Key_Renaming(p: keyElementParams) {
    return (
        <div class="flex mt-2 w-full gap-2 cursor-cell">

            <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
            outline-0 flex-2">
                <input id="search_key"
                    type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                    placeholder="Key to look in"
                    autocomplete="off"
                    value={p.store_value.key || ''} onChange={e => p.store_setter('keys', p.index,
                        p.store_value.val === "" ? ['key', 'val'] : ['key'], e.currentTarget.value)}
                />
                <label for="search_key"
                    class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-property"># Key</label>
                <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                onclick={() => p.store_setter('keys', p.index, 'key', "") }>
                    <Erase class="fill-app-text/30" />
                </button>
            </div>

            <span >
                {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-property select-none">{'>>'}</p>
            </span>

            <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
            outline-0 flex-2">
                <input id="new_key_name"
                    type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                    placeholder="Name for value"
                    autocomplete="off"
                    value={p.store_value.val || ''} onChange={e => p.store_setter('keys', p.index, 'val', e.currentTarget.value)}
                />
                <label for="new_key_name"
                    class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-string">New Name</label>

                <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                onclick={() => {
                    if (p.store_value.val.trim() === '') p.store_setter('keys', p.index, 'type', type => type === 'alter' ? 'unwrap' : 'alter');
                    p.store_setter('keys', p.index, 'val', "")
                }}>
                    <Erase class="fill-app-text/30" />
                </button>
            </div>
        </div>
    )
}
function Key_Attach(p: keyElementParams) {
    return (
        <div class="flex mt-2 w-full gap-2 cursor-cell">

            <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
            outline-0 flex-2">
                <input id="additional_key"
                    type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                    placeholder="New key"
                    autocomplete="off"
                    value={p.store_value.key || ''} onChange={e => p.store_setter('keys', p.index, 'key', e.currentTarget.value)}
                />
                <label for="additional_key"
                    class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-property">Additional Key</label>
                <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                onclick={() => p.store_setter('keys', p.index, 'key', "") }>
                    <Erase class="fill-app-text/30" />
                </button>
            </div>

            <span >
                {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-string select-none">{'<-'}</p>
            </span>

            <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
            outline-0 flex-2">
                <input id="key_value"
                    type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                    placeholder="Value to attach"
                    autocomplete="off"
                    value={p.store_value.val || ''} onChange={e => p.store_setter('keys', p.index, 'val', e.currentTarget.value)}
                />
                <label for="key_value"
                    class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-string">Value</label>

                <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                onclick={() => { p.store_setter('keys', p.index, 'val', "") }}>
                    <Erase class="fill-app-text/30" />
                </button>
            </div>
        </div>
    )
}
const key_elements: Record<keyUnit['type'], (p: keyElementParams) => JSXElement> = {
    unwrap: Key_Extract, 
    alter: Key_Renaming,
    attach: Key_Attach
}

// type static_KeyUnit = Omit<keyUnit, 'type'> ;
function Static_Extract(p: keyUnit) {
    return (
        <div class="relative p-0.5 mx-2 bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
            <input id="unwrapping_key" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
            bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
            text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
            placeholder="Name for value" disabled value={p.key || ''} />
            <label for="unwrapping_key" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
            top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
            peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
            peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
            start-1 pointer-events-none text-app-property">
                Unwrapping Key
            </label>
        </div>
    )
}
function Static_Renaming(p: keyUnit) {
    return (
        <span class="flex px-2 mt-1">
            {/* <p class="flex-2 text-app-property">{property.key}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="search_key" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-property not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Name for value" disabled value={p.key} />
                {/* <label for="search_key" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-property/70">
                    Get_From
                </label> */}
            </div>

            <span >
                {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-property select-none">{'>>'}</p>
            </span>

            {/* <p class="flex-2 text-app-string">{property.val}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="new_key_name" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-string not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Name for value" disabled value={p.val} />
                {/* <label for="new_key_name" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-string/70">
                    New Key_Name
                </label> */}
            </div>
        </span>
    )
}
function Static_Attach(p: keyUnit) {
    return (
        <span class="flex px-2 mt-1">
            {/* <p class="flex-2 text-app-property">{property.key}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="additional_key" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-property not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Name for value" disabled value={p.key} />
                {/* <label for="additional_key" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-property/70">
                    Get_From
                </label> */}
            </div>

            <span >
                {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-string select-none">{'<-'}</p>
            </span>

            {/* <p class="flex-2 text-app-string">{property.val}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="key_value" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-string not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Name for value" disabled value={p.val} />
                {/* <label for="key_value" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-string/70">
                    New Key_Name
                </label> */}
            </div>
        </span>
    )
}
const static_key_elements: Record<keyUnit['type'], (p: keyUnit) => JSXElement> = {
    unwrap: Static_Extract, 
    alter: Static_Renaming,
    attach: Static_Attach
}

function Edit_Extract(p: keyElementParams) {
    return (
        <div class="relative p-0.5 bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-1">
            <input id="unwrapping_key" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
            bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
            text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
            placeholder="Object storing the data (empty = result)" 
            value={p.store_value.key || ''} onChange={e => p.store_setter('keys', p.index, 'key', e.currentTarget.value)}
            />
            <label for="unwrapping_key" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
            top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
            peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
            peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
            start-1 pointer-events-none text-app-property">
                Unwrapping Key
            </label>
        </div>
    )
}
function Edit_Renaming(p: keyElementParams) {
    return (
        <span class="flex-1 flex">
            {/* <p class="flex-2 text-app-property">{property.key}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="search_key" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-property not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Key to look in" 
                value={p.store_value.key} onChange={e => p.store_setter('keys', p.index, 'key', e.currentTarget.value)} 
                />
                <label for="search_key" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-property/70">
                    Unwrap Key
                </label>
            </div>

            <span >
                {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-property select-none">{'>>'}</p>
            </span>

            {/* <p class="flex-2 text-app-string">{property.val}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="new_key_name" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-string not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Name for value" 
                value={p.store_value.val} onChange={e => p.store_setter('keys', p.index, 'val', e.currentTarget.value)} 
                />
                <label for="new_key_name" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-string/70">
                    New Name
                </label>
            </div>
        </span>
    )
}
function Edit_Attach(p: keyElementParams) {
    return (
        <span class="flex-1 flex">
            {/* <p class="flex-2 text-app-property">{property.key}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="additional_key" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-property not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Key to look in" 
                value={p.store_value.key} onChange={e => p.store_setter('keys', p.index, 'key', e.currentTarget.value)} 
                />
                <label for="additional_key" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-property/70">
                    Unwrap Key
                </label>
            </div>

            <span >
                {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-string select-none">{'<-'}</p>
            </span>

            {/* <p class="flex-2 text-app-string">{property.val}</p> */}
            <div class="relative bg-app-surface-secondary border-app-element border-2 rounded-lg ps-3 text-md outline-0 flex-2">
                <input id="key_value" type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                text-app-string not-focus:placeholder-transparent placeholder-app-text/80"
                placeholder="Name for value" 
                value={p.store_value.val} onChange={e => p.store_setter('keys', p.index, 'val', e.currentTarget.value)} 
                />
                <label for="key_value" class="absolute font-bold duration-300 transform -translate-y-4 scale-75 
                top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                start-1 pointer-events-none text-app-string/70">
                    New Name
                </label>
            </div>
        </span>
    )
}
const edit_key_elements: Record<keyUnit['type'], (p: keyElementParams) => JSXElement> = {
    unwrap: Edit_Extract, 
    alter: Edit_Renaming,
    attach: Edit_Attach
}