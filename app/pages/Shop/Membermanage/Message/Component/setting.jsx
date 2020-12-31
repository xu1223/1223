import React, { Component } from 'react';
import api from '@/fetch/api';
import { post } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import Ueditor from 'components/Ueditor/index_pub';

import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Checkbox
} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option

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
        callback(values);
    }

    componentDidMount() {
        const { rowData = {} } = this.context
        post(api.get_message_sign, {
        }).then(res => {
            if (res) {
           
            }
        })
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
        } = this.state
        const {


        } = this.context;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '邮箱设置',
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
                                <FormItem label="主机驱动" {...formItemLayout4} >
                                    {getFieldDecorator('email', {
                                        initialValue: rowData.email ? rowData.storage_area_id : '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <span></span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="主机" {...formItemLayout4} >
                                    {getFieldDecorator('host', {
                                        initialValue: rowData.host ? rowData.host : '',
                                        rules: [{ required: true, message: '请输入主机' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="端口" {...formItemLayout4} >
                                    {getFieldDecorator('port', {
                                        initialValue: rowData.port ? rowData.port : '',
                                        rules: [{ required: true, message: '请输入端口' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="邮箱账号" {...formItemLayout4} >
                                    {getFieldDecorator('username', {
                                        initialValue: rowData.username ? rowData.username : '',
                                        rules: [{ required: true, message: '请输入邮箱账号' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="邮箱密码" {...formItemLayout4} >
                                    {getFieldDecorator('password', {
                                        initialValue: rowData.password ? rowData.password : '',
                                        rules: [{ required: true, message: '请输入邮箱密码' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="加密类型" {...formItemLayout4} >
                                    {getFieldDecorator('encryption', {
                                        initialValue: rowData.encryption ? rowData.encryption : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="签名设置" {...formItemLayout4} >
                                    {getFieldDecorator('sign_content', {
                                        initialValue: rowData.sign_content ? rowData.sign_content : '',
                                    })(
                                        <Ueditor initialFrameHeight={300} id='wapcontainer1' richText={rowData.sign_content ? rowData.sign_content : ''} />
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