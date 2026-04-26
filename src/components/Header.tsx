// @ts-types="solid-js"
import { 
    createSignal, 
    onMount,
    onCleanup
} from "solid-js";

import type { SetStoreFunction } from "solid-js/store";
import type { noteFrame } from "../types.tsx";

import { CopySVG, Edit2, Erase } from "../assets/svgs.tsx";
import { toggleLateralCard } from "../Search.tsx";
// import { copyToClipboard, SaveNote } from "../helpers.tsx";

interface titleParams {
    onSave: () => void,
    onCopy: () => void,
    onErase: () => void,
    value: string,
    titleSetter: SetStoreFunction<noteFrame>,
}

export default function Title(props: titleParams) {
    const [isFixed, setIsFixed] = createSignal(false);
    const [barHeight, setBarHeight] = createSignal(100);
    let titleBarRef: HTMLDivElement | undefined;

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

    const btnColors = "bg-app-active/50 hover:bg-app-active active:bg-app-active/10";

    return (
        <>
            <div ref={titleBarRef} id="title" class={`NoteTitle p-2.5 rounded-4xl flex justify-between 
            transition-discrete duration-150 ease-in-out
                ${isFixed() ? 'bg-app-element fixed top-2 self-center-safe z-50 shadow-lg w-1/2 justify-evenly' 
                    : 'relative'}
                `}
            >
                <div class="relative w-8/10 p-0.5 text-lg bg-app-surface-secondary rounded-lg ps-3 
                placeholder-app-muted/70 outline-0 focus:border-2 border-app-borders font-semibold">
                    <input type="text" id="floating_outlined" class="block px-1.5 pb-1 pt-1.5 w-full text-md 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer
                    text-app-function"
                        placeholder="" value={props.value} onChange={e => props.titleSetter('metadata', 'title', e.currentTarget.value)} />
                    <label for="floating_outlined" class="absolute text-md text-body duration-300 transform 
                    -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 
                    peer-focus:text-fg-brand peer-placeholder-shown:scale-130 peer-placeholder-shown:-translate-y-1/2 
                    peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none
                    text-app-string">Note Title</label>
                </div>
                {/* {props.children} */}
                {/* Save Note */}
                {/* <button type="button" class={'group/save p-1.5 rounded cursor-pointer place-items-center '+btnColors}
                    title="Save Note"
                    onClick={props.onSave} >
                    <Edit2 class={`fill-app-surface-secondary group-active/save:fill-app-surface-secondary/70`} />
                </button> */}
                {/* Copy Content */}
                <button type="button" class={'group p-1.5 rounded cursor-pointer place-items-center '+btnColors}
                    title="Copy Note"
                    onClick={props.onCopy} >
                    <CopySVG class={`stroke-app-surface-secondary group-active:stroke-app-surface-secondary/70`} option={3} />
                </button>
                <button type="button" class={'group p-1.5 rounded cursor-pointer place-items-center '+btnColors}
                    title="Copy Note"
                    onClick={() => toggleLateralCard()} >
                    <CopySVG class={`stroke-app-surface-secondary group-active:stroke-app-surface-secondary/70`} option={3} />
                </button>
                {/* Erase Note */}
                {/* <button type="button" class={'group/erase p-1.5 rounded cursor-pointer place-items-center '+btnColors}
                    title="Erase Note"
                    onclick={props.onErase} >
                    <Erase class={`fill-app-surface-secondary group-active/erase:fill-app-surface-secondary/70`} />
                </button> */}
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