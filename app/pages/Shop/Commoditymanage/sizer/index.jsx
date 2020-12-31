import React, { Component } from 'react';
import pageConfig from './Config';
import api from '@/fetch/api';
import { is, fromJS } from 'immutable';
import { post } from '@/fetch/request';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import {
    Card,
    message,
    Input,
    Switch
} from 'antd';

@DataOper(pageConfig)
export default class LogisticsMode extends Component {
    static defaultProps = {};
    state = {}
    componentDidMount = () => {
        this.props.changeSearch();
    }



    constructor(props, context) {
        super(props, context);

        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '编辑',
                    noAuth: 'edit',
                    noCheck: true,
                    ghost: true,
                    onClick: () => this.Jumppage(rowData.id, 'edit')
                }, {
                    title: '复制',
                    noAuth: 'detail',
                    noCheck: true,
                    ghost: true,
                    onClick: () => this.Jumppage(rowData.id, 'copy')
                },],
                method: '',
                unicode: 'ids|id',
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [{
            title: '筛选器组名称',
            dataIndex: 'name',
        }, {
            title: '筛选器组别称',
            dataIndex: 'alias',
        }, {
            title: '筛选值',
            dataIndex: 'value',
            render: (text, row) => {
                return <div>
                    {
                        text.join('; ')
                    }
                </div>
            }
        }, {
            title: '排序',
            dataIndex: 'sort_order',
            render: (text, row) => {
                return <div>
                    <Input onChange={this.handelChange.bind(this)} onBlur={() => this.onPressEnterInput(row)} defaultValue={text} />
                </div>
            }
        }, {
            title: '操作',
            dataIndex: "operation",
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                return <div style={{ display: 'flex' }}>
                    <Switch onChange={(e) => this.onSwitch(record, e)} checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={record.status == 1 ? true : false} />
                    <BatOperation {..._batProps(record)} />
                </div>
            }
        }];

    }
    // 启用禁用
    onSwitch = (record, e) => {
        post(api.save_filter_list, {
            id: record.id,
            status: e ? 1 : 0
        }).then(res => {
            if (res) {
                message.success(res.msg);
                this.props.changeSearch();
            }
        })
    }

    // 获取排序值
    handelChange(e) {
        this.setState({
            inpValu: e.target.value
        })
    }
    // 修改排序值
    onPressEnterInput = (react) => {
        post(api.save_filter_list, {
            id: react.id,
            sort_order: this.state.inpValu
        }).then(res => {
            if (res) {
                this.props.changeSearch();  //修改后重新请求数据
            }
        })
    }
    //启用禁用
    switchChange = (checked, record) => {
        let status = checked ? '1' : '2'
        post(api.user_manager_edit, {
            id: record.id,
            status
        }).then(res => {
            if (res) {
                message.success(res.resultMsg);
                this.props.changeSearch();  //修改后重新请求数据
            }
        })
    }

    //打开页面。通过id区分编辑或复制
    Jumppage = (id, type) => {
        const routeList = ['Sizerporedit'];
        if (id) {
            routeList.push(id)
            routeList.push(type)
        } else {
            routeList.push('add')
            routeList.push(type)
        }
        this.props.goLink({
            pathname: `/${routeList.join("/")}`,
            query: {} //参数备用
        }, {
            type,
        })
    }

    render() {

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };

        const contextProps = {
            api,
            selectedRows: this.props.selectedRows,
            Jumppage: this.Jumppage,
            ...this.state.otherConfig,
            batConfig: this.props.batConfig,
            deleteButton: this.deleteButton,
            searchValues: this.state.searchValues
        };

        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <div className="header-tool">
                    <p>筛选器组</p>
                    <ToolWrap />
                </div>
                <Card className="content-main">
                    <div className="content-table">
                        <Table {...tableProps} />
                    </div>
                </Card>
            </ListContext.Provider>
        </div>
    }
}