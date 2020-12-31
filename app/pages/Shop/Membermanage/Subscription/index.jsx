import React, { Component } from 'react';
import pageConfig from './Config';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import {
    Card,
    Input
} from 'antd';

@DataOper(pageConfig)
export default class Subscription extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            areaList: []
        }

        this.columns = [{
            title: '会员名称',
            dataIndex: 'email',
            render: (text, record) => {
                return <div>
                    {this.showdevice(record.register_device)}   {record.email}
                </div>
            }
        }, {
            title: '订阅状态',
            dataIndex: 'newsletter',
            render: (text, record) => {
                let data = text == 1 ? '已订阅' : '未订阅'
                return <span>{data}</span>
            }
        }, {
            title: '注册状态',
            dataIndex: 'customer_id',
            render: (text, record) => {
                let data = text > 0 ? '已注册' : '未注册'
                return <span>{data}</span>
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
        ];
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
    // 根据状态显示图片
    showdevice = (type) => {
        if (type == 'computer') { //pc
            return <i className="iconfont shop_ziyuan24"></i>
        } else if (type == 'phone') { //移动
            return <i className="iconfont shop_ziyuan25"></i>
        }
        else {
            return ''
        }
    }
    componentDidMount = () => {
        this.props.changeSearch();
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
        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,

            batConfig: this.props.batConfig,
            changeSearch: this.props.changeSearch,
        };


        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    changeSearch={this.props.changeSearch} />
                <div className="header-tool">
                    <p>订阅列表</p>
                    <ToolWrap />
                </div>
                <Card
                    className="content-main">
                    <div className="content-table">
                        <Table {...tableProps} />
                    </div>
                </Card>
            </ListContext.Provider>
        </div>
    }
}