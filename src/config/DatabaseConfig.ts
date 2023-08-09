import mongoose from "mongoose";

export const connectToMongo = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://localhost:27017/sonarly`);
};
