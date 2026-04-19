import { InputButton } from "./Select.tsx";
import type { lineMenu, lineMenuParams } from "../types.tsx";

type settingsBtnParams = {
    config: lineMenuParams;
    hover_class?: string;
}

export function LineSettingsBtn(props: { config: lineMenu, hover_class: string, text?: string }) {
    return (
        <InputButton config={props.config}
            icon={{ option: 1, class: 'w-3.5 h-3.5 fill-stone-300' }}
            class={`w-6.5 h-6.5 right-1 border-2 border-slate-800 rounded-sm
            invisible ${props.hover_class} hover:border-slate-600 
            active:border-slate-600/80 absolute`} />
    )
}

import { menuStore } from "../stores.tsx";

/** Button in charge of opening the popover menu settings of all "Primitive Components".  */
export function Prim_settingsBtn(props: settingsBtnParams) {
    const BtnComponent = menuStore.primitives.MenuOpenerBtn;

    return (
        <BtnComponent config={props.config}
            icon={{ option: 1, class: 'w-3.5 h-3.5 fill-app-text' }}
            class={`w-6.5 h-6.5 right-1 border-2 border-app-surface-secondary rounded-sm
            invisible ${props.hover_class} hover:border-slate-600 
            active:border-slate-600/80 absolute`}
        />
    )
}
/** Button in charge of opening the popover menu settings of all "Object Components".  */
export function Obj_settingsBtn(props: settingsBtnParams) {
    const BtnComponent = menuStore.objects.MenuOpenerBtn;

    return (
        <BtnComponent config={props.config}
            icon={{ option: 1, class: 'w-3.5 h-3.5 fill-app-text' }}
            class={`w-6.5 h-6.5 right-1 border-2 border-app-surface-secondary rounded-sm
            invisible ${props.hover_class} hover:border-slate-600 
            active:border-slate-600/80 absolute`}
        />
    )
}
/** Button in charge of opening the popover menu settings for the main element adder button.  */
export function MA_settingsBtn(props: settingsBtnParams) {
    const BtnComponent = menuStore.mainAddBtn.MenuOpenerBtn;

    return (
        <BtnComponent config={props.config}
            icon={{ option: 1, class: 'w-3.5 h-3.5 fill-app-text' }}
            class={`w-6.5 h-6.5 right-1 border-2 border-app-surface-secondary rounded-sm
            invisible ${props.hover_class} hover:border-slate-600 
            active:border-slate-600/80 absolute`}
        />
    )
}


export function MenuPopovers() {
    const Primitives = menuStore.primitives.MenuComponent;
    const Objects = menuStore.objects.MenuComponent;
    const MainAdder = menuStore.mainAddBtn.MenuComponent;

    return (
        <>
            <Primitives />
            <Objects />
            <MainAdder />
        </>
    )
}