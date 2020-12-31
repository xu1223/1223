import React, { Component } from 'react';
import api from '@/fetch/api';
import { post } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4, formItemLayout1 } from 'config/localStoreKey';
import {
    Row,
    Col,
    Form,
    Input,
    Radio,
    message,
    Cascader,
    Select,
    Checkbox
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option

class addmember extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    //处理数据
    beforeCallback = (values, callback) => {
        const {
            information
        } = this.context;
        if (!information.id) {  //根据id值修改会员或者新增会员
            post(api.add_customer, values).then(res => {
                if (res) {
                    if (res.resultId == 200) {
                        let param = {
                            ...res.resultData.customer,
                            addresses: res.resultData.address
                        }
                        this.props.changeadder(param)
                        this.context.toggleWin('addvisible');
                    }
                }
            })
        } else {
            this.props.changeadder(values, true)
            this.context.toggleWin('addvisible');
        }

        // callback(values);
    }

    componentDidMount() {
        const { information = {} } = this.context
        if (information.addresses && information.addresses.country_id) {
            post(api.get_zones_list, {
                country_id: information.addresses ? information.addresses.country_id : ''
            }).then(res => {
                if (res) {
                    this.setState({
                        zoneArea: res.resultData
                    })
                }
            })
        }

    }
    //根据选择国家id获取省
    onChange = (value) => {

        post(api.get_zones_list, {
            country_id: value
        }).then(res => {
            if (res) {
                this.setState({
                    zoneArea: res.resultData
                })
            }
        })
    }
    //关闭弹窗
    onCancel = () => {
        this.context.toggleWin('addvisible');
    }

    render() {
        const {
            getFieldDecorator,
        } = this.props.form;
        const {
            zoneArea = []
        } = this.state
        const {
            storagecountry,
            addmembder,
            information
        } = this.context;
        let len = information.id ? true : false

        const span = 24;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: len ? '编辑会员' : '新增会员',
            method: len ? '编辑会员' : api.add_customer,
            visible: this.context.addvisible,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style'>
                        <Row style={{ marginTop: '16px', padding: '20px' }}>
                            <Col span={span}>
                                <Col span={12}>
                                    <FormItem label="名字" {...formItemLayout1} >
                                        {getFieldDecorator(len ? 'firstname' : 'first_name', {
                                            initialValue: information.addresses ? information.addresses.firstname : '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="姓氏" {...formItemLayout1} >
                                        {getFieldDecorator(len ? 'lastname' : 'last_name', {
                                            initialValue: information.addresses ? information.addresses.lastname : '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>
                            <Col span={24}>
                                <FormItem label="电子邮件" {...formItemLayout4} >
                                    {getFieldDecorator(len ? 'contactemail' : 'email', {
                                        initialValue: information ? information.email : '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={span}>
                                <FormItem label="会员是否接受订阅" {...formItemLayout1} >
                                    {getFieldDecorator('newsletter', {
                                        initialValue: information.addresses ? information.addresses.default : '',
                                    })(
                                        <Checkbox  ></Checkbox>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={span}>
                                <Col span={12}>
                                    <FormItem label="电话号码" {...formItemLayout1} >
                                        {getFieldDecorator('mobile', {
                                            initialValue: information.addresses ? information.addresses.mobile : '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input type="number" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="邮编" {...formItemLayout1} >
                                        {getFieldDecorator('postcode', {
                                            initialValue: information.addresses ? information.addresses.postcode : '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>

                            <Col span={span}>
                                <FormItem label="地址" {...formItemLayout4} >
                                    {getFieldDecorator('address_1', {
                                        initialValue: information.addresses ? information.addresses.address_1 : '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={span}>
                                <Col span={12}>
                                    <FormItem label="国家" {...formItemLayout1} >
                                        {getFieldDecorator('country_id', {
                                            initialValue: information.addresses ? information.addresses.country_id : '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Select
                                                showSearch
                                                optionFilterProp='children'
                                                onChange={this.onChange}
                                            >
                                                {
                                                    storagecountry.map(item => <Option name={item.name} value={len ? item.id : item.id}>{item.name}</Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="州" {...formItemLayout1} >
                                        {getFieldDecorator('zone_id', {
                                            initialValue: information.addresses ? information.addresses.zone_id : '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Select
                                                showSearch
                                                optionFilterProp='children'
                                            >
                                                {
                                                    zoneArea.map(item => <Option name={item.name} value={len ? item.id : item.id}>{item.name}</Option>)
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Col>

                            <Col span={span}>
                                <FormItem label="市" {...formItemLayout4} >
                                    {getFieldDecorator('city', {
                                        initialValue: information.addresses ? information.addresses.city : '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>

                        </Row>
                    </div>
                </Form>
            </ModalComp >
        )
    }
}

export default Form.create()(addmember)