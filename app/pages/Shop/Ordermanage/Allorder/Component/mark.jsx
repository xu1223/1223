import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2'
import api from '@/fetch/api'
import {
    Row,
    Col,
    Form,
    Input
} from 'antd';
const FormItem = Form.Item
const { TextArea } = Input

class Mark extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }
    // 处理数据
    beforeCallback = (values, callback) => {
        const { rowData } = this.context;
        values.order_id = rowData.id
        callback(values);
    }

    render() {
        const {
            visibleMark,
            rowData
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: visibleMark,
            winType: 1,
            onCancel: () => this.context.toggleWin('visibleMark'),
            method: api.add_edit_memo,
            form: this.props.form,
            ...this.context.batConfig,
        };

        const {
            getFieldDecorator
        } = this.props.form;

        return <ModalComp {...modalProp} >
            <Form style={{ padding: '20px' }}>
                <p>备注信息</p>
                <FormItem>
                    {getFieldDecorator('memo', {
                        initialValue: rowData.memo,
                        rules: [{ required: true, message: '必填项' }],
                    })(

                        <TextArea
                            placeholder='备注'
                            autoSize={{ minRows: 10, maxRows: 11 }}
                        />
                    )}
                </FormItem>
            </Form>
        </ModalComp>
    }
}


export default Form.create()(Mark)