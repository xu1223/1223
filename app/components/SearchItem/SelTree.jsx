import React from 'react';
import api from 'fetch/api';
import {
    post
} from 'fetch/request';
import {
    Form,
    Icon,
    Row,
    Col,
    Select,
    Input,
    Tree,
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
const { TreeNode } = TreeSelect;

const {
    MonthPicker,
    RangePicker
} = DatePicker;

export default class SelTree extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            classifyList: [],
            countryID: '',
            selectValue: '',
        }

    }

    //选择映射站点
    selectChange = (value) => {
        this.setState({
            countryID: value
        }, () => {
            this.getTreeData()
        })
    }

    //获取分类数据
    getTreeData = () => {
        const {
            countryID
        } = this.state;
        let params = {
            platform: '9',
            country_id: countryID,
        };
        post(api.getCategoryRelList, params).then(res => {
            const data = res.resultData.data;
            this.setState({
                classifyList: data
            })
        })
    }


    renderTreeNodes = (data) => {
        if (data instanceof Array) {
            return data.map((item,index) => {
                if (item.children) {
                    return (
                        <TreeNode title={item.node_name} key={item.node_id + index} value={item.node_id} dataRef={item} selectable={false}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode title={item.node_name} key={item.node_id + index} dataRef={item} value={item.node_id} isLeaf={item.isLeaf} selectable={item.has_children == '0' ? true : false} />;
            });
        }
    }

    render() {
        const {
            getFieldDecorator,
            span = 12,
            itemConf = {},
            labelConf,
            formItemName,
            renderOption,
            ...props
        } = this.props;

        const {
            classifyList
        } = this.state;

        return (
            <Col span={span} style={{ padding: "0 10px" }}>
                <FormItem >
                    <Row gutter={0} type="flex" justify="start">
                        <Col span={8} >
                            {
                                getFieldDecorator(formItemName != undefined ? formItemName[0] : 'select', {
                                    ...itemConf
                                })(

                                    <Select
                                        style={{ width: '100%', 'padding': 0 }}
                                        onChange={this.selectChange}
                                        size="large"
                                        {...props}
                                    >
                                        {
                                            labelConf.map(item => {
                                                if (renderOption != undefined) {
                                                    return renderOption(item);
                                                } else {
                                                    return <Option key={item.id || item.value} value={item.id || item.value}>
                                                        {item.name || item.label}
                                                    </Option>
                                                }
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Col>
                        <Col span={16}>
                            {
                                getFieldDecorator(formItemName != undefined ? formItemName[1] : 'select_tree', {
                                    ...itemConf
                                })(
                                    <TreeSelect
                                        showSearch
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    >
                                        
                                        {this.renderTreeNodes(classifyList)}
                                        
                                    </TreeSelect>
                                )
                            }
                        </Col>
                    </Row>
                </FormItem>

            </Col>
        )
    }
}