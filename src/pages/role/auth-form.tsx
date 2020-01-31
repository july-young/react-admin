import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree
} from 'antd'
import { FormComponentProps } from 'antd/lib/form';
import { reqMenuList } from '../../redux/actions';
import MenuModel from '../../models/menu';
import { reqMenuTree, reqMenus } from "../../api/index";
import RoleModel from '../../models/role';
import converter2Menu from '../../converter/converter2Menu';


const Item = Form.Item

const { TreeNode } = Tree;

interface AuthFormProps extends FormComponentProps {
    // 用来传递form对象的函数
    setForm: Function;
    role: any | null;
    setUpdateMenuKeys:Function;
}


/*
添加分类的form组件
 */
const AuthForm = (props: AuthFormProps) => {

    const [checkedKeys, setCheckedKeys] = useState()
    const [treeNodes, setTreeNodes] = useState(Array<any>())

    useEffect(() => {
        // 根据传入角色的menus生成初始状态
        initMenusTree();
        initCheckedKeys();
        return ()=>{
            setCheckedKeys([]);
            setTreeNodes([]);
        }
    }, [props.role]);

    const initMenusTree = async () => {
        // 得到最新的menus
        const { data, status } = await reqMenuTree();
        if (status === 0 && data) {
            props.setForm(props.form)
            const tree = data.map((x: any) => converter2Menu(x));
            setTreeNodes(getTreeNodes(tree));
        }
    }
    const initCheckedKeys = async () => {
        const { data, status } = await reqMenus(props.role._id)
        if (status === 0 && data) {
            const menus = data.map((x: any) => x.id);
            setCheckedKeys(menus)
        }
    }

    const convertMenuTreeData = (menuTree: Array<any>) => {

        const res = menuTree.map((x: any) => {
            if (x.children && x.children.length > 0) {
                x.children = convertMenuTreeData(x.children);
            }
            return {
                tilte: x.name,
                key: x.id,
                children: x.children
            };
        });
        return res;
    }

    /*
    为父组件提交获取最新menus数据的方法
     */
    const getMenus = () => checkedKeys


    const getTreeNodes = (menuList: MenuModel[]) => {
        return menuList.reduce((pre: any, item) => {
            pre.push(
                <TreeNode title={item.title} key={item._id}>
                    {item.children ? getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    // 选中某个node时的回调
    const onCheck = (checkedKeys: any) => {
        console.log('onCheck', checkedKeys);
        props.setUpdateMenuKeys(checkedKeys);
        setCheckedKeys(checkedKeys)
    };


    // 根据新传入的role来更新checkedKeys状态
    /*
    当组件接收到新的属性时自动调用
     */
    useEffect(() => {
        const menus = props.role.menus
        setCheckedKeys(menus)
    }, [])

    console.log('AuthForm render()')
    const { role } = props
    // 指定Item布局的配置对象
    const formItemLayout = {
        labelCol: { span: 4 },  // 左侧label的宽度
        wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
        <div >
            <Item label='角色名称' {...formItemLayout}>
                <Input value={role.name} disabled />
            </Item>

            <Tree
                checkable
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
            >
                <TreeNode title="平台权限" key="all">
                    {treeNodes}
                </TreeNode>
            </Tree>
        </div>
    )
}
export default Form.create<AuthFormProps>()(AuthForm)