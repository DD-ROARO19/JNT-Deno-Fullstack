export type menuButtons = { 
    text: string
    action: () => void
    subButtons?: menuButtons[]
}
export type menuOption = { title: string; buttons: menuButtons[]; open?: boolean }
export type lineMenu = { 
    // inputs_titles: string
    primary_inputs: menuOption
    extra_options?: menuButtons[]
}

export type typeOfInputs = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';
export type LineContent = {
    type: typeOfInputs;
    key: string | number;
    value: JSONPrimitive | LineContent[];
};
// export type ArrayContent = { type: typeOfInputs; value: JSONValue; };

export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = {
    [key: string]: JSONValue;
}
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONArray = JSONValue[];