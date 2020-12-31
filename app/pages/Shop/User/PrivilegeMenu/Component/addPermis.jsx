import React, {
    Component
} from 'react';

import {
    Form,
    Row,
    Select,
    message,
    Col,
    Icon,
    Cascader,
} from 'antd';
const FormItem = Form.Item;
import {
    EditTableRow
} from '@/components/TableEditor';
import {
    formItemLayout2
} from 'config/localStoreKey';
import { ListContext } from '@/config/context'; //引入上下文
import {DrawerComp} from '@/components/ModalComp2';
import api from 'fetch/api';
import {
    nameData,
    routeData
} from '../Config/index'

class addPermis extends Component {
    static defaultProps = {

    };
    static contextType = ListContext; //导入上下文 this.context
    constructor(props, context) {
        super(props, context);

        this.state = {
            skuMapData: [],
            codeData: '',
            dataRowSource: [{
                code: '',
                name: '',
                index: '',
            }],
        }
    }

    componentDidMount() {
        const {
            rowData = {},
        } = this.context;
        const dataRowSource = [{
            code: rowData.code,
            name: rowData.title,
            index: rowData.index,
        }];

        this.setState({
            type: "init",
            dataRowSource
        })
    }


    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
        let paentid = values.parent_id && values.parent_id instanceof Array ? values.parent_id[values.parent_id.length - 1] : values.parent_id;
        values.parent_id = paentid;
        let dataSourceList =  this.tableEditor.getData();
        if(!dataSourceList){
            return false
        }
        if(this.context.rowData) {
            dataSourceList.map(item => {
                item.id = this.context.rowData.id
            })
        }
       
        let _values = {
            list: JSON.stringify(dataSourceList),
            ...values
        }

        callback(_values);
    }

    onCreate = (res) => {
        if (res.resultId == 1) {
            this.context.toggleWin();
            message.success(res.resultMsg);
            this.context.getMenusList();
        } else {
            message.error(res.resultMsg)
        }
    }

    onChangeMenuData = (values, options) => {
        let code = options[options.length - 1].code;
        this.setState({
            codeData: code
        })
    }

    render() {
        const {
            form,
        } = this.props;

        const{
            rowData = {},
            PcategoryMenusList,
        }=this.context;

        const {
            codeData
        } = this.state;
        const {
            getFieldDecorator
        } = form;

        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const len = Object.keys(rowData).length;
        const modalProp = {
            beforeCallback: this.beforeCallback,
            afterCallback: (res) => this.onCreate(res),
            title:<span><Icon type={ len ? 'edit' :'diff'} style={{ color: '#798994', marginRight: 10 }} />{ len ? "编辑权限" : "添加权限"}</span>,  
            method: len ? api.menu_edit : api.menu_add,
            visible: this.context.visible,
            onCancel: ()=>this.context.toggleWin(),
            form:this.props.form,
            ...this.context.batConfig
        }

        //列操作
        this.rowColumns = [{
            title: '代码',
            dataIndex: 'code',
            width: "30%",
            _itemConf: {
                rules: [{
                    required: true,
                    message: '必填项'
                }],
            },
        }, {
            title: '名称',
            dataIndex: 'name',
            width: "30%",
            _itemConf: {
                rules: [{
                    required: true,
                    message: '必填项'
                }],
            },
            _type: { //类型 支持对象 和 字符串的形式
                name: 'select',
                data: nameData,
                unicode: "name|name"  //左侧 为 key  右侧 为value   用法同批量操作

            },
            _formConf: {
                onSelect: (value, {
                    props
                }) => {
                    const dataSource = this.tableEditor.state.dataSource
                    const {
                        recordIndex
                    } = props;
                    const{
                        rowData,
                    }=this.context;
                    dataSource[recordIndex].index = rowData.id || '';
                    this.setState({
                        dataRowSource: dataSource,
                        force: !this.state.force
                    })
                },
                allowClear: false, //清除有bug
                mode: 'combobox',
            },
        }, {
            title: '路由',
            dataIndex: 'index',
            width: "40%",
            _itemConf: {
                rules: [{
                    required: true,
                    message: '必填项'
                }],
            },
            _formConf: {
                onSelect: (value, {
                    props
                }) => {
                    const dataSource = this.tableEditor.state.dataSource
                    const {
                        recordIndex
                    } = props;
                    const{
                        rowData,
                    }=this.context;
                    dataSource[recordIndex].name = rowData.id  || '' ;
                    this.setState({
                        dataRowSource: dataSource,
                        force: !this.state.force
                    })
                },
                allowClear: false, //清除有bug
                mode: 'combobox',
            },
            _type: { //类型 支持对象 和 字符串的形式
                name: 'select',
                data: routeData,
                unicode: "name|name"  //左侧 为 key  右侧 为value   用法同批量操作
            },
        }]

        let parentArr = rowData && rowData.parents && rowData.parents.split(',').filter(item => item).map(Number);

        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">
                    <Row>
                        <Col span={24}>
                            <FormItem label="上一级名称" {...formItemLayout2} >
                                {getFieldDecorator('parent_id', {
                                    initialValue:parentArr,
                                    rules: [{ required: false, message: '必填项' }],
                                })(
                                    <Cascader
                                        options={PcategoryMenusList}
                                        expandTrigger="click"
                                        showSearch
                                        onChange={this.onChangeMenuData}
                                        placeholder="此处为空，默认模块添加"
                                        changeOnSelect
                                        style={{ width: '80%' }}
                                    />
                                )}
                                <span className='tip-text'>{!!rowData.code ? rowData.code:codeData}</span>
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="类型" {...formItemLayout2}  >
                                {getFieldDecorator('level', {
                                    initialValue: rowData.level ?  rowData.level+ '' : '1' || '1',
                                })(
                                    <Select style={{ width: '100%' }}>
                                        <Option value='1' key='1'>模块</Option>
                                        <Option value='2' key='2'>菜单</Option>
                                        <Option value='3' key='3'>操作</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="权限添加" {...formItemLayout2} >
                            <EditTableRow
                                columns={this.rowColumns}
                                dataSource={this.state.dataRowSource}
                                ref={table => this.tableEditor = table}
                                noAdd={!!rowData.id ? true : false}
                            />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </DrawerComp>
        )
    }
}

export default Form.create()(addPermis)