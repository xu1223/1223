import React, { Component } from 'react';
import api from "@/fetch";
import { ModalComp } from '@/components/ModalComp2';
import { formItemLayout2, } from 'config/localStoreKey';
import {
    Row,
    Col,
    Form,
    Input,
} from 'antd';
const FormItem = Form.Item;


class add extends Component {
    static defaultProps = {};
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    //处理数据提交
    beforeCallback = (values, callback) => {
        const {
            rowData = {}
        } = this.props
        api.order.edit_template_name({
            tpl_id: rowData.id,
            tpl_name: values.name,
        }).then((res) => {
            if (res) {
                this.props.customizelist()
                this.onCancel()
            }

        })


    }

    componentDidMount() {
        // this.zone_Store()
    }


    //关闭弹窗
    onCancel = () => {
        this.props.toggleWin('rechristen');
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            rowData = {}
        } = this.props
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '重命名',
            visible: this.props.visible,
            onCancel: this.onCancel,
            form: this.props.form,
            width: 500
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{ padding: '20px' }}>
                        <Row style={{ marginTop: '16px' }}>
                            <Col span={24}>
                                <FormItem label="名字" {...formItemLayout2} >
                                    {getFieldDecorator('name', {
                                        initialValue: rowData.name || '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>

                            </Col>
                        </Row>
                    </div>
                </Form>
            </ModalComp>
        )
    }
}

export default Form.create()(add)