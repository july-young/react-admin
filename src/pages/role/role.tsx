import React, { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'


import { PAGE_SIZE } from "../../utils/constants"
import { reqRoles, reqAddRole, reqUpdateRole, reqMenuTree } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/dateUtils'
import { logout } from '../../redux/actions'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import User from '../../models/user'
import RoleModel from "../../models/role";
import converter2Role from '../../converter/converter2Role'
const { connect } = require('react-redux')

interface RoleProps {
    user: User;
    logout(): any;
}
/*
角色路由
 */
const Role = (props: RoleProps) => {
    // 所有角色的列表
    const [roles, setRoles] = useState()
    // 选中的role
    const [role, setRole] = useState(new RoleModel())
    const [updateMenuKeys, setUpdateMenuKeys] = useState(Array())
    // 是否显示添加界面
    const [isShowAdd, setIsShowAdd] = useState(false)
    // 是否显示设置权限界面
    const [isShowAuth, setIsShowAuth] = useState(false)
    const [columns, setColumns] = useState()
    const [form, setForm] = useState<WrappedFormUtils | any>();
    const [total, setTotal] = useState(0)


    const initColumn = () => {
        setColumns([
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                render: (gmtCreate: any) => formateDate(gmtCreate)
            },
            {
                title: '授权时间',
                dataIndex: 'gmtAuth',
                render: (gmtAuth: any) => formateDate(gmtAuth)
            },
            {
                title: '授权人',
                dataIndex: 'authUser'
            },
        ]);
    }

    const getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0 && result.data) {
            const { list, total } = result.data;
            setTotal(total);
            const roles = list.map((x: any) => converter2Role(x))
            setRoles(roles);
        }
    }


    const onRow = (role: any) => {
        return {
            onClick: (event: any) => { // 点击行
                console.log('row onClick()', role)
                // alert('点击行')
                setRole(role);
            },
        }
    }

    /*
    添加角色
     */
    const addRole = () => {
        // 进行表单验证, 只能通过了才向下处理
        form.validateFields(async (error: any, values: any) => {
            if (!error) {

                // 收集输入数据
                const { roleName } = values
                form.resetFields()
                // 请求添加
                const result = await reqAddRole(roleName)
                // 根据结果提示/更新列表显示
                if (result.status === 0) {
                    message.success('添加角色成功')
                    // 隐藏确认框
                    setIsShowAdd(false);
                    getRoles();

                } else {
                    message.error('添加角色失败')
                }
            }
        })
    }

    /*
    更新角色
     */
    const updateRole = async () => {

        // 隐藏确认框
        setIsShowAdd(false);

        // 得到最新的menus
        const menus = await reqMenuTree()
        role.menus = menus
        // 请求更新
        const result = await reqUpdateRole(role._id, updateMenuKeys)
        if (result.status === 0) {
            // this.getRoles()
            // 如果当前更新的是自己角色的权限, 强制退出
            if (props.user.roles.map((x: RoleModel) => x._id).indexOf(role._id) > -1) {
                props.logout()
                message.success('当前用户角色权限成功')
            } else {
                message.success('设置角色权限成功')
                setRoles([...roles]);
            }
        }
    }



    useEffect(() => {
        initColumn()
        getRoles();
    }, [])

    const title = (
        <span>
            <Button type='primary' onClick={() => setIsShowAdd(true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={!role._id} onClick={() => setIsShowAuth(true)}>设置角色权限</Button>
        </span>
    )


    return (
        <Card title={title}>
            <Table
                bordered
                rowKey='_id'
                dataSource={roles}
                columns={columns}
                pagination={{ defaultPageSize: PAGE_SIZE, total: total }}
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: [role._id],
                    onSelect: (role) => { // 选择某个radio时回调
                        setRole(role);
                    }

                }}
                onRow={onRow}
            />

            <Modal
                title="添加角色"
                visible={isShowAdd}
                onOk={addRole}
                onCancel={() => {
                    setIsShowAdd(false)
                    form.resetFields()
                }}
            >
                <AddForm
                    setForm={(form: any) => { setForm(form) }}
                />
            </Modal>

            <Modal
                title="设置角色权限"
                visible={isShowAuth}
                onOk={updateRole}
                onCancel={() => {
                    setIsShowAuth(false)
                }}
            >
                <AuthForm
                    setUpdateMenuKeys={setUpdateMenuKeys}
                    setForm={(form: any) => { setForm(form) }}
                    role={role} />
            </Modal>
        </Card>
    )
}

export default connect(
    (state: any) => ({ ...state }),
    { logout }
)(Role)