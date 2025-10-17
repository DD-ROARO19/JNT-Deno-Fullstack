import { twMerge } from "tailwind-merge";
import type { ParentProps } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

import { SearchSVG } from "../assets/svgs.tsx";

function SearchBar(props: { class?: string, placeholder?: string } & ParentProps) {
    const [isFixed, setIsFixed] = createSignal(false);
    const [barHeight, setBarHeight] = createSignal(100);
    let searchBarRef: HTMLDivElement | undefined;

    onMount(() => {
        // console.log('Offset',searchBarRef?.offsetHeight);
        const scrollingContainer = document.querySelector('#Content');

        if (!searchBarRef || !scrollingContainer) {
            console.error("SearchBar couldn't find its ref or the #Content scrolling container.");
            return;
        };
        setBarHeight(searchBarRef.offsetHeight)

        function handleScroll() {
            setIsFixed(scrollingContainer!.scrollTop > barHeight())
        }

        scrollingContainer.addEventListener("scroll", handleScroll)
        onCleanup(() => scrollingContainer.removeEventListener("scroll", handleScroll))
    })

    return (
        <>
            <div ref={searchBarRef} id="SearchBar" class={twMerge(`p-2 my-3 bg-cyan-800 rounded-4xl flex justify-evenly place-items-center 
            transition-discrete duration-150 ease-in-out
            ${isFixed() ? 'fixed top-0 right-1/10 z-50 shadow-lg w-1/2 place-self-end' : 'relative'}
            `, props.class)}
            >
                <button class='group/search hover:bg-cyan-700 active:bg-cyan-900 w-15 rounded-xl cursor-pointer place-items-center' ><SearchSVG class='dark:group-active/search:stroke-cyan-600' /></button>
                <input type="text" placeholder={props.placeholder || 'Search'} class={`w-8/10 text-lg text-slate-200 bg-cyan-900 rounded-2xl ps-2.5 placeholder-slate-500/70 outline-0 focus:border-2 
                border-slate-500 
                `} />
                {props.children}
            </div>

            <div
                id="extra"
                class="transition-all"
                style={{
                    height: isFixed() ? `${barHeight()}px` : '0px',
                    display: isFixed() ? 'block' : 'none',
                }}
            />
        </>
    );
}

export default SearchBar