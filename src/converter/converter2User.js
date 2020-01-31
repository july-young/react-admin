/**
 * 模型转换器 前后端模型适配
 */

import converter2Menu from "./converter2Menu";
import converter2Role from "./converter2Role";

const converter2User = (userVo) => {
    let user = {};
    user._id = userVo.userId
    user.username = userVo.username
    user.email = userVo.email
    user.phone = userVo.phone
    user.gmtCreate = userVo.gmtCreate
    user.roles = userVo.roles
    user.roleNames = userVo.roles.map(x=>x.name).join(',')
    if (user.roles && user.roles instanceof Array) {
        user.roles = user.roles.map(x => {
            const role = converter2Role(x)
            if (role && role.menus instanceof Array) {
                role.menus = role.menus.map(y => converter2Menu(y))
            }
            return role
        })
    }
    return user;
}

export default converter2User;