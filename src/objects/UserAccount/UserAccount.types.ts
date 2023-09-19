export interface IUserAccount {
  id: string;
  username: string;
  password: string;
  email: string;
  DOB: Date;
  enableExplicitContent: boolean;
  verifCode: string;
  dateJoined: Date;
  status: string;
}
