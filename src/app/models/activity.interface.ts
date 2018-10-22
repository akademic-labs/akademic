import { Cities } from 'app/models/cities.interface';
import { States } from './states.interface';
import { User } from './user.interface';
import { ActivityType } from './activity-type.interface';
import { Attachment } from './attachment.interface';
import { ActMessages } from './act-messages.interface';

export interface Activity {
  uid: string;
  description: string;
  createdAt: Date;
  initialDate: Date;
  finalDate: Date;
  schoolYear: number;
  local: string;
  semester: number;
  link: string;
  hoursDuration: number;

  city: Cities;
  state: States;

  observation: string;
  validatedHours: number;
  status: string;
  controllerId: string;

  // subcollection
  messages: ActMessages;

  // subcollection
  // attachment: Attachment;
  attachments: any;

  // root collection
  activityType: ActivityType;

  // could be the uid or the object
  user: any;
}
