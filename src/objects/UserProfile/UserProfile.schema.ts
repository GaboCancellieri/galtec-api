import { model, Schema } from "mongoose";
import { IUserProfile } from "./UserProfile.types";

const UserProfileSchema = new Schema({
  userId: {
    // Reference to User Account
    type: Schema.Types.ObjectId,
    ref: "UserAccount",
    required: true,
  },
  artistName: { type: String, require: true },
  avatar: String,
  bio: String,
  interests: [String],
  followersIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
    },
  ],
  followingIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserAccount",
    },
  ],
  postsCount: {
    type: Number,
    default: 0,
  },
});

// Duplicate the ID field - _id --> id
UserProfileSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// to get followers count
UserProfileSchema.virtual("followersCount").get(function (this: any) {
  return this.followersIds.length;
});

// to get following count
UserProfileSchema.virtual("followingCount").get(function (this: any) {
  return this.followingIds.length;
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
UserProfileSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

UserProfileSchema.set("toObject", { virtuals: true });

const UserProfile = model<IUserProfile>(
  "UserProfile",
  UserProfileSchema,
  "user_profiles"
);
export default UserProfile;
