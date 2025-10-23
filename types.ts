export type Note = {
    id: string,
    title: string,
    content: string,
}

export type Category = {
    id: number;
    path: string;
    note_count: number;
}

export type CategoryNode = Category & {
    name: string;
    childs: CategoryNode[];
}