import { createSignal } from "solid-js";

// State of the lateral NavBar
export const [isBarOpen, setBarOpen] = createSignal(true)

// Style Theme
export const [light, setLight] = createSignal(false)

// InputType Menu Signals (for note edits)
export const [menuCoords, setMenuCoords] = createSignal({ x: 0, y: 0 })
export const [showInputMenu, openInputMenu] = createSignal(false)
export const [lastClicked, setLastClicked] = createSignal<HTMLButtonElement | undefined>();
import type { lineMenuConfig } from './types.tsx'
export const [lineConfig, setLineConfig] = createSignal<lineMenuConfig>({inputs_titles: "Inputs"});