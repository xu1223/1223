import React, { Component } from 'react'
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import { post } from "fetch/request";
import FileWrap from 'components/UpAndDown/index';
import Addmodal from './addmodal'
import Editmodal from './editmodal'

import api from "fetch/api";
import {
    Row,
    Col,
    message,
    Modal
} from 'antd';
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            type: '',
            downLoading: ''
        }
    }
    jumpPage = (link, id = 0, type = 'add') => {
        let url =  link + '/' + id + '/' + type;
        let href = window.location.origin+'/#/'+url
        window.open(href)
    }

    // 导出
    export(type, e) { 
        let data = this.context.batConfig
        let arr = []
        data.selectedRows.map(item => {  //获取id
            arr.push(item.id)
        })

        post(type == 'hx' ? api.export_products_sp : api.export_products_hx, {  //判断导出方式 是否是hx导出
            product_ids: arr.toString()
        }).then(res => {
            if (res.resultId == 200) {
                let url = ''
                if (type == 'hx') {  //配置地址添加access_token
                    url = res.resultData.urls[0] + '&access_token=' + localStorage.getItem('ACCESS_TOKEN') 
                } else {
                    url = res.resultData.url + '&access_token=' + localStorage.getItem('accessToken')
                }
                this.setState({
                    downLoading: url
                }, () => {
                    this.refs.golink.click();  //downloading改变使用a便签点击下载
                });
            } else {
                message.warning(res.resultMsg);
            }
        })
    }
    // 判断上下架方式
    putaway(type) {
        if (type == 'editshow') {
            this.context.toggleWin('editshow', type)
        } else {

            this.context.toggleWin('addshow', type, 'moreedit')
        }

    }


    render() {
        const _batProps = {
            config: [{
                title: '新增商品',
                noCheck: true,
                // onClick: () => this.jumpPage('ShopInsert'),
                url:`ShopInsertedit/0/add/`
            },
            {
                title: '批量导出',
                children: [{
                    title: "导出HX",
                    onClick: (e) => this.export('hx', e)
                }, {
                    title: "导出SP",
                    onClick: () => this.export('sp')
                },]
            },
            {
                title: '批量操作',
                children: [{
                    title: "批量上架",
                    onClick: (e) => this.putaway('add')
                }, {
                    title: "批量下架",
                    onClick: () => this.putaway('dow')
                }, {
                    title: "指定上架",
                    noCheck: true,
                    onClick: (e) => this.putaway('moreadd')
                }, {
                    title: "指定下架",
                    noCheck: true,
                    onClick: () => this.putaway('moredow')
                },]
            }, {
                title: '批量编辑',
                noAuth: 'add',
                onClick: () => this.putaway('editshow')
            }],
            method: '',
            unicode: 'ids|id',
            batConfig: this.context.batConfig,
        };
        const {
            type
        } = this.state
        return (
            <div>
                <div className='action-bar'>
                    <a href={this.state.downLoading} style={{ display: 'none' }} ref="golink"></a>
                    <Row type="flex" justify='space-between' align='middle' gutter={10}>
                        <Col>
                            <div style={{ display: 'flex' }}>
                                <BatOperation {..._batProps} />
                                <div style={{ marginLeft: '10px' }}>
                                    <FileWrap
                                        upLoadUrl="/api/admin/batch_add_products"
                                        title="批量导入"
                                        name='file'
                                        upLoadFile={'/api/admin/product_template_download'}
                                        uploadParamas={{ access_token: localStorage.getItem('ACCESS_TOKEN') }}
                                        showImportBtn={true}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>

                </div>

                {this.context.addshow && <Addmodal />}
                {this.context.editshow && <Editmodal />}
            </div>
        )
    }
}
