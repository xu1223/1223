import React, { Component } from 'react';
import {
    Form,
    Input,
    message,
} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
import {
    formItemLayout2,
} from 'config/localStoreKey';
import { ListContext } from '@/config/context'; //引入上下文
import {DrawerComp} from '@/components/ModalComp2';
import api from 'fetch/api';

class addRemarks extends Component {
    static defaultProps = {

    };

    static contextType = ListContext; //导入上下文 this.context
    state = {

    }

    constructor(props, context) {
        super(props, context);
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
        //这边对于 单个  和 多个可以进行操作
        let _values = {
            id : this.context.rowData.id,
            ...values
        }
        callback(_values);
    }

    onCreate = (res) => {
        if (res.resultId == 1) {
            this.context.toggleWin('visibleg')
            message.success(res.resultMsg);
            this.context.getMenusList();
        } else {
            message.error(res.resultMsg)
        }
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const{
            rowData = {},
        }=this.context;

        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback: this.beforeCallback,  
            afterCallback: (res) => this.onCreate(res),
            title: <span><Icon type="file-text" style={{ color: '#798994', marginRight: 10 }}/>权限备注</span>,
            method: api.menu_edit,
            visible: this.context.visibleg,
            onCancel: ()=>this.context.toggleWin('visibleg'),
            form:this.props.form,
            ...this.context.batConfig
        }

        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">

                    <FormItem label="备注" {...formItemLayout2} >
                        {getFieldDecorator('memo', {
                            initialValue: rowData.memo || '',
                        })(
                            <TextArea rows={4} style={{ width: '100%' }} />
                        )}
                    </FormItem>
                </Form>
            </DrawerComp>
        )
    }
}
export default Form.create()(addRemarks)