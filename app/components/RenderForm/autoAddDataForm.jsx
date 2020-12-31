import React from 'react'
import { Form, Input, Icon, Button } from 'antd';
import './form.less'

/**
 * 动态增加数据组件
 */
export default class AutoAddDataForm extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        if ('value' in nextProps) {
            if (nextProps.value != prevState.data) {
                return {
                    id: nextProps.value ? nextProps.value.length : 1 ,
                    keys: nextProps.value ? nextProps.value.map((item, index) => index) : [0],
                    data: nextProps.value || []
                }
            }
        }
        return null;
    }
    constructor(props) {
        super(props);
        this.state = {
            keys: [0],
            data: [],
            id: 1
        }
    }

    remove = k => {
        const { keys, data = [] } = this.state;
        if (keys.length === 1) {
            return;
        }
        const _destIndex = keys.find(item => item == k) // 得到索引
        const _destKey = keys.filter(key => key !== k)
        this.setState({
            keys: _destKey
        }, () => {
            this.props.onChange(data.filter((item, index) => index != _destIndex))
        })
    };

    add = () => {
        const { keys } = this.state;
        const nextKeys = keys.concat(this.state.id++);
        this.setState({
            keys: nextKeys,
        }, () => {
            console.log(nextKeys)
        })
    };

    onChangeData = (e, index, type = 'name') => {
        const { data = [] } = this.state;
        if (!data[index]) {
            data[index] = {}
        }
        data[index][type] = e.target.value
        this.props.onChange(data)
    }

    render() {
        const { formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        }, formLabel = '数据集' } = this.props;

        const { keys = [], data = [] } = this.state

        const wrapperCol = {}
        Object.entries(formItemLayout.wrapperCol).map(item => {
            const [key, obj] = item
            wrapperCol[key] = { span: obj.span, offset: 24 - obj.span }
        })

        const formItemLayoutWithOutLabel = {
            wrapperCol
        };

        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? formLabel : ''}
                required={this.props.isRequired && index === 0 ? true : false}
                key={k}
            >
                <Input onChange={(e) => { this.onChangeData(e, index, 'name') }} value={data[index] ? data[index].name : ''} placeholder={'请输入' + formLabel} style={{ width: '70%', marginRight: 8 }} />
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return <div>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.add} style={{ width: '70%' }}>
                    添加 {formLabel}
                </Button>
            </Form.Item>
        </div>
    }
}