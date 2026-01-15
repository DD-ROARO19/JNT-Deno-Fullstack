export interface NoteMetadata {
    title: string,
    author: string,
    path: string,
    directory_id: number,
    tags: string[] | undefined
};

export type NewNote = Omit<NoteMetadata, 'directory_id'> & { content: object }
export type Note = Omit<NoteMetadata, 'path'> & { id: number, content: object }

export type Category = {
    id: number;
    path: string;
    note_count: number;
}

export type CategoryNode = Category & {
    name: string;
    childs: CategoryNode[];
}