import React, { Component } from 'react';
import api from '@/fetch/api';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import RemoteSelect from '@/components/RenderForm/remoteSelect'
import {
    Row,
    Col,
    Form,
    Input,
    message, 

} from 'antd';
const FormItem = Form.Item;


class renderpass extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }


    componentDidMount() {
    }

 
    checkchange = (rule, value,callback) =>{  //判断修改密码长度
         if(value.length < 6){
            callback('输入长度必须大于6位数')
            return;
         }
         callback()
    }
    onCancel = () => { //关闭弹窗
        this.context.toggleWin('visible');
    }
    
    beforeCallback = (values, callback) => {   //提交数据
        const { initData = {} } = this.context
        values['customer_id']= initData.id
        callback(values);
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            // rowData = {},
        } = this.context;

        const span = 24;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            method: api.save_customer,
            visible: this.context.visible,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{padding:'40px'}}>
                        <Row style={{ marginTop: '16px' }}>
                            <Col span={span}>
                                <FormItem label="登录密码" {...formItemLayout4} >
                                    {getFieldDecorator('new_password', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '必填项' },{
                                            validator :  this.checkchange.bind(this)
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={span}>
                                <FormItem label="确认密码" {...formItemLayout4} >
                                    {getFieldDecorator('confirm_password', {
                                        initialValue: '',
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

export default Form.create()(renderpass)