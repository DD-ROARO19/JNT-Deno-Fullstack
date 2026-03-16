// @ts-types="solid-js"
import { createSignal, onCleanup, onMount } from "solid-js";
import type { ParentProps, Setter, Accessor } from "solid-js";

import type { otherFetchParams } from '../types.tsx'
import { twMerge } from "tailwind-merge";
import { SearchSVG } from "../assets/svgs.tsx";

interface barProps {
    class?: string, placeholder?: string,
    setter: Setter<otherFetchParams>,
    // value: Accessor<otherFetchParams>
}

function SearchBar(props: barProps & ParentProps) {
    const [isFixed, setIsFixed] = createSignal(false);
    const [barHeight, setBarHeight] = createSignal(100);
    let searchBarRef: HTMLDivElement | undefined;

    onMount(() => {
        // console.log('Offset',searchBarRef?.offsetHeight);
        const scrollingContainer = document.querySelector('#Content');

        if (!searchBarRef || !scrollingContainer) {
            console.error("SearchBar couldn't find its ref or the #Content scrolling container.");
            console.error('searchBarRef: ', searchBarRef); console.error('scrollingContainer: ', scrollingContainer);
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
            <div ref={searchBarRef} id="SearchBar" class={twMerge(`p-2 my-3 bg-app-surface rounded-4xl flex justify-evenly place-items-center 
            transition-discrete duration-150 ease-in-out
            ${isFixed() ? 'fixed top-0 right-1/10 z-50 shadow-lg w-1/2 place-self-end' : 'relative'}
            `, props.class)}
            >
                <button type="button" class='group/search w-15 rounded-xl cursor-pointer 
                place-items-center hover:bg-app-element/50 active:bg-app-element 
                ' >
                    <SearchSVG class='stroke-app-muted group-active/search:stroke-app-active' />
                </button>
                <input type="text" placeholder={props.placeholder || 'Search bar'}
                    class={`w-8/10 text-lg rounded-2xl ps-2.5 
                text-app-text bg-app-surface-secondary 
                placeholder-app-string outline-0 focus:outline-3
                outline-app-active`}
                    onInput={(e) => props.setter(prev => ({ ...prev, search: e.currentTarget.value ? e.currentTarget.value + '*' : '' }))} />
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