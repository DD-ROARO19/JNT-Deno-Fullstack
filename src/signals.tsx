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

// Lateral Search Panel
import type { Setter } from "solid-js";
export const [latCardSet, lateralSetter] = createSignal<Setter<boolean>>()

// Global App State
export const [isLoading, setLoadingState] = createSignal<'nope' | 'indeed' | 'finished'>("nope")