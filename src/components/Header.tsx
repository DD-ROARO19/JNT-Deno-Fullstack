// @ts-types="solid-js"
import {
    createSignal,
    onMount,
    onCleanup,
    For,
    Index,
    Show,
    createSelector,
    createResource
} from "solid-js";

import { CopySVG, Edit, Erase, SettingSVG } from "../assets/svgs.tsx";
import { toggleLateralCard } from "../Search.ts";
import { set_quickMenuConfig, update_tagStore, tagsStore, lastTouched, setLastTouched, quickMenuConfig } from "./QuickMenu.tsx";
import { copyToClipboard, SaveNote } from "../helpers.tsx";

import { unwrap, type SetStoreFunction } from "solid-js/store";
import type { noteFrame, quickOptions, quickButtons } from "../types.tsx";
import { objectsClosed, setObjectsClosed } from "../signals.tsx";
import { twMerge } from "tailwind-merge/es5";

// ## CHANGE PLACE: vv THIS vv
// # DEV: definition of dev state (maybe change to a togglable option?)
const dev = false;
const show_lastUpdate = true;
const headerType: 'sticky' | 'fixed' = 'sticky';

interface titleParams {
    onSave: () => void,
    onCopy: () => void,
    onErase: () => void,
    store_data: noteFrame,
    storeSetter: SetStoreFunction<noteFrame>,
    fixed_title?: boolean,
}

export default function Title(props: titleParams) {
    const metadata = props.store_data.metadata;
    const [advSettings, activate_advSettings] = createSignal(true);

    const [isFloating, setIsFloating] = createSignal(false);
    let titleBarRef: HTMLDivElement | undefined;
    let sentinelRef: HTMLDivElement | undefined;


    onMount(() => {
        const scrollingContainer = document.querySelector('#Content');

        if (!titleBarRef || !scrollingContainer || !sentinelRef) {
            console.error("Couldn't find headers related refs or the #Content scrolling container.");
            console.error('Header elements: ', { titleBarRef, sentinelRef, scrollingContainer });
            return;
        };
        // setBarHeight(titleBarRef.offsetHeight)

        const headerIntersection = new IntersectionObserver(
            ([entry]) => {
                setIsFloating(!entry.isIntersecting)
            }, {
            root: scrollingContainer,
            threshold: 0,
            rootMargin: '128px 0px 0px 0px'
        }
        );

        // function handleScroll() {
        //     setIsFixed(scrollingContainer!.scrollTop > barHeight())
        // }
        // scrollingContainer.addEventListener("scroll", handleScroll)
        // onCleanup(() => scrollingContainer.removeEventListener("scroll", handleScroll))

        headerIntersection.observe(sentinelRef);
        onCleanup(() => headerIntersection.disconnect());
    })


    const Class = {
        0: "p-2 max-h-fit rounded-md cursor-pointer place-items-center bg-app-surface-secondary",
        sticky: ['bg-app-element sticky self-center-safe top-2 z-2 shadow-lg w-full pt-2.5', 'w-full relative self-stretch'],
        fixed: ['bg-app-element fixed self-center-safe top-2 z-2 shadow-lg md:w-3/4 lg:w-1/2 pt-2.5', 'relative']
    } as const;

    return (
        <>
            <div ref={sentinelRef} class="h-[1px] w-full pointer-events-none" aria-hidden="true" />
            {/* <div id="ExtraSpace" class="w-full transition-all"
                style={{ height: isFixed() ? `${barHeight()}px` : 'auto' }}
            >
            </div> */}
            {/* #  Header content  # */}
            <div ref={titleBarRef} id="title" class={`NoteTitle p-1 pb-2.5 
            transition-all duration-150 ease-in-out 
            ${isFloating() ? Class[headerType][0] : Class[headerType][1]} 
            ${advSettings() ? 'rounded-2xl px-2.5' : 'rounded-4xl'}
            `}
                // style={{ width: `${sentinelRef!.offsetWidth ?? 0}px` }}
                classList={{
                    "px-4": isFloating() && !advSettings(),
                    // "sticky": headerType === 'sticky' 
                    // "sticky": !isFloating()
                }}
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
                    text-app-string" classList={{ "hidden": props.fixed_title }}>Note Title</label>
                    </div>
                    {/* {props.children} */}

                    {/* Save Note */}
                    <button type="button" class={'group/save ' + Class[0]}
                        title="Save Note"
                        onClick={props.onSave} >
                        <Edit option={2} class={`fill-app-text/70 group-hover/save:fill-app-text group-active/save:fill-app-active-secondary/70`} />
                    </button>

                    {/* Copy Content */}
                    {/* <button type="button" class={'group '+Class[0]}
                    title="Copy Note"
                    onClick={props.onCopy} >
                    <CopySVG class={`stroke-app-surface-secondary group-active:stroke-app-surface-secondary/70`} option={3} />
                </button> */}

                    {/* Erase Note */}
                    <button type="button" class={'group/erase ' + Class[0]}
                        title="Erase Note"
                        onclick={props.onErase} >
                        <Erase class={`fill-app-text/70 group-hover/erase:fill-app-text group-active/erase:fill-app-active-secondary/70`} />
                    </button>

                    {/* Expand Header */}
                    <button type="button" class={'group/adv ' + Class[0]}
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
                                    return <h2 id="author" class="font-semibold" title={`Created: ${localeDate}`}>{(show_lastUpdate ? 'C: ' : 'Created: ') + localeDate}</h2>
                                }}</Show>
                                <Show when={show_lastUpdate}>
                                    <Show when={metadata.last_updated}>{(date) => {
                                        const localeDate = new Date(date()).toLocaleString(undefined, { hour12: false, dateStyle: 'short', timeStyle: 'short' })
                                        return <h2 id="author" class="font-semibold" title={`Last updated: ${localeDate}`}>U: {localeDate}</h2>
                                    }}</Show>
                                </Show>
                            </div>
                            <div id="buttons" class="flex gap-1 shrink min-w-0">
                                {/* # DEV: Log Note */}
                                <Show when={dev}>
                                    <button type="button" class={`group/copy text-app-text/70 font-semibold hover:text-app-text
                                active:text-app-active-secondary/70 flex min-w-10 shrink items-center `+ Class[0]}
                                        title="Log note"
                                        onClick={() => console.log(structuredClone(unwrap(props.store_data)))} >
                                        <CopySVG class={`stroke-app-text/70 group-hover/copy:stroke-app-text group-active/copy:stroke-app-active-secondary/70`} option={3} />
                                        Log Note
                                    </button>
                                </Show>

                                {/* Open / Close - objects or arrays */}
                                <button type="button" class={`text-app-text/70 font-semibold hover:text-app-text
                            active:text-app-active-secondary/70 flex min-w-10 shrink items-center `+ Class[0]}
                                    title="Toggle objects & arrays"
                                    onclick={() => setObjectsClosed(p => !p)}>
                                    <p class="truncate">{objectsClosed() ? 'Close all objects' : 'Open all objects'}</p>
                                </button>

                                {/* Copy Content */}
                                <button type="button" class={'group/copy ' + Class[0]}
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
        </>
    )
}

