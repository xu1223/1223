import React, { Component } from 'react';
import api from '@/fetch';
import pageConfig, { TabApi } from './Config';

import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import './index.less'
import {
    Card,
    Input,
    Switch,
    message
} from 'antd';

@DataOper(pageConfig)
export default class PositionManage extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {
            areaList: [],
            channel_contrast: [],
            listdata: [],

        }

        this.columns = [{
            title: '语言名称',
            dataIndex: 'name',
        }, {
            title: '中文名',
            dataIndex: 'name_cn',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => {
                return <Switch
                    disabled={record.default == 1 ? true : false}
                    defaultChecked={text == 1 ? true : false}
                    onChange={(e) => this.onChange(e, record.id)} />
            }

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            render: (text, record) => {
                return <Input
                    disabled={record.default == 1 ? true : false}
                    defaultValue={text}
                    onBlur={value => this.onBlur(value, record.id, text)}>
                </Input>
            }
        },

        ]



    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return
        }
        api.order.edit_language_sort_order({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
            }
        })
    }
    //  修改状态
    onChange = (e, id) => {
        api.order.language_active({
            id: id,
            is_active: e ? 1 : 0
        }).then((res) => {
            if (res) {
                message.success('修改成功')
            }
        })
    }



    componentDidMount = () => {
        this.props.changeSearch({})
    }




    render() {
        const {


            channel_contrast,
            rowData,
        } = this.state;

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };
        const {
        } = this.props;

        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            jumpPage: this.jumpPage,
            batConfig: this.props.batConfig,

            channel_contrast,
            changeSearch: this.props.changeSearch,
            rowData
        };


        return <div className="tabSwitching">

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        changeSearch={this.props.changeSearch}

                        channel_contrast={channel_contrast}
                    />
                    <div className="header-tool">
                        <p>语言设置</p>
                    </div>
                    <Card
                        className="content-main">
                        <div className="content-table" style={{ paddingTop: '20px' }}>
                            <Table {...tableProps} />
                        </div>
                    </Card>
                </ListContext.Provider>
            </div>
        </div>

    }
}