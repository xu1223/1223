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
import Addshop from './add/index';
import { post } from '@/fetch/request'
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const _batProps = {
            config: [{
                title: '添加商品',
                noAuth: 'add',
                noCheck: true,
                onClick: () => this.context.toggleWin('visible', { rowData: {}, type: 'add' })
            }, {
                title: '转至心愿单',
                noAuth: 'add',
                method: api.save_cart_to_wishlist,
                unicode: 'cart_ids|id',
                childrenData:{
                    customer_id: this.context.id,
                }

            }, {
                title: '批量删除',
                noAuth: 'add',
                type:"danger",
                method: api.del_cart_product,
                unicode: 'cart_id|id',
            }],
        
            method: '',
            batConfig: this.context.batConfig,
        };
        const {
            param = {}
        } = this.props
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                    <Col>
                        {
                            param ?
                                <div className="tool-title">
                                    <p>商品总数：<span>{param.total_num}</span></p>
                                    <p>商品总重：<span>{param.total_weight}</span></p>
                                    <p>商品总额：<span>{param.total_price}</span></p>
                                </div>
                                : ''
                        }
                    </Col>
                    {
                        this.context.visible && <Addshop
                            visible={this.context.visible}
                            toggleWin={this.context.toggleWin}
                            id = {this.context.id}
                            changeindex ={this.context.changeSearch}
                        />
                    }
                </Row>

            </div>
        )
    }
}