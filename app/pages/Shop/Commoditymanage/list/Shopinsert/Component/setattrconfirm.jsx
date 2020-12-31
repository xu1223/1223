import React, { Component } from 'react'
import { ListContext } from '@/config/context';
import { formItemLayout3, formItemLayout2, formItemLayout1 } from '@/config/localStoreKey'
import { ModalComp, Dr } from '@/components/ModalComp2'
import { WinMessage } from '@/components/Confirm/index.js';
import {
    Row,
    Col,
    Input,
    Form,
    Select,
    Icon,
    Tag
} from 'antd';
import { post } from "fetch/request";
import api from "fetch/api";
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
import './setarrt.less'
class Setattrconfirm extends Component {
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            attributevalue: [], //下拉选择数据
            sizeAttributevalue: [],
            colorAttributevalue: [],
            type_select: '',
            list: [],
            parms: {},
            setAttrdata: [],
            type_name: '',
            color: '',
            _className: '',
            getCategoryOptionvalue: [],
            is_ids: [],

        }
    }
    componentDidMount() {
        let istext = this.context.setAttrdata
        if (this.context.setAttrdata.length == 0) {
            istext = [{
                name: 'Size',
                option_id: '1',
                option_value_list: []
            }, {
                name: 'Color',
                option_id: '1',
                option_value_list: []
            }
            ]
        }
        istext = JSON.parse(JSON.stringify(istext))

        this.setState({
            setAttrdata: istext ? istext : []
        })

        let is_ids = []
        istext.map(item => {
            if (item.option_value_list) {
                item.option_value_list.map(v => {
                    let param = {
                        id: v.id,
                        option_value_name: v.option_value_name
                    }
                    is_ids.push(param)
                })
            }

        })
        this.setState({
            is_ids: is_ids
        })

        console.log(is_ids, 'istextistext')
        post(api.get_param_option_list, {
        }).then((res) => {
            if (res.resultId == 200) {
                this.setState({
                    getCategoryOptionvalue: res.resultData
                });
                this.changeSelect(1)

            }
        });
    }
    beforeCallback = () => {
        const { setAttrdata, color } = this.state
        const { issetAttributescall } = this.context;

        for (var i = 0; i < setAttrdata.length; i++) {
            if (setAttrdata[i].option_value_list.length == 0) {
                WinMessage({
                    content: '请选择属性'
                });
                return false
            }
        }
        issetAttributescall(setAttrdata, color)   //处理选中属性进行回显
        this.context.toggleWin('issetAttributes', {}); //关闭弹窗
    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('issetAttributes', {});
    }
    /**
     * 下拉选择
     */
    changeSelect = (val) => {
        const {
            getCategoryOptionvalue
        } = this.state
        let data = []
        getCategoryOptionvalue.forEach(v => {
            if (v.id == val) {
                v.option_value_list.forEach(n => {
                    n['option_value_name'] = n.name;
                    n['option_name'] = v.name;
                });
                data = v.option_value_list
            }
        })

        this.setState({
            tabsearch: '',
            attributevalue: data,

        });
    }
    /**
     * 点击选择
     */
    listChange = (item, index, type_name) => {
        const { attributevalue, parms, setAttrdata, _className, is_ids } = this.state

        // if (type_name != 'Color') {
        //     attributevalue.splice(index, 1)
        // }

        console.log(is_ids, item, 'is_ids')
        for (var i = 0; i < is_ids.length; i++) {
            if (item.option_value_name == is_ids[i].option_value_name) {
                if (item.option_name == 'Color') {
                    item['color_id'] = is_ids[i].color_id
                }
                item['id'] = is_ids[i].id
                break;
            } else {
                item['id'] = ''
            }
        }
        // is_ids.forEach(v => {
        //     if (item.option_value_name == v.option_value_name) {
        //         console.log(22222222)
        //         istest['id'] = v.id
        //         return false
        //     }
        // })
        console.log(item, 'item')
        attributevalue.splice(index, 1)
        setAttrdata.forEach((v) => {
            if (v.name == type_name) {

                if (type_name != 'Color') {
                    let isstage = true
                    v.option_value_list.forEach(t => {
                        if (item.option_value_name == t.option_value_name) {
                            isstage = false
                        }
                    })
                    if (isstage) {
                        v['option_value_list'].push(item)
                    }
                } else {
                    let colordata = [item]
                    v['option_value_list'] = colordata
                }

            }
        })
        console.log(setAttrdata, 'setAttrdatasetAttrdatasetAttrdata')
        this.setState({
            setAttrdata: setAttrdata,

        });
    }
    /**
     * 点击删除
     * @param {*} item 
     * @param {*} index 
     */
    changeDel(item, index, option_name, option_value_name) {
        const { attributevalue, setAttrdata } = this.state
        setAttrdata.forEach(v => {
            console.log(v, option_name, 'option_nameoption_name')
            if (v['name'] == option_name) {
                console.log(v, 'option_nameoption_name')
                v.option_value_list.splice(index, 1);
            }
        })
        this.setState({
            setAttrdata: setAttrdata,
            attributevalue: this.deWeight([...attributevalue, { ...item }]),
            type_name: option_value_name
        });

    }
    issearch = (value) => {
        const {
            attributevalue
        } = this.state
        let val = value.target.value

        let tabsearch = [],
            tab_list = attributevalue,
            list_length = tab_list.length;
        for (let i = 0; i < list_length; i++) {
            let option_value_name = tab_list[i].option_value_name;
            if (option_value_name.indexOf(val) != -1) {
                tabsearch.push(tab_list[i]);
            }
        }

        this.setState({
            tabsearch: tabsearch
        })
    }
    /**
     * 数组去重
     */
    deWeight = (arr) => {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i].id == arr[j].id) {
                    arr.splice(j, 1);
                    //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                    j--;
                }
            }
        }
        return arr;
    }
    render() {
        const {
            form
        } = this.props
        const modalProp = {
            title: false,
            winType: 2,
            beforeCallback: this.beforeCallback,
            onCancel: this.onCancel,
            // method: type == '1' ? api.addCustomList : api.editCustomList,
            visible: this.context.issetAttributes,
            onCancel: this.onCancel,
            form: this.props.form,
        };
        const { getFieldDecorator } = form
        // const { getCategoryOptionvalue } = this.state;


        const { attributevalue, type_name, type_select, setAttrdata, getCategoryOptionvalue, tabsearch } = this.state
        console.log(getCategoryOptionvalue, 'getCategoryOptionvaluegetCategoryOptionvalue')
        return (
            <ModalComp {...modalProp}>
                <div style={{ padding: '20px' }}>
                    <>
                        {
                            // v.option_value_list.length
                            setAttrdata && setAttrdata.map((v, index) => {
                                return v.option_value_list ? <div className="clearfix setatr-select-header" style={{ display: v.option_value_list.length == 0 ? 'none' : 'block' }}>
                                    <div class="setatr-select-type-name">
                                        {v.name}
                                    </div>
                                    <div className="setatr-select-type">
                                        <ul className="clearfix">
                                            {
                                                v.option_value_list.map((n, i) => {
                                                    return <li key={n.id} >
                                                        {n.option_value_name}
                                                        <Icon type="close-circle" onClick={() => this.changeDel(n, i, n.option_name, v.option_value_name)} />
                                                    </li>
                                                })
                                            }

                                        </ul>
                                    </div>
                                </div>
                                    : ''
                            })
                        }

                    </>
                    <Row>
                        <Col span={20}>
                            <FormItem {...formItemLayout1} >
                                {getFieldDecorator('set_attr', {
                                    initialValue: '',
                                })(
                                    <InputGroup compact placeholder="选择属性">
                                        <Select defaultValue="Size" style={{ width: '100px' }} onChange={this.changeSelect}>
                                            {getCategoryOptionvalue && getCategoryOptionvalue.map(v => {

                                                return (v.name == 'Size' || v.name == 'Color') ? <Option value={v.id} key={v.index}>{v.name}</Option> : ''
                                            })}
                                        </Select>
                                        <Input style={{ width: '200px' }} onBlur={value => this.issearch(value)} placeholder="输入属性值名称搜索" />
                                    </InputGroup>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <div className="setattr">
                            <ul className="clearfix clearul">
                                {
                                    (tabsearch || (attributevalue && attributevalue)).map((v, index) => {

                                        return <li key={v.id} onClick={() => this.listChange(v, index, v.option_name)}>
                                            {v.option_value_name}
                                        </li>
                                    })}

                            </ul>
                        </div>
                    </Row>
                </div>
            </ModalComp>
        )
    }
}
export default Form.create()(Setattrconfirm)