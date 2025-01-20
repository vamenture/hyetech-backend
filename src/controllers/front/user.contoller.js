import { sendEmail,generateOtpandexpirationTime,hashedPassword } from "../../config/common.js";
import { httpResponseStatus } from "../../utils/httpResponseType.js";
import { httpStatusCodes } from "../../utils/http-status-codes.js";
import { serverResponseMessage } from "../../config/message.js";
import { httpResponses } from "../../utils/http-responses.js";
import UserModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail,updateToken,findUserById, updatePassword,updateOtpAndToken, updateOtpAndTokenAndPassword } from "../../db/front-repository/config/auth-repository.js";

const generateAccessToken = (_id, email) => {
  return jwt.sign(
    {
      _id,
      email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const generateRefreshToken = (_id) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await findUserById(userId);

    if (!user) {
      throw {
        code: httpStatusCodes.UNPROCESSABLE_ENTITY,
        message: serverResponseMessage.DOES_NOT_EXIST,
      };
    }

    const accessToken = generateAccessToken(userId, user.email);
    const refreshToken = generateRefreshToken(userId);

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};



//  Register Api
export const SignUpCtrl = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  //check user exist or not
  if( user ) {
    throw {
      code: httpStatusCodes.ALREADY_EXIST,
      message: serverResponseMessage.ALREADY_EXIST,
    };
  };

  //hash the password
  const hashPassword = await hashedPassword(password);
  if(!hashPassword){
    throw {
      code: httpStatusCodes.ERROR,
      message: serverResponseMessage.ERROR,
    };
  }

  //create the user
  const userDetails = await createUser(req.body,hashPassword);
  if(!userDetails){
    throw {
      code: httpStatusCodes.ERROR,
      message: serverResponseMessage.ERROR,
    };
  }
  
  //generate otp and its expiration time
  const {otp, expirationTime} = generateOtpandexpirationTime();

  //send email otp for email verification
  await sendEmail(email, `Email VERIFICATION`, `<p>Dear InfoNGO user\nyour InfoNGO Account One Time PIN is: <b>${otp}</b>, and This OTP is valid for 10 minutes. \n\nThis is an auto-generated email. Do not reply to this email.<p>`);

  //update otp in database
  const updatedUser = await UserModel.findByIdAndUpdate(userDetails._id,{ otp: otp, expiration_time: expirationTime }, { new: true }).select('-password');

  //send response
  return res.status(httpStatusCodes.SUCCESS).json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.SUCCESS,
    success: true,
    message: serverResponseMessage.SIGNUP_COMPLETE,
    type: httpResponseStatus.SUCCESS,
    data: updatedUser,
  });
};

//  Login Api
export const LoginCtrl = async ( req, res ) => {
  const { email, password } = req.body;
  const userDetails = await findUserByEmail(email);
  if( !userDetails ) {
    throw {
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: serverResponseMessage.NOT_EXIST,
    };
  };


  const isPasswordCorrect = await bcrypt.compare( password, userDetails.password );
  if( !isPasswordCorrect ) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.INCORRECT_PASSWORD,
    };
  };
  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(userDetails._id);


  const updatedUser = await updateToken(userDetails._id,refreshToken);

  const options = {
    httpOnly: true,
    secure: true
}

  return res
  .status(httpStatusCodes.SUCCESS)
  .cookie("accessToken", accessToken, options)
  .cookie("token", refreshToken, options)
  .json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.SUCCESS,
    success: true,
    message: serverResponseMessage.LOGIN_COMPLETE,
    type: httpResponseStatus.SUCCESS,
    data: updatedUser,
  });
};

// Change Password Api
export const ChangePasswordCtrl = async ( req, res ) => {
  const user = req.user;
  const isUserExist = await findUserById(user._id);
  if( !isUserExist ) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.DOES_NOT_EXIST,
    };
  };
  const { oldPassword, newPassword } = req.body;
  const isPasswordMatch = await bcrypt.compare( oldPassword, isUserExist.password );
  if( !isPasswordMatch ) {
  throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.INCORRECT_PASSWORD,
    };
  };
  const hashedPassword = await bcrypt.hash( newPassword, 10 );

  const updatedUser = await updatePassword(isUserExist._id,hashedPassword)

  return res.status(httpStatusCodes.SUCCESS).json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.SUCCESS,
    success: true,
    message: serverResponseMessage.PASSWORD_CHANGED,
    type: httpResponseStatus.SUCCESS,
    data: updatedUser,
  });
};

