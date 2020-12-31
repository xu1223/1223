import React from 'react'
import {
    Select,
    Spin,
    Button,
    message,
    Input,
    Row,
    Icon,
    Col,
    Cascader
} from 'antd';
const {
    Option,
} = Select;
import './index.less'
import {
    CONFIG,
} from './Config'
import {
    fetchUser
} from '@/util'
import Immutable from 'immutable';
/**
 * 自定义组件 分类选择
 */
import debounce from 'lodash/debounce';
import {
    post
} from 'fetch/request';
import ProductClassify from './productClassify';

export default class ClassifySelect extends React.Component {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                value: nextProps.value || {}
            }
        }
        return null;
    }
    constructor(props) {
        super(props);
        this.state = {
            defaultSelect: props.value || {},
            remoteData: [],
            fetching: false,
            categoryData: [],
            storeId: '',
            type: '',
            visibleClassify: false,
            cateText: props.categoryStr || '',
            slurStatus: false,
            cacheData: {},
            commonCategoryData: {},
            buttonLoading: false,
            iconLoading: false,
        }
        const {
            modal = 'configPub'
        } = props;
        this.lastFetchId = 0;
        this.fetchUser = debounce(fetchUser, 800);
        this.config = CONFIG[modal]
        // this.autoFetch = true
    }

    componentDidMount = () => {
    }

    handleChange = value => {
        this.setState({
            // remoteData: [],
            defaultSelect: value,
            fetching: false,
            slurStatus: false,
            cateText: value.label
        });
    };

    //获取分类
    getCategory = type => {
        const {
            otherParams,
            getCateMethod,
            getCommonCateMethod,
            beforeClick,
            modalParams = {},
        } = this.props;
        const {
            nodeKey,
            storeKey,
        } = this.config;
        console.log(otherParams, modalParams, 'params')
        let flag
        if (beforeClick) {
            flag = beforeClick()
        }
        if (!flag) {
            this.setState({
                buttonLoading: true
            })
            Promise.all([post(getCateMethod, {
                // [storeKey]: modalParams[storeKey] ? modalParams[storeKey].key : '',
                //[storeKey]: 1934, //测试亚马逊店铺id
                //[storeKey]: 617, //测试ebay店铺id
                [nodeKey]: 0,
                ...otherParams,
                ...modalParams
            }), getCommonCateMethod ? post(getCommonCateMethod, {
                // [storeKey]: modalParams[storeKey] ? modalParams[storeKey].key : '',
                [nodeKey]: 0,
                ...otherParams,
                ...modalParams
            }) : null]).then(res => {
                const [r1, r2] = res;
                let jsObj = Immutable.fromJS(r1)
                let resultData = jsObj.getIn(['resultData', 'data', 'list']) ? r1.resultData.data.list : jsObj.getIn(['resultData', 'data', 'children']) ? r1.resultData.data.children : jsObj.getIn(['resultData', 'data']) ? r1.resultData.data : r1.resultData
                this.setState({
                    categoryData: resultData,
                    cacheData: {
                        0: resultData
                    },
                    commonCategoryData: r2 ? r2.resultData.data : [],
                    // storeId: this.props.modalParams[storeKey].key,
                    type,
                    visibleClassify: true,
                    buttonLoading: false
                })
            })
        }
    }

    //id精准搜索
    idSearch = e => {
        const {
            nodeKey,
            storeKey,
        } = this.config;
        const {
            modalParams = {},
            beforeClick
        } = this.props;
        const {
            idSearchUrl,
            idSearchParams,
        } = modalParams;
        let flag
        if (beforeClick) {
            flag = beforeClick()
        } !flag && post(idSearchUrl, {
            ...idSearchParams,
            [nodeKey]: e.target.value
        }).then(res => {
            if (!res.resultData && !res.resultData.data) {
                message.error(res.resultMsg)
            } else {
                message.success(res.resultMsg)
                this.setState({
                    cateText: res.resultData,
                })
            }
        })
    }

    //回显选择结果
    setCateResult = (data, str) => {
        const {
            nodeKey,
        } = this.config;
        const {
            afterClick,
        } = this.props;
        this.setState({
            defaultSelect: {
                key: data[nodeKey],
                // label:data[nodeNameKey]
                label: str
            },
            cateText: str,
            slurStatus: false
        })
        console.log(data, str)
        afterClick && afterClick(data, str)
    }

    //关闭弹窗
    handleCancel = () => {
        this.setState({
            visibleClassify: false
        })
    }

    //模糊搜索
    slurSearch = () => {
        const {
            otherParams,
            getCateMethod,
            beforeClick,
            modalParams = {},
            fuzzySearchApi
        } = this.props;
        const {
            nodeKey,
        } = this.config;
        let flag
        if (beforeClick) {
            flag = beforeClick()
        }
        if (!flag) {
            post(fuzzySearchApi ? fuzzySearchApi : getCateMethod, {
                // [storeKey]: modalParams[storeKey] ? modalParams[storeKey].key : '',
                //[storeKey]: 1934, //测试亚马逊店铺id
                //[storeKey]: 617, //测试ebay店铺id
                [nodeKey]: 0,
                cate_name: true,
                ...otherParams,
                ...modalParams,
            }).then(res => {
                let jsObj = Immutable.fromJS(res)
                let resultData = jsObj.getIn(['resultData', 'data', 'list']) ? res.resultData.data.list : jsObj.getIn(['resultData', 'data', 'children']) ? res.resultData.data.children : jsObj.getIn(['resultData', 'data']) ? res.resultData.data : res.resultData
                this.setState({
                    options: resultData
                })
            })
            this.setState({
                slurStatus: true
            })
        }
    }

    onChange = (value, selectedOptions) => {
        const {
            fuzzySearchHandle,
            afterClick,

        } = this.props;
        const {
            addId,
        } = this.config;
        let cateText = '', nodeId = '', objClass = {};
        selectedOptions.map((item, index) => {
            if (item.has_children == 1) {
                if (addId) {
                    cateText += `${item.label} (${item.nodeId || item.value})  >> `
                } else {
                    cateText += `${item.label}  `
                }
            } else {
                if (addId) {
                    cateText += `${item.label} (${item.nodeId || item.value})  >> `
                } else {
                    cateText += `${item.label}  `
                }
            }

            if (selectedOptions && selectedOptions.length - 1 == index) {
                nodeId = item.value
            }
            objClass.node_id = nodeId;
            objClass.node_path_name = cateText;
            objClass.status = false;
            objClass.hand = true;
        })



        fuzzySearchHandle && fuzzySearchHandle(objClass)
        message.success(`分类${selectedOptions[selectedOptions.length - 1].label}选择成功`)
        this.setState({
            cateText,
            slurStatus: false,
            objClass
        })
        let selectObj = selectedOptions[selectedOptions.length - 1]
        selectObj.node_id = selectObj.value;
        this.setState({
            iconLoading: true
        })



        afterClick && afterClick(selectObj, cateText)
        setTimeout(() => {
            this.setState({
                iconLoading: false
            })
        }, 1000)
    }

    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    saveClass = (cateText) => {
        const {
            SearchHandleData,
        } = this.props;
        const {
            objClass
        } = this.state
        if (cateText.length != 0) {
            SearchHandleData && SearchHandleData(objClass)
            this.setState({
                cateText: '',
                slurStatus: true
            })
        } else {
            message.info('请先选择分类')
        }
    }

    render() {
        const {
            fetching,
            remoteData = [],
            defaultSelect,
            visibleClassify,
            cateText,
            slurStatus,
            buttonLoading,
            options,
            iconLoading
        } = this.state;

        const {
            modal,
            getCateMethod,
            getCommonCateMethod,
            otherParams,
            userSpace,
            openDrawer,
            modalParams = {},
            onlyRead,
            unNeedCommon = false,
            notFuzzySearch,
            classSearch,
            idSearchCate
        } = this.props;

        // if (this.autoFetch && userSpace) {
        //     this.autoFetch = false
        //     this.getCategory('platform')
        // }

        const {
            idSearch,
            platform,
            initCate
        } = modalParams;

        const editStoreMethod = {
            platform,
            categoryData: this.state.categoryData,
            cacheData: this.state.cacheData,
            storeId: this.state.storeId,
            type: this.state.type,
            visibleClassify,
            commonCategoryData: this.state.commonCategoryData,
            handleCancel: this.handleCancel,
            setCateResult: this.setCateResult,
            beforeCallback: this.props.beforeCallback,
            getCateMethod,
            getCommonCateMethod,
            otherParams,
            modal,
            userSpace,
            modalParams
        };
        return (
            <div className='storeBlock'>
                {!slurStatus && !userSpace && <Row className='idSearchCate' style={{ width: notFuzzySearch ? '79.8%' : !idSearchCate ? '92.8%' : null }}>
                    {idSearch && <Col span={4} className='idSearchInput'><Input placeholder='请输入完整分类搜索' onPressEnter={this.idSearch} /></Col>}
                    {!slurStatus && !userSpace && <Row className='idSearchCate' type="flex" align='middle' style={{ width: '100%' }}>
                        {idSearch &&
                            <Col span={4} className='idSearchInput'>
                                <Input placeholder='请输入完整分类搜索' onPressEnter={this.idSearch} />
                            </Col>
                        }
                        <Col span={idSearch ? 19 : 23} className='idSearchText' title={cateText}><span>{cateText || initCate}</span></Col>
                        {!notFuzzySearch && <Col span={1} className='idSearchIcon'><Icon type="search" onClick={this.slurSearch} /></Col>}
                    </Row >}
                </Row >}
                {
                    slurStatus && !userSpace && <Cascader
                        options={options}
                        style={{ width: '77%' }}
                        onChange={this.onChange}
                        placeholder="请输入ID或者关键字进行搜索"
                        showSearch={{ filter: this.filter, matchInputWidth: false }}
                    />
                    // <Select
                    //     labelInValue
                    //     value={defaultSelect}
                    //     notFoundContent={fetching ? <Spin size="small" /> : null}
                    //     filterOption={false}
                    //     showSearch={true}
                    //     onSearch={this.fetchUser.bind(this)}
                    //     onChange={this.handleChange}
                    //     style={{ width:'77%' }}
                    //     // disabled
                    // >
                    //     {remoteData.map(d => (
                    //         <Option key={d.value}>{d.label}</Option>
                    //     ))}
                    // </Select>
                }
                {
                    classSearch ?
                        <Icon type={iconLoading ? 'sync' : 'save'} spin={iconLoading} className='iconSave' onClick={() => this.saveClass(cateText)} /> :
                        !onlyRead ?
                            !userSpace && <span>
                                <Button className='choseCateBtn' style={{ marginLeft: notFuzzySearch ? '-20px' : null }} shape="round" onClick={() => this.getCategory('platform')} loading={buttonLoading}>选择</Button>
                                {
                                    !unNeedCommon && <span className='comonClassify' onClick={() => this.getCategory('common')}>常用分类</span>
                                }
                            </span>
                            : null
                }
                {visibleClassify && <ProductClassify {...editStoreMethod} />}
            </div>
        )
    }
}