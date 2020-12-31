import React, { Component } from 'react';
import api from '@/fetch';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import Ueditor from 'components/Ueditor/index_pub';
import {
    Row,
    Col,
    Form,
    Input,
    Radio,
    Icon,
    Tooltip
} from 'antd';
const FormItem = Form.Item;

class add extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    //提交数据
    beforeCallback = (values, callback) => {
        const { rowData = {} } = this.context
        let param = {
            id: rowData.id,
            something: ['', '', '']
        }
        for (var i = 1; i < 4; i++) {
            param.something[i - 1] = UE.getEditor(`wapcontainer${i}`)
                ? UE.getEditor(`wapcontainer${i}`).getContent()
                : ""
        }
        // param['something'].map((item, index) => {
        //     item = UE.getEditor(`wapcontainer${index + 1}`)
        //         ? UE.getEditor(`wapcontainer${index + 1}`).getContent()
        //         : "";
        // })
        api.order.edit_payment_description({ ...param }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('description');
            }
        })
        // callback(values);
    }

    componentDidMount() {
        const { rowData = {} } = this.context

    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('description');
    }

    // 选择图片
    uploadchange = (value) => {

        this.props.form.setFieldsValue({ ...value })
    }


    render() {
        const {
            getFieldDecorator
        } = this.props.form;


        const {
            rowData = {},
        } = this.context;
        const {
            something = []
        } = rowData

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '支付详情',
            method: api.save_message_sign,
            visible: this.context.description,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
            width: '1200px'
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{ padding: '20px' }}>
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <FormItem label={<span>支付方式提示 <Tooltip title="开启后将在前台进行显示">
                                    <Icon style={{ color: '#4486F7' }} type="question-circle" />
                                </Tooltip></span>} >
                                    <Ueditor id='wapcontainer1'
                                        richText={something[0] ? something[0] : ''} />
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label={<span>支付成功页面提示 <Tooltip title="富文本内容将在前台支付成功页面进行显示，可为空">
                                    <Icon style={{ color: '#4486F7' }} type="question-circle" />
                                </Tooltip></span>} >
                                    <Ueditor id='wapcontainer2'
                                        richText={something[1] ? something[1] : ''} />
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label={<span>支付失败页面提示<Tooltip title="富文本内容将在前台支付失败页面进行显示，可为空">
                                    <Icon style={{ color: '#4486F7' }} type="question-circle" />
                                </Tooltip></span>} >
                                    <Ueditor id='wapcontainer3'
                                        richText={something[2] ? something[2] : ''} />
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