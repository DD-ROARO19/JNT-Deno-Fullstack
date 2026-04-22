import { createSignal } from "solid-js";

// Style Theme
export const [light, setLight] = createSignal(false)

// InputType Menu Signals (for note edits)
export const [menuCoords, setMenuCoords] = createSignal({ x: 0, y: 0 })
export const [showInputMenu, openInputMenu] = createSignal(false)
export const [lastClicked, setLastClicked] = createSignal<HTMLButtonElement | undefined>();
import type { lineMenu } from './types.tsx'
export const [menuOpen, setMenuOpen] = createSignal('none');
export const [lineMenuConfig, setLineMenuConfig] = createSignal<lineMenu>({
    primary_inputs: { title: 'Inputs', buttons: [] }
});
import type { Setter } from "solid-js";
export const [latCardSet, lateralSetter] = createSignal<Setter<boolean> | undefined>(undefined)
export const [searchURL, upd_searchURL] = createSignal<string | undefined>('https://api.modrinth.com/v2/search?query=Create')