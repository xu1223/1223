import React from 'react';
import { Radio } from 'antd';
/**
 * 自定义组件 单选框
 */
export default class SingleSelect extends React.Component {
    static getDerivedStateFromProps(nextProps) {
       
        if ('value' in nextProps) {
            return {
                selectValue: nextProps.value || ''
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        
        this.state = {
            selectValue: props.value || ''
        };
    }

    changeType = (selectValue) => {
        if (!('selectValue' in this.props)) {
            this.setState({
                selectValue
            })
        }
        this.props.onChange(selectValue)
    }

    render() {
        const { selectValue } =this.state;
        const { patternData, disabled } = this.props;
        const defaultData = [{
            value: '1',
            label: '开启',
        }, {
            value: '2',
            label: '关闭',
        }];

        let singleDate = !!patternData ? patternData : defaultData || [];
        return (
            <div className="SelectionBox">
                <Radio.Group defaultValue={selectValue}>
                    {
                        singleDate.map((item, index) => {
                            return <Radio.Button disabled={item.disabled || disabled} value={item.value} onClick={() => this.changeType(item.value)} >{item.label}</Radio.Button>
                        })
                    }
                </Radio.Group>
            </div>
        )
    }
}