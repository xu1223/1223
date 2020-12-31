import React, { Component } from 'react';

import {
    Form,
    Row,
    Col,
    message,
    Input,
    Switch
} from 'antd';
const FormItem = Form.Item;

import { formItemLayout6, formItemLayout2 } from 'config/localStoreKey'
import api from 'fetch/api'
import { post } from 'fetch/request'
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2';

class Add extends Component {
    static defaultProps = {

    };

    state = {
        categoryStr: [],
    }
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
        const {
            rowData = {},
        } = this.context;
        const len = Object.keys(rowData).length == 0;  //判断是否为编辑
        let param = {}
        param.name = values.name
        param.status = values.status ? 1 : 0
        param.type = 'select'    //固定传参
        if (!len) {
            param.id = rowData.id
        }

        post(api.save_param_option, param).then((res) => {
            this.onCancel()
            this.context.changetable()
            
        })

        // callback(param);
    }


     //关闭弹窗
    onCancel = () => {
        this.props.form.resetFields();
        this.context.toggleWin('addshow', {});
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const {
            rowData = {},
        } = this.context;

        const modalProp = {
            wrapClassName: 'shop-Modal',
            beforeCallback: this.beforeCallback,
            closable: false,
            title: false,
            visible: this.context.addshow,
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
                                {...formItemLayout2}
                            >
                                {getFieldDecorator('name', {
                                    initialValue: rowData.name || [],
                                    rules: [{ required: true, message: '请输入属性名称' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="状态"
                                {...formItemLayout2}
                            >
                                {getFieldDecorator('status', {
                                    initialValue: rowData.status ? true : false,
                                })(
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={rowData.status == 1 ? true : false} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </ModalComp>

        )
    }
}
export default Form.create()(Add)










