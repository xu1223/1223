import React, {
    Component
} from 'react';
import {
    bindActionCreators
} from 'redux';
import {
    connect
} from 'react-redux';

import utilBase from 'util/base.js';
import api from 'fetch/api';
import {
    post
} from 'fetch/request';

import {
    Spin,
    Icon,
    Form,
    Table,
    Input,
    Select,
    Button,
    Switch,
    message,
    InputNumber,
    Popconfirm
} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

const bottonAttribute = {
    type: 'primary',
    size: 'small',
    className: 'button-style-blue button-style-small1',
    style: {
        marginLeft: '8px'
    }
};

const delAttribute = {
    ...bottonAttribute,
    type: 'danger',
    className: 'button-delete-style button-style-small1',
};



export default class AddTemplate extends Component {
    static defaultProps = {

    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            dataSource: [],
            listSelData: [],
        }
    }

    componentDidMount() {
        this.setTableEdinData(this.props.tableEdlinData.map((item, index) => { item.key = index; return item; }))
    }

    setTableEdinData = (dataSource, callback) => {
        this.setState({
            dataSource,
        }, callback)
    }


    goSetting = () => {
        const w = window.open('about:blank');
        w.location.href = '/#/productDev'
    }

    getColumns = () => {
        const {
            form,
            tableColumns, //表头数组
            showChooseSkuButton, //是否显示选择sku按钮
            showSortColumns, //是否显示排序列
            showSequenceColumns, //是否显示序号列  
            ustomColumns, //自定义表头
            pageKey,
            showDeleteButton,
        } = this.props;
        const {
            getFieldDecorator
        } = form;

        const columns = [];

        tableColumns.map((item) => {
            let obj = {
                ...item,
                render: this.renderFun(item),
            }
            columns.push(obj);
        });

        if (showDeleteButton) {
            columns.unshift({
                title: '操作',
                width: 100,
                dataIndex: 'operation',
                render: (text, row = {}) => {
                    return <div>
                        {
                            showChooseSkuButton ? <Button {...bottonAttribute} onClick={() => { this.props.chooseSku(row) }}>选择sku</Button> : null
                        }
                        <Popconfirm title="Delete ?" onConfirm={() => { this.delEdin(row, 2) }} okText="Yes" cancelText="No">
                            <Button {...delAttribute} type="danger">删除</Button>
                        </Popconfirm>
                    </div>
                }
            });
        }

        if (showSortColumns) { //显示排序列
            columns.unshift({
                title: '排序',
                width: 60,
                dataIndex: 'sort',
                render: (text, row, index) => {
                    return <div>
                        <Icon type="arrow-down" style={{ color: index != this.state.dataSource.length - 1 ? 'blue' : '' }} onClick={() => { this.arrowDown(index, row) }} />
                        <Icon type="arrow-up" style={{ color: index != 0 ? 'blue' : '' }} onClick={() => { this.arrowUp(index, row) }} />
                    </div>
                }
            })
        };

        if (showSequenceColumns) { //显示序号列
            columns.unshift({
                title: '',
                width: 40,
                dataIndex: 'sequence',
                render: (text, row, index) => {
                    return <div>{index + 1}</div>
                }
            })
        };

        if (ustomColumns) { //自定义表头
            ustomColumns.map((item) => {
                //arrColumns.splice(insertIndex, 0, item);
                columns.push(item);
            })
        };

        return columns;
    }

    renderFun(item) {
        const {
            form,
            fetching,
            selectArr,
            showChangeFun,
            inputChange,
            pageKey,
            linkJump,
        } = this.props;

        const {
            getFieldDecorator
        } = form;

        let render;
        switch (item.type) {
            case "switch":
                render = (text, row, index) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                            valuePropName: 'checked',
                            initialValue: text == '1' ? true : false,
                        })(
                            <Switch onChange={this.switchChange} />,
                        )}
                    </FormItem>
                }
                break;
            case "1":
                render = (text, row, index) => {
                    return <FormItem className='setCurrency-table'>
                        <InputGroup compact>
                            {item.showSymbol ? <span>{item.showSymbol}</span> : null}
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                                initialValue: text || (item.initValue != undefined ? item.initValue : '')
                            })(
                                <Input
                                    placeholder={item.placeholder || '请输入'}
                                    style={{ width: '80%', marginLeft: '8px' }}
                                    onChange={showChangeFun ? inputChange.bind(this, row.key, item.dataIndex, index) : null}
                                    addonAfter={linkJump && item.dataIndex == 'spu' ? <Icon type="setting" onClick={this.goSetting} /> : ''}
                                />
                            )}
                        </InputGroup>
                    </FormItem>
                }
                break;
            case "number":
                render = (text, row, index) => {
                    return <FormItem className='setCurrency-table'>
                        <InputGroup compact>
                            {item.showSymbol ? <span>{item.showSymbol}</span> : null}
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                                initialValue: text || (item.initValue != undefined ? item.initValue : '')
                            })(
                                <InputNumber
                                    step={0.1}
                                    size="large"
                                    placeholder={item.placeholder || '请输入'}
                                    style={{ width: '80%', marginLeft: '8px' }}
                                    onChange={showChangeFun ? inputChange.bind(this, row.key, item.dataIndex, index) : null}
                                />
                            )}
                        </InputGroup>
                    </FormItem>
                }
                break;
            case "2":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                            initialValue: text && text + '' || ''
                        })(
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                optionFilterProp="children"
                            >
                                {
                                    item.selectArr.map((items) => {
                                        return <Option value={items.value || items.id} key={items.value || items.id}>{items.name || items.label}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                }
                break;
            case "muti":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                            initialValue: text || []
                        })(
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                multiple={true}
                                optionFilterProp="children"
                                allowClear
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    item.selectArr.map((items) => {
                                        return <Option value={items.value || items.country_code} key={items.value || items.country_code}>{items.name || items.country_cn}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                }
                break;
            case "spec":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                            initialValue: text || ''
                        })(
                            <Select
                                showSearch
                                style={{ width: "100%", maxWidth: 300 }}
                                optionFilterProp="children"
                                allowClear
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    item.selectArr && item.selectArr.map((items) => {
                                        return <Option value={items.shippingService + "" || items.value || items.id} key={items.value || items.id}>{items.description || items.name || items.label}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                }
                break;
            case "3":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        <InputGroup compact>
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[0]}`, {
                                initialValue: row[item.dataIndex[0]] || '',
                            })(
                                <Input style={{ width: '33%' }} placeholder="长" addonAfter="X" />
                            )}
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[1]}`, {
                                initialValue: row[item.dataIndex[1]] || '',
                            })(
                                <Input style={{ width: '33%' }} placeholder="宽" addonAfter="X" />
                            )}
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[2]}`, {
                                initialValue: row[item.dataIndex[2]] || '',
                            })(
                                <Input style={{ width: '34%' }} placeholder="高" addonAfter="CM" />
                            )}
                        </InputGroup>
                    </FormItem>
                }
                break;
            case "4":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[0]}`, {
                            initialValue: row[item.dataIndex[0]] || '',
                        })(
                            <Input style={{ width: '100%' }} placeholder={item.placeholder || '请输入'} disabled={item.disabled ? item.disabled[0] : false} />
                        )}
                        <br />
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[1]}`, {
                            initialValue: row[item.dataIndex[1]] || '',
                        })(
                            <Input style={{ width: '100%' }} placeholder={item.placeholder || '请输入'} disabled={item.disabled ? item.disabled[1] : false} />
                        )}
                    </FormItem>
                }
                break;
            case "5":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[0]}`, {
                            initialValue: { key: row[item.dataIndex[0]] } || '',
                        })(
                            <Select
                                allowClear
                                labelInValue
                                showSearch
                                filterOption={false}
                                style={{ width: '100%' }}
                                onSearch={(value) => { this.props.selectSearch(value) }}
                                notFoundContent={item.fetching ? <Spin size="small" /> : null}
                            >
                                {
                                    item.selectArr.map(d => <Option key={d.value}>{d.text}</Option>)
                                }
                            </Select>
                        )}
                        <br />
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex[1]}`, {
                            initialValue: row[item.dataIndex[1]] || '',
                        })(
                            <Input style={{ width: '100%' }} placeholder={item.placeholder || '请输入'} disabled={item.disabled ? item.disabled[1] : false} />
                        )}
                    </FormItem>
                }
                break;
            case "6":
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                            initialValue: text || ''
                        })(
                            <div onClick={() => { this.props.setImage(row) }}>
                                {
                                    text ? <img style={{ width: 40, height: 40 }} src={text} /> : <span style={{ width: 40, height: 40, textAlign: 'center', lineHeight: "40px", color: "#108ee9" }}>设置</span>
                                }
                            </div>
                        )}
                    </FormItem>
                }
                break;
            case "7": //模糊搜索功能，满足阿里国际平台类目属性项
                render = (text, row) => {
                    return <FormItem className='setCurrency-table'>
                        {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                            initialValue: { key: row[item.dataIndex] } || '',
                        })(
                            <Select
                                allowClear
                                labelInValue
                                showSearch
                                filterOption={false}
                                style={{ width: '100%' }}
                                onSearch={(value) => { this.props.selectSearch(value) }}
                                notFoundContent={item.fetching ? <Spin size="small" /> : null}
                            >
                                {
                                    item.selectArr.map(d => <Option key={d.value}>{d.text}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                }
                break;
            case "8": //输入框、选择框、输入加选择框，满足阿里国际平台类目属性项
                render = (text, row) => {
                    if (row.type == '1' || row.type == '2') {
                        return <FormItem className='setCurrency-table'>
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                                initialValue: text || ''
                            })(
                                <Select
                                    mode={row.type == '2' ? "combobox" : null}
                                    showSearch
                                    optionFilterProp="children"
                                    style={{ width: '100%' }}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        item.selectArr.map((item) => {
                                            return (
                                                <Option value={item.label}>{item.label}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    } else {
                        return <FormItem className='setCurrency-table'>
                            {getFieldDecorator(`${pageKey}[${row.key}].${item.dataIndex}`, {
                                initialValue: text || ''
                            })(
                                <Input placeholder={item.placeholder || '请输入'} />
                            )}
                        </FormItem>
                    }
                }
                break;
            case "9"://对象类型的数据显示处理
                render = (text, row) => {
                    return <div>{!!text ? text.name : ''}</div>
                }
                break;
            default:
                break;
        }
        return render;
    }

    setFormData = () => {
        const {
            form,
            pageKey
        } = this.props;
        console.log(form.getFieldValue(pageKey))
    }

    //删除行
    delEdin = (row, type) => {
        if (type == 1) { //批量删除
            if (this.state.listSelData.length == 0) {
                message.error("请勾选后删除");
                return false;
            } else {
                let newData = this.state.dataSource.filter(item => !this.state.listSelData.some(ele => ele === item.key));
                this.setTableEdinData([...newData]);
            }
        } else { //单独删除一行
            let newData = this.state.dataSource.filter(item => item.key != row.key);
            this.setTableEdinData([...newData]);
        }
    }

    //添加行
    addEdin = () => {
        this.setTableEdinData([...this.state.dataSource, {
            key: new Date().getTime()
        }]);
    }

    //向下排序（走一步）
    arrowDown = (index, row) => {
        if (index + 1 != this.state.dataSource.length) {
            this.swapArray(this.state.dataSource, index, index + 1);
        } else {
            message.warning('已经处于置底，无法下移');
        }
    }

    //向上排序（走一步）
    arrowUp = (index, row) => {
        if (index != 0) {
            this.swapArray(this.state.dataSource, index, index - 1);
        } else {
            message.warning('已经处于置顶，无法上移');
        }
    }

    swapArray(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        this.setState({
            dataSource: arr
        });
    }

    switchChange = (checked) => {
        this.props.currentSwitchChange && this.props.currentSwitchChange(checked)
    }

    render() {
        const {
            pageKey,
            showRowSelection,
            showBatchDel,
            showAddButton,
            butExplain,
            butExplainText,
            showCommonAdd
        } = this.props;
        const {
            dataSource
        } = this.state;
        const columns = this.getColumns();

        let rowSelection = null;
        if (showRowSelection) {
            rowSelection = {
                selectedRowKeys: this.state.listSelData,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                        listSelData: selectedRowKeys
                    })
                }
            };
        };

        let showButton = false;
        if (pageKey == 'deliveryPeriod' && dataSource.length < 3) {
            showButton = true;
        } else if (pageKey == 'tieredPrice' && dataSource.length < 4) {
            showButton = true;
        };

        return (
            <div className="restTabStyle">
                {showBatchDel ? <Button {...delAttribute} onClick={() => { this.delEdin({}, 1) }} style={{ marginBottom: '10px' }}>批量删除</Button> : null}
                <Table
                    bordered
                    rowKey="key"
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    pagination={false}
                />
                {((showAddButton && showButton) || showCommonAdd) ? <Button onClick={this.addEdin} style={{ width: '100%', marginTop: 10, background: "#01b170", borderColor: "#01b170", color: "#fff", height: 36 }}><Icon type="plus" />新增{butExplain ? butExplainText : ''}</Button> : null}
            </div>
        )
    }
}