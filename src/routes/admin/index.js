import {Router} from 'express'
import SettingRoute from "./config/setting.route.js"
import RoleRoute from "./config/role.route.js"



const router = Router()
router.use("/role",RoleRoute)
router.use("/setting",SettingRoute)



export default router


