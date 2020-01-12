/**
 * 模型转换器 前后端模型适配
 */

const converter2Role= (roleVo) => {
    let role = {};
    role.name = roleVo.name
    role.menus = roleVo.permissions
    return role
}

export default converter2Role;