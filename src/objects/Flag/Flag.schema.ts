import { model, Schema } from "mongoose";
import { IFlag } from "./Flag.types";

const FlagSchema = new Schema({
  flaggedUserId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  flaggingUserId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  reason: { type: String, require: true },
  createdAt: Date,
});

// Duplicate the ID field - _id --> id
FlagSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
FlagSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

FlagSchema.set("toObject", { virtuals: true });

const Flag = model<IFlag>("Flag", FlagSchema, "flags");
export default Flag;
