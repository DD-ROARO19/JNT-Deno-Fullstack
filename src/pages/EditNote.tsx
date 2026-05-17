// import type { Note } from '../../types.ts';
import {
    createSignal,
    onMount,
    onCleanup
} from 'solid-js'
import { Edit, Erase } from '../assets/svgs.tsx'


function Title() {
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

    return (
        <>
            <div ref={titleBarRef} id="title" class={`p-2.5 bg-cyan-800 rounded-4xl flex justify-evenly place-items-center 
                transition-discrete duration-150 ease-in-out
                ${isFixed() ? 'fixed top-0 right-1/10 z-50 shadow-lg w-1/2 place-self-end' : 'relative'}
                `}
            >
                {/* <button type="button" class='group/title hover:bg-cyan-700 active:bg-cyan-900 w-15 rounded-xl cursor-pointer place-items-center' ><SearchSVG class='dark:group-active/search:stroke-cyan-600' /></button> */}
                <input type="text" placeholder='Title' class={`w-8/10 p-0.5 text-lg text-slate-200 
                bg-cyan-900 rounded ps-3 placeholder-slate-500/70 outline-0 focus:border-2 
                    border-slate-500 
                `} />
                {/* {props.children} */}
                <button type="button" class='group/save bg-cyan-700/70 hover:bg-cyan-700 
                active:bg-cyan-900 p-1.5 rounded cursor-pointer place-items-center'>
                    <Edit option={2} class="dark:cyan-500 dark:group-active/save:fill-white/70" />
                </button>
                <button type="button" class='group/erase bg-cyan-700/70 hover:bg-cyan-700 
                active:bg-cyan-900 p-1.5 rounded cursor-poin|ter place-items-center'>
                    <Erase class="dark:fill-cyan-500 dark:group-active/erase:fill-cyan-500/70" />
                </button>
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
    )
}


export default function EditNote() {

    return (
        <>
            <div class="m-4 dark:bg-cyan-800 min-h-30 rounded-2xl p-2 flex flex-col 
            hover:text-white">
                {/* Title */}
                <Title />

                {/* Content */}
                <div>

                </div>

            </div>
        </>
    )
}