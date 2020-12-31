import React, { Component } from 'react';

import {
    Form,
    Row,
    Col,
    message,
    Cascader,
    Modal
} from 'antd';
const FormItem = Form.Item;

import { formItemLayout6, formItemLayout4 } from 'config/localStoreKey'
import api from 'fetch/api'
import { post } from 'fetch/request'
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2';

class TransferProductsPage extends Component {
    static defaultProps = {

    };

    state = {
        categoryStr: [],
    }
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
    
        if (values.dest_category_id) {
            console.log(this.context.rowData, values, '===')
            let param = {}
            param.category_id = this.context.rowData.id
            param.dest_category_id = values.dest_category_id[values.dest_category_id.length - 1]
            console.log(param,'this.context.rowDatathis.context.rowData')
            callback(param);
        } else {
            message.info("请选择分类")
        }
    }

   
    // 获取下拉框选中值
    onChangeCategory = (value) => {
        this.setState({
            categoryStr: value
        })
    }
    // 关闭
    onCancel = () => {
        this.props.form.resetFields();
        this.context.toggleWin('visibleTransfer', {});
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const {
            ProductCategoryDataList,
        } = this.context;


        const modalProp = {
            wrapClassName: 'shop-Modal',
            beforeCallback: this.beforeCallback,
            closable: false,
            title: false,
            visible: this.context.visibleTransfer,
            onCancel: this.onCancel,
            form: this.props.form,
            method: api.transfer_category_product,
            ...this.context.batConfig,
        }
        return (

            <ModalComp
                {...modalProp}
            >
                <Form className="resetFormStyle" style={{ marginTop: '20px', overflow: 'hidden',padding:'20px' }} >
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="选择分类"
                                {...formItemLayout4}
                            >
                                {getFieldDecorator('dest_category_id', {
                                    rules: [{ required: false, message: '请选择分类' }],
                                })(
                                    <Cascader
                                        options={ProductCategoryDataList}
                                        expandTrigger="click"
                                        showSearch
                                        onChange={this.onChangeCategory}
                                        placeholder=""
                                        changeOnSelect
                                        fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </ModalComp>
            // <DrawerComp
            //     {...modalProp}
            // >

            // </DrawerComp >
        )
    }
}
export default Form.create()(TransferProductsPage)










