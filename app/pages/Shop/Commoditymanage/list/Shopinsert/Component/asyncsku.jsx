import React, { Component } from 'react'
import { ListContext } from '@/config/context';
import { formItemLayout3 } from '@/config/localStoreKey'
import { ModalComp } from '@/components/ModalComp2'
import {
    connect
} from 'react-redux';
import { WinMessage } from '@/components/Confirm/index.js';
import {
    Row,
    Col,
    Input,
    Form,
    Switch,
} from 'antd';
const FormItem = Form.Item;
/**
 * 关联sku
 */
class asyncsku extends Component {
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {


        }
    }
    componentDidMount() {

    }
    // 处理数据
    beforeCallback = (values, callback) => {
        let {
            dommodityAttribute
        } = this.context
        if (dommodityAttribute.length == 0) {  //判断是否设置了属性
            WinMessage({
                content: '请先设置属性数据',
                timer: 5
            })
            return false
        }
        let istset = '^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$'  //金额验证只允许输入数字加小数点
        let isnuber = '^[0-9]*[1-9][0-9]*$'  //只允许输入数字
        if (values.price.match(istset) == null && values.price != '') {
            WinMessage({
                content: '您输入的金额有误',
                timer: 5
            })
            return false
        } else if (values.show_price.match(istset) == null && values.show_price != '') {
            WinMessage({
                content: '您输入的金额有误',
                timer: 5
            })
            return false
        } else if (values.weight.match(istset) == null && values.weight != '') {
            WinMessage({
                content: '您输入的重量有误',
                timer: 5
            })
            return false
        } else if (values.quantity.match(isnuber) == null && values.quantity != '') {
            WinMessage({
                content: '您输入的库存有误',
                timer: 5
            })
            return false
        }


        dommodityAttribute.map(item => {
            if (values.zsku) {
                item.zsku = values.zsku
            }
            if (values.price) {
                item.price = values.price || 0
            }
            if (values.show_price) {
                item.show_price = values.show_price || 0
            }
            if (values.weight) {
                item.weight = values.weight || 0
            }
            if (values.quantity) {
                item.quantity = values.quantity || 0
            }
            item.status = values.status ? 1 : 2

        })
        this.props.commforceUpdate(this.props.this);
        this.context.toggleWin('visibleAddress', {});
    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('visibleAddress', {});
    }
    render() {
        const {
            form
        } = this.props
        const {
            getFieldDecorator,
        } = form;
        const modalProp = {
            title: "子sku同步",
            winType: 2,
            beforeCallback: this.beforeCallback,
            onCancel: this.onCancel,
            // method: type == '1' ? api.addCustomList : api.editCustomList,
            visible: this.context.visibleAddress,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };
        return (
            <ModalComp {...modalProp}>
                <Row>
                    <Col span={20}>
                        <FormItem {...formItemLayout3} label='实际售价【 ＄ 】 ：'>
                            {getFieldDecorator('price', {
                                initialValue: '',
                            })(
                                <Input onkeyup={() => this.clearNoNum(this)} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <FormItem {...formItemLayout3} label='市场价【 ＄ 】 ：'>
                            {getFieldDecorator('show_price', {
                                initialValue: '',
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <FormItem {...formItemLayout3} label='重量【 KG 】 ：'>
                            {getFieldDecorator('weight', {
                                initialValue: '',
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <FormItem {...formItemLayout3} label='库存 ：'>
                            {getFieldDecorator('quantity', {
                                initialValue: '',
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <FormItem {...formItemLayout3} label='状态 ：'>
                            {getFieldDecorator('status', {
                                initialValue: '',
                            })(
                                <Switch checkedChildren="上架" unCheckedChildren="下架" />
                            )}
                            <a href="javascript:void(0);" style={{ marginLeft: '10px' }}>定时上架</a>
                            <div style={{ float: 'right' }}>
                                <a href="javascript:void(0);">23 小时 16 分钟 44 秒 </a>
                                <span style={{ clor: '#4F4F4F' }}> 后自动上架</span>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
            </ModalComp>

        )
    }

}
export default Form.create()(connect(
    (state) => {
        return {}
    }
)(asyncsku))