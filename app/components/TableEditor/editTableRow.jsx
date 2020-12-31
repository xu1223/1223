import React from 'react';
import { Form, Input, Table, Button, Icon, InputNumber, Select, AutoComplete, Spin, Popconfirm } from 'antd';
import {
    post,
    get
} from '@/fetch/request.js';
import { isArray } from '@/util/';


const Option = Select.Option;
const FormItem = Form.Item;
const InputGroup = Input.Group;
import './index.less';
import MultipleInputs from './multipleInputs';
import LwgInputs from './lwgInputs'
import InputSelect from './inputSelect'

@Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        const obj = {}
        props.dataSource.map((item, index) => {
            props.columns.map(_item => {
                if (_item instanceof Array) {
                    _item.map(__item => {
                        if (!__item._noedit && props.dataSource[index]) {
                            let _curItem = props.dataSource[index][__item.dataIndex]
                            if (!(_curItem instanceof Object && !_curItem.label)) {
                                // 增加_curItem.label判断  存在labelInValue
                                _curItem = { value: _curItem }
                            }
                            obj[`dataSource[${index}][${__item.dataIndex}]`] = Form.createFormField({
                                ..._curItem
                            })
                        }
                    })
                } else {
                    if (!_item._noedit && props.dataSource[index]) {
                        let _curItem = props.dataSource[index][_item.dataIndex]
                        if (!(_curItem instanceof Object && !_curItem.label)) {
                            // 增加_curItem.label判断  存在labelInValue
                            _curItem = { value: _curItem }
                        }
                        obj[`dataSource[${index}][${_item.dataIndex}]`] = Form.createFormField({
                            ..._curItem
                        })
                    }
                }

            })
        })
        return obj
    }
})
class CustomizedForm extends React.Component {
    state = {
        remoteData: {}
    };



