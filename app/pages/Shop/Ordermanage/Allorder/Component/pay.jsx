import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import { ModalComp } from '@/components/ModalComp2'
import api from '@/fetch/api'
import {
    Row,
    Col,
    Form,
    Input,
    Select
} from 'antd';
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

class Pay extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }
    // 处理数据
    beforeCallback = (values, callback) => {
        if (this.props.paystate) {
            this.props.payvalues(values)
            this.context.toggleWin('visibleLog')
        } else {
            const { rowData } = this.context;
            values.order_id = rowData.id
            callback(values);
        }

    }

    render() {
        const {
            visibleLog,
            rowData,
            paylist
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: visibleLog,
            onCancel: () => this.context.toggleWin('visibleLog'),
            method: api.manual_payment,
            form: this.props.form,
            ...this.context.batConfig,
        };

        const {
            getFieldDecorator
        } = this.props.form;

        return <ModalComp {...modalProp} >
            <Form style={{ padding: '40px' }}>
                <p>标记付款</p>
                <FormItem label="交易ID " {...formItemLayout4} >
                    {getFieldDecorator('payment_code', {
                        rules: [{ required: true, message: '请输入交易ID' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="交易金额" {...formItemLayout4} >
                    {getFieldDecorator('price', {
                        rules: [{ required: true, message: '请输入交易金额' }],
                    })(
                        <div className='priceitem' >
                            <Input /><span>USD</span>
                        </div>
                    )}
                </FormItem>
                <FormItem label="交易方式" {...formItemLayout4} >
                    {getFieldDecorator('payment_method', {
                        rules: [{ required: true, message: '请选择交易方式' }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp='children'
                        >
                            {
                                paylist.map(item => <Option name={item.label} value={item.value}>{item.label}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label="交易备注" {...formItemLayout4} >
                    {getFieldDecorator('receipt_remarks', {
                    })(
                        <TextArea
                            placeholder='备注'
                            autoSize={{ minRows: 10, maxRows: 11 }}
                        />
                    )}
                </FormItem>
            </Form>
        </ModalComp>
    }
}


export default Form.create()(Pay)