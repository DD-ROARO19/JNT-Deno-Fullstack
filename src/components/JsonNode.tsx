import { For, Show } from "solid-js";
import type { JSONValue, JSONObject } from "../types.tsx";

type JsonNodeProps = {
    name: string; // The "key" for this node
    value: JSONValue;
    // Callback to update this specific node's value
    onUpdateValue: (newValue: JSONValue) => void;
    // Callback to rename this node's key (optional, only for object properties)
    onRenameKey?: (newKey: string) => void;
}

export function JsonNode(props: JsonNodeProps) {

    // Helper to detect type
    const isObject = (v: JSONValue): v is JSONObject =>
        typeof v === "object" && v !== null && !Array.isArray(v);

    const isArray = (v: JSONValue): v is JSONValue[] =>
        Array.isArray(v);

    return (
        <div style={{ "margin-left": "20px", "border-left": "1px solid #ccc", "padding-left": "10px" }}>
            <div style={{ display: "flex", gap: "10px", "align-items": "center", "margin-bottom": "5px" }}>

                {/* KEY INPUT: Only editable if onRenameKey is provided */}
                <Show when={props.onRenameKey} fallback={<strong>{props.name}:</strong>}>
                    <input
                        type="text"
                        value={props.name}
                        style={{ "font-weight": "bold", width: "100px" }}
                        onInput={(e) => props.onRenameKey?.(e.currentTarget.value)}
                    />
                    <span>:</span>
                </Show>

                {/* VALUE INPUT: If primitive */}
                <Show when={!isObject(props.value) && !isArray(props.value)}>
                    <input
                        type="text"
                        value={String(props.value)}
                        onInput={(e) => props.onUpdateValue(e.currentTarget.value)}
                    />
                </Show>

                {/* TYPE INDICATORS for Objects/Arrays */}
                <Show when={isObject(props.value)}>{`{ Object }`}</Show>
                <Show when={isArray(props.value)}>{`[ Array ]`}</Show>
            </div>

            {/* RECURSION: Object Handling */}
            <Show when={isObject(props.value)}>
                <For each={Object.keys(props.value as JSONObject)}>
                    {(childKey) => (
                        <JsonNode
                            name={childKey}
                            value={(props.value as JSONObject)[childKey]}

                            // 1. Update Child Value
                            onUpdateValue={(newValue) => {
                                const currentObj = props.value as JSONObject;
                                props.onUpdateValue({ ...currentObj, [childKey]: newValue });
                            }}

                            // 2. Rename Child Key (Tricky: requires creating new key, deleting old)
                            onRenameKey={(newKey) => {
                                const currentObj = props.value as JSONObject;
                                const val = currentObj[childKey];
                                // Create new object to maintain order or just swap keys
                                const newObj = { ...currentObj };
                                delete newObj[childKey];
                                newObj[newKey] = val;
                                props.onUpdateValue(newObj);
                            }}
                        />
                    )}
                </For>
            </Show>

            {/* RECURSION: Array Handling */}
            <Show when={isArray(props.value)}>
                <For each={props.value as any[]}>
                    {(item, index) => (
                        <JsonNode
                            name={index().toString()} // Array indices are not renameable keys
                            value={item}
                            onUpdateValue={(newValue) => {
                                const currentArray = [...(props.value as any[])];
                                currentArray[index()] = newValue;
                                props.onUpdateValue(currentArray);
                            }}
                        />
                    )}
                </For>
            </Show>
        </div>
    );
};

import { createStore } from "solid-js/store";
export function Test() {
    // Initialize store with some nested data
    const [store, setStore] = createStore<{ data: JSONValue }>({
        data: {
            user: {
                name: "Alice",
                age: 25,
                preferences: {
                    theme: "dark",
                    notifications: true
                }
            },
            tags: ["admin", "editor"]
        }
    });

    return (
        <div style={{ padding: "20px", "font-family": "monospace" }}>
            <h2>Recursive JSON Editor</h2>

            {/* Root Node */}
            <JsonNode
                name="root"
                value={store.data}
                onUpdateValue={(newValue) => setStore("data", newValue)}
            />

            <hr />

            {/* Live Preview of the actual JSON Store */}
            <h3>Live Result:</h3>
            <pre style={{ background: "#f4f4f4", padding: "10px" }}>
                {JSON.stringify(store.data, null, 2)}
            </pre>
        </div>
    );
}