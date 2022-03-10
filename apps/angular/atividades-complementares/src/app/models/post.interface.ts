import { Cities } from './cities.interface';
import { Comment } from './comment.interface';
import { States } from './states.interface';

export interface Post {
  uid?: string;
  title: string;
  initialDate: Date;
  finalDate: Date;
  description: string;

  local: string;
  city: Cities;
  state: States;

  createdAt: any;
  updatedAt: Date;
  votes: number;

  // could be the uid or the user object
  owner: any;
  // subcollection
  comments: Comment[];
}
