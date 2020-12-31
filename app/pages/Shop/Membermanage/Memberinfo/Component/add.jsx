import React, { Component } from 'react';
import api from '@/fetch/api';
import { post } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout1, formItemLayout4, formItemLayout2 } from 'config/localStoreKey';
import RemoteSelect from '@/components/RenderForm/remoteSelect'
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

    //处理数据提交
    beforeCallback = (values, callback) => {
        const { rowData = {} } = this.context
        if (rowData.id) {
            values.id = rowData.id
        }
        callback(values);
    }

    componentDidMount() {
        // this.zone_Store()
    }
    handleChange = (value) => {
        post(api.get_zones_pager, {
            page_size: 9999,
            country_id:value
        }).then(res => {
            if (res) {
                this.setState({
                    zoneArea: res.resultData.data
                })
            }
        })
    }
    //获取地区列表
    zone_Store = () => {


    }
    //关闭弹窗
    onCancel = () => {
        this.context.toggleWin('visible');
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            storagecountry = []
        } = this.props
        const {
            zoneArea = []
        } = this.state
        const {
            rowData = {},

        } = this.context;


        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '新增会员',
            method: api.add_customer,
            visible: this.context.visible,
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
                                <Col span={12}>
                                    <FormItem label="名字" {...formItemLayout1} >
                                        {getFieldDecorator('first_name', {
                                            initialValue: rowData.first_name || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="姓氏" {...formItemLayout1} >
                                        {getFieldDecorator('last_name', {
                                            initialValue: rowData.last_name || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>
                            <Col span={24}>
                                <FormItem label="电子邮件" {...formItemLayout4} >
                                    {getFieldDecorator('email', {
                                        initialValue: rowData.email ? rowData.storage_area_id : '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="会员是否接受订阅" {...formItemLayout1} >
                                    {getFieldDecorator('newsletter', {
                                        initialValue: rowData.newsletter || '',
                                    })(
                                        <Checkbox ></Checkbox>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={24}>
                                <Col span={12}>
                                    <FormItem label="电话号码" {...formItemLayout1} >
                                        {getFieldDecorator('mobile', {
                                            initialValue: rowData.mobile || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="邮编" {...formItemLayout1} >
                                        {getFieldDecorator('postcode', {
                                            initialValue: rowData.postcode || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>

                            <Col span={24}>
                                <FormItem label="地址" {...formItemLayout4} >
                                    {getFieldDecorator('address_1', {
                                        initialValue: rowData.address_1 || '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <Col span={12}>
                                    <FormItem label="国家" {...formItemLayout1} >
                                        {getFieldDecorator('country_id', {
                                            initialValue: rowData.country_id || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Select
                                                showSearch
                                                optionFilterProp='children'
                                                onChange={(e) => this.handleChange(e)}
                                            >
                                                {
                                                    storagecountry.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="州" {...formItemLayout1} >
                                        {getFieldDecorator('zone_id', {
                                            initialValue: rowData.zone_id || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Select
                                                showSearch
                                                optionFilterProp='children'
                                            >
                                                {
                                                    zoneArea.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>

                            <Col span={24}>
                                <FormItem label="市" {...formItemLayout4} >
                                    {getFieldDecorator('city', {
                                        initialValue: rowData.city || '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
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