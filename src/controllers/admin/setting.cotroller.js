import { httpStatusCodes } from "../../utils/http-status-codes.js";
import { httpResponseStatus } from "../../utils/httpResponseType.js";
import { serverResponseMessage } from "../../config/message.js";
import { httpResponses } from "../../utils/http-responses.js";
import { createSetting,isSettingExist,updateSetting,getByIdSetting,listSetting, deleteSetting} from "../../db/admin-repository/config/setting-repository.js";


export const createCtrl = async (req, res) => {

    const {user_id} = req.body;
    const user = await isSettingExist(user_id);
    if(user){
        throw {
            code: httpStatusCodes.ALREADY_EXSIST,
            message: serverResponseMessage.SETTING_EXIST
          };
    }
    const createdUser = await createSetting({...req.body});

    if(!createdUser){
      throw {
        code: httpStatusCodes.ERROR,
        message: serverResponseMessage.ERROR
      };
    }
  
    return res.status(httpStatusCodes.SUCCESS).json({
      statusCode: httpStatusCodes.SUCCESS,
      status: httpResponses.SUCCESS,
      success: true,
      message: serverResponseMessage.SETTING_CREATED,
      type: httpResponseStatus.SUCCESS,
      data: createdUser,
    });
};

export const updateCtrl = async (req, res) => {

    const updatedUser = await updateSetting({...req.body});
    if(!updatedUser){
      throw {
        code: httpStatusCodes.ERROR,
        message: serverResponseMessage.ERROR
      };
    }
  
    return res.status(httpStatusCodes.SUCCESS).json({
      statusCode: httpStatusCodes.SUCCESS,
      status: httpResponses.SUCCESS,
      success: true,
      message: serverResponseMessage.SETTING_UPDATED,
      type: httpResponseStatus.SUCCESS,
      data: updatedUser
    });
};

export const getCtrl = async (req, res) => {

    const {_id} = req.params;
    const user = await getByIdSetting(_id);

    if(!user){
      throw {
        code: httpStatusCodes.ERROR,
        message: serverResponseMessage.ERROR
      };
    }
  
    return res.status(httpStatusCodes.SUCCESS).json({
      statusCode: httpStatusCodes.SUCCESS,
      status: httpResponses.SUCCESS,
      success: true,
      message: serverResponseMessage.SETTING_FETCHED,
      type: httpResponseStatus.SUCCESS,
      data: user,
    });
};

export const listCtrl = async (req, res) => {

    const data = await listSetting();
    if(!data){
      throw {
        code: httpStatusCodes.ERROR,
        message: serverResponseMessage.ERROR
      };
    }
  
    return res.status(httpStatusCodes.SUCCESS).json({
      statusCode: httpStatusCodes.SUCCESS,
      status: httpResponses.SUCCESS,
      success: true,
      message: serverResponseMessage.SETTING_FETCHED,
      type: httpResponseStatus.SUCCESS,
      data: data,
    });
};

export const deleteCtrl = async (req, res) => {
  
    const data = await deleteSetting(req.params._id);
    if(!data){
      throw {
        code: httpStatusCodes.ERROR,
        message: serverResponseMessage.ERROR
      };
    }

    return res.status(httpStatusCodes.SUCCESS).json({
      statusCode: httpStatusCodes.SUCCESS,
      status: httpResponses.SUCCESS,
      success: true,
      message: serverResponseMessage.SETTING_DELETED,
      type: httpResponseStatus.SUCCESS,
      data: data,
    });
};