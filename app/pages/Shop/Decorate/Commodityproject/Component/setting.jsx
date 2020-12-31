import React, { Component } from 'react';
import api from '@/fetch';
import { post } from '@/fetch/request'
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
const { TextArea } = Input;
class add extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    //提交数据
    beforeCallback = (values, callback) => {
        const { rowData = {} ,activeKey } = this.context
        let apiKey = 'save_product_template_theme'
        if (rowData.id) {
            values.id = rowData.id
            apiKey = 'edit_product_template_theme'
        }
        values['is_mobile'] = activeKey

        api.order[apiKey]({ ...values }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('Setting');
            }
        })
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
            activeKey
        } = this.context;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '商品专题信息',
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
                                <FormItem label="商品专题名" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '商品专题名' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="中文别名" {...formItemLayout4} >
                                    {getFieldDecorator('name_cn', {
                                        initialValue: rowData.name_cn ? rowData.name_cn : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="自定义链接" {...formItemLayout4} >
                                    {getFieldDecorator('url', {
                                        initialValue: rowData.url ? rowData.url : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="SEO标题" {...formItemLayout4} >
                                    {getFieldDecorator('meta_title', {
                                        initialValue: rowData.meta_title ? rowData.meta_title : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="SEO关键字" {...formItemLayout4} >
                                    {getFieldDecorator('meta_keyword', {
                                        initialValue: rowData.meta_keyword ? rowData.meta_keyword : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="SEO描述" {...formItemLayout4} >
                                    {getFieldDecorator('meta_description', {
                                        initialValue: rowData.meta_description ? rowData.meta_description : '',
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
                                    {getFieldDecorator('is_active', {
                                        initialValue: rowData.is_active ? rowData.is_active+'' : '0',

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