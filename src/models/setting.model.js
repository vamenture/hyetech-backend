import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    user_id:{
      type:String,
      required:false
    },
    primary_email: {
      type: String,
      required: true,
    },
    secondary_email: {
      type: String,
      required: false,
    },
    address: {
        type: Object,
        required: false,
      },
    social_media: [
      {
        type: Object,
        required: false,
      },
    ],
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    sub_title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
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

const SettingsModel = mongoose.model("Settings", settingsSchema);

export default SettingsModel;
