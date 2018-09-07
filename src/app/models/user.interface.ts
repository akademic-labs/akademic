export interface User {
  uid: string;
  displayName: string;
  lastName: string;
  registration?: string;
  birthday?: Date;
  createdAt: Date;
  email: string;
  phone?: string;
  photoURL: string;
  status: string;

  // firebase user
  phoneNumber?: string | null;
  providerId?: string;

  // user enters activity, controller validates and adm is the superuser
  roles: {
    student?: boolean;
    controller?: boolean;
    administrator?: boolean;
  };

  course?: {
    uid: number;
    name: string;
  };
}
