import React, { Component } from 'react';
import api from '@/fetch/api';
import { post } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout1 } from 'config/localStoreKey';
import RemoteSelect from '@/components/RenderForm/remoteSelect'
import {
    Row,
    Col,
    Form,
    Input,

} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;


class review extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    
    //处理数据
    beforeCallback = (values, callback) => {
        const { rowData = {} } = this.props

        values['id'] = rowData.id

        callback(values);
    }

    componentDidMount() {


    }


    //关闭弹窗
    onCancel = () => {
        this.props.toggleWin('reviewshow');
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const span = 24;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '回复评论',
            method: api.save_review,
            visible: this.props.reviewshow,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.props.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style'>
                        <Row style={{ marginTop: '16px',padding:'20px' }}>
                            <Col span={span}>
                                <FormItem   >
                                    {getFieldDecorator('reply', {
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <TextArea rows={4} maxLength="30" />
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

export default Form.create()(review)