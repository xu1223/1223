import React from 'react'
import {
    Button,
    Form,
    Input,
    message,
    Spin,
    Switch,
    Anchor,
    Col,
    Icon,
    Tooltip
} from 'antd';
const { Link } = Anchor;
const FormItem = Form.Item;
import { formItemLayout5, } from 'config/localStoreKey';
import './index.less'
import api from "@/fetch";
import Checkbox from './Component/Checkbox'
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
        api.order.get_setting_list({ type: 2 }).then((res) => {
            if (res) {
                this.setState({
                    setting: res.resultData.setting,
                    site: res.resultData.setting.site,
                    email_notifier: res.resultData.setting.email_notifier,
                    password_protection: res.resultData.setting.password_protection,
                    verification_code: res.resultData.setting.verification_code,
                    browser_languages: res.resultData.browser_languages,
                    country: res.resultData.country,
                    loading: false,
                })
            }
        })


    }

    save = () => {
        this.props.form.validateFields((err, values) => {
            // if (err) {
            //     return
            // }
            let {
                browser_language_ids,
                country_ids,
                setting
            } = this.state
            for (var key in values) {
                if (typeof values[key] == 'boolean') {
                    values[key] = values[key] ? 1 : 0
                }
                if (key.indexOf('#') != -1) {
                    let arr = key.split("#")
                    if (values[key]) {
                        setting[arr[0]][arr[1]] = values[key]
                    }
                } else {
                    setting[key] = values[key]
                }
            }
            country_ids = country_ids.join(",")
            browser_language_ids = browser_language_ids.join(",")
            api.order.save_setting({
                setting: JSON.stringify(setting),
                type: 2,
                country_ids,
                browser_language_ids,
            }).then((res) => {
                if (res) {
                    message.success('保存成功')
                }
            })

            console.log(setting, 'valuesvalues')
        })
    }

    allcheckdata = (val, name) => {
        this.setState({
            [name]: val
        })
    }

    onChange = (val) => {
        this.setState({
            password: val
        })
    }


    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            setting = {},
            verification_code = {},
            password_protection = {},
            email_notifier = {},
            site = {},
            browser_languages = [],
            country = [],
            loading,
            password
        } = this.state
        return (
            <Spin spinning={loading}>
                <div className="header-tool">
                    <p>参数设置</p>
                </div>
                <div className="Basic-main">
                    {
                        !loading ? <Form className="Basic-form">
                            {/* <Anchor style={{ position: 'fixed', top: '120px', right: '0' }}>
                                <Link href="#link1" title="前台控制" />
                                <Link href="#link2" title="屏蔽国家IP" />
                                <Link href="#link3" title="屏蔽浏览器" />
                                <Link href="#link4" title="密码保护" />
                                <Link href="#link5" title="验证码" />
                                <Link href="#link6" title="邮件提醒" />
                                <Link href="#link7" title="URL规则" />
                                <Link href="#link8" title="分页设置" />
                            </Anchor> */}
                            <div className="Parameter-item" id="link1">
                                <p>前台控制</p>
                                <div style={{ width: '13%' }}>
                                    <FormItem label='网站开关' {...formItemLayout5}  >
                                        {getFieldDecorator(`open`, {
                                            initialValue: setting.open || '',
                                        })(
                                            <Switch defaultChecked={setting.open == 1}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='前台缓存' {...formItemLayout5}  >
                                        {getFieldDecorator(`cache`, {
                                            initialValue: setting.cache || '',
                                        })(
                                            <Switch defaultChecked={setting.cache == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                            <div className="Parameter-item" id="link2">
                                <p>屏蔽国家IP <Tooltip placement="topLeft" title="选中国家IP不允许访问网站">
                                    <Icon className="parameter-question" type="question-circle" />
                                </Tooltip> </p>
                                <Checkbox allcheckdata={this.allcheckdata} platformNameList={country} name='country_ids'></Checkbox>
                            </div>
                            <div className="Parameter-item" id="link3">
                                <p>屏蔽浏览器 <Tooltip placement="topLeft" title="选中浏览器语言不允许访问网站">
                                    <Icon className="parameter-question" type="question-circle" />
                                </Tooltip></p>
                                <Checkbox allcheckdata={this.allcheckdata} platformNameList={browser_languages} name='browser_language_ids'></Checkbox>
                            </div>
                            <div className="Parameter-item" id="link4">
                                <p>密码保护  <Tooltip placement="topLeft" title="开启后被屏蔽用户可输入访问密码进行访问">
                                    <Icon className="parameter-question" type="question-circle" />
                                </Tooltip></p>
                                <div className="Parameter-grid1" >
                                    <FormItem label='' {...formItemLayout5}  >
                                        {getFieldDecorator(`password_protection#open`, {
                                            initialValue: password_protection.open || '',
                                        })(
                                            <Switch onChange={this.onChange} defaultChecked={password_protection.open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='访问提示' {...formItemLayout5}  >
                                        {getFieldDecorator(`password_protection#access_to_prompt`, {
                                            initialValue: password_protection.access_to_prompt || '',
                                            rules: [{ required: true, message: `请输入访问提示` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    {
                                        (password_protection.open == 1 || password) ? <FormItem label='访问密码' {...formItemLayout5}  >
                                            {getFieldDecorator(`password_protection#access_to_password`, {
                                                initialValue: password_protection.access_to_password || '',
                                                rules: [{ required: true, message: `请输入访问密码` }],
                                            })(
                                                <Input></Input>
                                            )}
                                        </FormItem> : ''
                                    }

                                </div>
                            </div>
                            <div className="Parameter-item" id="link5">
                                <p>验证码 <Tooltip placement="topLeft" title="开启后需要输入验证码才能完成以下操作">
                                    <Icon className="parameter-question" type="question-circle" />
                                </Tooltip></p>
                                <div className="Parameter-grid2">
                                    <FormItem label='登录' {...formItemLayout5}  >
                                        {getFieldDecorator(`verification_code#login_open`, {
                                            initialValue: verification_code.login_open || '',
                                        })(
                                            <Switch defaultChecked={verification_code.login_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='注册' {...formItemLayout5}  >
                                        {getFieldDecorator(`verification_code#register_open`, {
                                            initialValue: verification_code.register_open || '',
                                        })(
                                            <Switch defaultChecked={verification_code.register_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='询盘' {...formItemLayout5}  >
                                        {getFieldDecorator(`verification_code#inquiry_open`, {
                                            initialValue: verification_code.inquiry_open || '',
                                        })(
                                            <Switch defaultChecked={verification_code.inquiry_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='评论' {...formItemLayout5}  >
                                        {getFieldDecorator(`verification_code#comment_open`, {
                                            initialValue: verification_code.comment_open || '',
                                        })(
                                            <Switch defaultChecked={verification_code.comment_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                            <div className="Parameter-item" id="link6">
                                <p>邮件提醒： <Tooltip placement="topLeft" title="开启指定类型邮件将自动向用户发送邮件">
                                    <Icon className="parameter-question" type="question-circle" />
                                </Tooltip></p>
                                <div className="Parameter-grid2">
                                    <FormItem label='注册' {...formItemLayout5}  >
                                        {getFieldDecorator(`email_notifier#register_open`, {
                                            initialValue: email_notifier.register_open || '',
                                        })(
                                            <Switch defaultChecked={email_notifier.register_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='加购' {...formItemLayout5}  >
                                        {getFieldDecorator(`email_notifier#add_cart_open`, {
                                            initialValue: email_notifier.add_cart_open || '',
                                        })(
                                            <Switch defaultChecked={email_notifier.add_cart_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='未支付' {...formItemLayout5}  >
                                        {getFieldDecorator(`email_notifier#order_unpaid_open`, {
                                            initialValue: email_notifier.order_unpaid_open || '',
                                        })(
                                            <Switch defaultChecked={email_notifier.order_unpaid_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                    <FormItem label='已发货' {...formItemLayout5}  >
                                        {getFieldDecorator(`email_notifier#shipped_open`, {
                                            initialValue: email_notifier.shipped_open || '',
                                        })(
                                            <Switch defaultChecked={email_notifier.shipped_open == 1 ? true : false}></Switch>
                                        )}
                                    </FormItem>
                                </div>

                            </div>
                            <div className="Parameter-item" id="link7">
                                <p>URL规则</p>
                                <div className="Parameter-grid3">
                                    <FormItem label='商品分类'   >
                                        {getFieldDecorator(`site#dash_l`, {
                                            initialValue: site.dash_l || '',
                                            rules: [{ required: true, message: `请输入商品分类` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='商品分类前缀'   >
                                        {getFieldDecorator(`site#category_prefix`, {
                                            initialValue: site.category_prefix || '',
                                            rules: [{ required: true, message: `请输入商品分类前缀` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='商品'   >
                                        {getFieldDecorator(`site#dash_i`, {
                                            initialValue: site.dash_i || '',
                                            rules: [{ required: true, message: `请输入商品` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='商品前缀'  >
                                        {getFieldDecorator(`site#product_prefix`, {
                                            initialValue: site.product_prefix || '',
                                            rules: [{ required: true, message: `请输入商品前缀` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='文章分类'   >
                                        {getFieldDecorator(`site#dash_c`, {
                                            initialValue: site.dash_c || '',
                                            rules: [{ required: true, message: `请输入文章分类` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='文章' >
                                        {getFieldDecorator(`site#dash_a`, {
                                            initialValue: site.dash_a || '',
                                            rules: [{ required: true, message: `请输入文章` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='搜索' >
                                        {getFieldDecorator(`site#dash_s`, {
                                            initialValue: site.dash_s || '',
                                            rules: [{ required: true, message: `请输入搜索` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='标签'  >
                                        {getFieldDecorator(`site#dash_t`, {
                                            initialValue: site.dash_t || '',
                                            rules: [{ required: true, message: `请输入标签` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='评论' >
                                        {getFieldDecorator(`site#dash_r`, {
                                            initialValue: site.dash_r || '',
                                            rules: [{ required: true, message: `请输入评论` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>


                                </div>

                            </div>
                            <div className="Parameter-item" id="link8">
                                <p>分页设置</p>
                                <div className="Parameter-grid3">
                                    <FormItem label='商品分页数'   >
                                        {getFieldDecorator(`page_size`, {
                                            initialValue: setting.page_size || '',
                                            rules: [{ required: true, message: `请输入商品分页数` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='分页递增数'   >
                                        {getFieldDecorator(`page_range`, {
                                            initialValue: setting.page_range || '',
                                            rules: [{ required: true, message: `请输入分页递增数` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='后台分页数'   >
                                        {getFieldDecorator(`page_size_admin`, {
                                            initialValue: setting.page_size_admin || '',
                                            rules: [{ required: true, message: `请输入后台分页数` }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                </div>

                            </div>
                            <div className="shop-footer-btn">
                                <Button type="primary" onClick={() => this.save()}>保存</Button>
                            </div>


                        </Form>
                            : ''
                    }
                </div>
            </Spin>
        )
    }
}

export default Form.create()(Decorate)