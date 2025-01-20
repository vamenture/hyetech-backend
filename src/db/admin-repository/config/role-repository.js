import RoleModel from "../../../models/role.model.js"

export const findRoleById = async (_id)=>{
    return await RoleModel.findById(_id);
   }

export const isRoleExist = async (role_key)=>{
 return await RoleModel.findOne({key:role_key});
}

export const createRole = async (obj)=>{
   return await RoleModel.create(obj);
}

export const updateRole = async (obj) => {

    const data = await RoleModel.findByIdAndUpdate(
        obj._id, 
        { ...obj}, 
        { new: true, runValidators: true }
    );

    return data;
};


export const getByIdRole = async (_id) => {
    return await RoleModel.findById(_id);
}

export const listRole = async () => {
    return await RoleModel.find({is_active:true})
}

export const deleteRole = async (_id) => {
    return await RoleModel.findByIdAndDelete(_id);
}