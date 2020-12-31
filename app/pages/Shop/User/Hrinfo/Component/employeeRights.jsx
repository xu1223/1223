import React, { Component } from 'react';

import {
    Form,
    Row,
    Input,
    Col,
    Switch,
    Icon,
    message,
    TreeSelect
} from 'antd';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
import api from '@/fetch';
import {
    formItemLayout2,
} from 'config/localStoreKey';

import { DrawerComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context'; //引入上下文
import { compose } from 'redux';



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

        this.menu_ids = []
    }

    componentDidMount() {
        const {
            rowData
        } = this.context
        this.menu_ids = []
        let Allids = []
        if (rowData.menus && rowData.menus.length > 0) {
            rowData.menus.map((item) => {
                Allids.push(item.id)
                this.menu_ids.push(`${item.id}##${item.parent_id}`)
            })

        }
        this.setState({
            Allids
        })
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
        const {
            rowData = {},
        } = this.context
        const {
            Allids = []
        } = this.state
        let apiname = ''
        if (rowData.id) {
            apiname = 'edit_role'
            values['id'] = rowData['id']
        } else {
            apiname = 'add_role'
        }
        if (Allids.length == 0) {
            message.error('请选择权限')
        }


        values['status'] = values['status'] ? 1 : 2
        values['menu_ids'] = Allids.toString()
        api.order[apiname]({
            ...values
        }).then((res) => {
            if (res) {
                this.context.toggleWin()
                message.success('修改成功')
                this.context.changeSearch();
            }
        })
    }

    renderTreeNodes = (data) => {
        let arr = [];
        data.map(item => {
            let value = `${item.id}##${item.parent_id}`
            if (Array.isArray(item.children) && item.children.length > 0) {
                arr.push(
                    <TreeNode value={value}  title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )

            } else {
                arr.push(<TreeNode value={value}  title={item.name} isLeaf={item.isLeaf} key={item.id} dataRef={item} />)
            }
        });
        return arr

    }

    mapfilter = (data) => {
        let arrids = []
        console.log(data,22222)
        data.map((item) => {
            let i =   item.split('##') 
            arrids.push(i[1])
            arrids.push(i[0])
        })
        let arr = arrids.filter(function (item, index, arr) {
            return arrids.indexOf(item, 0) === index
        })
        return arr

    }

    onChange = (data, v, t) => {
        this.setState({
            Allids: this.mapfilter(data)
        })

    }

    render() {

        const {
            getFieldDecorator
        } = this.props.form;

        const {
            rowData = {},
            ProductCategoryDataList = []
        } = this.context
        const len = Object.keys(rowData).length == 0;
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: <span><Icon type={len ? 'diff' : 'edit'} style={{ color: '#798994', marginRight: 10 }} />{len ? "新增角色" : "编辑角色"}</span>,
            visible: this.context.visible,
            onCancel: () => this.context.toggleWin(),
            form: this.props.form,
            ...this.context.batConfig
        }




        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">
                    <Row type='flex' justify='space-between' align='middle'>
                        <Col span={24}>
                            <FormItem label="角色名称" {...formItemLayout2} >
                                {getFieldDecorator('name', {
                                    initialValue: rowData.name || '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="角色描述" {...formItemLayout2} >
                                {getFieldDecorator('memo', {
                                    initialValue: rowData.memo || '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="是否启用" {...formItemLayout2} >
                                {getFieldDecorator('status', {
                                    initialValue: rowData.status == '1' ? true : false,
                                    valuePropName: 'checked'
                                })(
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="选择权限" {...formItemLayout2} >
                                {getFieldDecorator('menu_ids', {
                                    initialValue: this.menu_ids,
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="Please select"
                                        treeCheckable={true}
                                        allowClear
                                        multiple
                                        treeDefaultExpandAll
                                        onChange={this.onChange}
                                    >
                                        {this.renderTreeNodes(ProductCategoryDataList)}
                                    </TreeSelect>
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