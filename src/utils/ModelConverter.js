


/**
 * 模型转换器 前后端模型适配
 */
const Converter = {

    toUser: (userVo) => {
        let user = {};
        user._id = userVo.userId
        user.username = userVo.usename
        user.role = userVo.role
        return user;
    },
    toMenu: (menuVo) => {
        let menu = {}
        menu.title = menuVo.name
        menu.key = menuVo.url
        menu.icon = menuVo.icon
        menu.isPublic = menuVo.hasPub
        menu.children = menuVo.children
        return menu
    }

}

export default Converter;