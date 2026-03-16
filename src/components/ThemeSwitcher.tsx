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
];

export function ThemeTest(props: { class?: string }) {
    return (
        <div class={twMerge("flex gap-1 flex-wrap pt-3 [&>div]:flex-1/8 [&>div]:h-10 [&>div]:rounded-sm text-center", props.class)}>
            <div class="bg-app-base" >base</div>
            <div class="bg-app-surface" >surf</div>
            <div class="bg-app-surface-secondary" >surf 2nd</div>
            <div class="bg-app-sidebar" >side</div>
            <div class="bg-app-element" >elem</div>
            <div class="bg-app-active" >act</div>
            <div class="bg-app-active-secondary" >act 2nd</div>
            <div class="bg-app-text text-app-element" >text</div>

            <div class="bg-app-muted" >muted</div>
            <div class="bg-app-property" >prop</div>
            <div class="bg-app-string" >str</div>
            <div class="bg-app-number" >num</div>
            <div class="bg-app-function" >func</div>
            <div class="bg-app-keyword" >keyw</div>
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
                            ? 'bg-app-active text-white' // Active state
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