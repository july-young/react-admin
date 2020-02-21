import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import CategoryModel from '../../models/category'
import converter2Category from '../../converter/converter2Category'
import { WrappedFormUtils } from 'antd/lib/form/Form'
const { connect } = require('react-redux')

interface CategoryProps {
}
/*
商品分类路由
 */
function Category( props: CategoryProps) {

    const [form,setForm] = useState<WrappedFormUtils|any>();

    /*
    为第一次render()准备数据
     */
    useEffect(() => {
        initColumns();
    }, []);

    /*
    执行异步任务: 发异步ajax请求
     */
    //获取一级分类列表显示
    useEffect(() => {
        getCategorys()
    }, [1]) //useEffect 的第二个参数是 [1]，其实也可以是任何一个常数，因为它永远不变 这里只有mount时才被调用，相当于componentDidMount


    const [columns, setColumns] = useState(Array<any>());
    // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    const [showStatus, setShowStatus] = useState(0);
    const [category, setCategory] = useState();
    // 是否正在获取数据中
    const [loading, setLoading] = useState(false);
    // 当前需要显示的分类列表的父分类ID
    const [parentId, setParentId] = useState('0');
    // 当前需要显示的分类列表的父分类名称
    const [parentName, setParentName] = useState('');
    // 一级分类列表
    const [categorys, setCategorys] = useState(Array<CategoryModel>());
    // 二级分类列表
    const [subCategorys, setSubCategorys] = useState([]);

    /*
    初始化Table所有列的数组
     */
    const initColumns = () => {
        const cols = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category: CategoryModel) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        {parentId === '0' ? <LinkButton onClick={() => showSubCategorys(category)}>查看子分类</LinkButton> : null}

                    </span>
                )
            }
        ]
        setColumns(cols);
    }


    /*
    异步获取一级/二级分类列表显示
    parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
     */
    const getCategorys = async (pId: string | void) => {

        // 在发请求前, 显示loading
        setLoading(true);
        pId = pId || parentId
        // 发异步ajax请求, 获取数据
        const result = await reqCategorys(pId)
        // 在请求完成后, 隐藏loading
        setLoading(false)

        if (result.status === 0) {
            // 取出分类数组(可能是一级也可能二级的)
            const categorys = result.data.map((x: CategoryModel) => converter2Category(x))
            if (pId === '0') {
                // 更新一级分类状态
                setCategorys(categorys);
            } else {
                // 更新二级分类状态
                setSubCategorys(categorys)
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    /*
    显示指定一级分类对象的二子列表
     */
    const showSubCategorys = async (cate: CategoryModel) => {
        // 更新状态
        setParentId(cate._id);
        setParentName(cate.name);
        // 在状态更新且重新render()后执行

        // 获取二级分类列表显示
        await getCategorys(cate._id)
    }
    /*
    显示指定一级分类列表
     */
    const showCategorys = () => {
        // 更新为显示一列表的状态
        setParentId('0')
        getCategorys()
        setParentName('')
    }

    /*
    响应点击取消: 隐藏确定框
     */
    const handleCancel = () => {
        // 清除输入数据
        form.resetFields()
        // 隐藏确认框
        setShowStatus(0);
    }

    /*
    显示添加的确认框
     */
    const showAdd = () => {
        setShowStatus(1)
    }

    /*
    添加分类
     */
    const addCategory = () => {
        form.validateFields(async (err:any, values:any) => {
            if (!err) {
                // 隐藏确认框
                setShowStatus(0);

                // 收集数据, 并提交添加分类的请求
                const { parentId, categoryName } = values
                // 清除输入数据
                form.resetFields()
                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {

                    // 添加的分类就是当前分类列表下的分类
                    if (parentId === parentId) {
                        // 重新获取当前分类列表显示
                        getCategorys()
                    } else if (parentId === '0') { // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                        getCategorys('0')
                    }
                }
            }
        })
    }


    /*
    显示修改的确认框
     */
    const showUpdate = ((category: CategoryModel) => {
        // 保存分类对象
        setCategory(category)
        // 更新状态
        setShowStatus(2)
    })

    /*
    更新分类
     */
    const updateCategory = () => {
        console.log('updateCategory()')
        // 进行表单验证, 只有通过了才处理
        form.validateFields(async (err:any, values:any) => {
            if (!err) {
                // 1. 隐藏确定框
                setShowStatus(0)

                // 准备数据
                const categoryId = category._id
                const { categoryName } = values
                // 清除输入数据
                form.resetFields()

                // 2. 发请求更新分类
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    // 3. 重新显示列表
                    getCategorys()
                }
            }
        })
    }




    // card的左侧
    const title = parentId === '0' ? '一级分类列表' : (
        <span>
            <LinkButton onClick={()=>showCategorys()}>一级分类列表</LinkButton>
            <Icon type='arrow-right' style={{ marginRight: 5 }} />
            <span>{parentName}</span>
        </span>
    )
    // Card的右侧
    const extra = (
        <Button type='primary' onClick={showAdd}>
            <Icon type='plus' />
            添加
            </Button>
    )

    return (
        <Card title={title} extra={extra}>
            <Table
                bordered
                rowKey='_id'
                loading={loading}
                dataSource={parentId === '0' ? categorys : subCategorys}
                columns={columns}
                pagination={{ defaultPageSize: 5, showQuickJumper: true }}
            />

            <Modal
                title="添加分类"
                visible={showStatus === 1}
                onOk={addCategory}
                onCancel={handleCancel}
            >
                <AddForm
                    categorys={categorys}
                    parentId={parentId}
                    setForm={(form: any) => { setForm(form) }}
                />
            </Modal>

            <Modal
                title="更新分类"
                visible={showStatus === 2}
                onOk={updateCategory}
                onCancel={handleCancel}
            >
                <UpdateForm
                    category={category}
                    setForm={(form: any) => { setForm(form) }}
                />
            </Modal>
        </Card>
    )

}

export default connect(
    (state: any) => (state),
    {}
)(Category)