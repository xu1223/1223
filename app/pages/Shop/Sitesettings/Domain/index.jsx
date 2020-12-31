import React from 'react'
import {
    Button,
    Form,
    Input,
    message,
    Switch,
    Modal
} from 'antd';
const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
import './index.less'
import api from "@/fetch";
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            country_ids: [],
            browser_language_ids: []
        }
    }
    componentDidMount = () => {
        this.init()


    }
    init = () => {
        api.order.manager_domain({}).then((res) => {
            if (res) {
                this.setState({
                    free_domain: res.resultData.free_domain,
                    main_domain: res.resultData.main_domain,
                    maintext: res.resultData.main_domain.domain,
                    freetext: res.resultData.free_domain.domain,
                })
            }
        })
    }

    onredirectChange = (e) => {
        let that = this
        confirm({
            title: '',
            content: '请再次确认是否重定向至主域名',
            onOk() {
                api.order.redirect_main_domain({ is_redirect: e ? 1 : 0 }).then((res) => {
                    message.success('重定向成功')
                    that.init()
                })
            },
            onCancel() {
            },
        });
    }
    onHttpsChange = (e) => {
        let that = this
        if (e) {
            this.setState({
                httpvisible: true
            })
        } else {
            confirm({
                title: '',
                content: '请再次确认是否关闭Https',
                onOk() {
                    api.order.open_https({ open_https: 0 }).then((res) => {
                        message.success('关闭成功')
                        that.init()
                    })
                },
                onCancel() {
                },
            });
        }

    }
    handlehttpOk = () => {
        let key = this.props.form.getFieldValue('key')
        let certificate = this.props.form.getFieldValue('certificate')
        if (!key || !certificate) {
            message.error('请输入参数')
            return
        }
        api.order.open_https({
            open_https: 1,
            key,
            certificate
        }).then((res) => {
            if (res) {
                this.setState({
                    httpvisible: false
                })
                message.success('成功')
                this.init()
            }
        })

    }
    handleOk = () => {
        const {
            maintext
        } = this.state
        let that = this
        confirm({
            title: '绑定操作无法撤销',
            content: '请再次确认域名是否已经解析正确',
            onOk() {
                api.order.bind_domain({ domain: maintext }).then((res) => {
                    message.success('绑定成功')
                    that.setState({
                        visible: false
                    })
                    that.init()
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });


    }
    mainvalue = (e) => {
        this.setState({
            maintext: e.target.value
        })
    }
    freevalue = (e) => {
        this.setState({
            freetext: e.target.value
        })
    }
    mainchange = () => {
        this.setState({
            visible: true,
        })
    }
    freechange = () => {
        const {
            freetext
        } = this.state
        let that = this
        confirm({
            title: '只允许修改一次免费域名',
            content: '请再次确定',
            onOk() {
                api.order.edit_free_domain({ domain: freetext }).then((res) => {
                    message.success('修改成功')
                    that.init()
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            httpvisible: false
        })
    }
    render() {

        const {
            visible = false,
            httpvisible = false,
            main_domain = {},
            free_domain = {},
            maintext,
            freetext
        } = this.state
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <div className="Domain-main">
                <Form >

                    <div className="header-tool">
                        <p>域名绑定</p>
                    </div>
                    <div className="Domain-item">
                        <p>主域名</p>
                        <div style={{ display: 'flex', width: '500px' }}>
                            <FormItem label={''}  >
                                {getFieldDecorator(`main`, {
                                    initialValue: maintext,
                                })(
                                    <Input disabled={main_domain.domain} onChange={(e) => this.mainvalue(e)} />
                                )}
                            </FormItem>

                            <Button onClick={this.mainchange} disabled={main_domain.domain}>绑定</Button>
                        </div>
                        <span className="title">例子: 域名请填写 : example.com,请不要加 www</span>
                        <div style={{ marginTop: '20px' }}>
                            <span>Https状态：</span>
                            {
                                (main_domain.open_https || main_domain.open_https == 0) ? <FormItem label={''}  >
                                    {getFieldDecorator(`open_https`, {
                                        initialValue: main_domain.open_https == 1 ? true : false,
                                    })(
                                        <Switch defaultChecked={main_domain.open_https == 1 ? true : false} onChange={e => this.onHttpsChange(e)} ></Switch>
                                    )}
                                </FormItem>
                                    : ''
                            }


                        </div>

                    </div>
                    <div className="Domain-item">
                        <p>免费域名</p>
                        <div style={{ display: 'flex', width: '500px' }}>
                            <Input disabled={free_domain.modified_at} value={freetext} addonAfter={free_domain.domain_suffix} defaultValue={free_domain.domain} onChange={(e) => this.freevalue(e)} />
                            <Button disabled={free_domain.modified_at} onClick={this.freechange}>修改</Button>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <span>重定向至主域名：</span>
                            {
                                (free_domain.is_redirect || free_domain.is_redirect == 0) ? <FormItem FormItem FormItem label={''}  >
                                    {getFieldDecorator(`is_redirect`, {
                                        initialValue: free_domain.is_redirect == 1 ? true : false,
                                    })(
                                        <Switch defaultChecked={free_domain.is_redirect == 1 ? true : false} onChange={e => this.onredirectChange(e)} ></Switch>
                                    )}
                                </FormItem>
                                    : ''
                            }

                        </div>
                    </div>


                    <Modal
                        title="绑定提示"
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText='继续绑定'
                    >
                        <p>
                            若您尚未拥有自己的一级域名，可前往进行域名购买<br />
                    在您的域名提供商处添加域名解析<br />
                    1.根据域名服务商提供的账号及密码登录到域名服务商提供的管理平台<br />
                    2.点击“域名管理”<br />
                    3.找到需要设置的域名<br />
                    4.点击“域名解析”<br />
                    5.添加CNAME记录，主机记录为www,记录值为域名地址<br />
                    注：若您的域名解析配置中已经存在主机名为www的解析记录，须先将其删除再行步骤;若您仍然需要使用之前的www解析记录解析到您已有的网站而不能删除，建议您注册新的域名来绑定。
                    <br /> 6.保存后等待解析生效即可，最长解析时间不超过72小时。<br />
                    以上步骤仅为参考，具体操作以注册商提供的方式为准。<br />
                            <br /> 说明:系统会分析您的域名,避免域名输错的情况,但是一旦绑定,便不能再修改.此外,若解析成功后,我们这里分析域名有错,可能是域名服务商解析域名延迟导致。
                        </p>

                    </Modal>

                    {httpvisible && <Modal
                        title="Https信息"
                        visible={httpvisible}
                        onOk={this.handlehttpOk}
                        onCancel={this.handleCancel}
                        okText='保存'
                    >
                        <FormItem FormItem FormItem label={'密钥(KEY)'}  >
                            {getFieldDecorator(`key`, {
                                initialValue: '',
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                        <FormItem FormItem FormItem label={'证书(PEM格式)'}  >
                            {getFieldDecorator(`certificate`, {
                                initialValue: '',
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>

                    </Modal>
                    }


                </Form>
            </div >
        )
    }
}

export default Form.create()(Decorate)