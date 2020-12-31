import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import {
    Popover,
    Tag,
} from 'antd';
import {
    ChromePicker
} from 'react-color'
class Shipments extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            fileList: [],
        }
    }
    componentDidMount = () => {

    }


    getColor = (value, key) => {
        const color = value.hex;
        this.props.form.setFieldsValue({
            [key]: color,
        })
        this.props.changecolor(color, key)
        this.setState({
            defaultColoe: color
        })
    }



    render() {
        const {
            id,
            initial
        } = this.props
        const {
            defaultColoe
        } = this.state
        return <Popover
            placement="topLeft"
            trigger="click"
            content={<div style={{ margin: '10px 0' }}><ChromePicker color={defaultColoe} onChangeComplete={(value) => this.getColor(value, id)} /> </div>}
        >
            {<Tag style={{ width: '20%', fontSize: '12px', height: '28px', lineHeight: '28px', background: defaultColoe ? defaultColoe : initial }}></Tag>}
        </Popover>

    }
}


export default Shipments