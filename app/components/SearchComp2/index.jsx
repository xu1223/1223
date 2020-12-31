import React, {
    Component
} from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as userAction from 'sagas/user'
import {
    Select,
    Form,
    Row,
    Input,
    InputNumber,
    Col,
    DatePicker,
    Spin,
    Button,
    Icon,
    Tooltip,
    TreeSelect,
    Checkbox,
    Cascader,
    Tabs
} from 'antd';
const { TabPane } = Tabs;
const Option = Select.Option;
const FormItem = Form.Item;
import debounce from 'lodash.debounce';
const InputGroup = Input.Group;
import './index.less'
import {
    post,
    get
} from '@/fetch/request.js';
import { isDate, isArray } from '@/util/'
import moment from 'moment'
const {
    MonthPicker,
    RangePicker
} = DatePicker;

const {
    Search
} = Input;

import { deepClone } from '@/util/index'

import config from './config.js'

function mapStateToProps(state) {
    return {
        store: state.user.store,
        curMenu: state.user.menu.curMenu
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(userAction, dispatch)
    }
}

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
export default class SearchComp2 extends Component {
    static defaultProps = {
        loading: false,
        handleFormData: (values) => { }
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
        }

        this.lastFetchId = 0;
        this.getData = debounce(this.getData, 800);
    }

    // 获取span
    getItemSpan = (data) => {
        const {
            labelConf,
            isExact,
            isSign
        } = data;

        // 设置默认值
        let span = 4;
        if (labelConf instanceof Array && (isExact || isSign)) {
            span = 7
        } else if (isExact || isSign) {
            span = 5
        }

        // 以设置值为有限 没有设置 则使用前面设置的默认值
        if (data.span) {
            span = data.span
        }
        return span
    }

    // 组合选择框
    compSelectGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {}, exactConf, labelConf, selConf } = itemData
        const widArr = labelConf.isExact ? ['20%', '35%', '45%'] : ['', '45%', '55%']
        return <InputGroup compact>
            {
                labelConf.isExact && getFieldDecorator(labelConf.isExact, {
                    initialValue: '1'
                })(
                    <Select placeholder="请选择" style={{ width: widArr[0] }}>
                        {
                            (exactConf || config.exactData).map(item => <Option value={item.id} >{item.name}</Option>)
                        }
                    </Select>
                )
            }
            {
                getFieldDecorator(labelConf.name, {
                    initialValue: selConf[0].key
                })(
                    <Select placeholder="请选择" style={{ width: widArr[1] }}>
                        {
                            selConf.map(item => <Option value={item.key}>{item.name}</Option>)
                        }
                    </Select>
                )
            }
            {
                getFieldDecorator(labelConf.key)(
                    <Input style={{ width: widArr[2] }} placeholder="请输入" />
                )
            }
        </InputGroup>
    }

    // 获取输入框
    inputGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {}, placeholder } = itemData
        return getFieldDecorator(formKey, itemConf)(<Input key={formKey} {...formConf} placeholder={placeholder} style={{ flex: 5 }} />)
    }
    // 输入框
    numberGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {} } = itemData
        return getFieldDecorator(formKey, itemConf)(<InputNumber key={formKey}  {...formConf} style={{ flex: 5 }} />)
    }
    // 获取选择框
    checkboxGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {} } = itemData
        return getFieldDecorator(formKey, itemConf)(<Checkbox key={formKey}  {...formConf} style={{ flex: 5 }} />)
    }
    // 获取时间框
    dateGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {} } = itemData
        return getFieldDecorator(formKey, itemConf)(<DatePicker key={formKey} {...formConf} style={{ flex: 6 }} />)
    }

    // 获取时间范围
    rangeGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {} } = itemData
        return getFieldDecorator(formKey, { initialValue: '' })(<RangePicker key={formKey} {...formConf} style={{ flex: 6 }} />)
    }

    //获取月份
    monthGet = (itemData, formKey, getFieldDecorator) => {
        const { itemConf, formConf = {} } = itemData
        return getFieldDecorator(formKey, itemConf)(<MonthPicker key={formKey} {...formConf} style={{ flex: 4 }} />)
    }

    //获取范围
    betweenGet = (itemData, formKey, getFieldDecorator) => {
        let {
            labelConf: {
                key2
            },
            formConf = {},
        } = itemData
        key2 = !key2 ? formKey + '2' : key2
        return [
            getFieldDecorator(formKey)(<Input key={formKey + 'start'} className='between-left' placeholder="最小" {...formConf} />),
            <Input key={formKey + 'i'} placeholder="~" disabled className='between-split' />,
            getFieldDecorator(key2)(<Input key={formKey + 'end'} className='between-right' placeholder="最大"  {...formConf} />)
        ]
    }

    //获取树
    treeGet = (itemData, formKey, getFieldDecorator) => {
        const {
            data = [],
            formConf = {}
        } = itemData;
        return getFieldDecorator(formKey)(<TreeSelect
            key={formKey}
            showSearch
            style={{ flex: 5 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={data || []}
            {...formConf}
        />)
    }

    // 获取下拉框
    selectGet = (itemData, formKey, getFieldDecorator, remoteObj = {}) => {
        const {
            data = [],
            itemConf = {},
            formConf = {},
            renderOption,
        } = itemData;
        const obj = {
            showSearch: true,
            optionFilterProp: "children",
            placeholder: itemData.labelConf.name,
            allowClear: true,
            ...remoteObj,
            ...itemData,
            ...formConf
        }
        return getFieldDecorator(formKey, itemConf)(<Select key={formKey} {...obj} style={{ flex: 5 }} >
            {
                data.map(item => {
                    if (renderOption != undefined) {
                        return renderOption(item);
                    } else {
                        return <Option
                            key={item.id || item.value || item.key}
                            value={item.uuid || item.id || item.value || item.key}>
                            {item.name || item.label || item.member_name}
                        </Option>
                    }
                })
            }
        </Select>)
    }

    //获取远程数据
    remoteGet = (itemData, formKey, getFieldDecorator) => {
        const {
            remoteData = []
        } = this.state;
        const remoteObj = {
            notFoundContent: this.state.fetching ? <Spin size="small" /> : null,
            filterOption: false,
            labelInValue: true,
            onSearch: (value) => this.getData(value, itemData.ajaxConf),
        }
        //如果远程数据存在 则使用 远程数据
        if (!!remoteData.length) {
            itemData.data = remoteData
        } else if (itemData.extraData) {
            itemData.data = itemData.extraData
        }
        return this.selectGet(itemData, formKey, getFieldDecorator, remoteObj)
    }

    getData(value, ajaxConf = {}) {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;

        const {
            url,
            requestKey,
            methodType,
            otherParam = {}
        } = {

            url: "/api/member/get_member_list_pager.json", //模糊搜索url
            requestKey: "name", // 模糊搜索值对应的参数名
            otherParam: {
                pagesize: 1000,
                p: 1,
                status: 1,
            },
            ...ajaxConf
        }
        // debugger
        this.setState({
            fetching: true
        });
        if (methodType) {
            get(url, {
                [requestKey]: value,
                ...otherParam
            }).then((data) => {
                if (fetchId !== this.lastFetchId) {
                    return;
                }
                this.setState({
                    remoteData: data.resultData.data.list,
                    fetching: false
                });
            });
        } else {
            post(url, {
                [requestKey]: value,
                ...otherParam
            }).then((data) => {
                if (fetchId !== this.lastFetchId) {
                    return;
                }
                this.setState({
                    remoteData: data.resultData.data.list,
                    fetching: false
                });
            });
        }


    }

    //  获取
    getItemTpl = (itemData, getFieldDecorator) => {
        const {
            labelConf,
            isExact,
            isSign,
            noLabel = false,
            type = 'select',
            itemConf = {},
            exactConf = {},
            renderType,
        } = itemData;
        const arr = []
        const isArr = labelConf instanceof Array
        let formKey
        let keyStr
        const isComp = type.indexOf('comp') != -1
        if (isArr) {
            keyStr = labelConf.map(item => item.key).join("$")
            formKey = keyStr + '$unicodeValue'
        } else {
            formKey = itemData.labelConf.key
        }
        if (isExact && !isComp) {
            arr.push(getFieldDecorator(`${isExact}`, {
                initialValue: '1',
                ...exactConf
            })(<Select key={formKey + 'exact'} style={{ flex: 2 }} >{config.exactData.map(item => {
                return <Option key={item.id + formKey} value={item.id}>{item.name}</Option>
            })}</Select>))
        }

        if (!isComp) {
            if (isArr) {
                arr.push(getFieldDecorator(keyStr + '$unicodeSel', {
                    initialValue: labelConf[0].key
                })(<Select key={formKey + 'sel'} style={{ flex: 3 }}   >
                    {
                        labelConf.map(item => {
                            return <Option value={item.key} disabled={item.disabled} key={item.key + formKey}>{item.name}</Option>
                        })
                    }
                </Select>))
            } else {
                if (!noLabel) {
                    arr.push(<span key={formKey + 'span'} className="compactLabel" title={itemData.labelConf.name}>{itemData.labelConf.name}</span>)
                }
            }
        }

        if (isSign) {
            arr.push(getFieldDecorator(`isSign[${formKey}]`, {
                initialValue: '1',
            })(<Select key={formKey + 'sign'} style={{ flex: 2 }}>{config.signData.map(item => {
                return <Option key={item.id + formKey} value={item.id}>{item.name}</Option>
            })}</Select>))
        }

        if (renderType) {
            if (renderType.type == 'Cascader') {
                arr.push(getFieldDecorator(`${itemData.labelConf.key}`, {
                    initialValue: '',
                    ...exactConf
                })(
                    <Cascader
                        options={itemData.data}
                        changeOnSelect
                        fieldNames={renderType.fieldNames}
                    />
                ))
            }
        } else {
            arr.push(this[type + 'Get'](itemData, formKey, getFieldDecorator))
        }

        return arr;
    }

    getFormTpl = () => {
        const arr = []
        const {
            getFieldDecorator
        } = this.props.form
        const {
            isAdvance
        } = this.state;
        this.props.SearchConf.map((item, index) => {
            const {
                visible = true
            } = item;
            if (visible) {
                arr.push(<Col key={'searchconf' + index} span={24} className={"search-item"} style={{ marginBottom: '10px' }}>
                    <InputGroup compact className="compact-item" >{this.getItemTpl(item, getFieldDecorator)}</InputGroup>
                </Col>)
            }
        })
        return arr
    }

    getBtnTpl = (isTwo, isOne) => {
        const {
            loading,
            noSearch
        } = this.props;
        const arr = []
        //if(!noSearch){
        // const tpl = <Button key={'operateSearch'} type="primary" shape="round" htmlType="submit" disabled={loading}>{!noSearch ? '查询' : '筛选'}</Button>
        // if (!isOne) {
        //     arr.push(<div key={'tplkey'} className="search-button">{tpl}</div>)
        // } else {
        //     arr.push(tpl)
        // }
        //}

        arr.push(
            <div >
                <Button key={'operateSearch'} type="primary" htmlType="submit" disabled={loading}>{!noSearch ? '查询' : '筛选'}</Button>
                <Button key={'operateBtn'} disabled={loading} onClick={() => { this.handleSearch('rest') }}>刷新</Button>
            </div>)

        return arr
    }


    getPageKey = () => {
        return location.hash.split("/")[1] + this.props.activeKey
    }

    componentDidMount() {
        this.setFormData()
    }

    componentDidUpdate(nextProps) {
        if (this.props.activeKey != nextProps.activeKey) {
            debugger
            this.setFormData()
        }
    }

    // 设置初始化值  包含选项卡切换的情况
    setFormData() {
        const { curMenu, store } = this.props;
        const _obj = store.searchForm && store.searchForm[curMenu] && store.searchForm[curMenu][this.getPageKey()] ? store.searchForm[curMenu][this.getPageKey()] : ''
        if (_obj) {
            const restObj = {}
            Object.entries(_obj).map(item => {
                const [key, value] = item
                let resetValue
                if (isArray(value)) {
                    resetValue = []
                    value.forEach(_item => {
                        if (isDate(_item)) {
                            resetValue.push(moment(_item))
                        } else {
                            resetValue.push(_item)
                        }
                    })
                } else {
                    if (isDate(value)) {
                        resetValue = moment(value)
                    } else {
                        resetValue = value
                    }
                }
                restObj[key] = resetValue
            })
            this.props.form.resetFields()
            this.props.form.setFieldsValue(restObj)
        } else {
            this.props.form.resetFields()
        }
    }

    handleSearch = (e) => {
        const {
            form,
            store,
            curMenu
        } = this.props;
        if (e == "rest") {
            form.resetFields();
            // let str
            // let testArr = Object.entries(store.activeKey)
            // let arr = testArr[testArr.length - 1]
            // str = arr[0] + '#_#' + arr[1]
            // this.props.clearStoreData({str,curMenu})
        } else {
            e.preventDefault();
        }
        form.validateFields((err, values) => {
            // 缓存 查询数据
            const preValues = deepClone(values)
            this.props.storeSearchData({ key: this.getPageKey(), data: preValues }) //缓存查询条件到列表
            Object.entries(values).map(item => {
                const [key, value] = item;
                if (key.indexOf('$unicodeSel') != -1) {
                    const _destKey = key.split("$unicodeSel")[0]; //得到form 里的 公用key
                    const _destValue = values[_destKey + '$unicodeValue'];
                    const _destValue2 = values[_destKey + '$unicodeValue2']
                    const _destArr = _destKey.split("$");
                    _destArr.map(_item => {
                        if (_destValue2 != undefined) {
                            values[_item + '_min'] = _item == value ? _destValue : '';
                            values[_item + '_max'] = _item == value ? _destValue2 : '';
                        } else {
                            values[_item] = _item == value ? _destValue : ''
                        }
                    })
                    delete values[_destKey + '$unicodeValue']
                    delete values[_destKey + '$unicodeValue2']
                    delete values[key]
                } else if (key.indexOf("$obj") != -1) {
                    const _destKey = key.split("$obj")[0];
                    values[_destKey] = !!value ? value.key : ''
                    delete values[key]
                }
            })

            // 删除掉多余的字段
            // Object.keys(preValues).map(item => {
            //     delete values[item]
            // })
            console.log(values, preValues, '888')
            this.props.handleFormData(values, e, preValues);
        });
    }

    toggle = () => {
        this.setState({
            isAdvance: !this.state.isAdvance
        })
    }



    formchange = () => {
        this.setState({
            formshow: !this.state.formshow
        })
    }

    render() {

        const { nowrap, tabConfig = '', SearchConf = [] } = this.props
        const {
            formshow
        } = this.state
        return <div className="search-main-from">
            <img src="/search.png" onClick={this.formchange} ></img>
            <Form className={formshow ? 'search-show search-conter-from' : 'search-conter-from'} onSubmit={this.handleSearch}>
                {
                    tabConfig ? <Tabs
                        type="card"
                        activeKey={this.props.activeKey}
                        onChange={(e) => this.props.changeTab(e)}
                        style={{ width: '420px' }}
                    >
                        {
                            tabConfig.map((item) =>
                                <TabPane tab={<span><Icon type={item.icon} theme="filled" />{item.name}</span>} key={item.id}></TabPane>)
                        }
                    </Tabs> : ''
                }
                {
                    SearchConf.length == 0 ? '' : <Row className="search-comp" type='flex' justify='start' gutter={10}>
                        {this.getFormTpl()}
                        <Col span={24} className={`search-comp-bottom`}>
                            {this.getBtnTpl()}
                        </Col>
                    </Row>
                }

            </Form>
        </div>
    }
}