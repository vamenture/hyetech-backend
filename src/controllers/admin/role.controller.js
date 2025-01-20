import { httpStatusCodes } from "../../utils/http-status-codes.js";
import { httpResponseStatus } from "../../utils/httpResponseType.js";
import { serverResponseMessage } from "../../config/message.js";
import { httpResponses } from "../../utils/http-responses.js";
import { createRole,isRoleExist,updateRole,getByIdRole,listRole, deleteRole,findRoleById} from "../../db/admin-repository/config/role-repository.js";


export const createCtrl = async (req, res) => {

    const {key} = req.body;
    const user = await isRoleExist(key);
    if(user){
        throw {
            code: httpStatusCodes.ALREADY_EXIST,
            message: serverResponseMessage.ROLE_EXIST
          };
    }
    const createdUser = await createRole({...req.body});

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
      message: serverResponseMessage.ROLE_CREATED,
      type: httpResponseStatus.SUCCESS,
      data: createdUser,
    });
};

export const updateCtrl = async (req, res) => {

    const {_id} = req.body;
    const isPreviousRoleExist = await findRoleById(_id);
    if(!isPreviousRoleExist){
      throw {
        code: httpStatusCodes.ALREADY_EXIST,
        message: serverResponseMessage.ROLE_EXIST
      };
    }

    const isRoleNameExist = await isRoleExist(req.body.key)
    if(isRoleNameExist){
      throw {
        code: httpStatusCodes.ALREADY_EXIST,
        message: serverResponseMessage.ROLE_EXIST
      };
    }


    const updatedRole = await updateRole(req.body);
    if(!updatedRole){
      throw {
        code: httpStatusCodes.ERROR,
        message: serverResponseMessage.ERROR
      };
    }
  
    return res.status(httpStatusCodes.SUCCESS).json({
      statusCode: httpStatusCodes.SUCCESS,
      status: httpResponses.SUCCESS,
      success: true,
      message: serverResponseMessage.ROLE_UPDATED,
      type: httpResponseStatus.SUCCESS,
      data: updatedRole
    });
};

export const getCtrl = async (req, res) => {

    const {_id} = req.params;
    const user = await getByIdRole(_id);

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
      message: serverResponseMessage.ROLE_FETCHED,
      type: httpResponseStatus.SUCCESS,
      data: user,
    });
};

export const listCtrl = async (req, res) => {

    const data = await listRole();
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
      message: serverResponseMessage.ROLE_FETCHED,
      type: httpResponseStatus.SUCCESS,
      data: data,
    });
};

export const deleteCtrl = async (req, res) => {
  
    const data = await deleteRole(req.params._id);
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
      message: serverResponseMessage.ROLE_DELETED,
      type: httpResponseStatus.SUCCESS,
      data: data,
    });
};