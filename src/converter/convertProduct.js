/**
 * 模型转换器 前后端模型适配
 */

const converter2Product = (productVo) => {
    let product = {}
    product._id = productVo.id+""
    product.name = productVo.name
    product.desc =productVo.desc ;
    product.price =productVo.price ;
    product.detail =productVo.detail ;
    product.imgs =productVo.imgs ;
    product.status =productVo.status ;
    product.categoryId =productVo.categoryId ;
    product.pCategoryId =productVo.pCategoryId ;
    return product
}

export default converter2Product;