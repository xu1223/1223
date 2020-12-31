import React, { Component } from 'react';
import { Table } from 'antd';
import { getTableConfig } from '@/util/unit';
import '../index.less'
export default class BaseTable extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { flagIsList = false, ...pprops } = this.props
        const _props = {
            ...pprops,
            tableLayout: 'fixed',
            scroll: getTableConfig(this.props.columns, this.props.scrollTopHeight).scrollXY
        }
        return <div id="restTableStyle" style={flagIsList ? {height:_props.scroll.y + 74} : {}} ><Table {..._props} /></div>
    }
}