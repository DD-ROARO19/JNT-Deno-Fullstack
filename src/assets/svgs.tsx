import 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import { twMerge } from 'tailwind-merge';

export const DownArrow = (props: { class?: string, isDown: Accessor<boolean>, setArrow: Setter<boolean> }) => {
    function rotation() { return props.isDown() ? 'rotate-0' : 'rotate-180' }
    const c = `hover:bg-blend-luminosity hover:bg-cyan-500 rounded-2xl m-1.5 cursor-pointer active:bg-cyan-600 `;

    return (
        <button onclick={() => props.setArrow(p => !p)} class={twMerge(c, props.class)} >
            <svg class={`w-6 h-6 fill-black dark:fill-white ${rotation()}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" />
            </svg>
        </button>
    )
}

export const SearchSVG = (props: { class?: string }) => {
    return (
        <svg class={twMerge('h-8 dark:stroke-cyan-950/65', props.class)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const Edit = (props: { class?: string }) => {
    return (
        <svg class={twMerge('h-6 fill-black dark:fill-white', props.class)} viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                <g id="Dribbble-Light-Preview" transform="translate(-59.000000, -400.000000)" >
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path d="M3,260 L24,260 L24,258.010742 L3,258.010742 L3,260 Z M13.3341,254.032226 L9.3,254.032226 L9.3,249.950269 L19.63095,240 L24,244.115775 L13.3341,254.032226 Z" id="edit_fill-[#1480]" />
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const Edit2 = (props: { class?: string }) => {
    return (
        <svg class={twMerge('h-6 fill-black dark:fill-white', props.class)} viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                <g id="Dribbble-Light-Preview" transform="translate(-99.000000, -400.000000)" >
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path d="M61.9,258.010643 L45.1,258.010643 L45.1,242.095788 L53.5,242.095788 L53.5,240.106431 L43,240.106431 L43,260 L64,260 L64,250.053215 L61.9,250.053215 L61.9,258.010643 Z M49.3,249.949769 L59.63095,240 L64,244.114985 L53.3341,254.031929 L49.3,254.031929 L49.3,249.949769 Z" />
                    </g>
                </g>
            </g>
        </svg>
    )
}

export const Erase = (props: { class?: string }) => {
    return (
        <svg class={twMerge('h-6 fill-black dark:fill-white', props.class)} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path d="M18 3H8.446c-.44 0-1.071.236-1.402.525L.248 9.473a.682.682 0 0 0 0 1.053l6.796 5.947c.331.289.962.527 1.402.527H18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2.809 11l-2.557-2.557L10.078 14l-1.443-1.443L11.191 10 8.635 7.443 10.078 6l2.557 2.555L15.19 6l1.444 1.443L14.078 10l2.557 2.555L15.191 14z"/>
        </svg>
    )
}