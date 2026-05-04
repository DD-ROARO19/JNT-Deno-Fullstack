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
import { createStore } from "solid-js/store";
import { isLoading, setLoadingState } from "../signals.tsx";
import { reset_searchParams, searchParams, upd_searchParams } from "../stores.tsx";
import { Arrow, Loading, Erase } from "../assets/svgs.tsx";
import { ObjectType } from "./StaticTypes.tsx";
import { StringType } from "./InputTypes.tsx"
import { query_patterns, SearchError, searchLink, toggleLateralCard, uploadPattern } from "../Search.tsx";
import { formatValue, updateStore } from "../helpers.tsx";
import type { new_patternType, typeOfInputs, JSONValue, JSONObject } from "../types.tsx";
import type { pattern } from "../../types.ts";
import type { SetStoreFunction } from "solid-js/store";


// type patternStoreType = {
//     pattern: pattern,
//     updater: SetStoreFunction<pattern>
// }
export function SearchPanel() {
    const [selectedMenu, selectMenu] = createSignal<'existing' | 'new' | 'none'>('existing');
    const [currentStore, changeCurrentStore] = createSignal<pattern>()
    const [storeSetter, changeStoreSetter] = createSignal<SetStoreFunction<pattern>>()
    const [result, setResult] = createSignal<JSONValue>()

    const [patterns, { refetch, mutate }] = createResource(() => query_patterns())
    
    const pttrns = patterns();
    if (pttrns && pttrns.length === 0) selectMenu("new");

    function addProperty() {
        const updater = storeSetter()
        if(!updater) throw new SearchError("UNDEFINED_STORE");

        updater('keys', list => [...list, { key: "", val: "" }]) 
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


    const TabBtn = (props: { option: 'new' | 'existing', title: string }) => <span
        class="bg-app-element rounded-xl transition-discrete duration-100 ease-in z-1">
        <button type="button" class="rounded-md active:bg-transparent flex w-full"
            classList={{
                "bg-app-active/60 rounded-xl hover:bg-app-active/80": selectedMenu() === props.option,
                "hover:bg-app-active/30": selectedMenu() !== props.option
            }}
            onclick={() => selectMenu(p => p === props.option ? 'none' : props.option)} >
            <Arrow class={"fill-app-surface-secondary " + (selectedMenu() === props.option ? 'rotate-0' : 'rotate-270 fill-app-text/60')} />
            <p class={"font-medium " + (selectedMenu() === props.option ? 'text-app-surface-secondary' : 'text-app-text/60')} >{props.title}</p>
        </button>
    </span>;


    const [saveValidation, toggle_saveValidation] = createSignal<boolean>(false);
    function NewPattern() {
        const [newPattern, updateNewPattern] = createStore<pattern>({ title: '', keys: [] })
        // const [patternName, setPatternName] = createSignal<string>()

        createEffect(() => { if (selectedMenu() === 'new') {
            changeCurrentStore(newPattern)
            changeStoreSetter(_ => updateNewPattern)
        } })

        // Toggle between fist validating the selection & then saving when re-validated.
        function handleSave() { saveValidation() ? savePattern() : toggle_saveValidation(p => !p) };
        
        function savePattern() {
            if (newPattern.title.trim() === "") throw new SearchError("INVALID_PATTERN", 'Please fill a name to save this pattern');

            uploadPattern(newPattern)

            console.debug('saved!', newPattern);
            toggle_saveValidation(false);
        }

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

                {/* Packet Name */}
                <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
                outline-0 mt-2">
                    <input id="packet_name"
                        type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                        placeholder="Object storing the data (empty = result)"
                        autocomplete="off"
                        value={newPattern.packet_name || ''} onChange={e => updateNewPattern('packet_name', e.currentTarget.value)}
                    />
                    <label for="packet_name"
                        class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-2.5 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-property">Extract from</label>

                    <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                        onclick={() => updateNewPattern('packet_name', "") }>
                        <Erase class="fill-app-text/30" /></button>
                </div>


                {/* Aditional properties */}
                <For each={newPattern.keys}>{(property, index) => <div class="flex mt-2 gap-2 cursor-cell"
                    onAuxClick={e => removeProperty(e, index())}>

                    <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
                outline-0 flex-2">
                        <input id="search_key"
                            type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                            placeholder="Key to look in"
                            autocomplete="off"
                            value={property.key || ''} onChange={e => updateNewPattern('keys', index(),
                                property.val === "" ? ['key', 'val'] : ['key'], e.currentTarget.value)}
                        />
                        <label for="search_key"
                            class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-property"># Key Name</label>
                    </div>

                    <span >
                        {/* 2nd Space */} <p class="text-2xl font-bold text-center text-app-property select-none">{'>>'}</p>
                    </span>

                    <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
                outline-0 flex-2">
                        <input id="new_name"
                            type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                            placeholder="Name for value"
                            autocomplete="off"
                            value={property.val || ''} onChange={e => updateNewPattern('keys', index(), 'val', e.currentTarget.value.toString())}
                        />
                        <label for="new_name"
                            class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-string"># Value Name</label>

                    <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                        onclick={() => updateNewPattern('keys', index(), 'val', "") }>
                        <Erase class="fill-app-text/30" /></button>
                    </div>
                </div>}</For>

                <span class="flex mt-2 px-0.5 gap-1.5">
                    <button type="button" class="flex-1 bg-app-surface border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                    active:text-app-surface-secondary
                    text-app-text" onclick={e => removeProperty(e, -1)}>-</button>
                    <button type="button" class="flex-1 bg-app-surface border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                    active:text-app-surface-secondary
                    text-app-text" onclick={addProperty}>+</button>
                    <button type="button" class="flex-1 bg-app-surface border-app-element border-2 rounded-2xl hover:bg-app-active/70 active:bg-app-active
                    active:text-app-surface-secondary
                    text-app-text" onclick={handleSave} >{saveValidation() ? 'Save' : 'Save?'}</button>
                </span>
            </>
        )
    }

    function CurrentPatterns(props: { list: pattern[] }) {
        const [filedPattern, updateFiledPattern] = createStore<pattern>({ title: '', keys: [] })

        createEffect(() => { if (selectedMenu() === 'existing') {
            changeCurrentStore(filedPattern)
            changeStoreSetter(_ => updateFiledPattern)
        } })

        console.log('log list => ', props.list);
        const [openedPattern, openPattern] = createSignal<number | undefined>(undefined);

        function select_pattern(pattern_index: number) {
            openPattern(p => (p === pattern_index && p !== undefined) ? undefined : pattern_index )
        }

        createEffect(() => { 
            const index = openedPattern();
            (index !== undefined) ? 
                updateFiledPattern(props.list[index])
                : updateFiledPattern({ title: '', keys: [] })
        })
        
        return (
            <For each={props.list}>{(pattern, i) => {
                const isOpen = createMemo(() => openedPattern() === i())
                
                return (
                <div class="relative bg-app-surface border-app-element border-2 rounded-lg text-md font-semibold
                outline-0 mt-2 flex flex-col"
                onclick={ () => select_pattern(i()) }
                >
                    <span class="flex w-full hover:bg-app-active/50 rounded-md">
                        <Arrow class={"fill-app-text/60 " + (isOpen() ? 'rotate-0' : 'rotate-270')} />
                        <h2 class="text-app-function">{pattern.title}</h2>
                    </span>
                    <div class="grid transition-[grid-template-rows] duration-250 ease-in-out grid-rows-[0fr] invisible"
                    classList={{ "grid-rows-[1fr] visible": isOpen() }}
                    >
                        <span class="overflow-hidden" >
                            <textarea class="text-app-string w-full field-sizing-content" 
                            value={JSON.stringify(pattern, undefined, 2)} disabled />
                            {/* <Show when={isOpen()}>
                            </Show> */}
                            {/* <For each={pattern.keys}>{(property) =>
                                <span class="flex">
                                    <p class="flex-2">{property.key}</p>
                                    <p>{'>>'}</p>
                                    <p class="flex-2">{property.val}</p>
                                </span>
                            }</For> */}
                        </span>
                    </div>
                </div>
                )}
            }</For>
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

    function applyResult() {
        const res = result();
        console.log(searchParams.url, searchParams.path, searchParams.formatedResult);
        
        if(!res) throw new SearchError("UNDEFINED_RESULT");
        if(!searchParams.path) throw new SearchError("UNDEFINED_SEARCH_PARAMS", 'Path missing');
        
        setLoadingState("indeed")
        upd_searchParams("formatedResult", formatValue(res))
        setLoadingState("finished")
        if(!searchParams.formatedResult) throw new SearchError("ERROR_WHILE_FORMATING_RESULT") ;

        updateStore(searchParams.path.slice(0, -1), searchParams.formatedResult);
        if(searchParams.resultName || currentStore()?.title) updateStore(searchParams.path.with(-1, 'key'), searchParams.resultName || currentStore()?.title || '');
    }

    return (
        // Lateral Panel
        <span class="flex flex-col overflow-y-scroll select-none">
        
        {/* Search Pattern */}
        <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >
            <h1 class="text-app-function text-xl font-semibold">Search / Patterns</h1>

            <input disabled value={searchParams.url} 
            class="text-app-string" />

            <Show when={patterns()}>
            {(pattern_list) => (
                <>
                <TabBtn option="existing" title="Existing search patterns" />
                <div class="grid transition-[grid-template-rows] duration-200 ease-in-out grid-rows-[0fr] -mt-3 mb-3"
                classList={{ "grid-rows-[1fr]": selectedMenu() === 'existing' }}>
                    <div class="overflow-hidden">
                        <div class="bg-app-surface-secondary rounded-lg py-3 p-2 pt-4 z-0">
                            <CurrentPatterns list={pattern_list()} />
                        </div>
                    </div>
                </div>
                </>
            )}
            </Show>

            <TabBtn option="new" title="New search patterns" />
            <div class="grid transition-[grid-template-rows] duration-200 ease-in-out grid-rows-[0fr] -mt-3 mb-3"
            classList={{ "grid-rows-[1fr]": selectedMenu() === 'new' }}>
                <div class="overflow-hidden">
                    <div class="bg-app-surface-secondary rounded-lg p-2 py-3 pt-4 z-0">
                        <NewPattern />
                    </div>
                </div>
            </div>

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
            {/* <div class="bg-app-surface-secondary rounded-lg py-3 pl-8"></div> */}
        </div>
        
        {/* Search Result */}
        <Show when={isLoading() !== "nope" }>
            <ResultPanel result={result()} apply_func={applyResult} />
        </Show>
        </span>
    )
}


function ResultPanel(props: { result: JSONValue | undefined, apply_func(): void, sub_title?: string }) {
    return (
    <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >

        {/* SubTitle & Button */}
        <span class="flex place-content-between mr-1 mb-2"> 
            <h1 class="text-app-function text-xl font-semibold mt-0.5">{props.sub_title || 'Result'}</h1>
            <Show when={props.result} >
                <button type="button" 
                class="px-13 bg-app-active rounded-2xl p-0.5 font-medium border-2 
                border-app-muted/50 active:bg-app-active-secondary/70 hover:bg-app-active-secondary 
                text-app-surface-secondary" 
                onclick={props.apply_func}
                >Apply</button>
            </Show>
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

