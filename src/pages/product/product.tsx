import React, { createContext, useReducer } from 'react'


import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

const { Switch, Route, Redirect } = require('react-router-dom')

class ProductState {
    dispatch: any;
    imgs: Array<any> = Array();
    detail: any;
    detailRec = false;
    imgsRec = false;
}

export const ProductContext = createContext(new ProductState());

export function ProductReducer(state: any, action: any) {
  switch (action.type) {
      case 'setImgs':
          return { ...state, imgsRec: action.payload.imgsRec, imgs: action.payload.imgs };
      case 'setDetail':
          return { ...state, detailRec: action.payload.detailRec, detail: action.payload.detail };
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
    <ProductContext.Provider value={{ ...state, dispatch: dispatch }}>
      <Switch>
        <Route path='/product' component={ProductHome} exact /> {/*路径完全匹配*/}
        <Route path='/product/add' component={ProductAddUpdate}/>
        <Route path='/product/update' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail} />
        <Redirect to='/product' />
      </Switch>
   </ProductContext.Provider>
  )
}

export default Product;