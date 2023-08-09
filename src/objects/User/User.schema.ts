import { model, Schema } from "mongoose";
import { IUser } from "./User.types";

const UserSchema = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  DOB: { type: Date, require: true },
  bio: String,
  verifCode: { type: String, require: true },
  isVerified: { type: Boolean, default: false },
  isOnRevision: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
});

// Duplicate the ID field - _id --> id
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
UserSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

UserSchema.set("toObject", { virtuals: true });

const User = model<IUser>("User", UserSchema, "users");
export default User;
