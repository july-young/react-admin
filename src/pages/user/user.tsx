import React, { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { formateDate } from "../../utils/dateUtils"
import LinkButton from "../../components/link-button/index"
import { reqDeleteUser, reqUsers, reqAddUser, reqUpdateUser, reqRoles } from "../../api/index";
import UserForm from './user-form'
import UserModel from '../../models/user'
import RoleModel from '../../models/role';
import { PaginationConfig } from 'antd/lib/table';
import converter2User from '../../converter/converter2User';

interface UserProps {
}
/*
用户路由
 */
const User = (props: UserProps) => {

    const [columns, setColumns] = useState(Array());
    const [roleNames, setRoleNames] = useState<any>({});
    // 选中的用户
    const [user, setUser] = useState();
    // 所有用户列表
    const [users, setUsers] = useState(Array());
    // 所有角色列表
    const [roles, setRoles] = useState(Array())
    // 是否显示确认框
    const [isShow, setIsShow] = useState(false);
    const [form, setForm] = useState();
    const [pagination, setPagination] = useState<any>({
        current: 1,
        pageSize: 5,
        total: 0
    })
    const initColumns = () => {
        setColumns([
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },

            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'gmtCreate',
                render: (gmtCreate: any) => formateDate(gmtCreate)
            },
            {
                title: '所属角色',
                dataIndex: 'roleNames',
            },
            {
                title: '操作',
                render: (user: UserModel) => (
                    <span>
                        <LinkButton onClick={() => showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]);
    }

    /*
    显示添加界面
     */
    const showAdd = () => {
        // 去除前面保存的user
        setUser({});
        setIsShow(true);
    }

    /*
    显示修改界面
     */
    const showUpdate = (user: UserModel) => {
        // 保存user
        setUser(user);
        setIsShow(true);
    }

    /*
    删除指定用户
     */
    const deleteUser = (user: UserModel) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功!')
                    getUsers()
                }
            }
        })
    }

    /*
    添加/更新用户
     */
    const addOrUpdateUser = async () => {

        // 1. 收集输入数据
        let userForm: any = form.getFieldsValue()
        // 如果是更新
        const result = user && user._id ? await reqUpdateUser({...userForm,id: user._id}) : await reqAddUser(userForm)
        // 3. 更新列表显示
        if (result.status === 0) {
            message.success(` 操作成功!`)
            form.resetFields();
            setIsShow(false);
            getUsers();

        } else {
            message.error(` 操作失败!`)
        }
    }

    const getUsers = async () => {
        const result = await reqUsers(pagination)
        if (result.status === 0) {
            const { total, list } = result.data;
            const users = list.map((x: any) => converter2User(x));
            setUsers(users);
            setPagination({ ...pagination, total: parseInt(total) })
        }
    }

    useEffect(() => {
        initColumns()
        getUsers()
    }, []);

    const onChange = (pagination: PaginationConfig) => {
        // setPagination({ pageSize: pagination.pageSize!, current: pagination.current! });
    }

    const title = <Button type='primary' onClick={showAdd}>创建用户</Button>

    return (
        <Card title={title}>
            <Table
                bordered
                rowKey='_id'
                dataSource={users}
                columns={columns}
                pagination={pagination}
                onChange={onChange}
            />

            <Modal
                title={user && user._id ? '修改用户' : '添加用户'}
                visible={isShow}
                onOk={addOrUpdateUser}
                onCancel={() => {
                    form.resetFields()
                    setIsShow(false)
                }}
            >
                <UserForm
                    setForm={(form: any) => setForm(form)}
                    roles={roles}
                    user={user}
                />
            </Modal>

        </Card>
    )
}

export default User;