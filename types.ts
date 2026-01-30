export interface NoteMetadata {
    title: string,
    author: string,
    path: string,
    directory_id: number,
    tags: string[] | undefined
};

export type NewNote = Omit<NoteMetadata, 'directory_id'> & { content: object }
export type Note = Omit<NoteMetadata, 'path'> & { id: number, content: object }

export interface Category {
    parent_id: number | null,
    id: number,
    alias: string,
    note_count: number,
    path: string,
    created_at: Date,
    last_updated: Date,
}

export type CategoryNode = Category & { childs: CategoryNode[]; }