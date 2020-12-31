

import React, { Component } from 'react';
import '../index.less';
import { ListContext } from '@/config/context';
import api from '@/fetch/api';
import { get, post } from '@/fetch/request';
import EasyDragSort from '../Component/easyDragSort'   //拖拽组件
import BatOperation from '@/components/BatOperation';
import {
    Row,
    Col,
    Icon,
    Card,
    Form,
    Button,
    Input,
    Select,
    Table,
    message,
} from 'antd';
import { wrapAuth } from '@/util/unit';
const AuthButton = wrapAuth(Button)
import '../index.less'
const FormItem = Form.Item;
const Option = Select.Option;
import { formItemLayout6, } from 'config/localStoreKey'
class LogisticsModeEdit extends Component {
    static defaultProps = {};
    state = {};
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            initData: {},    //编辑回显值
            disabled: false,
            param_option_list: [],     //筛选器类型数据
            option_value_list: [],   //筛选值选择框数据
            list: [],    //筛选值数据
            curMoveItem: null,    //获取拖拽当前的index
            type: ''//状态
        }
        this.columns = [{
            title: '筛选值名称',
            dataIndex: 'name',
            render: (text, row) => {
                return <div>
                    {text}
                </div>
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            render: (text, row) => {
                return <div>
                    {text}
                </div>
            }
        },

        ]
    }

    componentDidMount() {
        const { id, type } = this.props.router.params;
        if (id != 'add') {
            post(api.get_filter, {
                id: id
            }).then(res => {
                if (res) {
                    let initData = ''
                    if (type == 'edit') {
                        initData = res.resultData
                    } else {
                        initData = {
                            type: res.resultData.type,
                            key: res.resultData.key,
                            value: res.resultData.value,
                        }
                    }
                    this.setState({
                        initData: initData,
                        list: res.resultData.value,
                        type: type
                    })
                }

            })
        }

        post(api.get_param_option_list).then(res => {
            if (res) {
                let param = res.resultData
                this.setState({
                    param_option_list: param
                })
                if (type == 'edit' || type == 'copy') {
                    for (var i = 0; i < param.length; i++) {
                        if (param[i].name == this.state.initData.key) {
                            this.setState({
                                option_value_list: param[i].option_value_list
                            })
                            return false
                        }
                    }
                }
            }

        })
    }
    //获取拖拽的index以及值
    handleDragMove = (data, from, to) => {
        this.setState({
            curMoveItem: to,
            list: data
        })
    }
    //  拖拽结束进行清空处理
    handleDragEnd = () => {
        this.setState({
            curMoveItem: null
        })
    }


    // 共享 tool 和index 
    toggleWin = (key = 'visible', otherConfig) => {
        this.setState({
            [key]: !this.state[key],
            otherConfig
        })
    }

    //控制当前处于专题活着属性
    onChange = (value, even) => {

        if (value == 'topic') {
            this.setState({
                disabled: true
            })
        } else {
            this.setState({
                disabled: false
            })
        }

    }
    //获取选中的筛选值
    keySelect = (value, even) => {
        const {
            param_option_list,
        } = this.state
        let i = ''
        param_option_list.map((item, index) => {
            if (item.name == value) {
                i = index
            }
        })
        console.log(param_option_list, value, 'param_option_list')
        this.setState({
            list: [],
            option_value_list: param_option_list[i].option_value_list
        })
    }

    // 添加筛选值
    addtable = () => {
        let {
            list
        } = this.state
        let test = list
        for (var i = 0; i < test.length; i++) {
            console.log(test[i])
            if (!test[i]) {
                message.error('筛选值不能为空');
                return false
            }
        }
        test.push('')
        console.log(test, 'test')
        this.setState({
            list: test
        })
        console.log(list, '_list')
    }

    //选中筛选值
    DragSortSelect = (value, index) => {
        let {
            list
        } = this.state
        for (var i = 0; i < list.length; i++) {
            if (list[i] == value) {  //判断筛选值是否重复
                message.error('筛选值不能重复');
                return false
            }
        }
        list[index] = value
    }
    //保存
    saveData = () => {
        const {
            form: { validateFields },
        } = this.props;
        validateFields((errors, values) => {
            if (!errors) {
                const {
                    list,
                    type,
                    initData
                } = this.state

                let param = values
                param['filter_value'] = list.toString()   //处理数据
                if (type == 'edit') {   //判断是否为编辑
                    param.id = initData.id
                }
                post(api.save_filter, param).then(res => {
                    if (res.resultId == 200) {
                        message.success(res.resultMsg);
                        this.goLink()   //成功后返回列表
                    } else {
                        message.error('参数错误');
                    }
                })
            }

        });

    }

    //返回列表页
    goLink = () => {
        this.props.goLink({
            pathname: '/sizer',
        })
    }


    render() {
        const {
            initData,
            param_option_list,
            option_value_list,
            list,
            curMoveItem
        } = this.state;
        const {
            getFieldDecorator,
        } = this.props.form;

        const formItemLayout = {
            labelCol: {
                span: 18
            },
            wrapperCol: {
                span: 6
            },
        }
        const _batProps = (rowData, index) => {
            return {
                config: [{
                    title: '删除',
                    noCheck: true,
                    type: 'danger',
                    ghost: true,
                    onClick: () => {
                        let newItems = this.state.list.slice();
                        newItems.splice(index, 1);
                        this.setState({ list: newItems });
                    }
                }],
                method: '',
                unicode: 'ids|id',
                batConfig: {},
                rowData
            }
        };
        return <div>
            <div className="productEditWrap content-main" style={{ height: '800px', paddingTop: '20px' }} >
                <Form className="resetFormStyle" style={{ marginTop: '20px', overflow: 'hidden' }} >
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="筛选器名称"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('name', {
                                    initialValue: initData.name || '',
                                    rules: [{ required: true, message: '请输入筛选器名称' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="筛选器别称"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('alias', {
                                    initialValue: initData.alias || '',
                                    rules: [{ required: true, message: '请输入筛选器名称' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <Col span={4}>
                                <FormItem
                                    label="筛选器类型"

                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('type', {
                                        initialValue: initData.type || 'option',
                                        rules: [{ required: true, message: '请输入筛选值' }],
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            onChange={this.onChange}
                                            // onSearch={onSearch}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            <Option value="option">属性</Option>
                                            <Option value="topic">专题</Option>
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={16}>
                                <FormItem
                                    label=""
                                    {...formItemLayout6}
                                >
                                    {getFieldDecorator('filter_key', {
                                        initialValue: initData.key || '',
                                        rules: [{ required: true, message: '请输入筛选值' }],
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            disabled={this.state.disabled}
                                            onSelect={this.keySelect}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                param_option_list.map((item, index) => {
                                                    return <Option key={index} value={item.name}>{item.name}</Option>
                                                })
                                            }

                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="筛选值"
                                {...formItemLayout6}
                            >

                                <div className={'sizer-table'}>
                                    <div className={'sizer-table-header'}>
                                        <p>筛选值名称</p>
                                        <p>操作</p>
                                    </div>
                                    <EasyDragSort onDragEnd={this.handleDragEnd} onChange={this.handleDragMove} data={list}>
                                        {list.map((item, index) => {
                                            return <div className={curMoveItem === index ? 'sizer-table-item active' : 'sizer-table-item'}
                                                key={item}
                                                onClick={() => {
                                                    console.log(list)
                                                }}
                                            >
                                                <div className={'item'}><Select
                                                    showSearch
                                                    defaultValue={item}
                                                    optionFilterProp="children"
                                                    onSelect={(e) => this.DragSortSelect(e, index)}
                                                    filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        option_value_list.map((v, i) => {
                                                            return <Option key={v} value={v.name}>{v.name}</Option>
                                                        })
                                                    }

                                                </Select></div>
                                                <div className={'item'}><BatOperation {..._batProps({}, index)} /></div>
                                            </div>
                                        })}
                                    </EasyDragSort>
                                    {/* <Table dataSource={table_list} columns={this.columns} />; */}
                                    <a className="sizer-add" onClick={() => this.addtable()}>添加数据</a>
                                </div>

                            </FormItem>
                        </Col>
                    </Row>
                </Form>

            </div>
            <div className="bottom-button-main">
                <Button type="primary" shape="round" onClick={this.saveData} size={'large'}>
                    保存
        </Button>
                <Button type="primary" style={{ background: '#C8C8C8', border: '1px solid #C8C8C8' }} onClick={() => this.goLink()} shape="round" size={'large'}>
                    取消
        </Button>
            </div>
        </div>
    }
}

export default Form.create()(LogisticsModeEdit)
