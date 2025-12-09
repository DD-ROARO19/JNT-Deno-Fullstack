// import type { Note } from '../../types.ts';
import {
    createSignal,
    onMount,
    onCleanup,
    For
} from 'solid-js'

import { newNote, setNewNote } from "../stores.tsx";
import { Edit2, Erase } from '../assets/svgs.tsx'


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
                {/* <input type="text" placeholder='Title' class={`w-8/10 p-0.5 text-lg text-slate-200 
                bg-cyan-900 rounded ps-3 placeholder-slate-500/70 outline-0 focus:border-2 
                    border-slate-500 
                `} /> */}
                <div class="relative w-8/10 p-0.5 text-lg text-slate-200 bg-cyan-900 rounded-lg ps-3 
                placeholder-slate-500/70 outline-0 focus:border-2 border-slate-500 ">
                    <input type="text" id="floating_outlined" class="block px-1.5 pb-1 pt-1.5 w-full text-md 
                    bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                        placeholder=" " onChange={e => setNewNote('metadata', 'title', e.currentTarget.value)} />
                    <label for="floating_outlined" class="absolute text-md text-body duration-300 transform 
                    -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-neutral-primary px-2 peer-focus:px-2 
                    peer-focus:text-fg-brand peer-placeholder-shown:scale-130 peer-placeholder-shown:-translate-y-1/2 
                    peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-4 
                    rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
                    pointer-events-none">Note Title</label>
                </div>
                {/* {props.children} */}
                <button type="button" class='group/save bg-cyan-700/70 hover:bg-cyan-700 
                active:bg-cyan-900 p-1.5 rounded cursor-pointer place-items-center'
                onClick={() => console.log('newNote', newNote.content)} >
                    <Edit2 class="dark:cyan-500 dark:group-active/save:fill-white/70" />
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

import { Keys } from "../components/Keys.tsx";
import { InputButton, OptionsMenu } from "../components/Select.tsx";
import { NewLineTwo } from '../components/Edit_Lines.tsx'
import type { lineMenu } from "../types.tsx";
import { addInput } from "../helpers.tsx";

export default function NewNote() {

    const rootPath = ['content']

    const addConfig: lineMenu = { 
        primary_inputs: { 
            open: true,
            title:'Select type',
            buttons: [
                { text: 'String', action: () => addInput(rootPath, 'string') },
                { text: 'Number', action: () => addInput(rootPath, 'number') },
                { text: 'Boolean', action: () => addInput(rootPath, 'boolean') },
                { text: 'Array', action: () => addInput(rootPath, 'array') },
                { text: 'Object', action: () => addInput(rootPath, 'object') },
            ]
        } 
    }

    return (
        <>
            <OptionsMenu />
            <div class="m-4 dark:bg-cyan-800 min-h-30 rounded-2xl p-2 flex flex-col 
            hover:text-white">
                {/* Title */}
                <Title />

                {/* Content */}
                <Keys>
                    <For each={newNote.content}>{(line, index) =>
                        <NewLineTwo type={line.type} index={index()} path={["content", index()]} />
                    }</For>
                    <InputButton path={["content", newNote.content.length]} config={addConfig}
                    class="rounded-xl mx-8 my-1 border-2 border-slate-700 hover:border-slate-600 
                    active:border-slate-700"/>
                </Keys>

            </div>
        </>
    )
}