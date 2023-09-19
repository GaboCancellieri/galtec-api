import { model, Schema } from "mongoose";
import { ITag } from "./Tag.types";

const TagSchema = new Schema({
  category: { type: String, require: true },
  name: { type: String, require: true, unique: true },
});

// Duplicate the ID field - _id --> id
TagSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
TagSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

TagSchema.set("toObject", { virtuals: true });

const Tag = model<ITag>("Tag", TagSchema, "tags");
export default Tag;
