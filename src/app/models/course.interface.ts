import { Institution } from './institution.interface';

export interface Course {
    uid: string;
    name: string;
    institution: Institution;
}