    longGet = ({
        getFieldDecorator,
        _itemConf = {},
        _formConf = {},
        index,
        dataIndex,
        isOperation
    }) => {
        return <FormItem>{getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
            ..._itemConf
        })(
            <LwgInputs disabled={isOperation} {..._formConf} />
        )}
        </FormItem>
    }

    inputSelectGet = ({
        getFieldDecorator,
        _itemConf = {},
        _formConf = {},
        index,
        dataIndex,
        isOperation
    }) => {
        return <FormItem>{getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
            ..._itemConf
        })(
            <InputSelect disabled={isOperation} {..._formConf} />
        )}
        </FormItem>
    }

    groupGet = ({
        getFieldDecorator,
        _itemConf = {},
        _formConf = {},
        index,
        dataIndex,
        isOperation
    }) => {
        return <FormItem>{getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
            ..._itemConf
        })(
            <MultipleInputs disabled={isOperation} {..._formConf} />
        )}
        </FormItem>
    }


    inputGet = ({
        getFieldDecorator,
        _itemConf = {},
        _formConf = {},
        index,
        dataIndex,
        isOperation
    }) => {
        return <FormItem>{getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
            ..._itemConf
        })(<Input disabled={isOperation} {..._formConf} />)}</FormItem>
    }

    numberGet = ({
        getFieldDecorator,
        _itemConf = {},
        _formConf = {},
        index,
        dataIndex
    }) => {
        return <FormItem>{getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
            ..._itemConf
        })(<InputNumber {..._formConf} />)}</FormItem>
    }

    selectGet = ({
        getFieldDecorator,
        _itemConf = {},
        _formConf = {},
        remoteObj = {},
        rowselect = false,
        data = [],
        remoteData = [],
        unicode = 'id|name',
        index,
        dataIndex,
        isOperation,
    }) => {
        const [value, label] = unicode.split('|')
        data = remoteData.length > 0 ? remoteData : rowselect ? data[index] : data

        data = !!data ? data : []
        const obj = {
            showSearch: true,
            optionFilterProp: "children",
            allowClear: true,
            style: { width:  _formConf.width ? _formConf.width : '100%' },
            ..._formConf,
            ...remoteObj
        }
        if (data.length == 0) {
            return <FormItem >
                {getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
                    ..._itemConf
                })(<AutoComplete {...obj} disabled={isOperation} {..._formConf} >
                    {
                        data.map(item => <Option key={item[value] + dataIndex} recordindex={index} rowdata={item} value={item[value]}>{item[label]}</Option>)
                    }
                </AutoComplete>)}
            </FormItem>
        } else {
            return <FormItem>
                {getFieldDecorator(`dataSource[${index}][${dataIndex}]`, {
                    ..._itemConf
                })(<Select {...obj} disabled={isOperation} {..._formConf} >
                    {
                        data.map(item => <Option  title={item[label]} key={item[value] + dataIndex} recordindex={index} rowdata={item} value={item[value] || item}>{item[label] || item}</Option>)
                    }
                </Select>)}
            </FormItem>
        }

    }

    remoteGet = ({
        _ajaxConf,
        row = {},
        ...item
    }) => {
        const {
            remoteData
        } = this.state;

        const remoteObj = {
            notFoundContent: this.state.fetching ? <Spin size="small" /> : null,
            filterOption: false,
            onSearch: (value) => this.getData(value, _ajaxConf, row, item.dataIndex),
        }

        return this.selectGet({
            remoteData: !!remoteData[item.dataIndex] ? remoteData[item.dataIndex] : [],
            remoteObj,
            ...item
        })
    }

    getData(value, ajaxConf = {}, row, dataIndex) {
        const {
            url,
            requestKey,
            otherParam = {}
        } = {
            url: "/home/member/getAllMemberListByName", //模糊搜索url
            requestKey: "name", // 模糊搜索值对应的参数名
            ...ajaxConf
        }

        if (row.platform || row.platform_name) {
            otherParam.platform = row.platform_name ? row.platform_name.value : row.platform.value
        }

        this.setState({
            fetching: true
        });

        const { remoteData } = this.state;

        get(url, {
            [requestKey]: value,
            ...otherParam,
        }).then((data) => {
            remoteData[dataIndex] = data.resultData.data instanceof Array ? data.resultData.data : data.resultData.data.list
            this.setState({
                remoteData,
                fetching: false
            });
        });
    }

    renderCell(col, text, row, index) {
        const { getFieldDecorator } = this.props.form;
        let {
            _type = 'input',
            _addonAfter,
            _addonBefore,
            ..._item
        } = col;
        if (_type instanceof Object) {
            _item.data = _type.data
            _item.unicode = _type.unicode
            _item.rowselect = _type.rowselect
            _type = _type.name
        }
        const arr = []
        if (_addonBefore) {
            arr.push(_addonBefore(row, index))
        }

        // 如果支持form conf 动态配置
        if (typeof _item._formConf == 'function') {
            _item._formConf = _item._formConf(row, index)
        }
        // 数据支持函数
        if (typeof _item.data == 'function') {
            _item.data = _item.data(row, index)
        }

        arr.push(<div style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>{this[_type + 'Get']({
            getFieldDecorator,
            index,
            row,
            ..._item
        })}</div>)
        if (_addonAfter) {
            arr.push(_addonAfter(row, index))
        }
        return <div style={{ "display": "flex", alignItems: 'center' }}>{arr}</div>
    }
    render() {
        const {
            dataSource,
            columns,
        } = this.props;

        // 重新渲染 列表
        const _columns = columns.map((item) => {
            if (item instanceof Array) {
                const itemArr = item[0]
                itemArr.render = (text, row, index) => {
                    return item.map(_item => {
                        return !_item._noedit ? this.renderCell(_item, text, row, index) : _item.render ? _item.render(text, row, index) : text
                    })
                }
                return itemArr
            } else {
                if (!item._noedit) {
                    item.render = (text, row, index) => this.renderCell(item, text, row, index)
                }
                return item
            }
        })
        let sumWidth = 0
        columns.forEach(item => {
            if (isArray(item)) {
                sumWidth += parseInt(item[0].width)
            } else {
                sumWidth += parseInt(item.width)
            }
        })
        return <div id="rowEditTable"><Table
            // style={{ minHeight: 300 }}
            columns={_columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: sumWidth, y: 500 }}
            {...this.props.tableConf}
        /></div>
    }
}

