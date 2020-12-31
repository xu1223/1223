import React, {
    Component
} from 'react';
import {
    bindActionCreators
} from 'redux';
import {
    connect
} from 'react-redux';
import {
    MyModal,
} from 'components';

import {
    Row,
    Col,
    Icon,
    Form,
    Radio,
    Modal,
    Upload,
    Input,
    Button,
    message
} from 'antd';
const FormItem = Form.Item;
const {
    ModalComp
} = MyModal;


@Form.create()
export default class ChangeColumn extends Component {
    static defaultProps = {

    };

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    componentDidMount() { }

    addCol = ()=>{
        const {
            form,
            curColumnsName,
            isEdit
        } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {
                    name
                } = values;
                
                if(isEdit){
                    this.props.resetColDataSource(curColumnsName,name);
                }else{
                    if(!curColumnsName){
                        this.props.addThHandle(``, "isTool",name); //操作按钮添加列
                    }else{
                        this.props.addThHandle(curColumnsName,'',name); //列的基础上增加列
                    }
                }
              
                this.props.handleCancel();
            }
        })
    }

    validForm = (rule, value, callback) => {
        const {
            field
        } = rule;
        const {
            columns,
            isEdit,
            curColumnsName
        } = this.props;
        if (columns.findIndex(item=>item.dataIndex == value) != -1) {
            if(isEdit && value == curColumnsName){
                callback()
            }else{
                callback("列名必须唯一；如果同时使用相同的列名，请使用'|'来进行区别，如Size|2")
            }
        } else {
            callback();
        }
    }

    render() {
        const {
            curColumnsName,
            isEdit
        } = this.props;
        const modalProp = {
            title: (!isEdit ? "新增" : "修改") + "列名",
            winType: 1,
            ...this.props,
            onCancel: this.props.handleCancel,
            onOk:this.addCol
        };

        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <ModalComp
                {...modalProp}
            >
                <div style={{ margin: '30px' }}>
                    <FormItem>
                        {getFieldDecorator("name", {
                            initialValue: isEdit ? curColumnsName : '',
                            rules: [{ required: true, message: '必填项' }, { validator: this.validForm }],
                        })(
                            <Input  placeholder="请输入列名"/>
                        )}
                    </FormItem>
                </div>
            </ModalComp>
        )
    }
}