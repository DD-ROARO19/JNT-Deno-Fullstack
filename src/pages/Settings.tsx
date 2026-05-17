// @ts-types="solid-js"
import {

} from "solid-js";

import ThemeSwitcher from "../components/ThemeSwitcher.tsx";

export default function SettingsMenu() {
    return (
        <div class="m-4 bg-app-surface w-3/4 p-2 flex flex-col 
        place-self-center rounded-lg shadow-md border border-app-muted">
            <ThemeSwitcher />
        </div>
    )
}