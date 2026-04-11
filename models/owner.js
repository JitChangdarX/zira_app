import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const Schema = mongoose.Schema;
const ownerSchema = new Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 20,
  },
  email: {
    type: String,
    maxlength: 50,
  },
  password: {
    type: String,
    maxlength: 100,
  },
  signupAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Owner", ownerSchema);
