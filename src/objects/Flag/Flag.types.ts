export interface IFlag {
  id: string;
  flaggedUserId: string;
  flaggingUserId: string;
  reason: string;
  createdAt: Date;
}