//  Forget Password Api
export const forgetPasswordCtrl = async ( req, res ) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if( !user ) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.DOES_NOT_EXIST,
    };
  };
  const token = jwt.sign({
    _id: user._id,
    email: user.email
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: "10min"
  });
  const {otp, expirationTime} = generateOtpandexpirationTime();
  await sendEmail( email, `Reset Password`, `<p>Dear InfoNGO user\nyour InfoNGO Account One Time PIN is: <b>${otp}</b>, and is valid for 10 minutes. \n\nPlease Click this Link for Reset Your Password\n https://www.infongo.in/forget-password/${token} \n\nThis is an auto-generated email. Do not reply to this email.</p>`);
  const updatedOtpUser = await updateOtpAndToken(user._id,otp,token,expirationTime)
  return res.status(httpStatusCodes.SUCCESS).json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.PENDING,
    success: true,
    message: serverResponseMessage.SUCCESS,
    type: httpResponseStatus.SUCCESS,
    data: updatedOtpUser,
  });
};

//  Reset Password Api
export const resetPasswordCtrl = async ( req, res ) => {
  const {  token, newPassword } = req.body;
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if( !decodedToken ) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.EXPIRED_TOKEN,
    };
  };
  const user = await findUserById(decodedToken._id);
  if( !user ) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.DOES_NOT_EXIST,
    };
  };
  const hashedPassword = await bcrypt.hash( newPassword, 10 );
  const updatedUser = await updateOtpAndTokenAndPassword(user._id,null,null,hashedPassword)
  await sendEmail(user.email, "InfoNGO PASSWORD CHANGED", "<p>Your Password Was Successfully Changed</p>" )
  return res.status(httpStatusCodes.SUCCESS).json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.SUCCESS,
    success: true,
    message: serverResponseMessage.PASSWORD_RESET,
    type: httpResponseStatus.SUCCESS,
    data: updatedUser,
  });
};

//  Verify Otp Api
export const verifyOtpCtrl = async ( req, res ) => {
  const { email, otp } = req.body;
  
  const user = await UserModel.findOne({email});
  if(!user){
    throw {
      code: httpStatusCodes.NOT_FOUND,
      message: serverResponseMessage.NOT_FOUND,
    };
  }
  if(new Date(Date.now()) > user.expiration_time) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.EXPIRED_OTP,
    };
  };
  if(otp !== user.otp) {
    throw {
      code: httpStatusCodes.BAD_REQUEST,
      message: serverResponseMessage.INVALID_OTP,
    };
  };
  const updatedUser = await UserModel.findByIdAndUpdate( user._id, { "otp": null, 'email_verified': true, 'token': null }, { new: true }).select( '-password' );
  return res.status(httpStatusCodes.SUCCESS).json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.VERIFIED,
    success: true,
    message: serverResponseMessage.SUCCESS,
    type: httpResponseStatus.SUCCESS,
    data: updatedUser,
  });
};

//  Logout Api
export const LogoutCtrl = async ( req, res ) => {
  const user = req.user;
  const isUserExist = await UserModel.findById( user._id );
  if( !isUserExist ) {
    throw{
      code: httpStatusCodes.UNPROCESSABLE_ENTITY,
      message: serverResponseMessage.DOES_NOT_EXIST,
    };
  };
  
  const updateUser = await UserModel.findByIdAndUpdate( user._id,{ token: null, otp: null,  }, { new: true }).select( "-password" )
  const options = {
    httpOnly: true,
    secure: true
}

  return res
  .status(httpStatusCodes.SUCCESS)
  .cookie("accessToken", "", options)
  .cookie("token", "", options)
  .json({
    statusCode: httpStatusCodes.SUCCESS,
    status: httpResponses.SUCCESS,
    success: true,
    message: serverResponseMessage.LOGOUT_SUCCESS,
    type: httpResponseStatus.SUCCESS,
    data: updateUser,
  });
};