export type menuButtons = { 
    text: string
    action: () => void
}
export type lineMenuConfig = { 
    inputs_titles: string
    extra_buttons?: menuButtons[] 
}

export type typeOfInputs = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';
export type LineContent = {
    type: typeOfInputs;
    key: string;
    value: JSONValue;
};
export type ArrayContent = { type: typeOfInputs; value: JSONValue; };

export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = {
    [key: string]: JSONValue;
}
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONArray = JSONValue[];