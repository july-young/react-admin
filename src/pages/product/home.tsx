import React, { useState, useCallback, useEffect } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import memoryUtils from "../../utils/memoryUtils";
import ProductModel from '../../models/product'

const Option = Select.Option

class ProductHomeProps {
    history?: any
}
/*
Product的默认子路由组件
 */
const ProductHome = (props: ProductHomeProps) => {

    const [pageNum, setPageNum] = useState(1)
    const [columns, setColumns] = useState(new Array<any>())

    // 商品的总数量
    const [total, setTotlal] = useState(0)
    // 商品的数组
    const [products, setProducts] = useState([]);
    // 是否正在加载中
    const [loading, setLoading] = useState(false);
    // 搜索的关键字
    const [searchName, setSearchName] = useState('');
    // 根据哪个字段搜索
    const [searchType, setSearchType] = useState('productName');

    /*
    初始化table的列的数组
     */
    const initColumns = () => {

        setColumns([
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price: any) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product: ProductModel) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => updateStatus(_id! || '', newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product: ProductModel) => {
                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={() => showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={() => showUpdate(product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]);
    }
    /*
    显示商品详情界面
     */
    const showDetail = (prodcut: ProductModel) => {
        // 缓存product对象 ==> 给detail组件使用
        memoryUtils.product = prodcut
        props.history.push('/product/detail')
    }

    /*
    显示修改商品界面
     */
    const showUpdate = (prodcut: ProductModel) => {
        // 缓存product对象 ==> 给detail组件使用
        memoryUtils.product = prodcut
        props.history.push('/product/addupdate')
    }

    /*
    获取指定页码的列表数据显示
     */
    const getProducts = async (pageNum: number) => {
        setPageNum(pageNum) // 保存pageNum, 让其它方法可以看到
        setLoading(true) // 显示loading

        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else { // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        setLoading(false) // 隐藏loading
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const { total, list } = result.data
            setTotlal(total);
            setProducts(list);
        }
    }

    /*
    更新指定商品的状态
     */
    const updateStatus = async (productId: string, status: number) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            getProducts(pageNum)
        }
    }

    useEffect(() => {
        initColumns()
        getProducts(1)
    }, []);

    const title = (
        <span>
            <Select
                value={searchType}
                style={{ width: 150 }}
                onChange={(value: any) => { setSearchType(value) }}
            >
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input
                placeholder='关键字'
                style={{ width: 150, margin: '0 15px' }}
                value={searchName}
                onChange={event => setSearchName(event.target.value)}
            />
            <Button type='primary' onClick={() => getProducts(1)}>搜索</Button>
        </span>
    )

    const extra = (
        <Button type='primary' onClick={() => props.history.push('/product/addupdate')}>
            <Icon type='plus' />
            添加商品
      </Button>
    )

    return (
        <Card title={title} extra={extra}>
            <Table
                bordered
                rowKey='_id'
                loading={loading}
                dataSource={products}
                columns={columns}
                pagination={{
                    current: pageNum,
                    total,
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    onChange: getProducts
                }}
            />
        </Card>
    )
}


export default ProductHome;