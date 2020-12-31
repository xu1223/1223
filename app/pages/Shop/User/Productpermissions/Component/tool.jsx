import React, { Component } from 'react';
import {
    Row,
} from 'antd';
import BatOperation from '@/components/BatOperation'
import EmployeeRights from '../Component/employeeRights';
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
            ],
            unicode: 'ids|id',
            batConfig: {
                blistSelData: '',
                selectedRows: '',
                changeSearch: '',
            },
        }
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <BatOperation {..._batProps} />
                </Row>
                {this.context.visible && <EmployeeRights />}
            </div>

        )
    }
}