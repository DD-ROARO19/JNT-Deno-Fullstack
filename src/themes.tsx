import { onMount, 
    createSignal,
    createEffect 
} from "solid-js";

import type { themeOptions } from "./types.tsx";


export const [theme, setTheme] = createSignal<themeOptions>('default')

export function loadTheme() {
    onMount(() => {
        const savedTheme = localStorage.getItem('theme') as themeOptions;
        if (savedTheme) setTheme(savedTheme);
    })

    createEffect(() => {
        const current = theme();
        document.documentElement.setAttribute('data-theme', current);
        localStorage.setItem('theme', current); 
    })

    return [theme, setTheme] as const
}