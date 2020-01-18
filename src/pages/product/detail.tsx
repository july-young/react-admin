import React, { useState, useEffect } from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'

import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import ProductModel from '../../models/product'

const Item = List.Item

interface ProductDetailProps {
    history: any;
    name: string;
    desc: string;
    price: string;
    imgs: Array<any>;
    detail: string;
}
/*
Product的详情子路由组件
 */
const ProductDetail = (props: ProductDetailProps) => {
    // 一级分类名称
    const [cName1, setCName1] = useState('');
    // 二级分类名称
    const [cName2, setCName2] = useState('');

    useEffect(() => {
        init();
    });

    const init = async () => {
        if (memoryUtils.product) {
            // 得到当前商品的分类ID
            const { pCategoryId, categoryId } = memoryUtils.product!;

            if (pCategoryId === '0') { // 一级分类下的商品
                const result = await reqCategory(categoryId)
                const cName1 = result.data.name
                setCName1(cName1);
            } else if (!pCategoryId) { // 二级分类下的商品
                // 一次性发送多个请求, 只有都成功了, 才正常处理
                const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
                const cName1 = results[0].data.name
                const cName2 = results[1].data.name
                setCName1(cName1);
                setCName2(cName2);
            }
        }
    }

    /*
    在卸载之前清除保存的数据
    */
    useEffect(() => {
        return () => {
            memoryUtils.product = new ProductModel();
        }
    })

    const title = (
        <span>
            <LinkButton>
                <Icon
                    type='arrow-left'
                    style={{ marginRight: 10, fontSize: 20 }}
                    onClick={() => props.history.goBack()}
                />
            </LinkButton>

            <span>商品详情</span>
        </span>
    )
    return (
        <Card title={title} className='product-detail'>
            <List>
                <Item>
                    <span className="left">商品名称:</span>
                    <span>{props.name}</span>
                </Item>
                <Item>
                    <span className="left">商品描述:</span>
                    <span>{props.desc}</span>
                </Item>
                <Item>
                    <span className="left">商品价格:</span>
                    <span>{props.price}元</span>
                </Item>
                <Item>
                    <span className="left">所属分类:</span>
                    <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
                </Item>
                <Item>
                    <span className="left">商品图片:</span>
                    <span>
                        {
                            props.imgs.map(img => (
                                <img
                                    key={img}
                                    src={BASE_IMG_URL + img}
                                    className="product-img"
                                    alt="img"
                                />
                            ))
                        }
                    </span>
                </Item>
                <Item>
                    <span className="left">商品详情:</span>
                    <span dangerouslySetInnerHTML={{ __html: props.detail }}>
                    </span>
                </Item>

            </List>
        </Card>
    )
}

export default ProductDetail;