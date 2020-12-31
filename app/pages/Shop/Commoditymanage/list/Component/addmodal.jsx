import React, { Component } from 'react';

import {
    Form,
    Row,
    Col,
    Icon,
    Input,
    DatePicker,
    Select,
    message
} from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
import { formItemLayout6 } from 'config/localStoreKey'
import api from 'fetch/api'
import { post } from 'fetch/request'
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2';
import '../index'
const { TextArea } = Input;
import moment from 'moment'
class Addmodal extends Component {
    static defaultProps = {

    };

    state = {
        categoryStr: [],
        DatePickershow: false,
        time: '',
        value: ''
    }
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    beforeCallback = (values, callback) => {
        const {
            type,
            batConfig,
            rowData,
        } = this.context;
        const {
            value,
            size_publish = ''
        } = this.state
        let ids = ''
        let _values = {}
        let len = false;
        if (rowData == 'moreedit') {   //判断是否为批量操作
            if (type == 'moredow' || type == 'moreadd') {
                len = true
            } else {
                len = false
            }
        }

        if (type == 'add' || type == 'dow') {  //判断是否上下架
            if (rowData.length > 0) {
                batConfig.selectedRows.map(item => {
                    ids += item.id + ','
                })

            } else {
                ids = rowData.id
            }

        } else {
            ids = rowData.id
        }
        _values = {
            product_id: ids,
            type: (type == 'add' || type == 'moreadd') ? 'publish' : 'unpublish',
        }
        if (len) {  //为批量操作时要判断是否输入sku
            if (!value) {
                message.error('请输入子sku')
                return false
            }
            ids = value
            _values = {
                zskus: ids,
                type: (type == 'add' || type == 'moreadd') ? 'publish' : 'unpublish',
            }
        }

        if (size_publish) {
            _values['option_value_names'] = size_publish.toString()

            _values['product_ids'] = _values['product_id']
            delete _values['product_id']
            console.log(size_publish, _values, 4444)


            post(api.batch_product_size_publish, { ..._values }).then(res => {
                if(res){
                    message.success('修改成功')
                    this.context.toggleWin('addshow', {});
                    this.context.changeSearch()
                }
            })
            return
        }
        callback(_values)
    }


    onChange = (value) => {   //获取上架时间
        this.setState({
            time: moment(value).format('YYYY-MM-DD hh:mm:ss')
        })
    }
    iconchange = () => {    //是否展示上架时间
        let DatePickershow = this.state.DatePickershow
        this.setState({
            DatePickershow: !DatePickershow
        })
    }
    onCancel = () => {  //关闭弹窗
        this.props.form.resetFields();
        this.context.toggleWin('addshow', {});
    }
    onChangeTextArea = ({ target: { value } }) => {  //获取批量上下架值
        this.setState({ value });
    };

    handleChange = (value) => {
        this.setState({
            size_publish: value
        })
    }

    render() {

        const {
            DatePickershow,
            value
        } = this.state;
        const {
            type,
            rowData,
            batConfig,

        } = this.context;
        let sizechange = []
        let sizedata = []
        let len = true
        if (rowData == 'moreedit') {   //判断是否为批量操作
            if (type == 'moredow' || type == 'moreadd') {
                len = true
            } else {
                len = false
            }
        } else {
            if (rowData.product_option_values.length != 0) {  //编辑时判断size的值，
                sizedata = rowData.product_option_values ? rowData.product_option_values.Size : []
            }
            if (rowData) {
                sizechange = rowData.size ? rowData.size.split(',') : []
            }
            len = false
        }




        // const len = Object.keys(rowData).length == 0;
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: this.context.addshow,
            winType: 1,
            method: len ? api.batch_product_zsku_publish : api.product_publish,
            onCancel: this.onCancel,
            ...this.context.batConfig,
        }
        let addtext = len ? '是否确定批量上架商品' : '是否确定上架商品'
        let closetext = len ? '是否确定批量下架商品' : '是否确定下架商品'
        return (
            <ModalComp
                {...modalProp}
            >
                <div className="win-model-content" style={{ height: '150px' }}>
                    <Form className="resetFormStyle">
                        <Row>

                            {
                                type == 'moreadd' || type == 'moredow' ?
                                    len ? <div>
                                        <p>{
                                            type == 'moreadd' ? '指定商品上架：' : '指定商品下架：'}</p>
                                        <TextArea
                                            value={value}
                                            onChange={this.onChangeTextArea}
                                            placeholder={type == 'moreadd' ? '可输入多个子sku可同时上架' : '可输入多个子sku可同时下架' + '逗号隔开'}
                                            autoSize={{ minRows: 3, maxRows: 5 }}
                                        />

                                    </div>
                                        :
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ marginRight: '10px', marginBottom: '0' }}>商品尺码</p>
                                            <Select
                                                mode="multiple"
                                                style={{ width: '100%', flex: '1' }}
                                                onChange={this.handleChange}
                                            >
                                                {
                                                    sizedata.map(item => {
                                                        return <Option key={item.id} value={item.option_value_name}>{item.option_value_name}</Option>
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    :
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <p style={{ textAlign: 'center', fontSize: "16px" }}>
                                                {
                                                    type == 'add' ? addtext : closetext
                                                }
                                            </p>
                                            {
                                                type == 'add' ? <a className="icondown" onClick={() => this.iconchange()} style={{ marginLeft: '15px' }}>
                                                    定时上架 <Icon style={{ transform: DatePickershow ? '' : 'rotate(-180deg)' }} type="down" />
                                                </a> : ''
                                            }
                                        </div>
                                        {
                                            type == 'add' ? <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                                {
                                                    DatePickershow ? <DatePicker showTime format={'YYYY-MM-DD hh:mm:ss'} onChange={this.onChange} /> : ''
                                                }
                                            </Col>
                                                : ''
                                        }
                                    </div>



                            }

                        </Row>
                    </Form>
                </div>
            </ModalComp >
        )
    }
}
export default Form.create()(Addmodal)