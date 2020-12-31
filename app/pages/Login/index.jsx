import React from 'react'
import './index.less';
import {
    Form,
    Input,
    Button,
    message,
    Col,
} from 'antd';
import api from '@/fetch/api';
import { get, post } from '@/fetch/request'
import { getItem, setItem, getAccesstoken } from '@/util'

const FormItem = Form.Item;
@Form.create()
class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false
        }
    }
    componentDidMount() {

        getAccesstoken()
        if (getItem('MEMBER_TOKEN') && getItem('ACCESS_TOKEN') && getItem('USE_INFO')) {
            this.props.router.push('personalDescriptions')
        }
    }
    // 登录提交
    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('请输入账号和密码')
                return false;
            }

            this.setState({
                loading: true
            })
            values['access_token'] = getItem('ACCESS_TOKEN')
            post(process.env['APP_HOST_URL_API_USER'] + api.login, values).then((res) => {

                setItem('USE_INFO', res.resultData || '')
                setItem('MEMBER_TOKEN', res.resultData.member_token || '')
                setItem('UUID', res.resultData.member_uuid || '')
                this.setState({
                    loading: false
                }, () => {
                    this.props.router.push('personalDescriptions')
                })
            })
        });
    }
    render() {
        const {
            getFieldDecorator,
        } = this.props.form;
        const {
            loading
        } = this.state
        return (
            <div className="">
                <div className="login-bg">

                </div>
                <div id="login-wrap">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div>
                            <Col span={24}>
                                <FormItem label="账号">
                                    {getFieldDecorator('mobile', {
                                        rules: [{ required: false, message: '请输入账号！' }],
                                    })(
                                        <Input size="large" placeholder="请输入账号" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="密码">
                                    {getFieldDecorator('password', {
                                        rules: [{ required: false, message: '请输入登录密码！' }],
                                    })(
                                        <Input.Password size="large" className="login-input" type="password" placeholder="登录密码" />
                                    )}
                                </FormItem>
                            </Col>

                        </div>

                        <Col span={24}>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} disabled={loading} >
                                    登录
                            </Button>
                            </FormItem>
                        </Col>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login