import { Router } from "express";
import { resetPasswordCtrl, SignUpCtrl, LogoutCtrl, LoginCtrl, ChangePasswordCtrl, forgetPasswordCtrl, verifyOtpCtrl} from "../../../controllers/front/user.contoller.js";
import { asyncHandler } from '../../../utils/asyncHandler.js';
import middleware from "../../../middlewares/validation.js";
import { changePasswordValidationSchema,forgetPasswordValidationSchema,loginValidationSchema,resetPasswordValidationSchema,signUpValidationSchema,verifyOtpValidationSchema } from "../../../validation/front/Auth/auth.validation.js";
import { verifyJWT } from "../../../middlewares/auth.middelware.js";
const router = Router();

router.post('/register', middleware(signUpValidationSchema),asyncHandler(SignUpCtrl));
router.post('/login', middleware(loginValidationSchema), asyncHandler(LoginCtrl));
router.post('/change-password', verifyJWT, middleware(changePasswordValidationSchema), asyncHandler(ChangePasswordCtrl));
router.post('/forgot-password', middleware(forgetPasswordValidationSchema), asyncHandler(forgetPasswordCtrl));
router.post('/verify-email', middleware(verifyOtpValidationSchema), asyncHandler(verifyOtpCtrl));
router.post('/reset', middleware(resetPasswordValidationSchema), asyncHandler(resetPasswordCtrl));
router.post('/logout', verifyJWT, asyncHandler(LogoutCtrl));

export default router;