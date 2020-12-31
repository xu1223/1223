import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import AddWarehouse from './add'

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
            dictData = {},
            selectdata = {}
        } = this.props;
        const _batProps = {
            config: [{
                title: '新增',
                noAuth: 'add',
                noCheck: true,
                onClick: () => this.context.toggleWin('visible', { rowData: {}, type: 'add' })
            }, {
                title: '批量删除',
                type:"danger",
                noAuth: 'add',
                method: api.review_del,

            }],
            method: '',
            unicode: 'review_ids|id',
            batConfig: this.context.batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <div style={{ display: 'flex' }}>
                            <BatOperation {..._batProps} />
                            <div style={{ marginLeft: '10px' }}>
                                <FileWrap
                                    upLoadUrl="/api/admin/batch_add_reviews"
                                    title="批量导入"
                                    name='file'
                                    upLoadFile={'api/admin/review_template_download'}
                                    uploadParamas={{ access_token: localStorage.getItem('ACCESS_TOKEN') }}
                                    showImportBtn={true}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                {this.context.visible && <AddWarehouse
                    storagecountry={selectdata.storagecountry}
                />}
          


            </div>

        )
    }
}