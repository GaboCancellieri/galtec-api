import { model, Schema } from "mongoose";
import { IImage } from "./Image.types";

const ImageSchema = new Schema({
  filename: {
    type: String,
    unique: true,
    required: true,
  },
  publicUrl: {
    type: String,
    unique: true,
    required: true,
  },
});

// Duplicate the ID field - _id --> id
ImageSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
ImageSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

ImageSchema.set("toObject", { virtuals: true });

const Image = model<IImage>("Image", ImageSchema, "images");
export default Image;
