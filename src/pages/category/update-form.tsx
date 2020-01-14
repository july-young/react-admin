import React, { useEffect } from 'react'
import {
    Form,
    Input
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import CategoryModel from '../../models/category'

const Item = Form.Item

interface UpdateFormProps extends FormComponentProps {
    category: CategoryModel;
    setForm: Function;
}
/*
更新分类的form组件
 */
const UpdateForm = (props: UpdateFormProps) => {
    // 将form对象通过setForm()传递父组件
    useEffect(() => {
        props.setForm(props.form)
    }, []);

    const { name:categoryName } = props.category;
    const { getFieldDecorator } = props.form

    return (
        <Form>
            <Item>
                {
                    getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules: [
                            { required: true, message: '分类名称必须输入' }
                        ]
                    })(
                        <Input placeholder='请输入分类名称' />
                    )
                }
            </Item>
        </Form>
    )
}

export default Form.create<UpdateFormProps>()(UpdateForm)