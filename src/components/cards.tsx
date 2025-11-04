import { For } from 'solid-js';
import type { ParentProps } from 'solid-js';
import { useNavigate } from '@solidjs/router';

import { twMerge } from 'tailwind-merge';
import { Edit, Erase } from '../assets/svgs.tsx';
// import SearchBar from './SearchBar.tsx';

import type { Note } from "../../types.ts";
// const arr = [0, 0, 0, 0, 0]


function Card(props: ParentProps & { class?: string, title: string, content: string, onclick: (e: MouseEvent) => void }) {

    return (
        <div onclick={e => props.onclick(e)} class={twMerge(`group/card cursor-pointer dark:bg-cyan-700 h-60 rounded-2xl p-2 flex flex-col 
        hover:text-white select-none hover:outline-2 hover:outline-slate-400 outline-offset-4 text-slate-300/80 
        `, props.class)} >
            <h1 class='text-2xl'>{props.title || 'Note Name...'}</h1>
            <p note-content>{props.content || 'Json content...'}</p>
            {props.children}
        </div>
    );
}

export function CardList(props: { list: Note[] }) {
    const navigate = useNavigate();

    function newNote(e: MouseEvent) {
        e.stopPropagation()
        console.log('new');
        navigate('/note/create', { resolve: true });
    }
    function openNote(e: MouseEvent, id: string) {
        e.stopPropagation()
        console.log('open =>', 'id: ' + id);
        navigate('/note/' + id, { resolve: true });
    }
    function editNote(e: MouseEvent, id: string) {
        e.stopPropagation()
        console.log('edit =>', 'id: ' + id);

    }
    function deleteNote(e: MouseEvent, id: string) {
        e.stopPropagation()
        console.log('delete =>', 'id: ' + id);

    }

    return (
        <>
            {/* <SearchBar /> */}
            <div class='max-h-dvh mt-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(21.75rem,1fr))]'>
                <For each={props.list}>{(item, _i) =>
                    <Card title={item.title} content={item.content} onclick={e => openNote(e, item.id)} >

                        <span class='group/edit opacity-0 group-hover/card:opacity-100 relative place-self-end mt-auto flex gap-1.5 transition-discrete delay-50 duration-150 ease-in-out' >
                            <button type="button" onclick={e => editNote(e, item.id)} title='Edit' class='cursor-pointer rounded p-1 hover:bg-cyan-600 active:bg-cyan-800' ><Edit /></button>
                            <button type="button" onclick={e => deleteNote(e, item.id)} title='Erase' class='cursor-pointer rounded p-1 hover:bg-cyan-600 active:bg-cyan-800' ><Erase /></button>
                        </span>

                    </Card>
                }</For>
                <Card onclick={e => newNote(e)} title='New Note' content='+' class={`[&>h1+[note-content]]:text-8xl flex flex-col-reverse justify-center items-center text-center
                text-slate-300/40 hover:text-slate-300/70 pb-10
                `} />
            </div>
        </>
    );
}