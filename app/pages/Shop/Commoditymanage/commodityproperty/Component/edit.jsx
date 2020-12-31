import React, { Component } from 'react';

import {
    Form,
    Row,
    Col,
    Button,
    Input,
    Icon,
    Modal,
    message,
} from 'antd';
const FormItem = Form.Item;
const { confirm } = Modal;
const { Search } = Input;
import { formItemLayout6, formItemLayout3 } from 'config/localStoreKey'
import api from 'fetch/api'
import { post } from 'fetch/request'
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2';
import '../index.less'
class Edit extends Component {
    static defaultProps = {

    };

    state = {
        tablist: [],      //实际数据
        tabsearch: [],   //搜索展示数据
        type: 'add',     // add 为添加属性。 edit为编辑属性
        editdata: ''    //编辑数据存储
    }
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount = () => {
        const {
            rowData
        } = this.context
        this.setState({
            tablist: rowData.option_values
        })

    }
    beforeCallback = (values, callback) => {

    }


    // 关闭弹窗
    onCancel = () => {
        this.props.form.resetFields();
        this.context.toggleWin('editshow', {});
    }
    // 回显编辑
    tabclick = (item, index) => {
        const {
            form
        } = this.props
        form.setFieldsValue({ name_1: item.name })
        form.setFieldsValue({ alias: item.alias })
        this.setState({
            type: 'edit',  //判断为编辑情况
            index: index,  //获取编辑的下标
            editdata: item //获取编辑数据
        })
    }
    close = (item, index, e) => {
        e.stopPropagation();
        e.preventDefault()
        const {
            tablist
        } = this.state
        let _this = this
        confirm({
            title: '确定是否要删除?',
            content: '删除后不可撤销',
            onOk() {
                post(api.del_param_option_value, {
                    option_value_ids: item.id
                }).then(res => {
                    if (res.resultId == 200) {
                        message.success('删除成功');
                        tablist.splice(index, 1)
                        _this.setState({
                            tablist: tablist
                        })
                    } else {
                        message.error(res.resultMsg);
                    }
                })

            },
            onCancel() {
            },
        });

    }
    // 搜索判断
    issearch = (value) => {
        const {
            tablist
        } = this.state
        let search_arr = value.replace('，', ',').split(',').filter(function (v) {  //用 ，区分中文以及英文进行分割
            v = v.trim();  //除去空格，排除为空情况
            if (v || v === 0) {  
                return true;
            } else {
                return false;
            }
        });

        let tabsearch = [],   //该值只参与回显数据，不参与最后提交
            tab_list = tablist,
            list_length = tab_list.length;
        for (let i = 0; i < list_length; i++) {
            let name = tab_list[i].name;
            search_arr.map(search_str => {   
                search_str = search_str.trim();  //排空处理
                if (name.toString().indexOf(search_str) != -1 && !tabsearch.includes(tab_list[i])) {  //判断原数据内是否包含。包含添加到搜素数据内
                    tabsearch.push(tab_list[i]);
                }
            });
        }

        this.setState({   //该值只参与回显数据，不参与最后提交
            tabsearch: tabsearch
        })
    }

    // 新增编辑数据
    addtab = () => {
        const {
            form
        } = this.props
        const {
            rowData
        } = this.context
        const {
            type,
            tablist,
            index,
            editdata
        } = this.state
        if (form.getFieldValue('name_1')) {  //属性值是否存在
            let item = {
                name: form.getFieldValue('name_1'),    //获取数据
                alias: form.getFieldValue('alias'),
                option_id: rowData.id
            }
            if (type == 'edit') {      //判断是否为编辑
                item.id = editdata.id
            }

            post(api.save_param_option_value, item).then(res => {
                if (res.resultId == 200) {
                    if (type == 'edit') {
                        tablist.splice(index, 1, res.resultData)  //编辑为替换。新增为添加
                    } else {
                        tablist.push(res.resultData)
                    }
                    this.setState({
                        tablist
                    })

                } else {
                    message.error(res.resultMsg)
                }
            })
            this.setState({  //无论编辑新增，结束后状态值必须切回add默认状态
                type: 'add'
            })
            form.resetFields('name_1')
            form.resetFields('alias')
        } else {
            message.error('属性值不能为空');
        }

    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const {
            rowData = {},
        } = this.context;
        const {
            tablist,
            tabsearch
        } = this.state
        const modalProp = {
            wrapClassName: 'shop-Modal',
            beforeCallback: this.beforeCallback,
            closable: false,
            title: false,
            footer: false,
            visible: this.context.editshow,
            onCancel: this.onCancel,
            form: this.props.form,
            method: api.save_param_option,
            ...this.context.batConfig,
        }

        return (

            <ModalComp
                {...modalProp}
            >
                <Form className="resetFormStyle" style={{ marginTop: '20px', overflow: 'hidden', padding: '20px' }} >
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="属性名称"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('name', {
                                    initialValue: rowData.name || '',
                                    rules: [{ required: true, message: '请输入属性名称' }],
                                })(
                                    <Input disabled />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="属性值"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('name_1', {
                                    initialValue: rowData.name_1 || '',
                                    rules: [{ required: false, message: '请输入属性值' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="前台映射"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('alias', {
                                    initialValue: rowData.alias || '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <Button type="primary" onClick={() => this.addtab()} style={{ width: '100%', borderRadius: '0', background: '#fff', color: '#4AAAF1' }}  >
                                {
                                    this.state.type == 'add' ? '新增' : '编辑'
                                }

                            </Button>
                        </Col>
                        <Col span={24}>
                            <Search
                                placeholder="输入属性值搜索，多个可用逗号，隔开"
                                onSearch={value => this.issearch(value)}
                                style={{ width: '100%', marginTop: '20px' }}
                            />
                            <div className={'edit-tile'}>
                                {
                                    (tabsearch.length ? tabsearch : tablist).map((item, index) => {
                                        return (
                                            <span onClick={() => this.tabclick(item, index)}>{item.name} <Icon onClick={(e) => this.close(item, index, e)} type="close-circle" /></span>
                                        )
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                </Form>
            </ModalComp>
        )
    }
}
export default Form.create()(Edit)










