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
    uid: string;
    description: string;
  };

  messages:
    {
      uid: string;
      description: string;
      date: Date;
      user: User;
    }

  attachment:
    {
      uid: string;
      user: User;

      file:
      {
        id: string;
        name: string;
        url: string;
        type: string;
      }
    }
  situation: {
    uid: string;
    description: string;
  }
}
