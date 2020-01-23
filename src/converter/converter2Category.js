/**
 * 模型转换器 前后端模型适配
 */

const converter2Category = (categoryVo) => {
    let category = {}
    category._id = categoryVo.id + ""
    category.name = categoryVo.name
    category.parentId = categoryVo.parentId
    if (categoryVo.children && categoryVo.children.length>0 ) {
        category.children = categoryVo.children.map(x => 
            converter2Category(x)
        );
    }

    return category
}

export default converter2Category;