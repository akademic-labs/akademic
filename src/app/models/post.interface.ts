import { Address } from './address.interface';
import { Comment } from './comment.interface';

export interface Post {
    title: string;
    description: string;
    address: Address;
    createdAt: Date;
    updatedAt: Date;
    votes: number;

    // could be the uid or the user object
    owner: any;
    // subcollection
    comments: Comment[];
}
