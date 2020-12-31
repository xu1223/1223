import React, { Component } from 'react';
import pageConfig from './Config';
import api from 'fetch/api';
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
    Switch,
    Popover
} from 'antd';

@DataOper(pageConfig)
export default class LogisticsMode extends Component {
    static defaultProps = {};
    state = {
        visible: false,
        addshow: false,
        editshow: false,
        isstate: false
    }
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
                    visible: rowData.name == 'Color' || rowData.name == 'Size' ? false : true,
                    onClick: () => this.toggleWin('addshow', rowData)
                }, {
                    title: '添加',
                    noAuth: 'detail',
                    noCheck: true,
                    ghost: true,
                    onClick: () => this.toggleWin('editshow', rowData)
                },],
                method: '',
                unicode: 'ids|id',
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [{
            title: '属性名称',
            dataIndex: 'name',
        }, {
            title: '属性值',
            dataIndex: 'channel_name',
            render: (text, record) => {
                const content = (
                    <div style={{ maxWidth: '500px', wordWrap: 'break-word' }}>
                        {
                            record.option_values.map(item => {
                                return <span style={{ marginRight: '10px' }}>{item.name}</span>
                            })
                        }
                    </div>
                )
                return (
                    <Popover content={content} title="属性值" trigger="hover">
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{content}</div>
                    </Popover>
                )
            }
        }, {
            title: '操作',
            dataIndex: "id",
            render: (text, record) => {

                return (
                    <div style={{ display: 'flex' }}>
                        {
                            record.name == 'Color' || record.name == 'Size' ? '' : <Switch onChange={(e) => this.onSwitch(record, e)} checkedChildren="启用" unCheckedChildren="禁用" checked={record.status == 1 ? true : false} />
                        }
                        <BatOperation {..._batProps(record)} />
                    </div>
                )
            }
        }];

    }
    changetable = () => {  //控制新增弹窗。回调
        this.setState({
            isstate: !this.state.isstate
        })
        this.props.changeSearch();
    }
    // 启用禁用  
    onSwitch = (record, e) => {
        post(api.save_param_option_status, {
            option_id: record.id,
            status: e ? 1 : 0
        }).then(res => {
            if (res) {
                message.success(res.msg);
                this.props.changeSearch();
            }
        })
    }

    // 共享 tool 和index 
    toggleWin = (key = 'visible', rowData) => {
        this.setState({
            [key]: !this.state[key],
            rowData
        })
    }



    render() {

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };

        const contextProps = {
            selectedRows: this.props.selectedRows,
            ...this.state,
            toggleWin: this.toggleWin,
            addshow: this.state.addshow,
            editshow: this.state.editshow,
            batConfig: this.props.batConfig,
            changetable: this.changetable
        };

        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <div className="header-tool">
                    <p>商品属性</p>
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