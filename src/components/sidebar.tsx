// @ts-types="solid-js"
import {
    // createEffect, 
    createSignal,
    For,
    Show,
    onMount,
    createResource,
    Switch,
    Match
} from 'solid-js';
// import { A } from "@solidjs/router";
// import { createStore } from "solid-js/store"

import logo from '../assets/solid.svg'
import { BackArrow, DownArrow, Home, ReloadArrow } from '../assets/svgs.tsx';
// import type { DOMElement } from 'solid-js/jsx-runtime';

// State of the lateral NavBar
const [isBarOpen, setBarOpen] = createSignal<boolean>(true)

import { twMerge } from 'tailwind-merge';
import type { ParentProps } from 'solid-js';
import type { categoryItem } from "../types.tsx";
import ThemeSwitcher, { ThemeTest } from "./ThemeSwitcher.tsx";
// @ts-types="solid-js"
import { createEffect } from "solid-js";

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

function CategoriesList(props: { list: categoryItem[] }) {
    // onMount(async () => {
    //     setList(await getCategories())
    // })

    const Pill = (props: ParentProps & { class?: string, data?: categoryItem, title?: string }) => {
        const style = twMerge(`w-19/20 h-8 rounded-lg m-2 pl-2 place-self-end flex items-center 
        justify-between focus:outline-2 cursor-default font-bold
        bg-app-active-secondary/40 focus:outline-app-muted text-app-text/75
        hover:bg-app-active-secondary active:bg-app-element`, props.class);

        return (!props.data) ?
            <a href={"/" + props.title?.toLowerCase()} class={style} title={props.title}> {props.children} </a>
            :
            <a href={'/show' + props.data.full_path} class={style} title={props.title}>
                {props.children}
            </a>
    }

    function PillGroup(props: { categoryItem: categoryItem }) {
        const [isOpen, setOpen] = createSignal(true)

        function visibility() { return !isBarOpen() ? 'invisible' : 'visible' }

        return (
            <div class={`w-19/20 place-self-center transition-discrete delay-75 duration-100 ease-in ${visibility()}`}>
                <Pill data={props.categoryItem} title={props.categoryItem.created_at.toLocaleString()} >
                    <p class='cursor-default'>{props.categoryItem.alias}</p>
                    <Show when={props.categoryItem.childs && props.categoryItem.childs.length > 0} >
                        <DownArrow isDown={isOpen} setArrow={setOpen} svg_class="fill-app-text/75" />
                    </Show>
                </Pill>
                <Show when={props.categoryItem.childs && props.categoryItem.childs.length > 0 && isOpen()}>
                    <For each={props.categoryItem.childs}>{(subItem) =>
                        <Pill data={subItem} class={`w-13/15 place-self-end`}>
                            <p>{subItem.alias}</p>
                        </Pill>
                    }</For>
                </Show>
            </div>
        );
    }

    // const _newNote: CategoryNode = { id: -1, path: '', note_count: -1, name: '+', childs: [] }

    return (
        <>
            {/* <PillGroup categoryItem={ newNote } /> */}
            <div class={`w-19/20 place-self-center transition-discrete delay-75 duration-100 ease-in ${!isBarOpen() ? 'invisible' : 'visible'}`}>
                <Pill class="justify-center" title="settings">
                    <p>Settings</p>
                </Pill>
            </div>
            <For each={props.list}>{(item) =>
                <PillGroup categoryItem={item} />
            }</For>
        </>
    );
}



const Sidebar = () => {

    onMount(() => {
        const savedNavState = localStorage.getItem('isNavOpen');
        // console.log('Sidebar Mount', savedNavState, savedNavState == 'false' ? false : true);
        if (savedNavState) setBarOpen(savedNavState == 'false' ? false : true)
    })

    createEffect(() => {
        const navState = isBarOpen();
        // console.log('SideBar Toggle! (Effect)', navState, String(navState))
        localStorage.setItem('isNavOpen', String(navState))
    })

    const [list, { mutate, refetch }] = createResource(getCategories);

    function barWidth() { return isBarOpen() ? 'w-70 min-w-70' : 'w-15 min-w-15'; }

    const milis = 500;

    const HomeIcon = (props: { class?: string }) => <Home class={"w-10 h-10 m-3 cursor-pointer fill-app-active " + props.class} />;
    const BackIcon = (props: { class?: string }) => <BackArrow option={4} class={"w-10 h-10 m-3 cursor-pointer fill-app-active " + props.class} />;

    return (
        <div id="sidebar" class={`h-dvh bg-app-sidebar rounded-e-2xl ${barWidth()} select-none flex flex-col overflow-hidden`} 
            style={`transition: ${milis}ms`}
            // classList={{ 'overflow-scroll': isBarOpen() }}
            >
            <div class="flex flex-row-reverse justify-between ">
                <img onclick={() => setBarOpen(p => !p)} src={logo} class='w-10 h-10 m-3 cursor-pointer' />
                <ReloadArrow class="w-10 h-10 m-3 fill-app-active" onclick={refetch} />
                <HomeIcon />
                <BackIcon />
            </div>
            <div class="flex flex-wrap flex-col-reverse content-end">
                <HomeIcon class={`${isBarOpen() ? 'h-0 w-0 m-0' : ''} transition-discrete delay-75 duration-100 ease-in`} />
                <BackIcon class={`${isBarOpen() ? 'h-0 w-0 m-0' : ''} transition-discrete delay-75 duration-100 ease-in`} />
            </div>
            <div id="scroll-content" class="flex-1 min-h-0"
            classList={{"overflow-y-scroll": isBarOpen()}} >
                <Switch>
                    <Match when={list.loading}>
                        <></>
                    </Match>
                    <Match when={list()}>
                        <CategoriesList list={list() || []} />
                    </Match>
                </Switch>
                <Show when={isBarOpen()}>
                    {/* <ThemeTest class="[&>div]:flex-1/3 m-1" /> */}
                    <ThemeSwitcher colorTest colorTest_class="[&>div]:flex-1/3 m-1" />
                </Show>
            </div>
        </div>
    );
}

export default Sidebar;