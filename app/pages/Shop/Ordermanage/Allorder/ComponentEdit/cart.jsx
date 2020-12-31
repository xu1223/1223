import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2'
import api from "@/fetch/api"
import { post } from '@/fetch/request'
import {
    Row,
    Col,
    Form,
    Input,
    message
} from 'antd';
const FormItem = Form.Item

class Mark extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }
    //  根据邮箱获取数据 
    beforeCallback = (values, callback) => {
        post(api.get_customer_carts, values).then(res => {
            if (res) {
                if (res.resultId == 200) {
                    const {
                        shopdata
                    } = this.context
                    let param = []
                    let selectedRows = res.resultData
                    if(selectedRows.length==0){  
                        message.error('购物车数量为空')
                        return false
                    }
                    selectedRows.map(item => {
                        shopdata.map(v => {
                            if (v.product_id == item.product_id) {
                                item['isshow'] = true
                            }
                        })

                        if (!item['isshow']) {
                            item['id'] = 0
                            item['quantity'] = 1
                            item['transactionprice'] = item['quantity'] * item['price']
                            item['total_weight'] = item['quantity'] * item['weight']
                            param.push(item)
                        }
                    })
                    this.context.toggshop(param)
                    this.context.toggleWin('visibleMark');
                } else {
                    message.error('邮箱不存在')
                }
            }
        })

    }

    render() {
        const {
            visibleMark,
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: visibleMark,
            winType: 1,
            onCancel: () => this.context.toggleWin('visibleMark'),
            method: api.get_customer_carts,
            form: this.props.form,
            ...this.context.batConfig,
        };

        const {
            getFieldDecorator
        } = this.props.form;

        return <ModalComp {...modalProp} >
            <Form style={{ padding: '20px' }}>
                <p>购物车</p>
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '请输入邮箱' }],
                    })(

                        <Input />
                    )}
                </FormItem>
            </Form>
        </ModalComp>
    }
}


export default Form.create()(Mark)