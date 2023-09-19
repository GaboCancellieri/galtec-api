export interface IPost {
  id: string;
  user: {
    id: string;
    username: string;
    profilePictureUrl: string;
  };
  content: string;
  image: {
    filename: string;
    publicUrl: string;
  };
  audio: {
    filename: string;
    publicUrl: string;
  };
  createdAt: Date;
  averageRating: number;
}
