import React, { Component, useEffect, useState } from 'react'
import { Menu, Icon } from 'antd'
import MenuModel from '../../models/menu'
import User from '../../models/user'

import logo from '../../assets/images/logo.png'
import './index.less'
import { setHeadTitle } from '../../redux/actions'

const { connect } = require('react-redux')
const { Link, withRouter } = require('react-router-dom')
const SubMenu = Menu.SubMenu;

interface LeftNavReduxProps {
    user?: User;
    setHeadTitle(title: string): Function;
    menuList: MenuModel[]
}

interface LeftNavProps extends LeftNavReduxProps {
    getMenuNodes(children: MenuModel[]): React.ReactNode
    location: any,
}
/*
左侧导航的组件
 */
const LeftNav = (props: LeftNavProps) => {


    const [menuNodes, setMenuNodes] = useState();
    // 得到需要打开菜单项的key
    const [openKey, setOpenKey] = useState(Array<string>());


    /*
    判断当前登陆用户对item是否有权限
     */
    const hasAuth = (item: MenuModel) => {
        const { key, isPublic } = item

        if (!props.user) {
            return false;
        }
        const menus = props.user.roles.menus
        const username = props.user.username
        /*
        1. 如果当前用户是admin
        2. 如果当前item是公开的
        3. 当前用户有此item的权限: key有没有menus中
         */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }


    /*
    根据menu的数据数组生成对应的标签数组
    使用reduce() + 递归调用
    */
    const getMenuNodes = (menuList: MenuModel[]) => {
        // 得到当前请求的路由路径
        const path = props.location.pathname

        return menuList.reduce((pre: any[], item) => {

            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            if (hasAuth(item)) {
                // 向pre添加<Menu.Item>
                if (item.children && (item.children as Array<MenuModel>).length > 0) {
                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        openKey.push(item.key)
                        setOpenKey(openKey)
                    }
                    // 向pre添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                } else {
                    // 判断item是否是当前对应的item
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        // 更新redux中的headerTitle状态
                        props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => {
                                props.setHeadTitle(item.title)
                            }}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                }
            }

            return pre
        }, [])
    }

    /*
    在第一次render()之前执行一次
    为第一个render()准备数据(必须同步的)
     */
    useEffect(() => {
        setMenuNodes(getMenuNodes(props.menuList))
    }, [props.menuList]);

    // debugger
    // 得到当前请求的路由路径
    const path  = props.location.pathname
       
    return (
        <div className="left-nav">
            <Link to='/' className="left-nav-header">
                <img src={logo} alt="logo" />
                <h1>JULY后台</h1>
            </Link>

            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[path]}
                defaultOpenKeys={openKey}
            >

                {
                    menuNodes
                }

            </Menu>
        </div>
    )
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default connect(
    (state: LeftNavReduxProps) => ({ ...state }),
    { setHeadTitle }
)(withRouter(LeftNav))