type tagJSON = { tag: string, count: number }
async function searchTags(val: string): Promise<tagJSON[]> {
    const res = await fetch('/api/tags/' + val, {
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

function focusElement(target: Element | null) {
    if (target && (target.id === 'addTag-btn' || target.classList.contains('TagInput'))) (target as HTMLElement).focus()
}

interface TagsParams {
    tags_val: noteFrame["metadata"]["tags"],
    store_setter?: SetStoreFunction<noteFrame>
};
function TagsComponent(p: TagsParams) {
    const Class = `bg-app-function hover:bg-app-active-secondary group-hover/card:text-app-element text-app-surface font-bold px-1.5 rounded-sm `;

    return (
        <>
            <Show when={p.store_setter} fallback={
                <Index each={p.tags_val}>{(tag, i) =>
                    <h2 class={Class}
                        classList={{
                            "rounded-l-xl": i == 0,
                            "rounded-r-xl": i == p.tags_val.length - 1,
                        }}
                    >{tag()}</h2>
                }</Index>
            }>{
                    (setter) => <>
                        <Index each={p.tags_val}>{(tag, i) =>
                            <TagInput class={Class} index={i} setter={setter()} tag={tag()} />
                        }</Index>
                        <button id="addTag-btn" type="button" class={Class + " rounded-r-xl"}
                            classList={{ "rounded-l-xl": p.tags_val.length === 0 }}
                            onClick={() => setter()('metadata', 'tags', tags => [...tags, ''])}
                            onKeyDown={e => { if(e.key === 'ArrowLeft')focusElement(e.currentTarget.previousElementSibling); }}
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
    const isLastTouched = createSelector(lastTouched);
    let inputRef: HTMLInputElement | undefined;


    async function updateConfig(val: string) {
        if (inputRef) {
            const mapped_tags = (await searchTags(val)).map(v => {
                return { text: v.tag, action: () => p.setter('metadata', 'tags', p.index, v.tag) }
            }) satisfies quickButtons[];
            update_tagStore('options', 0, 'buttons', _ => mapped_tags || [])

            if (!isLastTouched(inputRef)) {
                setLastTouched(inputRef)
            }

            set_quickMenuConfig({
                // coords: { x: (rect.right - 224), y: (rect.top + inputRef.offsetHeight) },
                show_menu: mapped_tags.length === 0 ? false : true,
                // show_menu: true,
                path: [],
                data: '',
                type: 'null', active_menu: 'tags'
            })
        }
    }

    function changeTag(val: string, index: number, setter: SetStoreFunction<noteFrame>) {
        if (val.trim() === "") return setter('metadata', 'tags', tags => [...tags.slice(0, index), ...tags.slice(index + 1)])
        setter('metadata', 'tags', index, val)
    };

    return (
        <input type="search" value={p.tag} class={twMerge("TagInput field-sizing-content", p.class,
            // `placeholder-app-surface-secondary text-app-text`
        )}
            ref={inputRef} placeholder="tag..."
            onClick={() => { if (p.tag === '') { updateConfig('') }; }}
            onInput={e => updateConfig(e.currentTarget.value)}
            onChange={e => changeTag(e.currentTarget.value, p.index, p.setter)}
            onKeyDown={e => {
                // if (e.shiftKey && e.altKey) {
                //     switch (e.key) {
                //         case 'ArrowLeft': focusPrevious
                //             break;
                //         case 'ArrowRight': focusNext
                //             break;

                //         default:
                //             break;
                //     }
                // }

                if (e.key === 'Enter') { e.preventDefault();
                    // const target = e.currentTarget.value.trim() === '' ? e.currentTarget.previousElementSibling : e.currentTarget.nextElementSibling
                    const target = e.currentTarget.nextElementSibling
                    changeTag(e.currentTarget.value, p.index, p.setter); // e.currentTarget.blur();
                    focusElement(target)
                };
                if (e.key === 'Backspace' && e.currentTarget.value.trim() === '') { e.preventDefault()
                    focusElement(e.currentTarget.previousElementSibling)
                    p.setter('metadata', 'tags', tags => [...tags.slice(0, p.index), ...tags.slice(p.index + 1)])
                };
            }}
            classList={{
                "rounded-l-xl": p.index == 0,
                // "placeholder-app-surface-secondary/50": p.tag.trim() === ''
            }}
        />
    )
}