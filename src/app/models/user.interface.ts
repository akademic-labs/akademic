export interface Roles {
  student?: boolean;
  controller?: boolean;
  administrator?: boolean;
};

export interface User {
  uid: string;
  firstName: string;
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
  roles: Roles;

  course?: {
    uid: number;
    name: string;
  };
}
