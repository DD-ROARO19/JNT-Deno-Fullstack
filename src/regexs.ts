export default {
    reference_regexp: {
        valid: /@\{[^}]+\}/,
        search: /@\{([^}]+)\}/
    },
    isURL: /^https?:\/\/(?:www\.)?(?:localhost|[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b)(?::\d{1,5})?(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    includeURL: /(https?:\/\/[^\s]+)/g,
    includeURL2: /((https?:\/\/|www\.)[^\s]+)/g,
    isJSON: /^\s*(?:\{[\s\S]*\}|\[[\s\S]*\])\s*$/
} as const