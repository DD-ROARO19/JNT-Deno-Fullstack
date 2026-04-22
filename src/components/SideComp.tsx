// @ts-types="solid-js"
import {
    createSignal,
    Show,
    For,
    createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import { latCardSet, searchURL } from "../signals.tsx";
import { toast } from "./notifications.tsx";
import { DownArrow, Arrow } from "../assets/svgs.tsx";
import type { typeOfInputs } from "../types.tsx";
import type { JSONValue, JSONObject } from "../types.tsx";
import { ObjectType } from "./StaticTypes.tsx";
import { StringType } from "./InputTypes.tsx"


const testObj = {
 "project_id": "LNytGWDc",
 "project_type": "mod",
 "slug": "create",
 "author": "simibubi",
 "title": "Create",
 "description": "Aesthetic Technology that empowers the Player",
 "categories": [
  "decoration",
  "forge",
  "neoforge",
  "technology",
  "utility"
 ],
 "display_categories": [
  "decoration",
  "forge",
  "neoforge",
  "technology",
  "utility"
 ],
 "versions": [
  "1.18.2",
  "1.19.2",
  "1.20.1",
  "1.21.1"
 ],
 "downloads": 15556136,
 "follows": 5519,
 "icon_url": "https://cdn.modrinth.com/data/LNytGWDc/61d716699bcf1ec42ed4926a9e1c7311be6087e2_96.webp",
 "date_created": "2022-07-07T21:24:43.018879+00:00",
 "date_modified": "2026-04-21T22:19:59.671226+00:00",
 "latest_version": "UjX6dr61",
 "license": "LicenseRef-Create-Mod-License",
 "client_side": "optional",
 "server_side": "required",
 "gallery": [],
 "featured_gallery": null,
 "color": 6639722
}


class SearchError extends Error {
    constructor(
        public code: 'UNDEFINED_TOGGLE_SETTER' | 'BAD_QUERY' | 'SEARCH_FORM_EMPTY' | 'INVALID_PATTERN',
        // error?: Error,
        message?: string,
    ) {
        super(message);
        this.name = "Search validation error";

        switch (this.code) {
            case "UNDEFINED_TOGGLE_SETTER":
                this.message = 'Setter for lateral card render toggle undefined!';
                break;

            case "BAD_QUERY":
                this.message += " - " + this.code;
                break;

            case "SEARCH_FORM_EMPTY":
                this.message = "Please fill query pattern form"
                break;

            case "INVALID_PATTERN":
                this.message += " - " + this.code;
                break;

            default:
                this.code satisfies never;
                this.message += " - UNDEFINED_CASE";
                break;
        }

        console.error(this, { ...this });
        toast().newNotification(this.message)
    }
}

export function toggleLateralCard() {
    const setterSignal = latCardSet();
    if (!setterSignal) throw new SearchError("UNDEFINED_TOGGLE_SETTER");

    setterSignal(p => !p);
};

// type ScardParams = null
export function SideCard() {
    const [selectedMenu, selectMenu] = createSignal<'existing' | 'new' | 'none'>('new');
    const [storedPattern, updatePattern] = createStore<patternType>({ keys: [{ key: "", val: "" }] })
    const [searchResult, setResult] = createSignal<JSONValue | undefined>(testObj)


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


    const [readSave, setSave] = createSignal<boolean>(false);
    function NewPattern() {
        const [patternName, setPatternName] = createSignal<string | undefined>(undefined)

        function handleSave() {
            readSave() ? savePattern() : setSave(p => !p);
        }

        function savePattern() {
            if (patternName() === undefined || patternName()?.trim() === "") throw new SearchError("INVALID_PATTERN", 'Please fill a name to save this pattern');

            console.log('saved!', { name: patternName(), ...storedPattern });
            setSave(false);
        }

        return (
            <>
                {/* Pattern name */}
                <Show when={readSave()}>
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
                    </div>
                </Show>

                {/* Packet Name */}
                <div class="relative p-0.5 bg-app-surface border-app-element border-2 rounded-lg ps-3 text-md
                outline-0 mt-2">
                    <input id="packet_name"
                        type="text" class="block px-1.5 pb-1 pt-1.5 w-full font-semibold 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-text not-focus:placeholder-transparent placeholder-app-text/80"
                        placeholder="Object storing the data (leave empty to extract from root)"
                        autocomplete="off"
                        value={storedPattern.packet_name || ''} onChange={e => updatePattern('packet_name', e.currentTarget.value)}
                    />
                    <label for="packet_name"
                        class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-2.5 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-property">Extract from</label>
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
                            placeholder="Key to look for"
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
                            placeholder="New name for the value"
                            autocomplete="off"
                            value={property.val || property.key || ''} onChange={e => updatePattern('keys', index(), 'val', e.currentTarget.value.toString())}
                        />
                        <label for="new_name"
                            class="absolute font-bold duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] 
                    px-2 peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-120 
                    peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 
                    peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto 
                    start-1 pointer-events-none text-app-string"># Value Name</label>
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
                    text-app-text" onclick={handleSave} >{readSave() ? 'Save' : 'Save?'}</button>
                </span>
            </>
        )
    }


    function closeSearch() { selectMenu('none'); toggleLateralCard(); setSave(false); }
    async function search() {
        try {
            console.log('Object? ', storedPattern);
            if (storedPattern.keys.length >= 1) {
                for (let i = 0; i < storedPattern.keys.length; i++) {

                    if (storedPattern.keys[i].key.trim() === "") { console.debug(storedPattern.keys[i]); throw new SearchError("SEARCH_FORM_EMPTY"); }
                }
            }
            // if(storedPattern.keys.length < 1) throw new SearchError("SEARCH_FORM_EMPTY");

            const newObject = await searchLink(searchURL(), storedPattern)
            console.log('Resulting Object > ', newObject);
            setResult(newObject)
        } catch (err) {
            if (err instanceof Error && !(err instanceof SearchError)) console.error(err);
        }
    }


    return (
        <span class="flex flex-col">
        
        {/* Pattern Panel */}
        <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >
            <h1 class="text-app-function text-xl font-semibold">Search Patterns</h1>

            <Show when={selectedMenu() === 'existing'} fallback={<TabBtn option="existing" title="Existing query patterns" />}>
                <TabBtn option="existing" title="Existing search patterns" />
                <div class="bg-app-surface-secondary rounded-lg py-3 pl-8">
                </div>
            </Show>

            <Show when={selectedMenu() === 'new'} fallback={<TabBtn option="new" title="New query patterns" />}>
                <TabBtn option="new" title="New search patterns" />
                <div class="bg-app-surface-secondary rounded-lg py-3 p-2 pt-4 -mt-3 z-0">
                    <NewPattern />
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
            </Show>

            {/* <div class="bg-app-surface-secondary rounded-lg py-3 pl-8"></div> */}
        </div>
        
        {/* Search Result */}
        <Show when={searchResult()}>
            <div class="mt-4 mr-2 bg-app-element w-auto rounded-2xl p-3 flex flex-col" >
            <h1 class="text-app-function text-xl font-semibold">Search Result</h1>
                {/* Content */}
                <div class="search_content bg-app-surface-secondary max-w-full rounded-lg py-3 pl-8">
                    <textarea disabled value={JSON.stringify(searchResult(), undefined, 2)} 
                    class="text-app-string w-full"/>
                </div>
            </div>
        </Show>
        </span>
    )
}



type patternType = { packet_name?: string, keys: { key: string, val: string }[] }
// type searchParams = {  }
async function searchLink(url: string | undefined, patter: patternType) {
    if (!url) throw new SearchError("BAD_QUERY", 'No URL given!')

    try {
        let response = await queryURL(url);
        if (patter.packet_name) response = response[patter.packet_name]

        // (patter.packet_name && patter.packet_name.trim() !== "") ?
        //     (await queryURL(url))[patter.packet_name]
        //     : await queryURL(url);

        if (Array.isArray(response)) response = response[0]

        console.log('response ', response);

        const result: JSONObject = {};
        // return patter.keys.reduce((acc, {key, val}) => {
        //     acc[val] = response[key]; return acc;
        // }, {} as JSONObject);

        if (patter.keys.length >= 1) {
            for (let i = 0; i < patter.keys.length; i++) {
                const { key, val } = patter.keys[i];
                result[val] = response[key] || null;
            }
        } else {
            console.log('search: ', response);
            return response;
        }

        console.log('search: ', result);
        return result;
    } catch (err) {
        if (err instanceof Error) throw new SearchError('BAD_QUERY', err.message)
    }
}

async function queryURL(url: string) {

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        console.error(`queryURL: ${res.status} - ${res.statusText}`);
        throw new Error(await res.json())
    }

    const data = await res.json();
    console.debug('api response: ', data);

    return data
}