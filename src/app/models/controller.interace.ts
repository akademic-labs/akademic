import { Course } from './course.interface';

export interface Controller {
    // collection
    uid: string;
    name: string;
    course: Course
}
