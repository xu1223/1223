import React, { Component } from 'react';
import {
    Row,
} from 'antd';
import BatOperation from '@/components/BatOperation'
import EmployeeRights from '../Component/employeeRights';
import UserGroup from '../Component/userGroup';
import api from 'fetch/api';
import { ListContext } from '@/config/context';


export default class Tool extends Component {
    static defaultProps = {};

    state = {}
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const _batProps = {
            config: [{
                title: '添加',
                noAuth: 'add',
                noCheck: true,
                onClick: () => this.context.toggleWin('visible', { rowData: {} })
            },
                // {
                //     title:'设置权限',
                //     noAuth:'Jurisdiction',
                //     onClick:()=>this.context.toggleWin('visibleg',{settingType:''})
                // },
                // {
                //     title:'工作状态',
                //     children:this.context.toolGroup
                // }
            ],
            method: api.user_manager_batch,
            unicode: 'ids|id',
            batConfig: this.context.batConfig
        }
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <BatOperation {..._batProps} />
                </Row>
                {this.context.visible && <EmployeeRights />}
                {this.context.visibleg && <UserGroup />}
            </div>

        )
    }
}