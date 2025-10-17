import 'solid-js'
import { For } from 'solid-js';
import type { ParentProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';
import { Edit, Erase } from '../assets/svgs.tsx';
import SearchBar from './SearchBar.tsx';

const arr = [0, 0, 0, 0, 0]


function newNote(e: MouseEvent) {
    e.stopPropagation()
    console.log('new');
    
}
function openNote(e: MouseEvent) {
    e.stopPropagation()
    console.log('open');
    
}
function editNote(e: MouseEvent) {
    e.stopPropagation()
    console.log('edit');
    
}
function deleteNote(e: MouseEvent) {
    e.stopPropagation()
    console.log('delete');
    
}


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

export function CardList() {

    return (
        <>
            <SearchBar />
            <div class='max-h-dvh mt-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(21.75rem,1fr))]'>
                <For each={arr}>{(_, i) =>
                    <Card title={'Note ' + i()} content='Sample Text' onclick={e => openNote(e)} >

                        <span class='group/edit opacity-0 group-hover/card:opacity-100 relative place-self-end mt-auto flex gap-1.5 transition-discrete delay-50 duration-150 ease-in-out' >
                            <button onclick={e => editNote(e)} title='Edit' class='cursor-pointer rounded p-1 hover:bg-cyan-600 active:bg-cyan-800' ><Edit /></button>
                            <button onclick={e => deleteNote(e)} title='Erase' class='cursor-pointer rounded p-1 hover:bg-cyan-600 active:bg-cyan-800' ><Erase /></button>
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