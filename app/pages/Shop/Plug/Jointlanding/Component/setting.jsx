import React, { Component } from 'react';
import api from '@/fetch';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import UploadImg from './uploadImg.jsx'
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
        let param = {}
        param['config'] = {}
        Object.entries(values).map((item) => {
            const [key, value] = item;
            if (key.indexOf("##") != -1) {
                let reg = new RegExp("##", "");
                let a = key.replace(reg, "");
                param['config'][a] = value
            } else {
                param[key] = value
            }
        })
        param['id'] = rowData.id
        console.log(param)
        api.order.edit_myapp({ ...param }).then((res) => {
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

    // 选择图片
    uploadchange = (value) => {

        this.props.form.setFieldsValue({ ...value })
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;


        const {
            rowData = {},
        } = this.context;
        const {
            config = {}
        } = rowData

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '登陆详情',
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
                                <FormItem label="登录方式名称" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '请输入支付方式名称" ' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="接口名称" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '请输入支付方式名称" ' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={24}>
                                <FormItem label="图片上传" {...formItemLayout4} >
                                    {getFieldDecorator('image', {
                                        initialValue: rowData.img_m ? rowData.img_m : '',
                                        rules: [{ required: true, message: '请输入支付方式名称" ' }],
                                    })(
                                        <UploadImg uploadchange={this.uploadchange}></UploadImg>
                                    )}
                                </FormItem>
                            </Col>
                            {

                                Object.entries(config).map((item) => {
                                    const [key, value] = item;
                                    return <Col span={24}>
                                        <FormItem label={key} {...formItemLayout4} >
                                            {getFieldDecorator(`${key}##`, {
                                                initialValue: value || '',
                                                rules: [{ required: true, message: `请输入${key}` }],
                                            })(
                                                <Input></Input>
                                            )}
                                        </FormItem>
                                    </Col>
                                })

                            }




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
                                        initialValue: rowData.status ? rowData.status + '' : '2',

                                    })(
                                        <Radio.Group>
                                            <Radio value="2">启用</Radio>
                                            <Radio value="3">禁用</Radio>
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