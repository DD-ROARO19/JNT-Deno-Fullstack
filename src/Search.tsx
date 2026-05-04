import { toast } from "./components/notifications.tsx";
import { latCardSet } from "./signals.tsx";
import { searchParams, upd_searchParams } from "./stores.tsx";
import type { JSONObject, new_patternType } from "./types.tsx";
import type { pattern } from "../types.ts";


export class SearchError extends Error {
    constructor(
        public code: 'UNDEFINED_TOGGLE_SETTER' | 'BAD_QUERY' | 'SEARCH_FORM_EMPTY' 
        | 'INVALID_PATTERN' | 'UNDEFINED_SEARCH_PARAMS' | 'UNDEFINED_RESULT'
        | 'ERROR_WHILE_FORMATING_RESULT' | 'BAD_POST',
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
                
            case "BAD_POST":
                this.message += " - " + this.code;
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

const pattern_title_term = "TITLE__";
const search_url_term = "URL__";
export async function searchLink(patter: new_patternType) {
    upd_searchParams("resultName", undefined);
    try {
        let response = await queryURL();
        if (patter.packet_name) response = response[patter.packet_name]

        // (patter.packet_name && patter.packet_name.trim() !== "") ?
        //     (await queryURL(url))[patter.packet_name]
        //     : await queryURL(url);

        // if (Array.isArray(response)) response = response[0]

        console.log('response ', response);

        const result: JSONObject = {};
        // return patter.keys.reduce((acc, {key, val}) => {
        //     acc[val] = response[key]; return acc;
        // }, {} as JSONObject);

        if (patter.keys.length >= 1) {
            for (let i = 0; i < patter.keys.length; i++) {
                const { key, val } = patter.keys[i];
                if(pattern_title_term === val.toLocaleUpperCase()) { 
                    upd_searchParams("resultName", pv => !pv ? pv = (response[key] || undefined) 
                    : pv += '_' + (response[key] || undefined)); 
                    continue; 
                }

                if(search_url_term === key.toString().toLocaleUpperCase()) {
                    result[val] = searchParams.url!;
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
        if(Object.keys(result).length === 0 || Object.values(result).includes(searchParams.url!)) Object.assign(result, response);

        console.log('search: ', result);
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
        console.error(`queryURL: ${res.status} - ${res.statusText}`);
        throw new Error(await res.json())
    }

    const data = await res.json();
    console.debug('api response: ', data);

    return data
}

export async function query_patterns(id: string): Promise<pattern>;
export async function query_patterns(): Promise<pattern[]>;
export async function query_patterns(id?: string): Promise<pattern | pattern[]> {
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