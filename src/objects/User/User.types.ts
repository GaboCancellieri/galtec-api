export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
  DOB: Date;
  bio?: string;
  verifCode: string;
  isVerified?: boolean;
  isOnRevision?: boolean;
  isBanned?: boolean;
}
