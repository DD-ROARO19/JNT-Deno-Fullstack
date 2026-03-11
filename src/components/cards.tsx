import { For } from 'solid-js';
import type { ParentProps } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';

import { twMerge } from 'tailwind-merge';
import { Edit, Erase } from '../assets/svgs.tsx';
// import SearchBar from './SearchBar.tsx';

import type { cardNote } from "../../types.ts";
// @ts-types="solid-js"
import { Show } from "solid-js";
// const arr = [0, 0, 0, 0, 0]

interface CardData {
    class?: string, 
    title: string, 
    snippet?: string, 
    tags: string[],
    onclick: (e: MouseEvent) => void 
}

function Card(props: ParentProps & CardData) {
    console.log('card', props);

    return (
        <div onclick={e => props.onclick(e)} class={twMerge(`group/card cursor-pointer dark:bg-cyan-700 
            h-59 rounded-2xl p-2 flex flex-col text-balance 
            hover:text-white select-none hover:outline-2 hover:outline-slate-400 outline-offset-4 
            text-slate-300/80 
        `, props.class)} >
            <h1 class='text-2xl'>{props.title || 'Note Name...'}</h1>
            <span class="flex gap-1 my-1">
                <For each={props.tags}>{(tag, i) =>                                 // << Note tags
                    <h2 class="bg-cyan-800 font-bold p-0.5 px-1.5 rounded-sm"
                    classList={{
                        "rounded-l-xl": i() == 0,
                        "rounded-r-xl": i() == props.tags.length -1,
                    }}
                    >{tag}</h2>                                                     // Note tags >>
                }</For>
            </span> 
            <Show when={props.snippet}> {/* Snippet show when using the search bar. */}
                <p note-content>{props.snippet || 'Json content...'}</p>
            </Show>
            {props.children}
        </div>
    );
}

export function CardList(props: { list: cardNote[] }) {
    const navigate = useNavigate();
    const location = useLocation();

    function newNote(e: MouseEvent) {
        e.stopPropagation()
        console.log('new');
        navigate('/new/' + location.pathname.slice(6), { resolve: true });
    }
    function openNote(e: MouseEvent, id: number) {
        e.stopPropagation()
        console.log('open =>', 'id: ' + id);
        navigate('/note/' + id, { resolve: true });
    }
    function editNote(e: MouseEvent, id: number) {
        e.stopPropagation()
        console.log('edit =>', 'id: ' + id);

    }
    function deleteNote(e: MouseEvent, id: number) {
        e.stopPropagation()
        console.log('delete =>', 'id: ' + id);

    }

    return (
        <>
            {/* <SearchBar /> */}
            <div class='max-h-dvh mt-4 grid gap-4.5 grid-cols-[repeat(auto-fit,minmax(20.75rem,1fr))]'>
                <For each={props.list}>{(item, _i) =>
                    <Card title={item.title} snippet={item.snippet} tags={JSON.parse(item.tags)} onclick={e => openNote(e, item.id)} >

                        <span class='group/edit opacity-0 group-hover/card:opacity-100 relative place-self-end mt-auto flex gap-1.5 transition-discrete delay-50 duration-150 ease-in-out' >
                            <button type="button" onclick={e => editNote(e, item.id)} title='Edit' class='cursor-pointer rounded p-1 hover:bg-cyan-600 active:bg-cyan-800' ><Edit /></button>
                            <button type="button" onclick={e => deleteNote(e, item.id)} title='Erase' class='cursor-pointer rounded p-1 hover:bg-cyan-600 active:bg-cyan-800' ><Erase /></button>
                        </span>

                    </Card>
                }</For>
                <Card onclick={e => newNote(e)} tags={[]} title='New Note' snippet='+' class={`[&>h1+[note-content]]:text-8x1 flex flex-col-reverse justify-center items-center text-center
                text-slate-300/40 hover:text-slate-300/70 pb-10
                `} />
            </div>
        </>
    );
}