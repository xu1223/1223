import React, { Component } from 'react';
import moment from 'moment';
import {
    Form,
    Row,
    Input,
    Select,
    Col,
    Checkbox,
    Switch,
    Icon,
    Radio,
    DatePicker,
    Button,
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
import {
    formItemLayout2,
} from 'config/localStoreKey';
import Method_a from './method_a'
import Method_b from './method_b'
import { DrawerComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context'; //引入上下文
import api from 'fetch/api';



class employeeRights extends Component {
    static defaultProps = {

    };
    static contextType = ListContext; //导入上下文 this.context
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        rolesDataArr: this.context.rolesDataArr || []
    }

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        const {
            rowData = {},
        } = this.context
        const len = Object.keys(rowData).length == 0;
        if (!len) {
            if(rowData.memo){
                rowData.memo = JSON.parse(rowData.memo)
            }
            this.setState({
                checkedList: rowData.country_ids.map(item => item + ""),
                method: rowData.memo &&  rowData.memo.method_id ? rowData.memo.method_id : "method_a"
            })
        }


    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {

        const {
            rowData = {},
        } = this.context
        const len = Object.keys(rowData).length == 0;
        const {
            // method,
            checkedList
        } = this.state;
        const destObj = {}
        const {
            zone_weight1,
            zone_weight2,
            zone_weight3,
            zone_weight4,
            ..._values
        } = values;
        const method = values.memo
        if (method != "method_a") {
            Object.entries(this.refs.method_b.arr_wp).map((item, index) => {
                const [key, value] = item;
                const _mode = index % 4;
                switch (_mode) {
                    case 0:
                        value.weight_price = zone_weight1.shift();
                        break;
                    case 1:
                        value.weight_price = zone_weight2.shift()
                        break;
                    case 2:
                        value.weight_price = zone_weight3.shift()
                        break;
                    case 3:
                        value.weight_price = zone_weight4.shift()
                        break;
                    default:
                        break;
                }
                destObj[key] = value
            })

        }

        const obj = {
            method_id: `${_values.memo}`,
            weight_price_table: destObj || "",
            cheavy: _values.cheavy != undefined ? `${_values.cheavy}` : "",
            cprice: _values.cprice != undefined ? `${_values.cprice}` : "",
            fheavy: _values.fheavy != undefined ? `${_values.fheavy}` : "",
            fprice: _values.fprice != undefined ? `${_values.fprice}` : "",
            freeship_number: _values.freeship_number != undefined ? `${_values.freeship_number}` : "",
            freeship_price: _values.freeship_price != undefined ? `${_values.freeship_price}` : "",
            freeship_weight: _values.freeship_weight != undefined ? `${_values.freeship_weight}` : "",
            hidden_number: _values.hidden_number != undefined ? `${_values.hidden_number}` : "",
            hidden_price: _values.hidden_price != undefined ? `${_values.hidden_price}` : "",
            hidden_weight: _values.hidden_weight != undefined ? `${_values.hidden_weight}` : "",
        }
        _values.create_at = moment(_values.create_at).format("YYYY-MM-DD HH:mm:ss");
        _values.memo = JSON.stringify(obj);
        _values.country_ids = checkedList.map(Number);

        if(!len){
            _values.geo_zone_id = rowData.id;
        }
        console.log(_values,len)
        // if (err == null) {
        //     post(api.save_geo_zone, _values).then(res => {
        //         if (res.code == "200") {
        //             message.success("保存成功");
        //             //    location.reload(); 
        //         }
        //     })
        // }
        // else {
        //     console.log(err)
        // }
        callback(_values);
    }

    SearchValue = (value) => {
        let {
            rolesDataArr
        } = this.state;
        let len = rolesDataArr.length,
            SearchValue = value.split(';');
        if (!!value) {
            for (let j = 0; j < SearchValue.length; j++) {
                for (let i = 0; i < len; i++) {
                    if (rolesDataArr[i].name.indexOf(SearchValue[j]) != -1) {
                        rolesDataArr[i].state = true
                    } else {
                        rolesDataArr[i].state = false
                    }
                }
            }
            this.setState({
                rolesDataArr
            })
        }
        if (value == '') {
            rolesDataArr.map(item => {
                item.state = true
            })
            this.setState({
                rolesDataArr
            })
        }
    }

    //修改配送方式
    changeMethod = (curKey) => {
        this.setState({
            method: curKey
        })
    }

    onChangeCountry = (checkedList) => {

        this.setState({
            checkedList
        });
    }

    render() {

        const {
            getFieldDecorator
        } = this.props.form;

        const {
            rowData = {},
            countrys = []
        } = this.context
        const len = Object.keys(rowData).length == 0;
        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: <span><Icon type={len ? 'diff' : 'edit'} style={{ color: '#798994', marginRight: 10 }} />{len ? "新增物流" : "编辑物流"}</span>,
            method: api.save_geo_zone,
            visible: this.context.visible,
            onCancel: () => this.context.toggleWin('visible'),
            form: this.props.form,
            winType: 'lg',
            ...this.context.batConfig
        }

        const {
            method = JSON.stringify(rowData) == "{}" ? "method_a" : "",
        } = this.state;
        console.log(method,'methodmethodmethodmethod')

        return (
            <DrawerComp
                {...modalProp}
            >
                <Form>
                    <Row span={24} type="flex" justify="start">
                        <Col span={24}>
                            <FormItem label="配送名称"
                                {...formItemLayout2}>
                                {getFieldDecorator("name", {
                                    initialValue: rowData.name || '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Input placeholder="placeholder" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="配送名称备注"
                                {...formItemLayout2}>
                                {getFieldDecorator("alias", {
                                    initialValue: rowData.alias || '',
                                    rules: [{ required: false, message: '必填项' }],
                                })(
                                    <Input placeholder="可为空" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="预计到达"
                                {...formItemLayout2}>
                                {getFieldDecorator("remark", {
                                    initialValue: rowData.remark || '',
                                    rules: [{ required: false, message: '必填项' }],
                                })(
                                    <Input placeholder="可为空" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="运费计算方式"
                                {...formItemLayout2}>
                                {getFieldDecorator("memo", {
                                    initialValue: rowData != {} && rowData.memo ? rowData.memo.method_id : "method_a",
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder="请选择运费计算方式"
                                        // style = "color:red"
                                        onChange={this.changeMethod}
                                    >
                                        <Option
                                            key="method_a"
                                            value="method_a"
                                        >
                                            首重 + 续重
                                            </Option>
                                        <Option
                                            key="method_b"
                                            value="method_b"
                                        >
                                            重量对应价格
                                            </Option>
                                    </Select>

                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            {
                                method == "method_b" ? <Method_b ref="method_b" getFieldDecorator={getFieldDecorator} params={rowData} /> : <Method_a ref="method_a" getFieldDecorator={getFieldDecorator} params={rowData} />
                            }
                        </Col>
                        <Col span={24}>
                            <FormItem label="配送国家"
                                {...formItemLayout2}>
                                <div style={{ height: "500px", border: "1px solid #e9e9e9", padding: "20px", overflow: "auto" }}>

                                    <CheckboxGroup value={this.state.checkedList} onChange={this.onChangeCountry}>
                                        <Row>
                                            {
                                                countrys.map((item, index) => {
                                                    return (
                                                        <Col span={24}>
                                                            <Checkbox value={item.id + ""}>
                                                                {item.name_cn}-{item.name}-{item.iso_code_2}-{item.iso_code_3}
                                                            </Checkbox>
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </CheckboxGroup>

                                </div>

                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="排序值"
                                {...formItemLayout2}>
                                {getFieldDecorator("store_id", {
                                    initialValue: rowData.store_id || '',
                                    rules: [{ required: false, message: '必填项' }],
                                })(
                                    <Input placeholder="placeholder" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="状态"
                                {...formItemLayout2}>
                                {getFieldDecorator('status', {
                                    initialValue: rowData.status + "" || '1',
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Radio.Group>
                                        <Radio value="1">启用</Radio>
                                        <Radio value="0">禁用</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <FormItem label="创建时间"
                                {...formItemLayout2}>
                                {getFieldDecorator("create_at", {
                                    initialValue: rowData.date ? moment(rowData.date) : moment(),
                                    rules: [{ required: false, message: '必填项' }],
                                })(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={true} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

            </DrawerComp>
        )
    }
}

export default Form.create()(employeeRights)