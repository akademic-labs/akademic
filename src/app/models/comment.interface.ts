export interface Comment {
    description: string;
    created: Date;
    // could be the uid or the object
    user: any;
}
