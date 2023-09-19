import { model, Schema } from "mongoose";
import { IPost } from "./Post.types";

const AudioImageSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  publicUrl: {
    type: String,
    required: true,
  },
});

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  audio: {
    type: AudioImageSchema,
    required: true,
  },
  image: {
    type: AudioImageSchema,
    required: false,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  totalNumberOfRatings: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  ratings: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
});

// Duplicate the ID field - _id --> id
PostSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// to get average rating
PostSchema.virtual("averageRating").get(function (this: any) {
  if (this.totalNumberOfRatings === 0) return 0;
  return this.totalRating / this.totalNumberOfRatings;
});

// Ensure virtual fields are serialized - Para que no se repita el campo "id"
PostSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

PostSchema.set("toObject", { virtuals: true });

const Post = model<IPost>("Post", PostSchema, "posts");
export default Post;
