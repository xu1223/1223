import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import BaseReport from "@/components/BaseReport";
import '../index.less'
import icon_error from '@/static/img/icon_error.png';
import {
    Icon,
    Select,
    Spin
} from 'antd'
const { Option } = Select;

export default class PositionManage extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {


        }




    }




    componentDidMount = () => {
    }






    render() {
        const {
            loading = false
        } = this.state;
        const {
            id
        } = this.props
        return <Spin spinning={loading}><div className="operation-echart">
            <div className="operation-echart-header">
                <p className="title">网站周期销售走势</p>
                <div className="ri">
                    <Icon type="redo" />
                    <Select defaultValue="1" onChange={this.handleChange}>
                        <Option value="1">近一周</Option>
                        <Option value="2">近一月</Option>
                        <Option value="3">近一季度</Option>
                        <Option value="3">近一年</Option>
                    </Select>
                </div>
            </div>
            {/* <BaseReport id={id} ref={ref => this.echartref2 = ref} type='bar' Eheight="400px" Ewidth="100%"></BaseReport> */}


            <div className='echart-error-box'>
                <img src={icon_error} alt="" />
                <p>暂无数据</p>
            </div>
        </div>
        </Spin>



    }
}