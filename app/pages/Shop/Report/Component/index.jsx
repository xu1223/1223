import React, { Component } from 'react';

import {
    Radio,
    DatePicker,
    Select,
    Button
} from 'antd'
import moment from 'moment'
import './index.less'
const { Option } = Select;
const { RangePicker } = DatePicker;
export default class Search extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {

        }


    }




    componentDidMount = () => {
    }

    onChangeRadio = e => {
        this.setState({
            Radiosize: e.target.value
        });
    };

    handleChange = (e) => {
        console.log(`selected ${value}`);
    }


    render() {

        const {
            Radiosize
        } = this.state

        const contextProps = {
            ...this.state.otherConfig,
        };


        return <div className="report-search">
            <div>
                <Select defaultValue="1" onChange={this.handleChange}>
                    <Option value="1">订单创建时间(北京时间)</Option>
                    <Option value="2">发货时间(北京时间)</Option>
                    <Option value="3">发货完成(北京时间)</Option>
                </Select>
                <Radio.Group onChange={this.onChangeRadio} >
                    <Radio.Button value="1">历史</Radio.Button>
                    <Radio.Button value="2">今日</Radio.Button>
                    <Radio.Button value="3">昨日</Radio.Button>
                    <Radio.Button value="4">本周</Radio.Button>
                    <Radio.Button value="5">本月</Radio.Button>
                    <Radio.Button value="6">本季度</Radio.Button>
                    <Radio.Button value="7">本年度</Radio.Button>
                    <Radio.Button value="8">自定义</Radio.Button>
                </Radio.Group>
                <RangePicker
                    defaultValue={[moment('2020-12-01', 'YYYY-MM-DD'), moment('22020-12-02', 'YYYY-MM-DD')]}
                    format={'YYYY-MM-DD'}
                    disabled={Radiosize != 8}
                />
            </div>
            <Button type="primary" >
                分析
        </Button>
        </div>



    }
}