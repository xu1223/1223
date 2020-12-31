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
    Radio,
    Icon,
    Tooltip
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
                if (key == 'fixed_costs##' && value != 0 && value) {
                    param['config']['cost'] = 0
                }else if(key == 'cost##'  && value != 0 && value){
                    param['config']['fixed_costs'] = 0
                }
                let reg = new RegExp("##", "");
                let a = key.replace(reg, "");
                param['config'][a] = value
            } else {
                param[key] = value
            }
        })
        param['config'] = JSON.stringify(param['config'])
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

    onChange = e => {
        this.setState({
            costvalue: e.target.value,
        });
    };

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            costvalue = ''
        } = this.state

        const {
            rowData = {},
        } = this.context;
        const {
            config = {}
        } = rowData

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '支付详情',
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
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={20}>
                                <FormItem label="支付方式名称" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '请输入支付方式名称" ' }],
                                    })(
                                        <Input disabled />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="图片上传" {...formItemLayout4} >
                                    {getFieldDecorator('image', {
                                        initialValue: rowData.image ? rowData.image : '',
                                        rules: [{ required: true, message: '请输入图片上传" ' }],
                                    })(
                                        <UploadImg uploadchange={this.uploadchange}></UploadImg>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="手续费设置" {...formItemLayout4} >

                                    <Radio.Group onChange={this.onChange} defaultValue={config.fixed_costs ? '1' : '2'}>
                                        <Radio value="1">按固定费用</Radio>
                                        <Radio value="2" >按百分比</Radio>
                                    </Radio.Group>
                                    {
                                        (costvalue ? (costvalue == 1 ? true : false) : (config.fixed_costs != 0 ? true : false)) ?
                                            <FormItem label="" {...formItemLayout4} >
                                                {getFieldDecorator(`fixed_costs##`, {
                                                    initialValue: config.fixed_costs || '',
                                                })(
                                                    <Input type="number" ></Input>
                                                )}
                                            </FormItem>
                                            :
                                            <FormItem label="" {...formItemLayout4} >
                                                {getFieldDecorator(`cost##`, {
                                                    initialValue: config.cost || '',
                                                })(
                                                    <Input type="number" style={{ marginRight: '10px' }}></Input>
                                                )}<Tooltip title="注意请不要输入超过1的数值">
                                                    <Icon style={{ color: '#4486F7' }} type="question-circle" />
                                                </Tooltip>
                                            </FormItem>
                                    }
                                </FormItem>
                            </Col>

                            {

                                Object.entries(config).map((item) => {
                                    const [key, value] = item;
                                    if (key == 'cost' || key == 'fixed_costs') {

                                    } else {
                                        return <Col span={20}>
                                            <FormItem label={key} {...formItemLayout4} >
                                                {getFieldDecorator(`${key}##`, {
                                                    initialValue: value || '',
                                                    rules: [{ required: true, message: `请输入${key}` }],
                                                })(
                                                    <Input></Input>
                                                )}
                                            </FormItem>
                                        </Col>
                                    }

                                })

                            }




                            <Col span={20}>
                                <FormItem label="排序" {...formItemLayout4} >
                                    {getFieldDecorator('sort_order', {
                                        initialValue: rowData.sort_order ? rowData.sort_order : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
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