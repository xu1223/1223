import React, { Component } from 'react';
import pageConfig from './Config';
import api from 'fetch/api';
import fetch from 'fetch/index';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import {
    Card,
    message,
    Switch,
    Input
} from 'antd';

@DataOper(pageConfig)
export default class LogisticsMode extends Component {
    static defaultProps = {};
    state = {
        visible: false,
        addshow: false,//新增编辑控制
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
                    onClick: () => this.toggleWin('addshow', rowData)
                }, {
                    title: '删除',
                    noAuth: 'del',
                    method: api.del_search,
                    type:"danger",
                    unicode: 'search_ids|id',
                },],
                method: '',
                unicode: 'search_ids|id',
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [{
            title: '标签名称',
            dataIndex: 'keyword',
        }, {
            title: '商品数量',
            dataIndex: 'product_total',
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
            dataIndex: "id",
            render: (text, record) => {

                return (
                    <BatOperation {..._batProps(record)} />
                )
            }
        }];

    }
    /**
     * 
     * @param {* string} key 
     * @param {*} rowData 
     */
    toggleWin = (key = 'visible', rowData) => {
        this.setState({
            [key]: !this.state[key],
            rowData
        })
    }



    // 修改排序值
    onsortBlur = (e, id, text) => {
        if (e.target.value == text) {
            return
        }
        fetch.order.sort_order_search({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                this.props.changeSearch();
                message.success('修改成功')
            }
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
            batConfig: this.props.batConfig,

        };

        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <div className="header-tool">
                    <p>商品标签</p>
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