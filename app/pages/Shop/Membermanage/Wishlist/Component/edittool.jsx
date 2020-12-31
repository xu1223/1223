import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';

import {
    Row,
    Col,
    message,
    Modal
} from 'antd';
import api from "@/fetch/api"

import { post } from '@/fetch/request'
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }


    // 转至购物车
    cartlist = () => {
        let {
            batConfig,
            id
        } = this.context
        let selectedRows = batConfig.selectedRows
        if (selectedRows.length > 0) {
            let param = {
                customer_id: id,
                wish_products: []
            }

            for (var i = 0; i < selectedRows.length; i++) {
                if (!selectedRows[i].issize) {  //判断是否选择尺码。
                    message.error('请选择尺码，诺无尺码则是商品数据有误')
                    return false
                } else {
                    param.wish_products.push({
                        wish_id: selectedRows[i].id,
                        product_id: selectedRows[i].product_id,
                        product_option_value_id: selectedRows[i].issize
                    })
                }
            }
            param.wish_products = JSON.stringify(param.wish_products)
            post(api.save_wishlist_to_cart,
                param
            ).then(res => {
                if (res.resultId == 200) {
                    this.props.changeSearch({
                        customer_id: id
                    })
                    message.success(res.resultMsg)
                }
            })
        } else {
            message.error('请至少选择一项')
        }
    }
    render() {
        const _batProps = {
            config: [{
                title: '转至购物车',
                noAuth: 'add',
                onClick: () => this.cartlist()

            }, {
                title: '批量删除',
                noAuth: 'add',
                type:"danger",
                method: api.del_customer_wishlist,
                unicode: 'wish_ids|id',
            }],
            method: '',
            batConfig: this.context.batConfig,
        };
        const {
        } = this.props
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>


                </Row>

            </div>
        )
    }
}