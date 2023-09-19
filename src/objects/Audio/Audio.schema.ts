import { model, Schema } from "mongoose";
import { IAudio } from "./Audio.types";

const AudioSchema = new Schema({
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
AudioSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
AudioSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

AudioSchema.set("toObject", { virtuals: true });

const Audio = model<IAudio>("Audio", AudioSchema, "audios");
export default Audio;
