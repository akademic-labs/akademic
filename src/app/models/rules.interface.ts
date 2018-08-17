import { ActivityType } from "./activity-type.interface";
import { Course } from "./course.interface";

export interface Rules {
  // collection
  uid: string;
  name: string;
  hours: number;

  // root collection
  course: Course;

  // root collection
  activityType: ActivityType;
}
