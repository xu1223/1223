import React from 'react'
import {
    Button,
    Form,
    Input,
    message,
    Spin,
    Switch,
    Icon,
    Select,
    Tooltip,
} from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
import { formItemLayout5, } from 'config/localStoreKey';
import './index.less'
import api from "@/fetch";
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            lotterydata: [{
                mony: '1',
                coupons: '22'
            }, {
                mony: '1',
                coupons: '22'
            }]

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
            const {
                lotterydata
            } = this.state
            let num = 0
            lotterydata.map((item) => {
                num += Number(item.mony)
            })
            console.log(num,'22')
            if (num != 100) {
                message.error('请设置中奖率等于100')
                return
            }
            console.log(this.state.lotterydata, 222222222)

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
    handleChange = (e, index) => {
        const {
            lotterydata
        } = this.state
        lotterydata[index]['coupons'] = e
        this.setState({
            lotterydata
        })
    }
    InputChange = (e, index) => {
        const {
            lotterydata
        } = this.state
        lotterydata[index]['mony'] = e.target.value
        this.setState({
            lotterydata
        })
    }
    delete = (index) => {
        const {
            lotterydata
        } = this.state
        this.setState({
            lotterydata: lotterydata.splice(1, index )
        })
    }
    addlottery = () => {
        const {
            lotterydata
        } = this.state
        if (lotterydata.length > 4) {
            message.error('最多添加5条数据')
            return
        }
        lotterydata.push({
            mony: '',
            coupons: ''
        })
        this.setState({
            lotterydata
        })
    }



    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            setting = {},
            loading,
            lotterydata = []
        } = this.state
        return (
            <Spin spinning={loading}>
                <div className="header-tool">
                    <p>营销抽奖</p>
                </div>
                <div className="Basic-main">
                    {
                        !loading ? <Form className="Basic-form">

                            <div className="Parameter-item" id="link1">
                                <p>开关控制</p>
                                <div style={{ width: '13%' }}>
                                    <FormItem label='前台浮窗开关' {...formItemLayout5}  >
                                        {getFieldDecorator(`open`, {
                                            initialValue: setting.open || '',
                                        })(
                                            <Switch defaultChecked={setting.open == 1}></Switch>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                            <div className="Parameter-item" id="link2">
                                <p>
                                    抽奖数据
                                    <Tooltip placement="topLeft" title="最多可设置5个奖项，所有奖项的中奖概率值之和需为100%">
                                        <Icon className="parameter-question" type="question-circle" />
                                    </Tooltip>
                                </p>
                                <FormItem label='奖项设置'  >
                                    {
                                        lotterydata.map((item, index) => {
                                            return <div className="lottery-item">
                                                <Select style={{ width: '150px' }} defaultValue={item.coupons} onChange={(e) => this.handleChange(e, index)}>
                                                    <Option value="11">11</Option>
                                                    <Option value="22">22</Option>
                                                </Select>
                                                <Input style={{ width: '150px', margin: '0 15px' }} addonAfter="%" defaultValue={item.mony} onChange={(e) => this.InputChange(e, index)}></Input>
                                                <Icon onClick={() => this.delete(index)} type="delete" />
                                            </div>
                                        })
                                    }
                                    <a className="lottery-add" onClick={() => this.addlottery()}><Icon type="plus-square" /></a>
                                </FormItem>





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