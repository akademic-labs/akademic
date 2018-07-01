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

  city: string;
  state: string;

  observation: string;
  validatedHours: number;
  status: string;
  userId: string;
  controllerId: string;

  // subcollection
  messages: ActMessages;

  // subcollection
  attachment: Attachment;

  // root collection
  activityType: ActivityType;
}
