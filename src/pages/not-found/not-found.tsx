import React, { Component } from 'react'
import { Button, Row, Col } from 'antd'

import { setHeadTitle } from '../../redux/actions'
import './not-found.less'

const { connect } = require('react-redux')

interface NotFoundProps {
    setHeadTitle: Function;
    history: any;
}
/*
前台404页面
 */
const NotFound = (props: NotFoundProps) => {

    const goHome = () => {
        props.setHeadTitle('首页')
        props.history.replace('/home')
    }

    return (
        <Row className='not-found'>
            <Col span={12} className='left'></Col>
            <Col span={12} className='right'>
                <h1>404</h1>
                <h2>抱歉，你访问的页面不存在</h2>
                <div>
                    <Button type='primary' onClick={goHome}>
                        回到首页
            </Button>
                </div>
            </Col>
        </Row>
    )
}

export default connect(
    null,
    { setHeadTitle }
)(NotFound)