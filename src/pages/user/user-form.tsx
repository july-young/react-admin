import React, { useState, useEffect } from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'
import UserModel from '../../models/user'
import { reqRoles } from '../../api'
import converter2Role from '../../converter/converter2Role'


const Item = Form.Item
const Option = Select.Option

interface UserFormProps {
    setForm: Function, // 用来传递form对象的函数
    roles: any,
    form: any;
    user: UserModel
}
/*
添加/修改用户的form组件
 */
const UserForm = (props: UserFormProps) => {
    const [roles, setRoles] = useState([])
    useEffect(() => {
        props.setForm(props.form);
        initRoleoptions();
    }, []);

    const initRoleoptions = async () => {
        const result = await reqRoles();
        if (result.status === 0) {
            const { list } = result.data
            const roles = list.map((x: any) => { return { _id: x.id, name: x.name } });
            setRoles(roles);
        }
    }



    const { user } = props
    const { getFieldDecorator } = props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
        labelCol: { span: 4 },  // 左侧label的宽度
        wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
        <Form {...formItemLayout}>
            <Item label='用户名'>
                {
                    getFieldDecorator('username', {
                        initialValue: user.username,
                    })(
                        <Input placeholder='请输入用户名' />
                    )
                }
            </Item>

            {
                user._id ? null : (
                    <Item label='密码'>
                        {
                            getFieldDecorator('password', {
                                initialValue: user.password,
                            })(
                                <Input type='password' placeholder='请输入密码' />
                            )
                        }
                    </Item>
                )
            }

            <Item label='手机号'>
                {
                    getFieldDecorator('phone', {
                        initialValue: user.phone,
                    })(
                        <Input placeholder='请输入手机号' />
                    )
                }
            </Item>
            <Item label='邮箱'>
                {
                    getFieldDecorator('email', {
                        initialValue: user.email,
                    })(
                        <Input placeholder='请输入邮箱' />
                    )
                }
            </Item>

            <Item label='角色'>
                {
                    getFieldDecorator('roleIds', {
                        initialValue: user.roles && user.roles.length > 0 ? user.roles.map((x:any)=>x._id) : [],
                    })(
                        <Select
                        mode="multiple"
                        >
                            {
                                roles.map((role: any) => <Option key={role._id} value={role._id}>{role.name}</Option>)
                            }
                        </Select>
                    )
                }
            </Item>
        </Form>
    )
}

export default Form.create<UserFormProps>()(UserForm)