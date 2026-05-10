import { toast } from "./components/notifications.tsx";
import { latCardSet } from "./signals.tsx";
import { searchParams, upd_searchParams } from "./stores.tsx";
import type { JSONObject, patternQuery } from "./types.tsx";
import type { pattern } from "../types.ts";


export class SearchError extends Error {
    constructor(
        public code: 'UNDEFINED_TOGGLE_SETTER' | 'BAD_QUERY' | 'SEARCH_FORM_EMPTY' 
        | 'INVALID_PATTERN' | 'UNDEFINED_SEARCH_PARAMS' | 'UNDEFINED_RESULT'
        | 'ERROR_WHILE_FORMATING_RESULT' | 'UNDEFINED_STORE'
        | 'APPLY_ERROR',
        // error?: Error,
        message?: string,
    ) {
        super(message);
        this.name = "Search validation error";

        switch (this.code) {
            case "UNDEFINED_TOGGLE_SETTER":
                this.message = 'Setter for lateral card render toggle undefined!';
                break;

            case "BAD_QUERY":
                this.message += " - " + this.code;
                break;

            case "SEARCH_FORM_EMPTY":
                this.message = "Please fill query pattern form"
                break;

            case "INVALID_PATTERN":
                this.message += " - " + this.code;
                break;

            case "UNDEFINED_SEARCH_PARAMS":
                this.message ? this.message += ' - Invalid search parameters!'
                : this.message = 'Invalid search parameters!';
                break;

            case "UNDEFINED_RESULT":
                this.message = 'There isn\'t any result to apply!';
                break;
                
            case "ERROR_WHILE_FORMATING_RESULT":
                this.message = 'Error while formating result';
                break;

            case "UNDEFINED_STORE":
                this.message = 'Either store or storeSetter undefined!';
                break;

            case "APPLY_ERROR":
                this.message = this.code + ' - ' + this.message;
                break;

            default:
                this.code satisfies never;
                this.message += " - UNDEFINED_CASE";
                break;
        }

        console.error(this, { ...this });
        toast().newNotification(this.message)
    }
}

export class UploadError extends Error {
    constructor(
        public code: 'EMPTY_PATTERN_TITLE' | 'BAD_UPLOAD',
        message?: string
    ) {
        super(message);
        this.name = "Search validation error";

        switch (this.code) {
            case 'EMPTY_PATTERN_TITLE':
                this.message = "Please make shure to include any title!";
                break;

            case "BAD_UPLOAD":
                this.message = this.message ? this.message + " - " + this.code 
                : "Error while uploading pattern :(";
                break;
        
            default:
                this.code satisfies never;
                this.message += " - UNDEFINED_CASE";
                break;
        }

        console.error(this, { ...this });
        toast().newNotification(this.message)
    }
}

export function toggleLateralCard(state?: boolean) {
    const setterSignal = latCardSet();
    if (!setterSignal) throw new SearchError("UNDEFINED_TOGGLE_SETTER");
    if (Object.keys(searchParams).length === 0) throw new SearchError("UNDEFINED_SEARCH_PARAMS");

    state ? setterSignal(state) : setterSignal(p => !p);
};

export function prepareSearchPanel(new_url:string, path: (string | number)[]) {
    upd_searchParams("url", new_url);
    upd_searchParams("path", path);
    toggleLateralCard(true);
}

