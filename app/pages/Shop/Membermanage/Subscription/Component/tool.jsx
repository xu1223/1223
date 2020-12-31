import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import FileWrap from '@/components/UpAndDown/index';
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


    render() {

        const {
          
        } = this.props;
        const _batProps = {
            config: [ {
                title: '取消订阅',
                noAuth: '',
                method: api.newsletter_cancel,
                    
            }],
            method: '',
            unicode: 'newsletter_id|id',
            batConfig: this.context.batConfig,
        };

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