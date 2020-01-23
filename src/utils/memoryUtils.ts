import ProductModel from "../models/product";
import User from "../models/user";

/*
用来在内存保存一些数据的工具模块
 */
class MemoryUtils{
  user?: User; // 保存当前登陆的user
  product: ProductModel|null=new ProductModel(); // 指定的商品对象
  
}

export default new MemoryUtils()