const terms = {
    keys: {
        current_url: "__URL",
        current_title: "__TITLE",
    },
    vals: {
        pattern_title: "TITLE_ADD__",
        newline_value: "ADD_IN__",
    }
} as const
// const pattern_title_term = "TITLE__";
// const search_url_term = "URL__";
// const newline_term = "ADD_IN__*";
export async function searchLink(patter: pattern) {
    upd_searchParams("resultName", undefined);
    try {
        let response = await queryURL();
        // if (patter.packet_name) response = response[patter.packet_name]

        // (patter.packet_name && patter.packet_name.trim() !== "") ?
        //     (await queryURL(url))[patter.packet_name]
        //     : await queryURL(url);

        // if (Array.isArray(response)) response = response[0]

        console.log('searchLink pattern', patter);

        const result: JSONObject = {};
        // return patter.keys.reduce((acc, {key, val}) => {
        //     acc[val] = response[key]; return acc;
        // }, {} as JSONObject);

        if (patter.keys.length >= 1) { // ## We need to make shure there is keys to filter the response.
            for (let i = 0; i < patter.keys.length; i++) {
                const { key, val } = patter.keys[i];
                if(terms.vals.pattern_title === val.toLocaleUpperCase()) { // ## USE this value for the key of property. 
                    upd_searchParams("resultName", pv => !pv ? pv = (response[key] || undefined) 
                    : pv += '_' + (response[key] || '')); 
                    continue; 
                }
                
                // ## ADDs the current url used for the query search to the result object.
                if(terms.keys.current_url === key.toString().toLocaleUpperCase()) { 
                    result[val] = searchParams.url!;
                    continue;
                }

                // # IN PROGRESS: Desire to add a NewLine with this value to the note
                if (val.toLocaleUpperCase().startsWith(terms.vals.newline_value)) {
                    if (val.toLocaleUpperCase().startsWith(terms.vals.newline_value + '{')
                    && val.toLocaleUpperCase().endsWith('}')) {
                        const name = val.slice(terms.vals.newline_value.length +1, -1)
                        upd_searchParams("extra_results", pv => (!pv)
                            ? Object.fromEntries([ [name, response[key]] ]) // if the object doesn't exist: create it with this! 
                            : ( pv[name] && Array.isArray(pv[name]) )       // vv -- for this -- vv
                            ? pv[name] = [...pv[name], response[key]]       // if it's already an array: add one item! 
                            : (pv[name]) ? [pv[name], response[key]]        // if it isn't an array: transform it to one!
                            : pv[name] = response[key]                      // else: add this value to the object.
                        ); 
                        continue;
                        /* # TODO: Function to search thro parent, or root, object 
                        *  for an already existing property with this name to add this new value 
                        *  (NOT for use in this place - FOR USE in `ApplyResult`) 
                        */
                    }
                    
                    upd_searchParams("extra_results", pv => !pv ? { '': response[key] } 
                        : pv[''] = response[key] );
                    continue;
                }
                
                if (!val) {
                    // Object.assign(result, response[key]) 
                    // result = response[key]
                    response = response[key]
                } else result[val] = response[key] || null;

                // console.log(key, ': ', val, ' => ', response[key]);
            }
        }
        // ## Yeah for if you need the URL as a property you get everything else, or, assigning the `response` to the `result` when you've only been unwrapping.
        if(Object.keys(result).length === 0 || Object.values(result).includes(searchParams.url!)) Object.assign(result, response);

        // console.log('search: ', result);
        return result;
    } catch (err) {
        if (err instanceof Error) throw new SearchError('BAD_QUERY', err.message)
    }
}

async function queryURL() {
    if (!searchParams.url) throw new SearchError("BAD_QUERY", 'No URL given!')

    const res = await fetch(searchParams.url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        // console.error(`queryURL: ${res.status} - ${res.statusText}`);
        throw new Error((await res.json())?.error)
    }

    const data = await res.json();
    console.debug('QueryURL response: ', data);

    return data
}

export async function query_patterns(id: string): Promise<patternQuery>;
export async function query_patterns(): Promise<patternQuery[]>;
export async function query_patterns(id?: string): Promise<patternQuery | patternQuery[]> {
    const url = id ? `/api/patterns/${id}` : '/api/patterns/query';
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!res.ok) {
        console.error(`queryURL: ${res.status} - ${res.statusText}`);
        throw new Error(await res.json())
    }

    const data = await res.json();
    console.debug('Patterns => ', data);
    
    return data;
}

export async function uploadPattern(pattern: pattern, id?: number | string) {
    if(pattern.title.trim() === "") throw new UploadError("EMPTY_PATTERN_TITLE");
    
    const url = id ? `/api/patterns/${id}/update` : '/api/patterns/new'

    const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            author: 'USER', // TEMPORARY | will need to query cache for username.
            pattern
        })
    })

    if (!response.ok) {
        console.error({ url, method: id ? 'PUT' : 'POST', pattern })
        throw new UploadError("BAD_UPLOAD", (await response.json())?.code);
    }

    console.debug(`Pattern ${pattern.title} successfully saved!`);
};
export async function deletePattern(id: number | string) {
    const url = `/api/patterns/${id}/erase`;

    const res = await fetch(url, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) {
        throw new SearchError("BAD_QUERY", (await res.json())?.code);
    }

    console.debug(await res.json());
};