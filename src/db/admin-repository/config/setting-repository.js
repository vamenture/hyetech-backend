import SettingsModel from "../../../models/setting.model.js"

export const isSettingExist = async (_id)=>{
 return await SettingsModel.findOne({user_id:_id});
}

export const createSetting = async (obj)=>{
   return await SettingsModel.create(obj);
}

export const updateSetting = async (obj) => {
    return await SettingsModel.findByIdAndUpdate(obj._id,{...obj});
}

export const getByIdSetting = async (_id) => {
    return await SettingsModel.findById(_id);
}

export const listSetting = async () => {
    return await SettingsModel.find({is_active:true})
}

export const deleteSetting = async (_id) => {
    return await SettingsModel.findByIdAndDelete(_id);
}