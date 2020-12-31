import React, { Component } from 'react';
import { Table } from 'antd';
import { getTableConfig } from '@/util/unit';

import '../index.less'

export default class BaseTable extends Component {

    static defaultProps = {
        bordered: false
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const _props  = {
            ...this.props,
            scroll:getTableConfig(this.props.columns,this.props.scrollTopHeight).scrollXY
        }
        return <div id="restTableStyle" >
            <Table {..._props} />
        </div>
    }
}