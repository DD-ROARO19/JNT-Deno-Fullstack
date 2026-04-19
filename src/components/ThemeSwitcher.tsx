import {
    For,
} from "solid-js";
import { loadTheme } from "../themes.tsx";

import type { themeOptions } from "../types.tsx";
import { twMerge } from "tailwind-merge/es5";
// @ts-types="solid-js"
import { Show } from "solid-js";

const themes: { id: themeOptions; label: string }[] = [
    { id: "default", label: 'Default' },
    { id: "deep-sea", label: 'DeepSea' },
    { id: "ide-monokai", label: 'IDE' },
    { id: "dracula", label: 'Dracula' },
    { id: "nord", label: 'Nord' },
    { id: "cyber-amber", label: 'Amber' },
    { id: "forest-night", label: 'ForestNight' },
    { id: "gruvbox-material", label: 'Gruvbox' },
    { id: "midnight-purple", label: 'MidnightPurple' },
    { id: "rose-pine", label: 'RosePine' },
    { id: "solarized-dark", label: 'SolarizedDark' },
    { id: "solarized-light", label: 'Solarized' },
    { id: "github-light", label: 'Light' },
    { id: "catppuccin-latte", label: 'Latte' },
    { id: "rose-pine-dawn", label: 'RoseDawn' },
    { id: "coral-ocean-dark", label: 'DarkCoralOcean' },
];

export function ThemeTest(props: { class?: string }) {
    return (
        <div class={twMerge(`flex gap-1 flex-wrap pt-3 [&>div]:flex-1/8 [&>div]:h-10 [&>div]:rounded-sm 
        text-center text-app-text`, props.class)}>
            <div class="bg-app-base" ><p>base</p></div>
            <div class="bg-app-surface" ><p>surf</p></div>
            <div class="bg-app-surface-secondary" ><p>surf 2nd</p></div>
            <div class="bg-app-sidebar" ><p>side</p></div>
            <div class="bg-app-element" ><p>elem</p></div>
            <div class="bg-app-active text-app-base" ><p>act</p></div>
            <div class="bg-app-active-secondary" ><p>act 2nd</p></div>
            <div class="bg-app-text text-app-base" ><p>text</p></div>

            <div class="bg-app-muted" ><p>muted</p></div>
            <div class="bg-app-property text-app-base" ><p>prop</p></div>
            <div class="bg-app-string text-app-base" ><p>str</p></div>
            <div class="bg-app-number text-app-base" ><p>num</p></div>
            <div class="bg-app-function text-app-base" ><p>func</p></div>
            <div class="bg-app-keyword text-app-base" ><p>keyw</p></div>
        </div>
    )
}

interface switcherProps {
    colorTest?: true,
    colorTest_class?: string
}
export default function ThemeSwitcher(props: switcherProps) {
    const [currentTheme, setTheme] = loadTheme();

    return (
        <div class="p-4">
            <h3 class="font-bold mb-3 text-app-text">Select Theme</h3>
            <div class="flex gap-2 flex-wrap">
                <For each={themes}>{(t) => (
                    <button type="button"
                        class={`px-3 py-1 rounded transition-colors ${currentTheme() === t.id
                            ? 'bg-app-active' // Active state
                            : 'bg-app-base text-app-muted hover:bg-app-element' // Inactive state
                            }`}
                        onClick={() => setTheme(t.id)}
                    >
                        {t.label}
                    </button>
                )}</For>
            </div>
            <Show when={props.colorTest}>
                <ThemeTest class={props.colorTest_class} />
            </Show>
        </div>
    );
};