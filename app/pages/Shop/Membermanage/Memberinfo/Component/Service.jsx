import React, { Component } from 'react';
import api from '@/fetch/api';
import { post } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option

class add extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    beforeCallback = (values, callback) => { //处理数据
        let data = ''
        this.props.listSelData.map(item=>{  //获取id值用字符串形式传递
            data += item
        })
        values.customer_ids = data
        callback(values);
    }

    componentDidMount() {
    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('visibleSku');
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            storagemanager = []
        } = this.props
        const {
            rowData = {},

        } = this.context;

        const span = 24;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '转移客服',
            method: api.transfer_to_manager,
            visible: this.context.visibleSku,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{padding:'40px'}}>
                        <Row style={{ marginTop: '16px' }}>
                            <Col span={span}>
                                <FormItem label="客服" {...formItemLayout4} >
                                    {getFieldDecorator('manager_id', {
                                        initialValue: rowData.manager_id || '',
                                        rules: [{ required: true, message: '必填项' }],
                                    })(
                                        <Select
                                            showSearch
                                            optionFilterProp='children'
                                        >
                                            {
                                                storagemanager.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </ModalComp>
        )
    }
}

export default Form.create()(add)