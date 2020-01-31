import React, {useEffect} from 'react'
import {
  Form,
  Input
} from 'antd'
import { FormComponentProps } from 'antd/lib/form'

const Item = Form.Item

interface AddFormProps  extends FormComponentProps{
        // 用来传递form对象的函数
        setForm: Function;
}
/*
添加分类的form组件
 */
const AddForm =(props:AddFormProps)=> {

    useEffect(()=>{
        props.setForm(props.form)
    },[1]);


    const { getFieldDecorator } = props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form>
        <Item label='角色名称' {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules: [
                {required: true, message: '角色名称必须输入'}
              ]
            })(
              <Input placeholder='请输入角色名称'/>
            )
          }
        </Item>
      </Form>
    )
}

export default Form.create<AddFormProps>()(AddForm)