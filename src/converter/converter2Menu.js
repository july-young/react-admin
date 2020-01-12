/**
 * 模型转换器 前后端模型适配
 */

const converter2Menu = (menuVo) => {
    let menu = {}
    menu.title = menuVo.name
    menu.key = menuVo.url
    menu.icon = menuVo.icon
    menu.isPublic = menuVo.hasPub
    menu.children = menuVo.children
    if(menu.children && menu.children instanceof Array ){
        menu.children = menu.children.map(x=>converter2Menu(x))
    }
    return menu
}

export default converter2Menu;