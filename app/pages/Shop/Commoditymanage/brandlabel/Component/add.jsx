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

import { formItemLayout4 } from 'config/localStoreKey'
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

    //    保存
    beforeCallback = (values, callback) => {
        const {
            rowData = {},
        } = this.context;
        const len = Object.keys(rowData).length == 0;   //判断是否为编辑状态
        let param = {}
        var regPos = /^\d+(\.\d+)?$/;  
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
        if (regPos.test(values.keyword) || regNeg.test(values.keyword)) {
            message.error('名称不能为数字');
            return false;
        }
        param.keyword = String(values.keyword)  //转为字符串类型，后端不支持对象数组
        if (!len) {
            param.id = rowData.id
        }
        callback(param);
    }

    // 关闭
    onCancel = () => {
        this.props.form.resetFields();  //清除之前选择项，避免回显问题
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
            method: api.save_search,
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
                                {...formItemLayout4}
                            >
                                {getFieldDecorator('keyword', {
                                    initialValue: rowData.keyword || [],
                                    rules: [{ required: true, message: '请输入标签名称' }],
                                })(
                                    <Input />
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










