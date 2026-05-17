const get_all = `--sql
    SELECT 
        display_tag as tag,
        count
    FROM tags
    ORDER BY count DESC 
`;

const basic_search = `--sql
    SELECT 
        t.display_tag as tag,
        t.count
    FROM tags AS t
    WHERE t.tag_id LIKE LOWER(?) || '%'
    ORDER BY t.count DESC
`;

const fts_search = `--sql
    SELECT 
        t.display_tag as tag,
        t.count
    FROM tags_fts AS s
    JOIN tags AS t ON t.tag_id = s.tag_id
    WHERE tags_fts MATCH ? 
`;

const composed_order = `--sql
    ORDER BY 
        s.rank ASC
        t.count DESC
`;

const advance_order = `--sql
    ORDER BY (rank * 0.7) - (t.count * 0.3) ASC
`

export {
    get_all,
    basic_search, fts_search,
    composed_order, advance_order
}