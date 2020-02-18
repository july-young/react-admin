import React from 'react'


import AsyncComponent from './pages/admin/AsyncComponent.jsx';


import {
  login
} from './redux/actions'

const Login =AsyncComponent(() => import('./pages/login/login'));
const Admin =AsyncComponent(() => import('./pages/admin/admin'));

const {connect} = require( 'react-redux')

const { HashRouter, Route, Switch } = require('react-router-dom')

/*
应用的根组件
 */
const App: React.FC = () => {

  return (
    <HashRouter>
      <Switch> {/*只匹配其中一个*/}
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={Admin}></Route>
      </Switch>
    </HashRouter>
  )
}




// 指定向Counter传入哪些一般属性(属性值的来源就是store中的state)
const mapStateToProps = (state:any) => (state)
/*如果是函数, 会自动调用得到对象, 将对象中的方法作为函数属性传入UI组件*/
/*如果是对象, 将对象中的方法包装成一个新函数, 并传入UI组件 */
const mapDispatchToProps = {login}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
