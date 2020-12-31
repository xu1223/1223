import React, {
    Component
} from 'react';

import {
    Form,
    Card,
    Row,
    Col,
    Input,

} from 'antd';
const FormItem = Form.Item;
import { formItemLayout3, formItemLayout2 } from 'config/localStoreKey';



export default class method_1 extends Component {
    static defaultProps = {};
    state = {

    }


    constructor(props, context) {
        super(props, context);
        //TODO：
        
    }
   
    render() {
        const {
            params,
            getFieldDecorator,
        } = this.props;
        return (
            <FormItem label="配送公式"
                {...formItemLayout2}>
                {getFieldDecorator("label", {
                    initialValue: params.pay_name || '',
                    rules: [{ required: false, message: '必填项' }],
                })(
                    <Card title="首重+续重（重量单位：KG，货币单位：USD）">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="基本参数设置" bordered={false}>
                                    <Row span={24}>
                                        <Col span={24}>
                                            <FormItem label="首重重量"
                                                {...formItemLayout3}>
                                                {getFieldDecorator("fheavy", {
                                                    initialValue: params.memo ? params.memo.fheavy : '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="首重价格"
                                                {...formItemLayout3}>
                                                {getFieldDecorator("fprice", {
                                                    initialValue: params.memo ? params.memo.fprice : '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="续重重量"
                                                {...formItemLayout3}>
                                                {getFieldDecorator("cheavy", {
                                                    initialValue: params.memo ? params.memo.cheavy : '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="续重价格"
                                                {...formItemLayout3}>
                                                {getFieldDecorator("cprice", {
                                                    initialValue:params.memo ? params.memo.cprice : '',
                                                    rules: [{ required: true, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="免运费设置" bordered={false}>
                                    <Row span={24}>
                                        <Col span={24}>
                                            <FormItem label="价格>="
                                                {...formItemLayout3}>
                                                {getFieldDecorator("freeship_price", {
                                                    initialValue: params.memo ? params.memo.freeship_price : '',
                                                    rules: [{ required: false, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="重量>="
                                                {...formItemLayout3}>
                                                {getFieldDecorator("freeship_weight", {
                                                    initialValue:params.memo ? params.memo.freeship_weight : '',
                                                    rules: [{ required: false, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="件数>="
                                                {...formItemLayout3}>
                                                {getFieldDecorator("freeship_number", {
                                                    initialValue: params.memo ? params.memo.freeship_number : '',
                                                    rules: [{ required: false, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <p style={{ textAlign: "center" }}>超过某一个值时将免运费</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="屏蔽设置" bordered={false}>
                                    <Row span={24}>
                                        <Col span={24}>
                                            <FormItem label="价格>="
                                                {...formItemLayout3}>
                                                {getFieldDecorator("hidden_price", {
                                                    initialValue: params.memo ? params.memo.hidden_price : '',
                                                    rules: [{ required: false, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="重量>="
                                                {...formItemLayout3}>
                                                {getFieldDecorator("hidden_weight", {
                                                    initialValue:params.memo ? params.memo.hidden_weight : '',
                                                    rules: [{ required: false, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="件数>="
                                                {...formItemLayout3}>
                                                {getFieldDecorator("hidden_number", {
                                                    initialValue:params.memo ? params.memo.hidden_number : '',
                                                    rules: [{ required: false, message: '必填项' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <p style={{ textAlign: "center" }}>超过某一个值时将不可用</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                )}
            </FormItem>
        )
    }
}