import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      default:false,
    },
    phone: {
      type: String,
      required: true,
    },
    secondary_email: {
      type: String,
      default: null,
    },
    login_type: {
      type: String,
      enum: ["email", "sso"],
      default: "email",
    },
    role: {
      type: String,
      enum: ["user","admin","super-admin"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    expiration_time:{
      type:Date,
      default:null
    },
    avatar: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
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

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