export default class EditTableRows extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.getDataOfKey(props.dataSource),
            count: props.dataSource.length,
            columns: []
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { force, dataSource, columns } = nextProps;
        if (force !== prevState.force) {
            return {
                force,
                dataSource,
                columns
            };
        }
        if (columns !== prevState.columns) {
            return {
                columns
            };
        }

        return {
            columns
        };
    }

    // 获取同步title
    getSyncTitle = (item) => {
        if (item._sync && !item.isSync) {
            const { _syncIndex = '', dataIndex } = item
            const _newKey = _syncIndex.split(',').filter(item => item);
            _newKey.push(dataIndex)
            item.title = <div>{item.title}<Icon type="sync" title="同步" onClick={() => this.syncFirstData(_newKey)} className="edit-sync" /></div>
            item.isSync = true
        }
        return item
    }

    renderColumns = () => {
        const { noDel = false } = this.props
        let _columns = [...this.state.columns].map((item) => {
            if (item instanceof Array) {
                // 给数组型 增加同步功能
                item[0] = this.getSyncTitle(item[0])
            } else {
                item = this.getSyncTitle(item)
            }
            return item
        })

        if (!noDel) {
            _columns = _columns.concat({
                title: "操作",
                dataIndex: "operate",
                width: "10%",
                _noedit: true,
                render: (item, row, index) => {
                    return <Popconfirm
                        title="删除?"
                        onConfirm={() => this.deleteRow(row.key)}
                    ><Button key={row.key} type="danger" shape="round" size="small">删除</Button></Popconfirm>
                }
            })
        }
        return _columns
    }

    //根据修改项修改datasource
    handleFormChange = changedFields => {
        const {
            dataSource
        } = this.state;
        const _chgValue = changedFields.dataSource
        if (_chgValue) {
            const index = _chgValue.findIndex(item => item)
            const _key = Object.keys(_chgValue[index])[0]
            dataSource[index][_key] = _chgValue[index][_key]
            if (this.props.onChange) {
                this.props.onChange(dataSource)
            } else {
                this.setState({
                    dataSource
                })
            }
        }
    };

    //同步功能
    syncFirstData = (dataIndexArr = []) => {
        const {
            dataSource = []
        } = this.state
        const setValue = {}
        dataSource.forEach((item, index) => {
            dataIndexArr.map(_itemIndex => {
                if (index == 0) {
                    setValue[_itemIndex] = item[_itemIndex]
                } else {
                    item[_itemIndex] = setValue[_itemIndex]
                }
            })
        })
        if (this.props.onChange) {
            this.props.onChange(dataSource)
        } else {
            this.setState({
                dataSource
            })
        }
    }

    getDataOfKey = (data) => {
        const arr = []
        data.forEach((item, index) => {
            item.key = !item.id ? index : item.id || item._id
            arr.push(item)
        })
        return arr
    }

    deleteRow = key => {
        const dataSource = [...this.state.dataSource].filter(item => item.key !== key);
        if(this.props.onChange) {
            this.props.onChange(dataSource)
        } else {
            this.setState({
                dataSource
            })
        }
    }

    addRow = (isFirst) => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
        };
        if (isFirst) {
            this.setState({
                dataSource: [newData, ...dataSource],
                count: count + 1,
            })
        } else {
            this.setState({
                dataSource: [...dataSource, newData],
                count: count + 1,
            })
        }

    }

    getData = () => {
        let arr = []
        this.innerTable.validateFields((error, row) => {
            if (error) {
                arr = false
                return false
            }
            this.state.dataSource.map(item => {
                const itemrow = {}
                Object.entries(item).map(_item => {
                    const [key, val] = _item
                    if (key != "key")
                        itemrow[key] = val instanceof Object && !(val instanceof Array) ? val.value : val
                })
                arr.push(itemrow)
            })
        });
        return arr
    }

    render() {
        const _columns = this.renderColumns()
        return [
            <CustomizedForm tableConf={this.props.tableConf} ref={ref => this.innerTable = ref} columns={_columns || []} dataSource={this.state.dataSource} onChange={this.handleFormChange} />,
            !this.props.noAdd ? <Button onClick={this.addRow}  icon="plus" type="dashed" block style={{ marginTop: 10 }}>新增</Button> : null
        ]
    }
}