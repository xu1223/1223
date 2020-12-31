import React, { Component } from 'react';
import api from '@/fetch';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';

import {
    Row,
    Col,
    Form,
    Input,
    Radio,
    DatePicker,
    InputNumber
} from 'antd';
import moment from 'moment'
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class add extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    //提交数据
    beforeCallback = (values, callback) => {
        const { rowData = {} } = this.context
        if (rowData.id) {
            values.id = rowData.id
        }
        values.id = rowData.id || '';
        //判断当前选择的买满多少直多少金额
        if (values.rule1 == "rule1prise") {
            values.purchase_number_min = 0
            values.purchase_number_max = 0
        } else {
            values.purchase_amount_max = 0
            values.purchase_amount_min = 0
            values.purchase_number_min = values.purchase_number_min == 0 ? 1 : values.purchase_number_min
            values.purchase_number_max = values.purchase_number_max == 0 ? 1 : values.purchase_number_max
        }
        if (values.rule2 == "rule2discount") {
            values.preferential = 0
        } else {
            values.discount = 0
            values.preferential = values.preferential == 0 ? 1 : values.preferential
        }

       
        const [date_start, date_end] = values.range_time || [];
        values.date_start = date_start && moment(date_start).format("YYYY-MM-DD HH:mm:ss");
        values.date_end = date_end && moment(date_end).format("YYYY-MM-DD HH:mm:ss");
        delete values.range_time
        values.status = values.status == true ? 1 : 0
   
        api.order.save_full_mall_activity({ ...values }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('Setting');
            }
        })
        // callback(values);
    }

    componentDidMount() {
        const { rowData = {} } = this.context

    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('Setting');
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;


        const {
            rowData = {},
        } = this.context;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '优惠卷',
            method: api.save_message_sign,
            visible: this.context.Setting,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };
        const inputStyle = {
            width: '70px',
            marginLeft: '5px',
            marginRight: '5px',
        }
        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{ padding: '20px' }}>
                        <Row style={{ marginTop: '16px' }}>

                            <Col span={24}>
                                <FormItem label="活动名称" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '请输入活动名称" ' }],
                                    })(
                                        <Input placeholder="不在前台展示" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24} style={{ marginTop: 10 }}>
                                <FormItem label="满减条件"
                                    {...formItemLayout4}>
                                    <Col span={24}>
                                        {getFieldDecorator("rule1", {
                                            initialValue: JSON.stringify(rowData) != '{}' && parseFloat(rowData.purchase_amount_max) > 0 ? 'rule1prise' : 'rule1Num',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <RadioGroup>
                                                <Radio value="rule1prise">
                                                    <span>买满</span>
                                                    {getFieldDecorator("purchase_amount_min", {
                                                        initialValue: JSON.stringify(rowData) != '{}' ? parseFloat(rowData.purchase_amount_min).toFixed(2) : '',
                                                        rules: [{ required: false, message: '必填项' }],
                                                    })(
                                                        <Input placeholder='>' style={inputStyle} />
                                                    )}
                                                    <span> - </span>
                                                    {getFieldDecorator("purchase_amount_max", {
                                                        initialValue: JSON.stringify(rowData) != '{}' ? parseFloat(rowData.purchase_amount_max).toFixed(2) : '',
                                                        rules: [{ required: false, message: '必填项' }],
                                                    })(
                                                        <Input placeholder='≤' style={inputStyle} onChange={this.numberMax} />
                                                    )}
                                                    <span>金额（USD）</span>
                                                </Radio>
                                                <Radio value="rule1Num">
                                                    <span>买满</span>
                                                    {getFieldDecorator("purchase_number_min", {
                                                        initialValue: JSON.stringify(rowData) != '{}' ? parseFloat(rowData.purchase_number_min).toFixed(0) : 1,
                                                        rules: [{ required: false, message: '必填项' }],
                                                    })(
                                                        <InputNumber min={1} placeholder='>' style={inputStyle} />
                                                    )}
                                                    <span> - </span>
                                                    {getFieldDecorator("purchase_number_max", {
                                                        initialValue: JSON.stringify(rowData) != '{}' ? parseFloat(rowData.purchase_number_max).toFixed(0) : 1,
                                                        rules: [{ required: false, message: '必填项' }],
                                                    })(
                                                        <InputNumber min={1} placeholder='≤' style={inputStyle} />
                                                    )}
                                                    <span>件数</span>
                                                </Radio>
                                            </RadioGroup>
                                        )}
                                    </Col>
                               
                                </FormItem>
                                <FormItem label="满减金额"
                                    {...formItemLayout4}>
                                    <Col span={24}>
                                        {getFieldDecorator("rule2", {
                                            initialValue: JSON.stringify(rowData) != '{}' && parseFloat(rowData.preferential) > 0 ? 'rule2price' : 'rule2discount',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <RadioGroup>
                                                <Radio value="rule2price">
                                                    <span>满减</span>
                                                    {getFieldDecorator("preferential", {
                                                        initialValue: rowData.preferential || 1,
                                                        rules: [{ required: false, message: '必填项' }],
                                                    })(
                                                        <InputNumber min='1' max={99} placeholder='>' style={inputStyle} />
                                                    )}
                                                    <span>金额（USD）</span>
                                                </Radio>
                                                <Radio value="rule2discount">
                                                    <span>折扣</span>
                                                    {getFieldDecorator("discount", {
                                                        initialValue: rowData.discount || '',
                                                        rules: [{ required: false, message: '必填项' }],
                                                    })(
                                                        <InputNumber min='1' max={100} placeholder='>' style={inputStyle} />
                                                    )}
                                                    <span>%</span>
                                                </Radio>
                                            </RadioGroup>
                                        )}
                                        <span>例如:(折扣20%代表减去原金额20%)</span>
                                    </Col>
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="有效时间"
                                    {...formItemLayout4}>
                                    {getFieldDecorator("range_time", {
                                        initialValue: JSON.stringify(rowData) != '{}' ? [moment(rowData.date_start, 'YYYY-MM-DD HH:mm'), moment(rowData.date_end, 'YYYY-MM-DD HH:mm')] : null,
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <RangePicker
                                            showTime={{ format: 'HH:mm' }}
                                            format="YYYY-MM-DD HH:mm"
                                            placeholder={['开始时间', '结束时间']}
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="活动描述" {...formItemLayout4} >
                                    {getFieldDecorator('activity_describe', {
                                        initialValue: rowData.activity_describe ? rowData.activity_describe : '',
                                    })(
                                        <TextArea />
                                    )}
                                </FormItem>
                            </Col>


                            <Col span={24}>
                                <FormItem label="排序" {...formItemLayout4} >
                                    {getFieldDecorator('sort_order', {
                                        initialValue: rowData.sort_order ? rowData.sort_order : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="状态" {...formItemLayout4} >
                                    {getFieldDecorator('status', {
                                        initialValue: rowData.status ? rowData.status + '' : '1',

                                    })(
                                        <Radio.Group>
                                            <Radio value="1">启用</Radio>
                                            <Radio value="0">禁用</Radio>
                                        </Radio.Group>,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </ModalComp>
        )
    }
}

export default Form.create()(add)