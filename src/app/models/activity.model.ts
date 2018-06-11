import { Attachment } from './attachment.model';
import { ActMessages } from './act-messages.model';

export class Activity {
  uid: string;
  description: string;
  createdAt: Date;
  executedAt: Date;
  local: string;
  semester: number;
  link: string;
  hoursDuration: number;
  observation: string;
  validatedHours: number;
  status: string;
  userId: string;
  controllerId: string;

  type: {
    uid: string;
    description: string;
  };

  // subcollection
  messages: ActMessages;

  // subcollection
  attachment: Attachment;
}
