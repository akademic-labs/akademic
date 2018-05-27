export class User {
  uid: string;
  firstName: string;
  lastName: string;
  cpf: string;
  dateOfBirth: Date;
  registrationDate: Date;
  email: string;
  phone: string;

  type: {
    id: number;
    description: string;
  };

  course: {
    id: number;
    description: string;
  };

  photo: string;

  status: {
    id: number;
    description: string;
  }
}
