export interface Comment {
    uid?: string;
    description: string;
    createdAt: any;
    // could be the uid or the object
    user: any;
}
