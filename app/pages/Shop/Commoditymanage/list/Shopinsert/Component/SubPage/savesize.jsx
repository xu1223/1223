import React, {
    Component
} from 'react';
import {
    MyModal,
} from 'components';

import {
    Form,
    Input,
    message
} from 'antd';
const FormItem = Form.Item;
const {
    ModalComp
} = MyModal;
import Base from 'util/base.js';
import {formItemLayout1} from 'config/localStoreKey'
import { post } from 'fetch/request'
@Form.create()
export default class SaveSize extends Component {
    static defaultProps = {

    };

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    componentDidMount() {}

    beforeCallback = () =>{
        const { 
            saveSizeData,
            form,
            api,
        } = this.props;
        const obj = {}
        obj.template_id = ''
        obj.name = form.getFieldValue('name')
        obj.account_id = Base.getItem("USER_UUID");
        obj.size_chart = JSON.stringify(saveSizeData);
        post(api.save_size_template,obj).then(res=>{
            if(res.resultId == '200'){
                message.success(res.resultMsg)
                this.props.handleCancel()
            }else{
                message.error(res.resultMsg);
            }
        })
        
    }


    render() {

        const modalProp = {
            title: "保存模板",
            winType: 1,
            ...this.props,
            onCancel: this.props.handleCancel,
            onOk:this.beforeCallback
        };

        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <ModalComp
                {...modalProp}
            >
                <div style={{ margin: '30px' }}>
                    <FormItem label = '模板标题' {...formItemLayout1}>
                        {getFieldDecorator("name", {
                            initialValue: '',
                            rules: [{ required: true, message: '必填项' }, { validator: this.validForm }],
                        })(
                            <Input  placeholder="建议模板标题清晰明确，避免混淆" />
                        )}
                    </FormItem>
                </div>
            </ModalComp>
        )
    }
}