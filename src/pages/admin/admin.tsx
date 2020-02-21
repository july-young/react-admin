import React from 'react'
import UserModel from '../../models/user';
import { Layout } from 'antd'

import { reqMenuList, setHeadTitle } from '../../redux/actions'
import AsyncComponent from './AsyncComponent.jsx';
import Menu from '../../models/menu';

const Home =AsyncComponent(() => import('../home/home'));
const Role =AsyncComponent(() => import('../role/role'));
const User =AsyncComponent(() => import('../user/user'));
const Header =AsyncComponent(() => import('../../components/header'));
const Category =AsyncComponent(() => import('../category/category'));
const Product =AsyncComponent(() => import('../product/product'));
const LeftNav =AsyncComponent(() => import('../../components/left-nav'));
const Bar =AsyncComponent(() => import('../charts/bar'));
const Line =AsyncComponent(() => import('../charts/line'));
const Pie =AsyncComponent(() => import('../charts/pie'));
const NotFound =AsyncComponent(() => import('../not-found/not-found'));

const { Redirect, Route, Switch } = require('react-router-dom')

const { connect } = require('react-redux')

const { Footer, Sider, Content } = Layout

function Admin(props: any) {

  const user = props.user
  // 如果内存没有存储user ==> 当前没有登陆
  if (!user || !user._id) {
    // 自动跳转到登陆(在render()中)
    return <Redirect to='/login' />
  }

  return (
    <Layout style={{ minHeight: '100%' }}>

      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{ margin: 20, backgroundColor: '#fff' }}>
          <Switch>
            <Redirect exact from='/' to='/home' />
            <Route path='/home' component={Home} />
            <Route path='/category' component={Category} />
            <Route path='/product' component={Product} />
            <Route path='/role' component={Role} />
            <Route path='/user' component={User} />
            <Route path='/charts/bar' component={Bar} />
            <Route path='/charts/line' component={Line} />
            <Route path='/charts/pie' component={Pie} />
            <Route component={NotFound} /> {/*上面没有一个匹配, 直接显示*/}
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
  )
}

export default connect(
  (state: { user: UserModel; menuList: Array<Menu> }) => ({ user: state.user, menuList: state.menuList }),
  { reqMenuList, setHeadTitle }
)(Admin)