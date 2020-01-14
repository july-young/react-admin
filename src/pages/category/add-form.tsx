import React, { useEffect} from 'react'
import {
  Form,
  Select,
  Input
} from 'antd'
import CategoryModel from '../../models/category'
import { FormComponentProps } from 'antd/lib/form'

const Item = Form.Item
const Option = Select.Option


interface AddFormProps extends FormComponentProps{
    // 用来传递form对象的函数
    setForm: Function;
    // 一级分类的数组
    categorys: Array<CategoryModel>;
    // 父分类的ID
    parentId: string; 
}
/*
添加分类的form组件
 */
const AddForm =(props:AddFormProps)=> {


    useEffect(()=>{
           props.setForm(props.form)
    },[1]);

    const {categorys, parentId} = props
    const { getFieldDecorator } = props.form

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }

        </Item>

        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                {required: true, message: '分类名称必须输入'}
              ]
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
}

export default Form.create<AddFormProps>()(AddForm)