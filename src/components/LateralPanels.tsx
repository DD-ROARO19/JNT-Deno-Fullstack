// @ts-types="solid-js"
import {
    createResource,
    createSignal,
    Show,
    For,
    createEffect,
    Switch,
    Match,
} from "solid-js";
import { createStore } from "solid-js/store";
import { isLoading, setLoadingState } from "../signals.tsx";
import { reset_searchParams, searchParams, upd_searchParams } from "../stores.tsx";
import { Arrow, Loading, Erase } from "../assets/svgs.tsx";
import { ObjectType } from "./StaticTypes.tsx";
import { StringType } from "./InputTypes.tsx"
import { query_patterns, SearchError, searchLink, toggleLateralCard } from "../Search.tsx";
import { formatValue, updateStore } from "../helpers.tsx";
import type { new_patternType, typeOfInputs, JSONValue, JSONObject } from "../types.tsx";
import type { pattern } from "../../types.ts";


// type ScardParams = null
export function SearchPanel() {
    const [selectedMenu, selectMenu] = createSignal<'existing' | 'new' | 'none'>('existing');
    const [storedPattern, updatePattern] = createStore<new_patternType>({ keys: [] })
    const [result, setResult] = createSignal<JSONValue>()
    const [patternName, setPatternName] = createSignal<string>()

    const [patterns, { refetch, mutate }] = createResource(() => query_patterns())
    
    const pttrns = patterns();
    if (pttrns && pttrns.length === 0) selectMenu("new");

    function addProperty() { updatePattern('keys', list => [...list, { key: "", val: "" }]) };
    function removeProperty(event: MouseEvent, index: number) { 
        if (index === -1) {
            updatePattern('keys', list => list.slice(0, -1)) 
        }
        
        if (event.button === 1) {
            event.preventDefault();
            updatePattern('keys', list => list.filter((_, i) => i !== index )) 
        }
    };


    const TabBtn = (props: { option: 'new' | 'existing', title: string }) => <span
        class="bg-app-element rounded-xl select-none transition-discrete duration-100 ease-in z-1">
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

        function handleSave() { saveValidation() ? savePattern() : toggle_saveValidation(p => !p) };

        async function savePattern() {
            if (patternName() === undefined || patternName()?.trim() === "") throw new SearchError("INVALID_PATTERN", 'Please fill a name to save this pattern');

            // fetch()

            console.log('saved!', { name: patternName(), ...storedPattern });
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
                            value={patternName() || ''} onChange={e => setPatternName(e.currentTarget.value)}
                        />
                        <label for="pattern_name"
                            class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-2.5 z-10 origin-[0] 
                        px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                        peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                        peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                        start-1 pointer-events-none text-app-function">New pattern name</label>

                        <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                        onclick={() => setPatternName("")}>
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
                        value={storedPattern.packet_name || ''} onChange={e => updatePattern('packet_name', e.currentTarget.value)}
                    />
                    <label for="packet_name"
                        class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-2.5 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-property">Extract from</label>

                    <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                        onclick={() => updatePattern('packet_name', "") }>
                        <Erase class="fill-app-text/30" /></button>
                </div>


                {/* Aditional properties */}
                <For each={storedPattern.keys}>{(property, index) => <div class="flex mt-2 gap-2 cursor-cell"
                    onAuxClick={e => removeProperty(e, index())}>

                    <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
                outline-0 flex-2">
                        <input id="search_key"
                            type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                            placeholder="Key to look in"
                            autocomplete="off"
                            value={property.key || ''} onChange={e => updatePattern('keys', index(),
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
                            value={property.val || ''} onChange={e => updatePattern('keys', index(), 'val', e.currentTarget.value.toString())}
                        />
                        <label for="new_name"
                            class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-string"># Value Name</label>

                    <button type="button" class="absolute right-1.5 top-2 cursor-pointer" 
                        onclick={() => updatePattern('keys', index(), 'val', "") }>
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
        console.log('log list => ', props.list);
        
        return (
            <For each={props.list}>{(pattern) =>
                <>
                <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md font-semibold
                outline-0 mt-2 text-app-function">
                    <span>
                        <h2>{pattern.title}</h2>

                    </span>
                </div>
                </>
            }</For>
        );
    }


    function closeSearch() { selectMenu('none'); toggleLateralCard(); toggle_saveValidation(false); setLoadingState("nope"); reset_searchParams() }
    async function search() {
        setLoadingState("indeed");
        try {
            console.log('Object? ', storedPattern);
            if (storedPattern.keys.length >= 1) {
                for (let i = 0; i < storedPattern.keys.length; i++) {

                    if (storedPattern.keys[i].key.toString().trim() === "") { console.debug(storedPattern.keys[i]); throw new SearchError("SEARCH_FORM_EMPTY"); }
                }
            }
            // if(storedPattern.keys.length < 1) throw new SearchError("SEARCH_FORM_EMPTY");

            const newObject = await searchLink(storedPattern)
            console.log('Resulting Object > ', newObject);
            setResult(newObject)
            setLoadingState("finished");
        } catch (err) {
            // setLoadingState("nope");
            if (err instanceof Error && !(err instanceof SearchError)) console.error(err);
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
        if(searchParams.resultName || patternName()) updateStore(searchParams.path.with(-1, 'key'), searchParams.resultName || patternName()!);
    }

    return (
        // Lateral Panel
        <span class="flex flex-col overflow-y-scroll">
        
        {/* Search Pattern */}
        <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >
            <h1 class="text-app-function text-xl font-semibold">Search / Patterns</h1>

            <input disabled value={searchParams.url} 
            class="text-app-string" />

            <Show when={patterns()}>
            {(pattern_list) => (<Switch fallback={<TabBtn option="existing" title="Existing query patterns" />}>
                <Match when={selectedMenu() === 'existing'}>
                    <TabBtn option="existing" title="Existing search patterns" />
                    <div class="bg-app-surface-secondary rounded-lg py-3 p-2 pt-4 -mt-3 z-0">
                        <CurrentPatterns list={pattern_list()} />
                    </div>
                </Match>
            </Switch>)}
            </Show>

            <Show when={selectedMenu() === 'new'} fallback={<TabBtn option="new" title="New query pattern" />}>
                <TabBtn option="new" title="New search patterns" />
                <div class="bg-app-surface-secondary rounded-lg py-3 p-2 pt-4 -mt-3 z-0">
                    <NewPattern />
                </div>
            </Show>

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

