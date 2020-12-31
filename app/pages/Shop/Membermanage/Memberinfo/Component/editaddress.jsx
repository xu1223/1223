import React, { Component } from 'react';
import api from '@/fetch/api';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import Default from '../../../../../../public/img/default.png'
import { formItemLayout1, formItemLayout4 } from 'config/localStoreKey';
import { post, get } from 'fetch/request'
import {
    Form,
    Icon,
    Input,
    Select,
    Row,
    Col,
    Checkbox,
    Pagination
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option
class editaddress extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            show: false,
            rowData: {},
            zoneArea: [],
            storagecountry: [],
            address_id: ''
        }
    }

    // 处理数据编辑地址
    beforeCallback = (values, callback) => {
        values['default'] = values['default'] == true ? 1 : 0
        values['address_id'] = this.state.address_id
        values['customer_id'] = this.context.customer_id
        post(api.save_customer_address, values).then(res => {
            if (res.resultId == 200) {
                let page = this.state.page || 1
                this.get_customer_address_pager(page)
                get(api.get_customer, { customer_id: this.context.id }).then(res => {
                    if (res) {
                        this.context.initData = initData  //回显地址值
                        this.props.edittype()         //回调父级数据。重新请求数据渲染
                    }
                })
                this.context.toggleWin('addershow');
            }
        })
    }
    // 分页x
    onChange = (val) => {
        this.setState({
            page: val
        })
        this.get_customer_address_pager(val)
    }
    componentDidMount() {
        this.get_customer_address_pager(1)
    }
    // 请求数据 page为分页数
    get_customer_address_pager = (page) => {
        post(api.get_customer_address_pager, {
            customer_id: this.context.id,
            page_size: 10,
            page: page
        }).then(res => {
            if (res) {
                this.setState({
                    address_pager: res.resultData ? res.resultData : []
                })
            }
        })
    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('addershow');
    }
    // 关闭弹窗
    onCanceladd = () => {
        this.setState({
            show: false
        })
    }
    // 删除地址
    colose = (item) => {
        const {
            id
        } = this.context
        post(api.del_customer_address, {
            customer_id: id,
            address_id: item.id,
        }).then(res => {
            if (res.resultId == 200) {
                let page = this.state.page || 1
                this.get_customer_address_pager(page)
                this.props.edittype(res.resultData)
            }
        })
    }
    // 打开添加地址弹窗
    addarr = (item, type) => {
        if (type == 'add') {
            this.setState({
                rowData: {},
                address_id: ''
            })
        } else {
            this.setState({
                rowData: item,
                address_id: item.id
            })
        }
        this.setState({
            show: true
        })
    }


    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            initData = {},
            zoneArea,
            storagecountry
        } = this.context;
        const {
            show,
            rowData,
            address_pager
        } = this.state
        const span = 24;

        const modalProp = {
            title: false,
            footer: false,
            // method: api.add_customer,
            visible: this.context.addershow,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };
        const modalPropadd = {
            beforeCallback: this.beforeCallback,
            title: false,
            method: api.save_customer_address,
            visible: this.context.addershow,
            onCancel: this.onCanceladd,
            form: this.props.form,
            ...this.context.batConfig,
        };
        return (
            <div>
                <ModalComp {...modalProp}>
                    <div style={{ padding: '40px' }}>
                        <div className='editaddress' >
                            <a className='add' onClick={() => this.addarr('', 'add')}>
                                <Icon style={{ fontSize: '35px' }} type="plus" />
                            </a>
                            <div className="con">
                                {
                                    address_pager ? address_pager.data.map(item => {
                                        return <div className={item.default == 1 ? 'item  ative' : 'item'} >
                                            <Icon className='icon' type="check-circle" />
                                            <img src={Default}></img>
                                            <div className="top">
                                                <p> {item.lastname} {item.firstname}</p>
                                                <p>{item.mobile}</p>
                                                <p>{item.postcode}</p>
                                                <p>
                                                    <a onClick={() => this.addarr(item, 'edit')} >修改地址</a>
                                                    <a onClick={() => this.colose(item)}  >删除</a>
                                                </p>
                                            </div>
                                            <div className="bottom">
                                                {
                                                    item.address_1 ? <span>{item.address_1}</span> : <span>{item.address_2}</span>
                                                }
                                            </div>
                                        </div>

                                    })
                                        : ''
                                }
                            </div>
                        </div>
                        <Pagination showQuickJumper pageSize={10} defaultCurrent={1} total={address_pager ? address_pager.total : 1} onChange={this.onChange} />
                    </div>

                </ModalComp>
                {
                    show ? <ModalComp {...modalPropadd}>
                        <Form className="bulletbox-form">
                            <div className='collapse-style' style={{ padding: "20px" }}>
                                <Row style={{ marginTop: '16px' }}>
                                    <Col span={span}>
                                        <Col span={12}>
                                            <FormItem label="名字" {...formItemLayout1} >
                                                {getFieldDecorator('firstname', {
                                                    initialValue: rowData.firstname || '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="姓氏" {...formItemLayout1} >
                                                {getFieldDecorator('lastname', {
                                                    initialValue: rowData.lastname || '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Col>
                                    <Col span={span}>
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

                                    <Col span={span}>
                                        <FormItem label="地址" {...formItemLayout4} >
                                            {getFieldDecorator('address_1', {
                                                initialValue: rowData.address_1 || '',
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
                                                    initialValue: rowData.country_id || '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Select
                                                        showSearch
                                                        optionFilterProp='children'
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

                                    <Col span={span}>
                                        <FormItem label="市" {...formItemLayout4} >
                                            {getFieldDecorator('city', {
                                                initialValue: rowData.city || '',
                                                rules: [{ required: true, message: '必填项' }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={span}>
                                        <FormItem label="是否默认" {...formItemLayout4} >
                                            {getFieldDecorator('default', {
                                                initialValue: rowData.default || '',
                                            })(
                                                <Checkbox defaultChecked={rowData.default == 1 ? true : false}></Checkbox>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Form>

                    </ModalComp>
                        : ''
                }

            </div>
        )
    }
}

export default Form.create()(editaddress)