export interface NoteMetadata {
    title: string,
    author: string,
    path: string,
    directory_id: number,
    tags: string[]
};

export type NewNote = Omit<NoteMetadata, 'directory_id'> & { content: object }

type stringifiedArray = string;
export type Note = Omit<NoteMetadata, 'path' | 'tags'> & 
{ id: number, snippet?: string, created_at: Date, last_updated: Date, tags: stringifiedArray }

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