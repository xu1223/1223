import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import Setting from './setting'
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
            config: [{
                title: '添加',
                onAuth: 'add',
                noCheck: true,
                method: '',
                onClick: () => this.context.toggleWin(activeKey == 'list' ? 'Addlist' : 'Setting')
            },
            {
                title: '更新汇率',
                onAuth: 'add',
                noCheck: true,
                method: '',
                onClick: () => this.context.toggleWin(activeKey == 'list' ? 'Addlist' : 'Setting')
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

                {this.context.Setting && <Setting changeSearch={this.props.changeSearch}></Setting>}
            </div>

        )
    }
}