import React, { Component } from 'react';
import api from '@/fetch/api';
import pageConfig from './Config';
import { is, fromJS } from 'immutable';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import Review from './Component/review'
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import { get, post } from '@/fetch/request'
import './index.less'
import {
    Card,
    message,
    Switch,
    Input
} from 'antd';

@DataOper(pageConfig)
export default class PositionManage extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            areaList: [],
            reviewshow: false
        }
        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '回复',
                    noCheck: true,
                    ghost: true,
                    onClick: () => {
                        this.save_review(rowData)
                    }
                }, {
                    title: '删除',
                    noCheck: true,
                    type:"danger",
                    ghost: true,
                    method: api.review_del,
                }],
                batConfig: this.props.batConfig,
                unicode: 'review_ids|id',
                rowData
            }
        };

        this.columns = [{
            title: '商品图片',
            dataIndex: 'image',
            width: 150,
            render: (text, record) => {
                return <div>
                    <img src={record.product.img_m} style={{ width: '100px',height:'130px' }}></img>
                </div>
            }
        }, {
            title: '商品信息',
            dataIndex: 'product',
            width: 300,
            render: (text, record) => {
                return record.product ? <div>
                    <a href={record.product.product_url} target="_blank"  >{record.product.name}</a>
                    {
                        record.product.spu ? <p style={{ color: '#999' }}>SPU:{record.product.spu}</p> : ''
                    }

                    <p style={{ color: '#999' }}>SKU:{record.product.sku}</p>
                </div >
                    : ''
            }
        }, {
            title: '商品分类',
            dataIndex: 'product.parent_category',
            width: 100,
            render: (text, record) => {
                return record.product ? <div>
                    <p>
                        {record.product.parent_category}
                        {
                            record.product.parent_category ? <span>></span> : ''
                        }
                        {record.product.child_category}
                    </p>
                </div>
                    : ''
            }
        }, {
            title: '会员名称',
            dataIndex: 'email',
            width: 150,
            render: (text, record) => {
                return <div>
                    <a onClick={() => this.morelink("Memberinfo", '会员信息', record.email)}>{record.email}</a>
                </div>
            }
        }, {
            title: '国家',
            dataIndex: 'country_flag',
            width: 150,
            render: (text, record) => {
                return <div>
                    <img src={text} style={{ width: '50px' }}></img>
                </div>
            }
        },

        {
            title: '评分',
            dataIndex: 'rating',
            width: 100,
        }, {
            title: '评论内容',
            dataIndex: 'description',
            width: 200,
            render: (text, record) => {
                return <div className="twoomit" >
                    {text}
                </div>
            }

        }, {
            title: '评论时间',
            dataIndex: 'created_at',
            width: 200,
            render: (text, record) => {
                return <div style={{ color: '#999' }}>
                    {text}
                </div> 
            }
        },

        {
            title: '状态',
            dataIndex: 'status',
            width: 100, 
            render: (text, record) => {
                return <div>
                    <Switch checkedChildren="显示" unCheckedChildren="隐藏" onChange={() => { this.onChange(record) }} checked={record.status == 0 ? false : true} />
                </div>
            }
        },

        {
            title: '排序',
            dataIndex: 'sort_order',
            width: 100,
            render: (text, record) => {
                return <div>
                    <Input defaultValue={text} onBlur={(e) => this.onBlur(e, record)}></Input>
                </div>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 200,
            fixed: 'right',
            render: (text, record) => {
                return <div>
                    <BatOperation {..._batProps(record)} />
                </div>
            }
        }];
    }
    // 修改显示隐藏
    onChange = (record) => {
        post(api.save_review_status, { review_id: record.id, status: record.status == 1 ? 0 : 1 }).then(res => {
            if (res) {
                message.success('操作成功')
                this.props.changeSearch();
            }
        })

    }
    //跳转页面生成tab数据
    morelink = (link, name, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url, {
            title: name,
        })
    }
    //修改排序值
    onBlur = (e, record) => {
        let value = e.target.value
        if (e.target.value == record.sort_order) {  //判断是否有修改。无修改不生效
            return false
        }
        post(api.save_review, {
            id: record.id,
            sort_order: value
        }).then(res => {
            if (res.resultId == 200) {
                message.success('修改成功')
                this.props.changeSearch({
                    storage_id: this.props.params.id
                })
            }
        })
    }

    // 回复
    save_review = (value) => {
        this.setState({
            reviewshow: true,
            reviewdata: value
        })
    }
    componentDidMount = () => {
        const { id } = this.props.params
        this.props.changeSearch({
            email: id
        })
        this.country_idsetore()
    }
    country_idsetore = () => {
        post(api.get_customers_pager, {
        }).then(res => {
            if (res) {
                this.setState({
                    storagegroup: res.resultData.data
                })

            }
        })
    }

    // 共享 tool 和index
    toggleWin = (key = 'visible', cotherConfig = {}) => {
        let { otherConfig = {} } = this.state;
        otherConfig = {
            ...otherConfig,
            ...cotherConfig,
            [key]: !this.state[key]
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig,
        })
    }

    render() {
        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };
        console.log(this.props.tableConfig, 'this.props.tableConfig')
        const { local = {} } = this.props;
        const { storageInitData = {}, storageList } = local;
        const { area = [] } = storageInitData;
        const dictData = area
        const {
            storagegroup,
        } = this.state
        let selectdata = {
            storagegroup,
        }
        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            dictData,
            storageList,
            batConfig: this.props.batConfig,
            changeSearch: this.props.changeSearch,
        };


        return <div className='userStyle'>

            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    selectdata={selectdata}
                    changeSearch={this.props.changeSearch}
                    dictData={dictData}
                    storageList={storageList} />
                <div className="header-tool">
                    <p>会员评论</p>
                    <ToolWrap
                        selectdata={selectdata}
                        listSelData={this.props.listSelData}
                        values={this.props.values} />
                </div>
                <Card
                    className="content-main">

                    <div className="content-table">
                        <Table {...tableProps} />
                    </div>
                </Card>
                {this.state.reviewshow && <Review
                    reviewshow={this.state.reviewshow}
                    toggleWin={this.toggleWin}
                    batConfig={this.props.batConfig}
                    rowData={this.state.reviewdata}
                />}
            </ListContext.Provider>

        </div>
    }
}