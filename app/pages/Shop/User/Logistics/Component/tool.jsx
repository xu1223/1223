import React, { Component } from 'react';
import {
    Row,
} from 'antd';
import BatOperation from '@/components/BatOperation'
import EmployeeRights from '../Component/employeeRights';
import Statechange from '../Component/statechange';
import api from '@/fetch/api';
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
            {
                title: '批量删除',
                noAuth: 'add',
                method: api.geo_zone_del,
                type:"danger",
            },
            ],
            unicode: 'geo_zone_id|id',
            batConfig: this.context.batConfig
        }
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <BatOperation {..._batProps} />
                </Row>
                {this.context.visible && <EmployeeRights />}

                {this.context.statevisible && <Statechange />}
                
            </div>

        )
    }
}