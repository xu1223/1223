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
    Radio
} from 'antd';
const FormItem = Form.Item;

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
        values['default'] = 0
        api.order.save_currency({ ...values }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('Setting');
            }
        })
        // callback(values);
    }

    componentDidMount() {


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
            title: '编辑货币',
            method: api.save_message_sign,
            visible: this.context.Setting,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{ padding: '20px' }}>
                        <Row style={{ marginTop: '16px' }}>

                            <Col span={24}>
                                <FormItem label="货币名称" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '请输入货币名称" ' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="显示符号" {...formItemLayout4} >
                                    {getFieldDecorator('symbol_left', {
                                        initialValue: rowData.symbol_left ? rowData.symbol_left : '',
                                        rules: [{ required: true, message: '请输入显示符号" ' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="标准符号" {...formItemLayout4} >
                                    {getFieldDecorator('code', {
                                        initialValue: rowData.code ? rowData.code : '',
                                        rules: [{ required: true, message: '请输入标准符号" ' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem  {...formItemLayout4} label="小数点位数" >
                                    {getFieldDecorator('decimal_place', {
                                        initialValue: rowData.decimal_place || '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="汇率" {...formItemLayout4} >
                                    {getFieldDecorator('value', {
                                        initialValue: rowData.value ? rowData.value : '',
                                        rules: [{ required: true, message: '请输入汇率" ' }],
                                    })(
                                        <Input />
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