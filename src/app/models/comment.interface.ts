export interface Comment {
    uid?: string;
    description: string;
    createdAt: Date;
    // could be the uid or the object
    user: any;
}
