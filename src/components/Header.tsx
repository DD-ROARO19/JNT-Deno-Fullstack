// @ts-types="solid-js"
import { 
    createSignal, 
    onMount,
    onCleanup,
    For,
    Show,
    createSelector, 
createResource } from "solid-js";

import { CopySVG, Edit, Erase, SettingSVG } from "../assets/svgs.tsx";
import { toggleLateralCard } from "../Search.ts";
import { setLastClicked, set_quickMenuConfig, update_tagStore, tagsStore } from "./QuickMenu.tsx";
import { copyToClipboard, SaveNote } from "../helpers.tsx";

import { unwrap, type SetStoreFunction } from "solid-js/store";
import type { noteFrame, quickOptions, quickButtons } from "../types.tsx";
import { objectsClosed, setObjectsClosed } from "../signals.tsx";

// ## CHANGE PLACE: vv THIS vv
// # DEV: definition of dev state (maybe change to a togglable option?)
const dev = false;
const show_lastUpdate = true;

interface titleParams {
    onSave: () => void,
    onCopy: () => void,
    onErase: () => void,
    store_data: noteFrame,
    storeSetter: SetStoreFunction<noteFrame>,
    fixed_title?: boolean,
}

export default function Title(props: titleParams) {
    const [isFixed, setIsFixed] = createSignal(false);
    const [barHeight, setBarHeight] = createSignal(100);
    let titleBarRef: HTMLDivElement | undefined;
    const metadata = props.store_data.metadata;

    const [advSettings, activate_advSettings] = createSignal(true);

    onMount(() => {
        // console.log('Offset',searchBarRef?.offsetHeight);
        const scrollingContainer = document.querySelector('#Content');

        if (!titleBarRef || !scrollingContainer) {
            console.error("SearchBar couldn't find its ref or the #Content scrolling container.");
            console.error('titleBarRef: ', titleBarRef); console.error('scrollingContainer: ', scrollingContainer);
            return;
        };
        setBarHeight(titleBarRef.offsetHeight)

        function handleScroll() {
            setIsFixed(scrollingContainer!.scrollTop > barHeight())
        }

        scrollingContainer.addEventListener("scroll", handleScroll)
        onCleanup(() => scrollingContainer.removeEventListener("scroll", handleScroll))
    })

    const Class = "p-2 max-h-fit rounded-md cursor-pointer place-items-center bg-app-surface-secondary";

    return (
        <>
            <div ref={titleBarRef} id="title" class={`NoteTitle p-1 pb-2.5 
            transition-discrete duration-150 ease-in-out
            ${isFixed() ? 'bg-app-element fixed top-2 self-center-safe z-50 shadow-lg md:w-3/4 lg:w-1/2 pt-2.5' : 'relative'} 
            ${advSettings() ? 'rounded-2xl px-2.5' : 'rounded-4xl'}
            `} 
            classList={{ "px-4": isFixed() && !advSettings() }} 
            >
            <span class="w-full flex justify-evenly gap-1">
                <div class="relative flex-1 p-0.5 text-lg bg-app-surface-secondary rounded-lg ps-3 
                placeholder-app-muted/70 outline-0 focus:border-2 border-app-borders font-semibold">
                    <input type="text" id="floating_outlined" class="block px-1.5 pb-1 pt-1.5 w-full text-md 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-function" autocomplete="off"
                        placeholder="" value={metadata.title} onChange={e => props.storeSetter('metadata', 'title', e.currentTarget.value)} disabled={props.fixed_title} />
                    <label for="floating_outlined" class="absolute text-md text-body duration-300 transform 
                    -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 
                    peer-focus:text-fg-brand peer-placeholder-shown:scale-130 peer-placeholder-shown:-translate-y-1/2 
                    peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none
                    text-app-string" classList={{"hidden": props.fixed_title}}>Note Title</label>
                </div>
                {/* {props.children} */}

                {/* Save Note */}
                <button type="button" class={'group/save '+Class}
                    title="Save Note"
                    onClick={props.onSave} >
                    <Edit option={2} class={`fill-app-text/70 group-hover/save:fill-app-text group-active/save:fill-app-active-secondary/70`} />
                </button>

                {/* Copy Content */}
                {/* <button type="button" class={'group '+Class}
                    title="Copy Note"
                    onClick={props.onCopy} >
                    <CopySVG class={`stroke-app-surface-secondary group-active:stroke-app-surface-secondary/70`} option={3} />
                </button> */}

                {/* Erase Note */}
                <button type="button" class={'group/erase '+Class}
                    title="Erase Note"
                    onclick={props.onErase} >
                    <Erase class={`fill-app-text/70 group-hover/erase:fill-app-text group-active/erase:fill-app-active-secondary/70`} />
                </button>

                {/* Expand Header */}
                <button type="button" class={'group/adv '+Class}
                    title="Copy Note"
                    onClick={() => activate_advSettings(p => !p)} >
                    {/* <SettingSVG class={`stroke-app-surface-secondary group-active:stroke-app-surface-secondary/70`} option={3} /> */}
                    <SettingSVG class="fill-app-text/70 group-hover/adv:fill-app-text group-active/adv:fill-app-active-secondary/70 stroke-app-surface-secondary" option={2} />
                </button>
            </span>
            <div class="grid transition-[grid-template-rows] delay-75 duration-150 ease-in-out grid-rows-[0fr]"
            classList={{ "grid-rows-[1fr]": advSettings() }}>

                <div class="mt-1 overflow-hidden">
                    <span is="additional" class="flex justify-between place-items-start gap-1">
                        <div id="info" class="py-1 px-2 flex gap-x-5 flex-wrap bg-app-surface-secondary rounded-lg text-app-text">
                            {/* <span class="flex">
                                <label for="content_length" class="">length:</label>
                            </span> */}
                            <h2 id="author" class="font-semibold">Author: {metadata.author}</h2>
                            <h2 id="content_length" class="font-semibold">Items length: {props.store_data.content.length}</h2>
                            <h2 id="content_type" class="font-semibold">Note type: "object"</h2>
                            <Show when={metadata.created_at}>{(date) => { 
                                const localeDate = new Date(date()).toLocaleString(undefined, { hour12: false, dateStyle: 'short', timeStyle: 'short' })
                                return <h2 id="author" class="font-semibold" title={`Created: ${localeDate}`}>{ (show_lastUpdate ? 'C: ' : 'Created: ') + localeDate}</h2>
                            }}</Show>
                            <Show when={show_lastUpdate}>
                                <Show when={metadata.last_updated}>{(date) => {
                                    const localeDate = new Date(date()).toLocaleString(undefined, { hour12: false, dateStyle: 'short', timeStyle: 'short' })
                                    return <h2 id="author" class="font-semibold" title={`Last updated: ${localeDate}`}>U: {localeDate}</h2>} }</Show>
                            </Show>
                        </div>
                        <div id="buttons" class="flex gap-1 shrink min-w-0">
                            {/* # DEV: Log Note */}
                            <Show when={dev}>
                                <button type="button" class={`group/copy text-app-text/70 font-semibold hover:text-app-text
                                active:text-app-active-secondary/70 flex min-w-10 shrink items-center `+Class}
                                    title="Log note"
                                    onClick={() => console.log(structuredClone(unwrap(props.store_data)))} >
                                    <CopySVG class={`stroke-app-text/70 group-hover/copy:stroke-app-text group-active/copy:stroke-app-active-secondary/70`} option={3} />
                                    Log Note
                                </button>
                            </Show>
                            
                            {/* Open / Close - objects or arrays */}
                            <button type="button" class={`text-app-text/70 font-semibold hover:text-app-text
                            active:text-app-active-secondary/70 flex min-w-10 shrink items-center `+Class}
                                title="Toggle objects & arrays"
                                onclick={() => setObjectsClosed(p => !p)}>
                                    <p class="truncate">{ objectsClosed() ? 'Close all objects' : 'Open all objects' }</p>
                            </button>
                            
                            {/* Copy Content */}
                            <button type="button" class={'group/copy '+Class}
                                title="Copy Note"
                                onClick={props.onCopy} >
                                <CopySVG class={`stroke-app-text/70 group-hover/copy:stroke-app-text group-active/copy:stroke-app-active-secondary/70`} option={3} />
                            </button>
                        </div>
                    </span>
                    <span id="note_tags" class="TagsComponent flex gap-1 my-1 flex-wrap">
                        <h2 class="text-app-property font-black me-2">Tags:</h2>
                        <TagsComponent tags_val={metadata.tags} store_setter={props.storeSetter} />
                    </span>
                </div>

            </div>
            </div>

            <div
                id="ExtraSpace"
                class="transition-all"
                style={{
                    height: isFixed() ? `${barHeight()}px` : '0px',
                }}
            />
        </>
    )
}

