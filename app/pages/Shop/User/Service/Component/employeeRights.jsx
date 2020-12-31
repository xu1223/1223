import React, { Component } from 'react';

import {
    Form,
    Row,
    Input,
    Col,
    Switch,
    Icon,
    Tooltip
} from 'antd';
const FormItem = Form.Item;
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
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
        //这边对于 单个  和 多个可以进行操作
        values.is_rec = values.is_rec == true ? '1' : '2';
        if(this.context.rowData.id){
            values.id = this.context.rowData.id
        }
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
        } = this.context
        const len = Object.keys(rowData).length == 0;
        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback: this.beforeCallback,
            //  afterCallback: (res) => this.onCreate(res),
            title: <span><Icon type={len ? 'diff' : 'edit'} style={{ color: '#798994', marginRight: 10 }} />{len ? "新增客服" : "编辑客服"}</span>,
            method: len ? api.add_live_chat : api.edit_live_chat,
            visible: this.context.visible,
            onCancel: () => this.context.toggleWin(),
            form: this.props.form,
            ...this.context.batConfig
        }

        let roleId = [];

        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">
                    <Row type='flex' justify='space-between' align='middle'>
                        <Col span={24}>
                            <FormItem label="英文名" {...formItemLayout2} >
                                {getFieldDecorator('name', {
                                    initialValue: rowData.name || '',
                                    rules: [{ required: true, message: '请填写英文名' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="真实姓名" {...formItemLayout2} >
                                {getFieldDecorator('title', {
                                    initialValue: rowData.title || '',
                                    rules: [{ required: true, message: '请填写真实姓名' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="Whatsapp" {...formItemLayout2} >
                                {getFieldDecorator('whatsapp', {
                                    initialValue: rowData.whatsapp || '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="联系邮箱" {...formItemLayout2} >
                                {getFieldDecorator('email', {
                                    initialValue: rowData.email || '',
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
                        <Col span={24}>
                            <div className="Recommendation-main">
                                <FormItem label="是否推荐" {...formItemLayout2} >
                                    {getFieldDecorator('is_rec', {
                                        initialValue: rowData.is_rec == '1' ? true : false,
                                        valuePropName: 'checked'
                                    })(
                                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                    )}
                                </FormItem>
                                <div className="Recommendation-i">
                                    <Tooltip placement="top" title="开启推荐，客服将会在商城前台悬浮展示">
                                        <Icon type="info-circle" />
                                    </Tooltip>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Form>
            </DrawerComp>
        )
    }
}

export default Form.create()(employeeRights)