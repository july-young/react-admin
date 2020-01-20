import React, { createContext,useReducer } from 'react'


import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'
import ProductModel from '../../models/product'

const { Switch, Route, Redirect } = require('react-router-dom')

class ProductState  {
  productChosen:any =new ProductModel();
  dispatch:any
}

export const ProductContext = createContext(new ProductState());

export function ProductReducer(state: any, action: any) {
  switch (action.type) {
    case 'add':
      return { productChosen:action.payload };
    case 'clear':
      return {};
    default:
      throw new Error();
  }
}
/*
商品路由
 */
const Product = () => {
  const [state, dispatch] = useReducer(ProductReducer, new ProductState())
  return (
    <ProductContext.Provider value={{productChosen:state.productChosen,dispatch:dispatch}}>
      <Switch>
        <Route path='/product' component={ProductHome} exact /> {/*路径完全匹配*/}
        <Route path='/product/addupdate' component={ProductAddUpdate} />
        <Route path='/product/detail' component={ProductDetail} />
        <Redirect to='/product' />
      </Switch>
    </ProductContext.Provider>
  )
}

export default Product;