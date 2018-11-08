export interface Roles {
  // user enters activity, controller validates, institution manage controllers and courses and adm is the superuser
  student?: boolean;
  controller?: boolean;
  institution?: boolean;
  administrator?: boolean;
};

interface Address {
  street: string;
  number: number;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

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
  address?: Address;
  about?: string;
}
