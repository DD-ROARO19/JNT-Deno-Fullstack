// @ts-types="solid-js"
import {
    // createEffect, 
    createSignal,
    For,
    Show,
    onMount,
    createResource
} from 'solid-js';
// import { A } from "@solidjs/router";
// import { createStore } from "solid-js/store"

import logo from '../assets/solid.svg'
import { BackArrow, DownArrow, Home, ReloadArrow } from '../assets/svgs.tsx';
// import type { DOMElement } from 'solid-js/jsx-runtime';

import { isBarOpen, setBarOpen } from '../signals.tsx'

import { twMerge } from 'tailwind-merge';
import type { ParentProps } from 'solid-js';
import type { categoryItem } from "../types.tsx";

// const [list, setList] = createSignal<categoryItem[]>([])

async function getCategories(): Promise<categoryItem[]> {
    console.debug('Categories List ->', 'Loading');
    const res = await fetch('/api/categories/list', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });

    const data = await res.json();
    return data.slice(1);
}

const [list, { mutate, refetch }] = createResource(getCategories);

function CategoriesList() {
    // onMount(async () => {
    //     setList(await getCategories())
    // })

    const Pill = (props: ParentProps & { class?: string, data?: categoryItem, title?: string }) => {
        const style = twMerge(`w-19/20 h-8 rounded-lg m-2 pl-2 bg-cyan-800 place-self-end flex items-center 
        justify-between hover:bg-cyan-700 focus:outline-2 focus:outline-cyan-50 cursor-default`, props.class);

        return (!props.data) ?
            <a class={style} title={props.title}> {props.children} </a>
            :
            <a href={'/show' + props.data.full_path} class={style} title={props.title}>
                {props.children}
            </a>
    }

    function PillGroup(props: { categoryItem: categoryItem }) {
        const [isOpen, setOpen] = createSignal(true)

        function visibility() { return !isBarOpen() ? 'invisible' : 'visible' }
        function showSubs() { return !isOpen() ? 'hidden' : '' }

        return (
            <div class={`w-19/20 place-self-center transition-discrete delay-75 duration-100 ease-in ${visibility()}`}>
                <Pill data={props.categoryItem} title={props.categoryItem.created_at.toLocaleString()} >
                    <p class='cursor-default'>{props.categoryItem.alias}</p>
                    <Show when={props.categoryItem.childs && props.categoryItem.childs.length > 0} >
                        <DownArrow isDown={isOpen} setArrow={setOpen} />
                    </Show>
                </Pill>
                <For each={props.categoryItem.childs}>{(subItem) =>
                    <Pill data={subItem} class={`w-13/15 place-self-end ${showSubs()}`}>
                        <p>{subItem.alias}</p>
                    </Pill>
                }</For>
            </div>
        );
    }

    // const _newNote: CategoryNode = { id: -1, path: '', note_count: -1, name: '+', childs: [] }

    return (
        <>
            {/* <PillGroup categoryItem={ newNote } /> */}
            <div class={`w-19/20 place-self-center transition-discrete delay-75 duration-100 ease-in ${!isBarOpen() ? 'invisible' : 'visible'}`}>
                <Pill class="justify-center" title="Create new note">
                    <p>+</p>
                </Pill>
            </div>
            <For each={list()}>{(item) =>
                <PillGroup categoryItem={item} />
            }</For>
        </>
    );
}



const Sidebar = () => {
    function barWidth() { return isBarOpen() ? 'w-70 min-w-70' : 'w-15 min-w-15'; }

    const milis = 500;

    const HomeIcon = (props: { class?: string }) => <Home class={"w-10 h-10 m-3 cursor-pointer dark:fill-cyan-600 " + props.class} />;
    const BackIcon = (props: { class?: string }) => <BackArrow option={4} class={"w-10 h-10 m-3 cursor-pointer dark:fill-cyan-600 " + props.class} />;

    return (
        <div class={`h-dvh dark:bg-cyan-900 rounded-e-2xl ${barWidth()} select-none`} style={`transition: ${milis}ms`} >
            <div class="flex flex-row-reverse justify-between ">
                <img onclick={() => setBarOpen(p => !p)} src={logo} class='w-10 h-10 m-3 cursor-pointer' />
                <ReloadArrow class="w-10 h-10 m-3 dark:fill-cyan-600" onclick={refetch} />
                <HomeIcon />
                <BackIcon />
            </div>
            <div class="flex flex-wrap flex-col-reverse content-end">
                <HomeIcon class={`${isBarOpen() ? 'h-0 w-0 m-0' : ''} transition-discrete delay-75 duration-100 ease-in`} />
                <BackIcon class={`${isBarOpen() ? 'h-0 w-0 m-0' : ''} transition-discrete delay-75 duration-100 ease-in`} />
            </div>
            <CategoriesList />
        </div>
    );
}

export default Sidebar;