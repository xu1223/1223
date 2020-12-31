import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
// import LogOperation from '../../../Conponent/Log/logOperation'

import Taglist from './taglist'
import Details from './details'
import Setting from './setting'


import {
    Row,
    Col,
    Button

} from 'antd';
import api from "@/fetch/api"
import { get } from '@/fetch/request'
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            Checkboxdata: []
        }
    }
    componentDidMount = () => {
        this.tablist()
    }
    tablist = () => {
        get(api.get_message_tag_list, {}).then(res => {
            if (res) {
                this.setState({
                    Checkboxdata: res.resultData
                })
            }
        })
    }
    render() {
        const {
            activeKey,

        } = this.context;
        const _batProps = {
            config: [{
                title: '写信',
                onAuth: 'add',
                noCheck: true,
                method: '',
                onClick: () => this.context.jumpPage('Messageproedit', '0', 'add')
            }, {
                title: '设置标签',
                onAuth: 'add',
                onClick: () => this.context.toggleWin('tagshow', {
                    type: 'add'
                })
            }, {
                title: '取消标签',
                onAuth: 'add',
                onClick: () => this.context.toggleWin('tagshow', {
                    type: 'colse'
                })
            }, {
                title: '批量删除',
                onAuth: 'add',
                type:"danger",
                method: activeKey == 'draft' ? api.del_draft_message : api.del_message
            }, {
                title: '批量审核通过',
                onAuth: 'add',
                visible: activeKey == 'sent' ? true : false,
                method: api.save_message_approval,
                childrenData: { 'status': 1 },
            }, {
                title: '批量审核驳回',
                onAuth: 'add',
                visible: activeKey == 'sent' ? true : false,
                method: api.save_message_approval,
                childrenData: { 'status': 2 },
            },],
            unicode: activeKey == 'draft' ? 'draft_ids|id' : 'message_ids|id',
            batConfig: this.context.batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                    <Col>
                        <Button type="primary" onClick={()=>this.context.toggleWin('Setting')}>
                            邮箱设置
                    </Button>
                    </Col>
                </Row>

                {this.context.tagshow && <Taglist changeSearch={this.props.changeSearch} tablist={this.tablist} Checkboxdata={this.state.Checkboxdata} />}
                {this.context.details && <Details></Details>}
                {this.context.Setting && <Setting></Setting>}
            </div>

        )
    }
}