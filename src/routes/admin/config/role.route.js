import { Router } from "express";
import { asyncHandler } from '../../../utils/asyncHandler.js';
import middleware from "../../../middlewares/validation.js";
import { createValidation, getValidation, updateValidation } from "../../../validation/admin/role.validation.js";
import { createCtrl, updateCtrl, getCtrl, listCtrl, deleteCtrl } from "../../../controllers/admin/role.controller.js";

const router = Router();

router.post('/create', middleware(createValidation), asyncHandler(createCtrl));
router.patch('/update', middleware(updateValidation), asyncHandler(updateCtrl));
router.get('/get/:_id', middleware(getValidation), asyncHandler(getCtrl));
router.post('/list', asyncHandler(listCtrl));
router.delete('/delete/:_id', asyncHandler(deleteCtrl));

export default router;
