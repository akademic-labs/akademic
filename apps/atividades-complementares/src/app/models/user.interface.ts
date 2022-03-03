import { Address } from './address.interface';

export interface Roles {
  // user enters activity, controller validates, institution manage controllers and courses and adm is the superuser
  student?: boolean;
  controller?: boolean;
  institution?: boolean;
  administrator?: boolean;
};

export interface User {
  uid: string;
  displayName: string;
  registration?: string;
  birthday?: Date;
  createdAt: Date;
  email: string;
  phone?: string;
  photoURL: string;
  status: string;
  password?: string;
  phoneNumber?: string;
  providerId?: string;
  roles: Roles;
  course?: string;
  institution?: string;
  address?: Address;
  about?: string;
}
