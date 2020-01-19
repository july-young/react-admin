/**
 * 模型转换器 前后端模型适配
 */

const toProduct = (productVo) => {
    let product = {}
    product._id = productVo.id + ""
    product.name = productVo.name
    product.desc = productVo.description;
    product.price = productVo.price;
    product.detail = productVo.detail;
    product.imgs = productVo.imgs;
    product.status = productVo.status;
    product.categoryId = productVo.categoryId;
    product.pCategoryId = productVo.pCategoryId;
    return product
}

const toProductAddForm = (product) => {
    product.description = product.desc;
    delete product.desc;
    delete product._id;
    return product;
}

export default { toProduct , toProductAddForm };