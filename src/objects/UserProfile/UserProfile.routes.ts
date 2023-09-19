import { Router } from "express";
import UserProfileController from "./UserProfile.controller";
const UserAccountRoutes = Router();

UserAccountRoutes.get(`/userProfile/:email`, UserProfileController.getProfile);
UserAccountRoutes.post(`/userProfile`, UserProfileController.createProfile);
UserAccountRoutes.patch(
  `/userProfile/avatar`,
  UserProfileController.updateAvatar
);
UserAccountRoutes.patch(
  `/userProfile/interests`,
  UserProfileController.updateInterests
);

export default UserAccountRoutes;
