import UserModel from "../../../models/user.model.js";
export const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

export const findUserById = async (_id) => {
  return await UserModel.findById(_id);
};

export const createUser = async (data, hashedPassword) => {
  return await UserModel.create({
    ...data,
    password: hashedPassword,
  });
};

export const updatePassword = async (_id, hashedPassword) => {
  return await UserModel.findByIdAndUpdate(
    _id,
    { password: hashedPassword },
    { new: true }
  ).select("-password");
};

export const updateOtpAndToken = async (_id,otp,token,expirationTime) => {
  return await UserModel.findByIdAndUpdate(
    _id,
     { 
      otp: otp,
      token: token,
      expiration_time: expirationTime 
    },
    { new :true }).select( "-password" );
};

export const updateOtpAndTokenAndPassword = async (_id,otp,token,hashedPassword) => {
  return await UserModel.findByIdAndUpdate(
    _id,
     { 
      otp: otp,
      token: token,
      password: hashedPassword 
    },
    { new :true }).select( "-password" );
};

export const updateToken = async (_id, refreshToken) => {
  return await UserModel.findByIdAndUpdate(
    _id,
    { token: refreshToken },
    { new: true }
  );
};
