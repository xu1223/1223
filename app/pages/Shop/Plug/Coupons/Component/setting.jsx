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
    InputNumber,
    TreeSelect,
    Select
} from 'antd';
const { TextArea } = Input;
const { Search } = Input;
import moment from 'moment'
const Option = Select.Option;
const RadioGroup = Radio.Group;
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

        // //判断商品类型 是全部商品 还是指定商品 还是指定分类，此选项未单选，不能
        // if(values.use_type == 'designated_product'){
        //     let productIdArr = []
        //     // if(!!assignPro.length){

        //     // }else{
        //     //     productIdArr = rowData.product_ids
        //     // }
        //     assignPro.map(item=>{
        //         productIdArr.push(item.id)
        //     })
        //     // 为指定商品时，要把指定分类清空
        //     values.product_ids = productIdArr.join(',');
        //     values.category_ids = '';
        //     //为指定分类时  要把指定商品清空
        // }else if(values.use_type == 'designated_category'){
        //     values.category_ids = values.category_ids.join(',');
        //     values.product_ids = '';
        // }else if(values.use_type == 'all_product'){
        //     values.category_ids = '';
        //     values.product_ids = '';
        // }
        const [date_start, date_end] = values.range_time || [];
        values.date_start = date_start && moment(date_start).format("YYYY-MM-DD HH:mm:ss");
        values.date_end = date_end && moment(date_end).format("YYYY-MM-DD HH:mm:ss");
        delete values.range_time
        values.status = values.status == true ? 1 : 0
        values['generated_quantity'] = 0
        values['first_order_limit'] = 'no_limit'

        values['use_type'] = ''
        values['category_ids'] = ''
        values['product_ids'] = ''
        api.order.save_coupon({ ...values }).then((res) => {
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


    getcategory() {

        api.order.get_tree_category_simple({}).then((res) => {
            this.setState({
                categoryDataTree: res.resultData
            })
        })

    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('Setting');
    }

    useType = (value) => {
        this.setState({
            usetype: value,
        })

    }

    codenumber = (value) => {
        var arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var rand1 = Math.floor((Math.random() * 62));
        var rand2 = Math.floor((Math.random() * 62));
        var rand3 = Math.floor((Math.random() * 62));
        var rand4 = Math.floor((Math.random() * 62));
        var rand5 = Math.floor((Math.random() * 62));
        var rand6 = Math.floor((Math.random() * 62));
        this.props.form.setFieldsValue({
            code: arr[rand1] + arr[rand2] + arr[rand3] + arr[rand4] + arr[rand5] + arr[rand6]
        })
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            usetype = 'all_product',
            categoryDataTree = []
        } = this.state

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
                                <FormItem label="优惠券名称" {...formItemLayout4} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name ? rowData.name : '',
                                        rules: [{ required: true, message: '请输入优惠券名称" ' }],
                                    })(
                                        <Input placeholder="不在前台展示" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="折扣码" {...formItemLayout4} >
                                    {getFieldDecorator('code', {
                                        initialValue: rowData.code ? rowData.code : '',
                                        rules: [{ required: true, message: '请输入折扣码" ' }],
                                    })(
                                        <Search
                                            placeholder="input search text"
                                            enterButton="随机生成"
                                            onSearch={value => this.codenumber(value)}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            {/* <Col span={24}>
                                <FormItem label="发放用户" {...formItemLayout4} >
                                    {getFieldDecorator('host', {
                                        initialValue: rowData.host ? rowData.host : '',
                                        rules: [{ required: true, message: '请输入主机" ' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col> */}
                            <Col span={24}>
                                <FormItem label="使用次数" {...formItemLayout4} >
                                    {getFieldDecorator('available_num_times', {
                                        initialValue: rowData.available_num_times ? rowData.available_num_times : '',
                                    })(
                                        <Input placeholder="输入次数，输入1代表新人卷，留空代表无限次使用" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="使用范围" {...formItemLayout4} >
                                    {getFieldDecorator('encryption', {
                                        initialValue: rowData.encryption ? rowData.encryption : 'all_product',
                                    })(
                                        <Select onChange={(e) => this.useType(e)} placeholder='请选择'>
                                            <Option value="all_product">全部商品</Option>
                                            {/* <Option value="designated_product">指定商品</Option>
                                            <Option value="designated_category">指定分类</Option> */}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                rowData.encryption == 'designated_product' ? "" : rowData.encryption == 'designated_category' ? <Col span={14} style={{ display: _treeSelectDisplay }}>
                                    {getFieldDecorator("category_ids", {
                                        initialValue: JSON.stringify(rowData) != '{}' && rowData.category_ids.length ? rowData.category_ids.map(p => parseInt(p)) : [],
                                        rules: [{ required: false, message: '必填项' }],
                                    })(
                                        <TreeSelect
                                            showSearch
                                            treeData={categoryDataTree}
                                            treeCheckable={true}
                                            style={{ width: '100%', height: '30px' }}
                                            allowClear
                                            multiple
                                            treeDefaultExpandAll
                                            placeholder="请选择分类"
                                        />
                                    )}
                                </Col> : ''
                            }


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
                                <FormItem label="优惠券描述" {...formItemLayout4} >
                                    {getFieldDecorator('describe', {
                                        initialValue: rowData.describe ? rowData.describe : '',
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