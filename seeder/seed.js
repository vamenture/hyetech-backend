import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { initialUser, generatePassword } from "./user.js";
import UserModel from "../src/models/user.model.js";
import { httpStatusCodes } from "../src/utils/http-status-codes.js";
import { serverResponseMessage } from "../src/config/message.js";

// Load environment variables
dotenv.config();

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI
  try {
    const connectionInstance = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function seedSuperAdmin() {
  try {
    const generatedPassword = generatePassword(15);

    const isAdminExist = await UserModel.findOne({ is_active: true });
    if (isAdminExist) {
      throw {
        code: httpStatusCodes.ALREADY_EXIST,
        message: serverResponseMessage.ALREADY_EXIST,
      };
    }

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    if (!hashedPassword) {
      throw {
        code: httpStatusCodes.INTERNAL_SERVER_ERROR,
        message: serverResponseMessage.PASSWORD_HASHED,
      };
    }

    initialUser.password = hashedPassword;

    const user = await UserModel.create(initialUser);
    if (!user) {
      throw {
        code: httpStatusCodes.INTERNAL_SERVER_ERROR,
        message: serverResponseMessage.MODULE_CREATED,
      };
    }

    console.log("Email:", initialUser.email);
    console.log("Password:", generatedPassword);

    console.log("Super Admin seeded successfully!");
  } catch (error) {
    console.error("Error in seeding super admin:", error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

(async () => {
  await connectToDatabase();
  await seedSuperAdmin();
})();
