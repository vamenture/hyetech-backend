import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    role_name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = mongoose.model("Role", roleSchema);

export default RoleModel;