type tagJSON = { tag: string, count: number }
async function searchTags(val: string): Promise<tagJSON[]> {
    const res = await fetch('/api/tags/'+val, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        console.error(`queryTags: ${res.status} - ${res.statusText}`, 'error => ', await res.json());
        return [];
    }

    // const data = await res.json() as tagJSON[]
    // return data;
    return await res.json();
}
async function queryTags() {
    const res = await fetch('/api/tags/', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        console.error(`queryTags: ${res.status} - ${res.statusText}`, 'error => ', await res.json());
        return;
    }

    const tags_list = await res.json() as tagJSON[]
    // console.group('queryTags')
    // console.log('tags_list => ', tags_list);
    
    const btns = tags_list.map((v) => { return { text: v.tag, action: ()=>{} } }) satisfies quickButtons[];
    // console.log('tags btns => ', btns);
    // console.groupEnd()
    
    update_tagStore('options', 0, 'buttons', _ => btns )
    // return await res.json() as tagJSON[];
}

interface TagsParams {
    tags_val: noteFrame["metadata"]["tags"],
    store_setter?: SetStoreFunction<noteFrame>
};
function TagsComponent(p: TagsParams) {
    const Class = `bg-app-function hover:bg-app-active-secondary group-hover/card:text-app-element text-app-surface font-bold px-1.5 rounded-sm `;

    if (p.store_setter) {
        onMount(() => queryTags())
        // console.log('tagsStore => ', unwrap(tagsStore));
    }

    return (
        <>
            <Show when={p.store_setter} fallback={
                <For each={p.tags_val}>{(tag, i) =>
                    <h2 class={Class}
                    classList={{
                        "rounded-l-xl": i() == 0,
                        "rounded-r-xl": i() == p.tags_val.length -1,
                    }}
                    >{tag}</h2>
                }</For>
            }>{
                (setter) => <>
                    <For each={p.tags_val}>{(tag, i) =>
                        <TagInput class={Class} index={i()} setter={setter()} tag={tag} />
                    }</For>
                    <button type="button" class={Class+" rounded-r-xl"} 
                    classList={{ "rounded-l-xl": p.tags_val.length === 0 }}
                    onClick={() => setter()('metadata','tags', tags => [...tags, ''])}
                    ><p class="-mt-1" classList={{ "-ms-0.5": p.tags_val.length !== 0 }} >+</p>
                    </button>
                </>
            }</Show>
        </> 
    )
}
interface singleTag {
    tag: string,
    index: number,
    setter: SetStoreFunction<noteFrame>,
    class: string
}
function TagInput(p: singleTag) {
    const isLastTouched = createSelector(setLastClicked);
    let inputRef: HTMLInputElement | undefined ;

    async function updateConfig(val: string) {
        if (inputRef) {
            const rect = inputRef.getBoundingClientRect();
            const mapped_tags = (await searchTags(val)).map(v => {
                return { text: v.tag, action: () => p.setter('metadata', 'tags', p.index, v.tag) }
            }) satisfies quickButtons[];
            update_tagStore('options', 0, 'buttons', _ => mapped_tags)

            set_quickMenuConfig({ 
                coords: { x: (rect.right - 224), y: (rect.top + inputRef.offsetHeight) },
                show_menu: mapped_tags.length === 0 ? false : true,
                path: [],
                data: '',
                type: 'null', active_menu: 'tags'
            })
        }
    }

    function changeTag(val: string, index: number, setter: SetStoreFunction<noteFrame>) {
        if(val.trim() === "") return setter('metadata', 'tags', tags => [...tags.slice(0, index), ...tags.slice(index +1)])
        setter('metadata', 'tags', index, val)
    };
    
    return (
        <input type="text" value={p.tag} class={"TagInput "+p.class+" field-sizing-content"} 
        ref={inputRef}
        // onClick={updateConfig}
        onInput={e => updateConfig(e.currentTarget.value)} 
        onchange={e => changeTag(e.currentTarget.value, p.index, p.setter)} 
        classList={{
            "rounded-l-xl": p.index == 0,
            // "rounded-r-xl": i() == p.tags_val.length -1,
        }}
        placeholder="tag..." />
    )
}