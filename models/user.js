import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userOrganizationSchema = new Schema(
  {
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    invited_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    join_time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


userOrganizationSchema.index(
  { organization_id: 1, user_id: 1 },
  { unique: true }
);

export default mongoose.model("user_organizations", userOrganizationSchema);