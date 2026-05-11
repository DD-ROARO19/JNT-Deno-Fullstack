// @ts-types="solid-js"
import type { JSXElement } from "solid-js";
import type { Note, NoteMetadata, pattern } from "../types.ts";
import type { Category, CategoryNode } from "../types.ts";


// ##  MENUS  ##

export type menuButtons = {
    text: string
    action: () => void
    subButtons?: menuButtons[]
}
export type menuOption = { title: string; buttons: menuButtons[]; open?: boolean }
export type lineMenu = {
    primary_inputs: menuOption
    extra_options?: menuButtons[]
}

export type lineMenuParams = [path: (string | number)[], data: JSONPrimitive | LineContent[], type: typeOfInputs]
export type menuConfig = (...args: lineMenuParams) => lineMenu;


// ###  LATERAL PANELS  ###
type StringyfiedPattern = string
export type patternQuery = { 
    id:number, title: string, author: string, 
    pattern: StringyfiedPattern//, created_at: Date, last_updated: Date 
};
export type searchParamsType = { 
    formatedResult?: LineContent;   url?: string; 
    path?: (string | number)[];     resultName?: string;
    extra_results?: Record<string, JSONValue>;
}
export type quickButtons = {
    text: string;   icon?: JSXElement;
    action(): void
}
export type quickOptions = { 
    title: string;  render: 'same_menu' | 'collapse_menu' | 'another_menu' 
    buttons: quickButtons[]; 
} 


// ##  JSON TYPES  ##

export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = {
    [key: string]: JSONValue;
}
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONArray = JSONValue[];



// ##  Content Layout  ##

export type typeOfInputs = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';
export type LineContent = { 
    type: typeOfInputs;     key: string | number;
    value: JSONPrimitive | LineContent[];
};

type partialMetadata = Partial<Omit<Note, keyof NoteMetadata | 'content'>> & { directory_id?: number }

/** Frame for creating new notes. */
export interface noteFrame {
    metadata: Omit<NoteMetadata, 'directory_id' | 'content'> & partialMetadata;
    content: LineContent[]
}

// >> #  Input render components props  #
export type path_list = (string | number)[];
// export type path_list = ( "content" | number | ("value" | "key" | "type") )[];
export type inputsProps = { path: path_list }
// export type valid_data = JSONPrimitive | LineContent[];
export type lineProps = inputsProps & { 
    type: typeOfInputs;     path: path_list;
    index: number;          data: JSONPrimitive | LineContent[];
    key?: string | number;
} 
export type listsProps = {
    data: LineContent[];
    no_config?: boolean;
    full_addButton?: boolean;
}


// ##  API Related Types  ##

export type categoryItem = Category & Partial<Pick<CategoryNode, 'childs'>>

export interface fetchParams {
    path: string,       search?: string, 
    tags?: string[],    directOnly?: true
}
export type otherFetchParams = Omit<fetchParams, 'path'>;



// ##  THEMES  ##
export type themeOptions = 'default' | 'nord' | 'dracula' | 'deep-sea' 
    | 'midnight-purple' | 'forest-night' | 'ide-monokai' | 'cyber-amber' 
    | 'rose-pine' | 'solarized-dark' | 'gruvbox-material' | 'github-light'
    | 'solarized-light' | 'catppuccin-latte' | 'rose-pine-dawn'
    | 'coral-ocean-dark'
    ;