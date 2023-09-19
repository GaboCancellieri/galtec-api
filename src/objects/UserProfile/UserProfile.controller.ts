import { Request, Response } from "express";

const getProfile = (req: Request, res: Response) => {};
const createProfile = (req: Request, res: Response) => {};
const updateAvatar = (req: Request, res: Response) => {};
const updateInterests = (req: Request, res: Response) => {};

const UserProfileController = {
  getProfile,
  createProfile,
  updateAvatar,
  updateInterests,
};

export default UserProfileController;
