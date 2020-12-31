import React, { Component } from 'react';

import {
    Form,
    Row,
    Input,
    Select,
    Col,
    Checkbox,
    Switch,
    Icon
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
import {
    formItemLayout2,
} from 'config/localStoreKey';

import { DrawerComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context'; //引入上下文
import api from 'fetch/api';



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
        //这边对于 单个  和 多个可以进行操作
        values.status = values.status == true ? '1' : '2';
        values.id = this.context.rowData.id
        callback(values);
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





    render() {

        const {
            getFieldDecorator
        } = this.props.form;

        const {
            rowData = {},
            get_role_list_pager = []
        } = this.context
        const len = Object.keys(rowData).length == 0;
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: <span><Icon type={len ? 'diff' : 'edit'} style={{ color: '#798994', marginRight: 10 }} />{len ? "新增员工" : "编辑员工"}</span>,
            method: len ? api.add_member : api.edit_member,
            visible: this.context.visible,
            onCancel: () => this.context.toggleWin(),
            form: this.props.form,
            ...this.context.batConfig
        }

        let role_ids = []
        if (rowData.roles && rowData.roles.length > 0) {
            rowData.roles.map((item) => {
                role_ids.push(
                    item.role_id +''
                )
            })

        }
        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">
                    <Row type='flex' justify='space-between' align='middle'>
                        <Col span={24}>
                            <FormItem label="姓名" {...formItemLayout2} >
                                {getFieldDecorator('name', {
                                    initialValue: rowData.name || '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="电话" {...formItemLayout2} >
                                {getFieldDecorator('mobile', {
                                    initialValue: rowData.mobile || '',
                                    rules: [{ required: true, message: '必填项' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        {
                            len ? <Col span={24}>
                                <FormItem label="密码" {...formItemLayout2} >
                                    {getFieldDecorator('password', {
                                        initialValue: rowData.password || '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                                : ""
                        }
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
                            <FormItem label="选择角色" {...formItemLayout2} >
                                {getFieldDecorator('role_ids', {
                                    initialValue: role_ids || [],
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder="Please select"
                                    >
                                        {
                                            get_role_list_pager.map((item) => {
                                                return <Option key={item.id}>{item.name}</Option>
                                            })
                                        }
                                    </Select>,
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