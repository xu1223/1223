import React, { Component } from 'react';

import {
    Form,
    Row,
    Select,
    Input,
    Modal,
    message,
    Button,
    Switch,
    Col,
    List,
} from 'antd';
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
import Base from '@/util/base.js'
import { formItemLayout1,formItemLayout1_l,formItemLayout2,formItemLayout} from 'config/localStoreKey'
import './index.less';
import api from 'fetch/api'
import { post } from 'fetch/request'


@Form.create()
export default class RestPwd extends Component {
    static defaultProps = {

    };
    state = {
        pwdLev:0
    };
    

    
    constructor(props, context) {
        super(props, context);
    }
    
    componentDidMount() {
    
    }

    handleOk = ()=>{
        const {
            form 
        } = this.props;
        form.validateFields((errors, values) => {
            const parmas = {
                id: localStorage.getItem('MANAGER_ID'),
                password_old: values.password_old,
                password:  values.password2
            }
            post(api.user_manager_reset,parmas).then(res=>{
                if(res.resultId == 1){
                    this.props.handleCancel()
                    Modal.success({
                        title: '系统提示',
                        content: '密码修改成功，请退出系统后再次登录系统',
                        onOk() {
                            Base.loginOut()
                        },
                    });
                    
                }else if(res.resultId == 1004){
                    message.error('原始密码错误！')
                }
            })
        })
        
    }

    //密码验证
	setPassWord = (e)=>{
		const value = e.target.value
        //要么全数字，要么全字母
        if(value == ''){
            this.setState({
                pwdLev : 0
            })
        }
        if(/^[a-zA-Z]+$/.test(value) || /[0-9]/.test(value)){
            this.setState({
                pwdLev : 1
            })
        //数字和字母组合
        }
        if(/^[a-zA-Z0-9]{4,23}$/.test(value)){
            this.setState({
                pwdLev : 2
            })
        //数字+字母组合，且有大小写或符号并且大于6位
        }
        if(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{5,}$/.test(value)){
            this.setState({
                pwdLev : 3
            })
        }
    }

    //验证码匹配
    validValue = (rule, value, callback) => {
        const {
            field
        } = rule;
        const {
            form
        } = this.props;
        let pwd1 = form.getFieldValue('password1');
        if(pwd1 == value){
            callback()
        }else{
            callback('两次密码输入必须一致');
        }
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const {
            pwdLev
        } = this.state;
        //TODO:  modal 参数 其中beforeCallback 是可选的
        const modalProp = {
            onOk: this.handleOk,
            title: "重置密码",
            width: 610,
            onCancel : this.props.handleCancel,
            visible:this.props.visibleKey,
            ...this.props
        }
        
        return (
            <Modal
                {...modalProp}
                >
                <Row className = "resetPwd-pd">
                    <Col span = {14}>
                        <FormItem label = "原始密码" {...formItemLayout1}>
                            {getFieldDecorator('password_old', {
                                rules: [{ required: true, message: '请输入验证码'}]
                            })(
                                <Input.Password  type="password" placeholder="请输入原始密码"  />
                            )}
                        </FormItem>
                    </Col>
                    <Col span ={8}></Col>
                    <Col span = {14}>
                        <FormItem label = "新密码"{...formItemLayout1}>
                            {getFieldDecorator('password1', {
                                rules: [{ required: true, message: '请输入验证码！' }],
                            })(
                                <Input.Password  type="password" placeholder="请设置密码" onChange = {(e)=>this.setPassWord(e)} />
                            )}
                        </FormItem>
                    </Col>
                    
                    <Col span ={10}>
                        <div className = "pwdVerify">
                            <div style = {{background: pwdLev > 0 ? "#FF8684" : "#ccc"}}></div>
                            <div style = {{background: pwdLev > 1 ? "#FFA93A" : "#ccc"}}></div>
                            <div style = {{background: pwdLev > 2 ? "#19A526" : "#ccc"}}></div>
                            <span>弱/中/强</span>
                        </div>
                    </Col>
                    <Col span = {14}>
                        <FormItem label = "确认密码" {...formItemLayout1}>
                            {getFieldDecorator('password2', {
                                rules: [{ required: true, message: '请输入验证码！' },
                                { validator: this.validValue }
                            ],
                            })(
                                <Input.Password type="password" placeholder="请输入确认密码" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                
            </Modal>
        )
    }
}