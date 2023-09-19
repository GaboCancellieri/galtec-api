export interface IUserProfile {
  userId: string;
  avatar: string;
  bio: string;
  interests: [string];
  followersIds?: [string];
  followingIds?: [string];
  followersCount: number;
  followingCount: number;
  postsCount: number;
}
