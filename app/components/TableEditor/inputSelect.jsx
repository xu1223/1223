import React from 'react';
import { Input, Select } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option
/**
 * 自定义组件 单选框
 */
export default class SingleSelect extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            let dd = typeof nextProps.value == 'string'  ? nextProps.value.split(',') : ['', nextProps.dataOption ? nextProps.dataOption[0] : ''];
            return {
                selectValue: dd 
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            selectValue: []
        };
    }

    numberChange = (e , type) => {
        const{
            selectValue
        }=this.state;
        selectValue[type] = e.target ? e.target.value : e
        if (!('selectValue' in this.props)) {
            this.setState({
                selectValue
            })
        }  
        this.props.onChange(selectValue.join(','))
    }

    render() {
        const {
            disabled,
            dataOption = []
        } = this.props;
        const{
            selectValue
        }=this.state;

        return (
            <InputGroup compact>
                <Input disabled={disabled} value={selectValue[0]} onChange={(e)=>this.numberChange(e, '0')} style={{ width: '49%' }} placeholder="请输入"  />
                <Select disabled={disabled} value={selectValue[1]} onChange={(e)=>this.numberChange(e , '1')} placeholder="请选择" style={{ width: '49%' }}>
                    {
                        dataOption.map(item => <Option value={item}>{item}</Option>)
                    }
                </Select>
            </InputGroup>
        )
    }
}