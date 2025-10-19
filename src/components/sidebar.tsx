import 'solid-js'

import logo from '../assets/solid.svg'
import { DownArrow } from '../assets/svgs.tsx';
// import type { DOMElement } from 'solid-js/jsx-runtime';

import { isBarOpen, setBarOpen } from '../signals.tsx'
import { 
    // @ts-types="solid-js"
    // createEffect, 
    createSignal, 
    For, // @ts-types="solid-js"
onMount, Show 
} from 'solid-js';
// import { createStore } from "solid-js/store"

import { twMerge } from 'tailwind-merge';
import type { ParentProps } from 'solid-js';

function processList(pathList: string[]) {
    const separatorFilter = pathList.map(v => v.split('/').slice(1)); // [['New Notes'], ['Cats'], ['Cats', 'Orage'], ['Cats', 'Black'], ['Dog', 'Chihuahuas'], ['Dog', 'Shiba']]
    const prevList: string[] = [...new Set(pathList.map(v => v.split('/').slice(1)[0]))]; // ['New Notes', 'Cats', 'Dog']
    
    const list: any = {}
    for (const category of prevList) {
        list[category] = separatorFilter.filter(va => va[0] == category && va.length > 1).map(i => i.slice(1))
    }
    return { list: list, plist: prevList }
}

function CategoriesList() {
    const [categories, setCategories] = createSignal([])

    onMount(async () => {
        const res = await fetch('/api/categories', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        let data: any = {}
        data = await res.json()
        console.log(data);
        setCategories(data.map((v: { path: any }) => v.path))
    })

    const { list, plist } = processList(categories())

    const Pill = (props: ParentProps & { class?: string }) => {
        return <button type="button" class={twMerge(`w-19/20 h-8 rounded-lg m-2 pl-2 bg-cyan-800 place-self-end flex items-center justify-between 
        hover:bg-cyan-700 focus:outline-2 focus:outline-cyan-50 
        `, props.class)}>
            {props.children}
        </button>
    }

    function PillGroup(props: { categoryItem: string }) {
        const [isOpen, setOpen] = createSignal(true)

        function visibility() { return !isBarOpen() ? 'invisible' : 'visible' }
        function showSubs() { return !isOpen() ? 'hidden' : '' }

        return (
            <div class={`w-19/20 place-self-center transition-discrete delay-75 duration-100 ease-in ${visibility()}`}>
                <Pill>
                    <p class='cursor-default'>{ props.categoryItem }</p>
                    <Show when={list[ props.categoryItem ].length > 0}>
                        <DownArrow isDown={isOpen} setArrow={setOpen} />
                    </Show>
                </Pill>
                <For each={list[ props.categoryItem ]}>{ (subItem) =>
                    <Pill class={`w-13/15 place-self-end ${showSubs()}`}>
                        <p>{subItem}</p>
                    </Pill>
                }</For>
            </div>
        );
    }

    return (
        <For each={plist}>{ (item) =>
            <PillGroup categoryItem={ item } />
        }</For>
    );
}



const Sidebar = () => {
    function barWidth() { return isBarOpen() ? 'w-70 min-w-70' : 'w-15 min-w-15'; }

    return (
        <div class={`h-dvh dark:bg-cyan-900 rounded-e-2xl ${barWidth()}`} style="transition: 0.5s" >
            <img onclick={() => setBarOpen(p => !p)} src={logo} class='w-10 h-10 m-3 place-self-end cursor-pointer' />
            <CategoriesList />
        </div>
    );
}

export default Sidebar;