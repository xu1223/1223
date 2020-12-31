import React from 'react';

import {
	Form,
    Icon,
    Row,
	Col,
	Select,
	Input,
	InputNumber,
	TreeSelect,
	Radio,
	DatePicker,
	Spin,
	Checkbox
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

const {
	MonthPicker,
	RangePicker
} = DatePicker;



export default class Zuhe extends React.Component {
    state = {
        curKey:this.props.labelConf[0].key
    }

    constructor(props, context) {
        super(props, context);
    }
    
    onChangeCom = (curKey)=>{
        this.setState({
            curKey
        })
    }


    getFormItemCell = (props) =>{
        const {type} = this.props;
        if(type == "sel_input"){
            return <Input 
                {...props}
                size="large"
                style={{width: '100%'}}
            />
        }else{
            return <RangePicker
                style={{width: '100%'}}
                size = "large"
                {...props}
            />
        }
        
    }
    
    render() {
        const {
            getFieldDecorator,
            span = 12,
            itemConf = {},
            labelConf,
            ...props
        } = this.props;

        const {
            curKey
        } = this.state;
        
        return (
                <Col span={span} style={{padding:"0 10px"}}>
                    <FormItem >
                        <Row gutter={0}  type="flex" justify="start">
                            <Col span={8} >
                                <Select
                                    style={{width: '100%','padding':0}}
                                    onChange = {this.onChangeCom}
                                    value = {curKey}
                                    size = "large"
                                    {...props}
                                >
                                    {labelConf.map(item=><Option key={item.key} value={item.key}>{item.name}</Option>)}
                                </Select>
                            </Col>
                            <Col span={16} >
                                {
                                    getFieldDecorator(curKey,{
                                        ...itemConf
                                    })(this.getFormItemCell(props))
                                }
                            </Col>
                        </Row>
                    </FormItem>
                   
                </Col>
        )
    }
}