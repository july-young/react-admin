/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数
 */
import { message } from 'antd'
import ajax from './ajax'
import { MUTI_REQ, FORM_REQ } from '../utils/constants'

// const BASE = 'http://localhost:5000'
const BASE = ''
// 登陆
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST', FORM_REQ)

// 获取菜单树
export const reqMenuTree = () => ajax(BASE + '/menu', {}, 'GET')

// 获取菜单
export const reqMenus = (roleId) => ajax(BASE + '/menus', {roleId}, 'GET')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/categories', { parentId })

// 添加分类
export const reqAddCategory = (name, parentId) => ajax(BASE + 'category', { name, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + 'category', { id: categoryId, name: categoryName }, 'PUT')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/category', { categoryId })

// 获取一个分类的所有父类
export const reqCategoryParents = (categoryId) => ajax(BASE + '/category/parents', { id:categoryId })
// 获取所有类
export const reqCategoryTree = () => ajax(BASE + '/category/tree',{})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/product/updateStatus', { id: productId, status }, 'PUT', FORM_REQ)

//上传图片
export const uploadImg = (data) => ajax(BASE + '/img/upload', data, 'POST', MUTI_REQ)



// 搜索商品分页列表 (根据商品描述)
/*export const reqSearchProducts2 = ({pageNum, pageSize, searchName}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  productDesc: searchName,
})*/

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/img/delete', { name }, 'POST')
// 商品API==================================================================================================================
// 根据Id获取商品
export const reqProduct = (productId) => ajax(BASE + '/product', { productId })
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/products', { pageNum, pageSize })
// 添加商品
export const reqAddProduct = (product) => { delete product._id; return ajax(BASE + '/product', { ...product }, 'POST')}
// 修改商品
export const reqUpdateProduct = (product) => ajax(BASE + '/product', product, 'PUT')
/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})

// 角色API===================================================================================================================
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/roles')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/role', { name:roleName }, 'POST')
// 添加角色
export const reqUpdateRole = (roleId,menuKeys) => ajax(BASE + '/role', { id:roleId,permissionKeys: menuKeys }, 'PUT')


// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

/*
json请求的接口请求函数
 */
export const reqWeather = async (cityId) =>
  ajax(BASE + '/weather', { cityId }, 'GET')
    .then(await (data => {
      // 如果成功了
      if (data.status === 0 && data.data.status === 200) {
        // 取出需要的数据
        return data.data.data
      } else {
        // 如果失败了
        message.error('获取天气信息失败!')
      }

    })
    )
// reqWeather('杭州')
/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */