import type { Note, NoteMetadata } from "../types.ts";
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
export type inputsProps = { path: (string | number)[] }
export type lineProps = inputsProps & { 
    type: typeOfInputs;     path: (string | number)[];
    index: number;          data: JSONPrimitive | LineContent[];
    key?: string | number;
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
    ;