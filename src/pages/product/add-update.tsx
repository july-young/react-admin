import React, { useState, useEffect, useRef, useContext } from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddProduct } from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import CategoryModel from '../../models/category'
import ProductModel from '../../models/product'
import productConverter from '../../converter/converter2Product'

import { ProductContext } from './product'

const { Item } = Form;
const { TextArea } = Input;

interface ProductAddUpdateProps {
    form: any;
    history: any;
    imgs: any;
    editor: any;
    pCategoryId: string;
    categotyId: string;
}

/*
Product的添加和更新的子路由组件
 */
const ProductAddUpdate = (props: ProductAddUpdateProps) => {

    const [options, setOptions] = useState(Array<any>());
    const [product, setProduct] = useState(new ProductModel());
    const [categoryIds, setCategoryIds] = useState(Array());
    const [imgs, setImgs] = useState(Array());
    const [editor, setEditor] = useState(Array());

    const [detail, setDetail] = useState();
    const [isUpdate, setIsUpdate] = useState(false);

    const productContext= useContext(ProductContext);
    const { productChosen } =productContext;

    useEffect(() => {
        if (productChosen && productChosen._id) {
            setProduct(productChosen);
            setDetail(props.editor);
            // 保存是否是更新的标识
            setIsUpdate(true);
        }
        getCategorys('0')
        /*
        在卸载之前清除保存的数据
        */
        return () => {
            
            productContext.dispatch({
                type: "clear",
            });
            setIsUpdate(false);
        }
    }, []);

    const initOptions = async (categorys: Array<CategoryModel>) => {
        // 根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            loading: false,
            label: c.name,
            isLeaf: false, // 不是叶子
            children: null
        }))

        // 如果是一个二级分类商品的更新
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map((c: CategoryModel) => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)!

            // 关联对应的一级option上
            targetOption.loading = false
            targetOption.children = childOptions
        }

        // 更新options状态
        setOptions([...options]);
    }

    /*
    异步获取一级/二级分类列表, 并显示
    async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
     */
    const getCategorys = async (parentId: string) => {
        const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
        if (result.status === 0) {
            const categorys = result.data.map((x: any) => productConverter.toProduct(x))
            // 如果是一级分类列表
            if (parentId === '0') {

                initOptions(categorys)
            } else { // 二级列表
                return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
            }
        }
    }


    /*
    验证价格的自定义验证函数
     */
    const validatePrice = (rule: any, value: any, callback: any) => {
        console.log(value, typeof value)
        if (value * 1 > 0) {
            callback() // 验证通过
        } else {
            callback('价格必须大于0') // 验证没通过
        }
    }

    /*
    用加载下一级列表的回调函数
     */
    const loadData = async (selectedOptions: any) => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true

        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的options
            const childOptions = subCategorys.map((c: CategoryModel) => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
                children: null
            }))
            // 关联到当前option上
            targetOption.children = childOptions
            //更新级联下拉框
            setOptions(options.map(x => x.value === targetOption.value ? targetOption : x))
        } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

    }

    const submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        props.form.validateFields(async (error: any, values: any) => {
            if (!error) {

                // 1. 收集数据, 并封装成product对象
                const { name, desc, price, categoryIds } = values
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                const product = { _id: '', name, desc, price, imgs: props.imgs, detail: props.editor, pCategoryId, categoryId }

                // 如果是更新, 需要添加_id
                if (isUpdate) {
                    product._id = product._id || ''
                }

                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddProduct(productConverter.toProductAddForm(product))

                // 3. 根据结果提示
                if (result.status === 0) {
                    message.success(`${isUpdate ? '更新' : '添加'}商品成功!`)
                    props.history.goBack()
                } else {
                    message.error(`${isUpdate ? '更新' : '添加'}商品失败!`)
                }
            }
        })
    }

    // 指定Item布局的配置对象
    const formItemLayout = {
        labelCol: { span: 2 },  // 左侧label的宽度
        wrapperCol: { span: 8 }, // 右侧包裹的宽度
    }

    // 头部左侧标题
    const title = (
        <span>
            <LinkButton onClick={() => props.history.goBack()}>
                <Icon type='arrow-left' style={{ fontSize: 20 }} />
            </LinkButton>
            <span>{isUpdate ? '修改商品' : '添加商品'}</span>
        </span>
    )

    const { getFieldDecorator } = props.form

    return (
        <ProductContext.Consumer>
            {productChosen =>
                <Card title={title}>
                    <Form {...formItemLayout}>
                        <Item label="商品名称">
                            {
                                getFieldDecorator('name', {
                                    initialValue: product.name,
                                    rules: [
                                        { required: true, message: '必须输入商品名称' }
                                    ]
                                })(<Input placeholder='请输入商品名称' />)
                            }
                        </Item>
                        <Item label="商品描述">
                            {
                                getFieldDecorator('desc', {
                                    initialValue: product.desc,
                                    rules: [
                                        { required: true, message: '必须输入商品描述' }
                                    ]
                                })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                            }

                        </Item>
                        <Item label="商品价格">

                            {
                                getFieldDecorator('price', {
                                    initialValue: product.price,
                                    rules: [
                                        { required: true, message: '必须输入商品价格' },
                                        { validator: validatePrice }
                                    ]
                                })(<Input type='number' placeholder='请输入商品价格' addonAfter='元' />)
                            }
                        </Item>
                        <Item label="商品分类">
                            {
                                getFieldDecorator('categoryIds', {
                                    initialValue: categoryIds,
                                    rules: [
                                        { required: true, message: '必须指定商品分类' },
                                    ]
                                })(
                                    <Cascader
                                        placeholder='请指定商品分类'
                                        options={options}  /*需要显示的列表数据数组*/
                                        loadData={loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                                    />
                                )
                            }

                        </Item>

                        <Item label="商品图片">
                            <PicturesWall setImgs={setImgs} imgs={imgs} />
                        </Item>

                        <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                            <RichTextEditor setEditor={setEditor} detail={detail} />
                        </Item>
                        <Item>
                            <Button type='primary' onClick={submit}>提交</Button>
                        </Item>
                    </Form>
                </Card>
            }
        </ProductContext.Consumer>
    )

}



export default Form.create()(ProductAddUpdate);