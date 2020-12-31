import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import AddWarehouse from './add'
import Service from './Service'
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



    dealUploadData = (res) => {
        this.context.batConfig.changeSearch()
    }

    render() {

        const {
            selectdata = {}
        } = this.props;
        const _batProps = {
            config: [{
                title: '新增',
                noAuth: 'add',
                noCheck: true,
                onClick: () => this.context.toggleWin('visible', { rowData: {}, type: 'add' })
            }, {
                title: '转移客服',
                noAuth: 'add',
                onClick: () => this.context.toggleWin('visibleSku')
            }],
            method: '',
            batConfig: this.context.batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                </Row>
                {this.context.visible && <AddWarehouse
                    storagecountry={selectdata.storagecountry}
                />}
                {this.context.visibleSku && <Service 
                storagemanager = {selectdata.storagemanager}
                listSelData={this.props.listSelData} />}
            </div>

        )
    }
}