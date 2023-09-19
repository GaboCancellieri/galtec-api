import { model, Schema } from "mongoose";
import { IUserAccount } from "./UserAccount.types";

const UserAccountSchema = new Schema({
  email: { type: String, require: true, unique: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  DOB: { type: Date, require: true },
  enableExplicitContent: { type: Boolean, default: false },
  verifCode: { type: String, require: true },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "banned", "in_revision", "not_verified"],
    default: "not_verified",
  },
});

// Duplicate the ID field - _id --> id
UserAccountSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
UserAccountSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

UserAccountSchema.set("toObject", { virtuals: true });

const UserAccount = model<IUserAccount>(
  "UserAccount",
  UserAccountSchema,
  "user_accounts"
);
export default UserAccount;
