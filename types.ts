export interface NoteMetadata {
    title: string,
    author: string,
    path: string,
    directory_id: number,
    tags: string[],
    // content: object
};

// export type NewNote = Omit<NoteMetadata, 'directory_id'>

type stringifiedArray = string;
type stringifiedObject = string;

export type Note = Omit<NoteMetadata, 'path' | 'tags'> & 
{ id: number, created_at: Date, last_updated: Date, tags: stringifiedArray, content: stringifiedObject }
export type newNote = Omit<NoteMetadata, 'directory_id'> & { content: object }

export type cardNote = Omit<Note, 'content'> & { snippet?: string }

export interface Category {
    parent_id: number | null,
    id: number,
    alias: string,
    total_note_count: number,
    direct_count: number,
    full_path: string,
    created_at: Date,
    last_updated: Date,
}

export type CategoryNode = Category & { childs: CategoryNode[]; }

export type pattern = { title: string, packet_name?: string, keys: { key: string | number, val: string }[] }
export type bindObject = Record<string, string | number | undefined>