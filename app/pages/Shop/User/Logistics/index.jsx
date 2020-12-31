import React, {
    Component
} from 'react';
import {
    message,
    Card,
    Switch,
    Tooltip,
    Input
} from 'antd';
import SearchWrap from './Component/search';
import ToolWrap from './Component/tool';
import pageConfig from './Config';

import api from '@/fetch/api';
import fetch from '@/fetch/index';
import {
    post
} from '@/fetch/request';
import Table from '@/components/TableComp' //统一使用Table 组件
import BatOperation from '@/components/BatOperation';
import {
    ListContext
} from '@/config/context';
import DataOper from '@/advanced/dataOper2';
import './index.less'
@DataOper(pageConfig)
export default class UserManagerment extends Component {
    static defaultProps = {

    };





    constructor(props, context) {
        super(props, context);
        this.state = {
            countrys: [],
        }
        this._batProps = (record) => {
            let obj = {
                config: [{
                    title: '编辑',
                    noAuth: 'edit',
                    noCheck: true,
                    size: 'small',
                    ghost: true,
                    onClick: () => this.toggleWin('visible', { rowData: record })
                }, {
                    title: '删除',
                    noAuth: 'delete',
                    method: api.geo_zone_del,
                    type:"danger",
                    size: 'small',
                    ghost: true,
                    params: { geo_zone_id: record.id },
                    type: 'danger',
                }, {
                    title: '配送国家',
                    noAuth: 'edit',
                    noCheck: true,
                    size: 'small',
                    ghost: true,
                    onClick: () => this.toggleWin('statevisible', { rowData: record })
                },],
                batConfig: this.props.batConfig,
                rowData: record
            }
            return obj
        }

        this.columns = [{
            title: '配送方式',
            dataIndex: 'name',
            width: '7%',
        }, {
            title: '别名',
            dataIndex: 'alias',
            width: '7%',
        }, {
            title: '预计到达',
            dataIndex: 'remark',
            width: '9%',
        }, {
            title: '运费计算方式',
            dataIndex: 'memo',
            width: '10%',
            render: (text, record) => {
                let data = text
                if (typeof text == "object" && text) {
                    if (JSON.stringify(text).length < 20) {
                        data = {
                            method_id: text
                        }
                    } else {
                        if (typeof text == "object") {
                            data = text
                        } else {
                            data = JSON.parse(text)
                        }

                    }
                }
                let method_name = '首重 + 续重'
                if (data.method_id == 'method_a') {
                    method_name = '首重 + 续重'
                } else {
                    method_name = '重量对应价格'
                }
                return <div>
                    {method_name}
                </div>
            }


        }, {
            title: '配送国家',
            dataIndex: 'country_ids',
            width: '8%',
            render: (text, record) => {

                return this.countrys(text)
            }



        },

        {
            title: '状态',
            dataIndex: 'status',
            width: 180,
            render: (text, record) => {
                return <Switch checked={record.status == '1' ? true : false} checkedChildren="启用" unCheckedChildren="禁用" onChange={(e) => this.switchChange(e, record)} />
            }
        },
        {
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onsortBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "key",
            width: '20%',
            render: (text, record, index) => {
                return <BatOperation {...this._batProps(record)} />
            }
        }];

    }
    // 修改排序值
    onsortBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        // fetch.order.sort_order_bottom_column({
        //     id: id,
        //     is_column: this.state.activeKey == 'cate' ? 1 : 0,
        //     sort_order: e.target.value
        // }).then((res) => {
        //     if (res) {
        //         message.success('修改成功')
        //     }
        // })
    }
    componentDidMount = async () => {
        this.props.changeSearch({
            pagesize: '20'
        });
        post(api.get_countrys_list).then(res => {
            if (res) {
                this.setState({
                    countrys: res.resultData
                })
            }
        })

    }
    // 国家数据
    countrys = (text) => {
        const {
            countrys
        } = this.state
        let font = ''
        if (text.length > 0) {
            for (var t = 0; t < text.length; t++) {
                for (var i = 0; i < countrys.length; i++) {
                    if (text[t] == countrys[i].id) {
                        font = font + countrys[i].name + ' , '
                        continue;
                    }
                }
            }
        }
        return <Tooltip placement="topRight" title={font}>
            <div className="font-hilde"> {font}</div>
        </Tooltip>


    }
    //启用禁用
    switchChange = (checked, record) => {
        let status = checked ? '1' : '2'
        post(api.save_geo_zone, {
            geo_zone_id: record.id,
            status
        }).then(res => {
            if (res) {
                message.success(res.resultMsg);
                this.props.changeSearch();
            }
        })
    }

    // 共享 tool 和index 
    toggleWin = (key = 'visible', otherConfig) => {
        this.setState({
            [key]: !this.state[key],
            otherConfig
        })

    }

    render() {
        const {
            countrys = []
        } = this.state;

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        }

        const contextProps = {
            visible: this.state.visible,
            statevisible: this.state.statevisible,
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            batConfig: this.props.batConfig,
            countrys,
        }
        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    changeSearch={this.props.changeSearch}
                    countrys={countrys}
                />
                <div className="header-tool">
                    <p>物流管理</p>
                    <ToolWrap />
                </div>
                <Card className="content-main">
                    <div className="content-table">
                        <Table
                            {...tableProps}
                        />
                    </div>
                </Card>
            </ListContext.Provider>
        </div>
    }
}