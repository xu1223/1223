import React from 'react'
import {
    Button,
    Col,
    Form,
    Input,
    message,
    Spin,
} from 'antd';
const FormItem = Form.Item;
import './index.less'
import api from "@/fetch";
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
        }
    }
    componentDidMount = () => {
        api.order.get_setting_list({ type: 2 }).then((res) => {
            if (res) {
                this.setState({
                    setting: res.resultData.setting,
                })
            }
        })


    }

    save = () => {
        this.props.form.validateFields((err, values) => {


            return
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


        })
    }



    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            loading,
            setting = {}
        } = this.state
        return (
            <Spin spinning={loading}>
                <div className="header-tool">
                    <p>营销抽奖</p>
                </div>
                <div className="Basic-main">
                    <Form>
                        <div className="Parameter-item" id="link1">
                            <p>INS账号信息</p>
                            <div >
                                <div style={{ width: '50%' }}>
                                    <FormItem label='INS账号' >
                                        {getFieldDecorator(`open`, {
                                            initialValue: setting.open || '',
                                            rules: [{ required: true, message: '请输入INS账号 ' }],
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                    <FormItem label='账号地址' >
                                        {getFieldDecorator(`open`, {
                                            initialValue: setting.open || '',
                                        })(
                                            <Input></Input>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                        </div>


                        <div className="Parameter-item" id="link1">
                            <p>授权配置</p>
                            <div style={{ width: '50%' }}>
                                <FormItem label='app-id' >
                                    {getFieldDecorator(`open`, {
                                        initialValue: setting.open || '',
                                        rules: [{ required: true, message: '请输入app-id ' }],
                                    })(
                                        <Input></Input>
                                    )}
                                </FormItem>
                                <FormItem label='app-secret' >
                                    {getFieldDecorator(`open`, {
                                        initialValue: setting.open || '',
                                        rules: [{ required: true, message: '请输入app-secret ' }],
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
                </div>
            </Spin>
        )
    }
}

export default Form.create()(Decorate)