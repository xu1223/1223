import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';

import List from './list'
import Addlist from './addlist'
import {
    Row,
    Col,


} from 'antd';

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
    }
    tablist = () => {

    }
    render() {
        const {
            activeKey,
        } = this.context;
        const _batProps = {
            config: [
                {
                    title: '新增任务',
                    onAuth: 'add',
                    noCheck: true,
                    method: '',
                    visible:activeKey == 'list',
                    onClick: () => this.context.toggleWin('list')
                },
                {
                    title: '批量删除',
                    onAuth: 'add',
                    noCheck: true,
                    method: '',
                    visible:activeKey == 'list',
                    onClick: () => this.context.toggleWin('Setting')
                },

                {
                    title: '新增模板',
                    onAuth: 'add',
                    noCheck: true,
                    method: '',
                    visible:activeKey == 'template',
                    onClick: () => this.context.toggleWin('template')
                },



                {
                    title: '新增分组',
                    onAuth: 'add',
                    noCheck: true,
                    method: '',
                    visible:activeKey == 'grouping',
                    onClick: () => this.context.toggleWin('grouping')
                },

                {
                    title: '批量删除',
                    onAuth: 'add',
                    noCheck: true,
                    method: '',
                    visible:activeKey == 'grouping',
                    onClick: () => this.context.toggleWin('Setting')
                },

                
            ],
            unicode: '',
            batConfig: this.context.batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                </Row>

                {this.context.list && <List changeSearch={this.props.changeSearch}></List>}
                {this.context.Addlist && <Addlist changeSearch={this.props.changeSearch}></Addlist>}
            </div>

        )
    }
}