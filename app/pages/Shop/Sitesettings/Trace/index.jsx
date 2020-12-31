import React from 'react'
import {
    Button,
    Form,
    Select,
    Modal,
    Col,
    Row,
    Input,
    message,
    Upload,
    Spin,
    Icon,
    Tabs
} from 'antd';
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;
const Option = Select.Option;
const FormItem = Form.Item;
import { formItemLayout1 } from 'config/localStoreKey';
import './index.less'
import { Tracedata } from './config/index'
import api from "@/fetch";
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        }
    }
    componentDidMount = () => {
        api.order.get_setting_list({ type: 3 }).then((res) => {
            if (res) {
                let rowdata = res.resultData.setting
                // rowdata.google_code
                let gtm_code = rowdata.google_code.gtm_code
                if (gtm_code) {
                    for (var key in gtm_code) {
                        rowdata.google_code[key] = gtm_code[key]
                    }
                }
                this.setState({
                    setting: rowdata,
                    facabook_code: rowdata.facabook_code,
                    google_code: rowdata.google_code,
                })
            }
        })
    }
    save = () => {
        this.props.form.validateFields((err, values) => {
            const {
                setting = {},
            } = this.state
            for (var key in values) {
                if (key.indexOf('#') != -1) {
                    let arr = key.split("#")
                    if (arr[0] == 'google_code' && (arr[1] == 'head_code' || arr[1] == 'body_code')) {
                        setting[arr[0]]['gtm_code'][arr[1]] = values[key]
                    } else {
                        setting[arr[0]][arr[1]] = values[key]
                    }
                } else {
                    setting[key] = values[key]
                }
            }
            api.order.save_setting({
                type: 3,
                setting: JSON.stringify(setting)
            }).then((res) => {
                if (res) {
                    message.success('保存成功')
                }
            })
        })
    }

    formchange = (item, name) => {
        const {
            getFieldDecorator
        } = this.props.form;
        let rowData = this.state[name] || {}
        let html = <TextArea rows={4}></TextArea>
        return <Col span={24}>
            <FormItem label={item.name}  >
                {getFieldDecorator(`${name}#${item.key}`, {
                    initialValue: rowData[item.key] ? rowData[item.key] : '',
                })(
                    html
                )}
            </FormItem>
        </Col>

    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            setting = {},
        } = this.state

        return (
            <div>
                <div className="header-tool">
                    <p>统计跟踪</p>
                </div>
                <div className="Basic-main">

                    <Form className="Trace-form">
                        <Tabs defaultActiveKey="1" >
                            <TabPane tab="谷歌代码" key="1">

                                {
                                    Tracedata.google.map((item) => {
                                        return this.formchange(item, 'google_code')
                                    })
                                }

                            </TabPane>
                            <TabPane tab="Facabook代码" key="2">
                                {
                                    Tracedata.facabook.map((item) => {
                                        return this.formchange(item, 'facabook_code')
                                    })
                                }
                            </TabPane>
                            <TabPane tab="在线客服" key="3">
                                <FormItem label="在线客服代码"  >
                                    {getFieldDecorator(`online_customer_service_code`, {
                                        initialValue: setting['online_customer_service_code'] || '',
                                    })(
                                        <TextArea rows={4}></TextArea>
                                    )}
                                </FormItem>
                            </TabPane>
                        </Tabs>
                        <div className="shop-footer-btn">
                            <Button type="primary" onClick={() => this.save()}>保存</Button>
                        </div>

                    </Form>
                </div>

            </div>

        )
    }
}

export default Form.create()(Decorate)