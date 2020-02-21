import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    List,
    message
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddProduct, reqProduct, reqCategoryParents, reqCategoryTree, reqUpdateProduct } from '../../api'
import CategoryModel from '../../models/category'
import ProductModel from '../../models/product'
import productConverter from '../../converter/converter2Product'
import { BASE_IMG_URL } from '../../utils/constants'
import { ProductContext } from './product';

import converter2Product from '../../converter/converter2Product'
import converter2Category from '../../converter/converter2Category'

const { Item } = Form;

interface ProductDetailProps {
    history: any;
    name: string;
    desc: string;
    price: string;
    location: any;
    form: any;
}
/*
Product的详情子路由组件
 */
const ProductDetail = (props: ProductDetailProps) => {

    const [product, setProduct] = useState(new ProductModel());
    const [categoryNames, setCategoryNames] = useState('');

    useEffect(() => {
        const path: string = props.location.pathname;

        if (path.indexOf('detail') > -1) {
            const productId = path.slice((path.lastIndexOf('/') + 1));
            getProduct(productId);
        }
    }, []);

    /*
    async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
     */
    const getProduct = useCallback(async (productId: string) => {
        const result = await reqProduct(productId)   // {status: 0, data: categorys}
        if (result.status === 0 && result.data) {
            const productChosen = converter2Product.toProduct(result.data)
            setProduct(productChosen);

            const res = await reqCategoryParents(productChosen.categoryId);

            if(res.status===0){
                const categorys = res.data;
                const names =categorys.map((item:any)=>{
                    return item.name;
                })
                setCategoryNames(names.join('--->'))                

            }
        }
    }, [])


    // 指定Item布局的配置对象
    const formItemLayout = {
        labelCol: { span: 2 },  // 左侧label的宽度
        wrapperCol: { span: 8 }, // 右侧包裹的宽度
    }

    // 头部左侧标题
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
                    <span>{product.name}</span>
                </Item>
                <Item>
                    <span className="left">商品描述:</span>
                    <span>{product.desc}</span>
                </Item>
                <Item>
                    <span className="left">商品价格:</span>
                    <span>{product.price}元</span>
                </Item>
                <Item>
                    <span className="left">所属分类:</span>
                    <span>{categoryNames}</span>
                </Item>
                <Item>
                    <span className="left">商品图片:</span>
                    <span>
                        {
                            product.imgs.map(img => (
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
                    <span dangerouslySetInnerHTML={{ __html: product.detail }}>
                    </span>
                </Item>

            </List>
        </Card>
    )
}

export default ProductDetail;