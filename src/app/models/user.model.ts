export class User {
  uid: string;
  firstName: string;
  lastName: string;
  registration: string;
  birthday: Date;
  createdAt: Date;
  email: string;
  phone: string;
  photo: string;
  status: string;

  // user enters activity, controller validates and adm is the superuser
  type: {
    user?: boolean;
    controller?: boolean;
    administrator?: boolean;
  };

  course: {
    uid: number;
    name: string;
  };
}
