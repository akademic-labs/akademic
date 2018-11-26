import { Cities } from 'app/models/cities.interface';

import { ActMessages } from './act-messages.interface';
import { ActivityType } from './activity-type.interface';
import { States } from './states.interface';

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
  feedback?: string;

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
