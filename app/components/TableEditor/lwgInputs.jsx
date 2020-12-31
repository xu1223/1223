import React from 'react';
import { Input } from 'antd';
const InputGroup = Input.Group;
/**
 * 自定义组件changkuangao
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
            title = '尺寸'
        } = this.props;
        const{
            selectValue
        }=this.state;

        return (
            <InputGroup compact>
                <Input disabled={disabled} value={selectValue[0]} onChange={(e)=>this.numberChange(e, '0')} style={{ width: '50%' }} placeholder="长" addonBefore={title} />
                <Input disabled={disabled} value={selectValue[1]} onChange={(e)=>this.numberChange(e , '1')} style={{ width: '25%' }} placeholder="宽" />
                <Input disabled={disabled} value={selectValue[2]} onChange={(e)=>this.numberChange(e , '2')} style={{ width: '25%' }} placeholder="高" />
            </InputGroup>
        )
    }
}