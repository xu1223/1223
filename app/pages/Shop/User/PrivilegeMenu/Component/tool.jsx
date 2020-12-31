import React, {
    Component
} from 'react';

import {
    Row,
} from 'antd';
import BatOperation from '@/components/BatOperation'

import AddPermis from './addPermis';
import AddRemarks from './addRemarks';
import { ListContext } from '@/config/context';

export default class Tool extends Component {
    static defaultProps = {

    };
    static contextType = ListContext;  //设置 上下文

    state = {
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {

        const _batProps = {
            config: [{
                title: '添加',
                // noAuth:'add',
                noCheck:true,
                onClick:() => this.context.toggleWin('visible')
            }],

            batConfig: this.context.batConfig
        }
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' gutter={10}>
                    <BatOperation {..._batProps} />
                </Row>
                {this.context.visible &&<AddPermis/>}
                {this.context.visibleg && <AddRemarks />}
            </div>

        )
    }
}