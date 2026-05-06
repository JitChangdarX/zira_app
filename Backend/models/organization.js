import mongoose from "mongoose";
const { Schema } = mongoose;

const organizationSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    organizationname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    slug: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("organization", organizationSchema);
