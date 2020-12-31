import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import Exportbutton from '@/components/Exportbutton';
// import LogOperation from '../../../Conponent/Log/logOperation'
import Mark from './mark'
import Pay from './pay'
import Shipments from './shipments'
import {
    Row,
    Col,
    message,
} from 'antd';
import api from "@/fetch/api"
import { get, post } from '@/fetch/request'
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            downLoading: ''   //导出下载链接
        }
    }
    // 导出功能
    order_export = () => {
        const {
            batConfig
        } = this.context
        const ids = batConfig.listSelData
        if (ids.length == 0) {
            message.error('请选择商品')
            return false
        }
        let orderid = ids.toString()

        post(api.order_export, { order_id: orderid }).then(res => {
            if (res) {
                if (res.resultId == 200) {
                    let url = res.resultData.url + '&access_token=' + localStorage.getItem('ACCESS_TOKEN')

                    this.setState({
                        downLoading: url
                    }, () => {
                        this.refs.golink.click();
                    });
                }
            }
        })
    }
    render() {
        const {
            activeKey
        } = this.context;
        const _batProps = {
            config: [{
                title: '创建订单',
                onAuth: 'add',
                noCheck: true,
                method: '',
                // onClick: () => this.context.jumpPage('Allorderpor')
                url:`Allorderporedit/0/add`
            }, {
                title: '导出数据',
                onAuth: 'add',
                method: api.order_export,
                noCheck: true,
                method: '',
                onClick: () => this.order_export()
            }],
            unicode: 'order_id|id',
            batConfig: this.context.batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                    {/* <Exportbutton {...istest} ></Exportbutton> */}
                </Row>
                <a href={this.state.downLoading} style={{ display: 'none' }} ref="golink">urlLink</a>
                {this.context.shipments && <Shipments />}
                {this.context.visibleLog && <Pay />}
                {this.context.visibleMark && <Mark />}
            </div>

        )
    }
}