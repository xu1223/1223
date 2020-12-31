import React, { Component } from 'react';

import {
    Form,
    Row,
    Input,
    Col,
    Icon,
    TreeSelect,
    message
} from 'antd';
const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
import {
    formItemLayout2,
} from 'config/localStoreKey';
import { DrawerComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context'; //引入上下文
import api from '@/fetch';


class employeeRights extends Component {
    static defaultProps = {
    };
    static contextType = ListContext; //导入上下文 this.context

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {

        api.order.add_menu({
            ...values
        }).then((res) => {
            if (res) {
                message.success('添加成功')
                this.context.indta()
            }
        })

    }



    onChange = checkedKeys => {
        this.setState({ checkedKeys });
    };



    renderTreeNodes = (data) => {
        let arr = [];
        data.map(item => {
            if (Array.isArray(item.children) && item.children.length > 0) {
                arr.push(
                    <TreeNode value={item.id} item={item} title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )

            } else {
                arr.push(<TreeNode value={item.id} item={item} title={item.name} isLeaf={item.isLeaf} key={item.id} dataRef={item} />)
            }
        });
        return arr

    }
    render() {

        const {
            getFieldDecorator
        } = this.props.form;
        // const {} = this.state
        const {
            rowData = {},
            ProductCategoryDataList = []
        } = this.context
        const len = Object.keys(rowData).length == 0;
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: <span><Icon type={len ? 'diff' : 'edit'} style={{ color: '#798994', marginRight: 10 }} />{len ? "新增菜单" : "编辑菜单"}</span>,
            visible: this.context.visible,
            onCancel: () => this.context.toggleWin(),
            form: this.props.form,
            batConfig: {

            },
        }


        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">
                    <Row type='flex' justify='space-between' align='middle'>
                        <Col span={24}>
                            <FormItem label="上一级栏目" {...formItemLayout2} >
                                {getFieldDecorator('parent_id', {
                                    initialValue: '',

                                })(

                                    <TreeSelect
                                        showSearch
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="Please select"
                                        allowClear
                                        treeDefaultExpandAll
                                        onChange={this.onChange}
                                    >
                                        {this.renderTreeNodes(ProductCategoryDataList)}
                                    </TreeSelect>

                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="权限名称" {...formItemLayout2} >
                                {getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(

                                    <Input></Input>

                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="路由" {...formItemLayout2} >
                                {getFieldDecorator('index', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(

                                    <Input></Input>

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