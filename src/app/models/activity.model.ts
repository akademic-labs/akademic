import { User } from './user.model';

export class Activity {
  uid: string;
  description: string;
  registrationDate: Date;
  executionDate: Date;
  organ: string;
  hoursDuration: number;
  observation: string;
  validatedHours: number;

  type: {
    uid: number;
    description: string;
  };

  messages:
    {
      uid: 1;
      description: string;
      date: Date;
      user: User;
    }

  attachment:
    {
      uid: 1;
      user: User;

      file:
      {
        id: 1;
        name: string;
        url: string;
        type: string;
      }
    }
}
