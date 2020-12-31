import React from 'react';
import { Input } from 'antd';
const InputGroup = Input.Group;
import './index.less'
/**
 * 自定义组件 单选框
 */
export default class SingleSelect extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            let dd = typeof nextProps.value == 'string'  ? nextProps.value.split(',') : [];
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
        selectValue[type] = e.target.value
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
        } = this.props;
        const{
            selectValue
        }=this.state;

        return (
            <InputGroup compact className="hxInputGroup">
                <Input disabled={disabled} value={selectValue[0]} onChange={(e)=>this.numberChange(e, '0')} className="startInput" placeholder="最小" />
                <Input className="spanInput"  placeholder="~" disabled/>
                <Input disabled={disabled} value={selectValue[1]} onChange={(e)=>this.numberChange(e , '1')} style={{borderLeft:0}} className="endInput" placeholder="最大" />
            </InputGroup>
        )
    }
}