import React, { Component } from 'react';
import {
    Table
} from 'antd';
// import Table from './Component/Table'
// import Pagination from '../Pagination/index'

export default class TableScroll extends Component {
    static getDerivedStateFromProps(nextProps) {
        // console.log(nextProps)
        return {

        }
    }

    static defaultProps = {
        pagination: {
            showTotal: function (total) {
                return `总计 ${total} 条记录`
            },
            current: 1,
            showQuickJumper: true,
        },
        tableType: "normal",
        columns: [{
            title: 'null',
            dataIndex: 'id'
        }],
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            pagesNumber: 1,
            pagesMax: parseInt(props.dataSource.length / 20),
            allData: props.dataSource,
            dataSource: props.dataSource.slice(0, 20) || [],
        }
        this.expandObj = {};
    }
    componentDidMount() {
    }
    getColumn = (row, str, count) => {
        const {
            index_1,
            index_2
        } = row;

        const column_obj = {
            children: str,
            props: {}
        }

        if (count == undefined) {
            column_obj.props.rowSpan = index_1 == 1 ? index_2 : 0;
        } else {
            if (index_2 > 2) {
                column_obj.props.colSpan = index_1 == index_2 ? count : 1;
                if (index_1 == index_2)
                    column_obj.children = this._getExpandItem(row)
            }
        }
        return column_obj;
    }

    //重置列定义
    resetTableColumns = (columns = []) => {
        return columns.map(item => {
            const {
                ColSpan,
                render: renderItem,
                ..._item
            } = item;

            if (item.children) {
                return {
                    ..._item,
                    children: item.children.map(__item => {
                        const {
                            ColSpan,
                            render: renderItem,
                            ..._item
                        } = __item
                        return {
                            ..._item,
                            render: (text, row, index) => {
                                return this.getColumn(row, renderItem != undefined ? renderItem(text, row, index) : text, ColSpan)
                            }
                        }
                    })
                }
            } else {
                return {
                    ..._item,
                    render: (text, row, index) => {
                        return this.getColumn(row, renderItem != undefined ? renderItem(text, row, index) : text, ColSpan)
                    }
                }
            }

        });
    }

    // 針對有收縮的情況
    resetTableData = (dataSource = []) => {
        const tableData = [];
        const { subKey } = this.props;
        dataSource.map((item, windex) => {
            let {
                list,
                skuDetailList,
                list: listData,
                key,
                ..._item
            } = item;
            list = skuDetailList || list;
            if (!!subKey) {
                list = item[subKey] || []
            }
            list = list.length == 0 ? [{}] : list;
            listData = list;
            const maxLen = list.length;

            const groupId = key != undefined ? key : (_item.id || _item.spuId);

            let index_2 = listData.length;

            if (maxLen > 2) {
                index_2 = !this.expandObj[groupId] ? 3 : maxLen + 1;
            }
            listData.map((_iitem, index) => {
                const {
                    id,
                    spuId,
                    updateUser,
                    createUser,
                    image,
                    ...iitem
                } = _iitem;
                if (index < index_2) {
                    const _listItem = {
                        ..._item,
                        ...iitem,
                        index_1: index + 1,
                        maxLen,
                        index_2,
                        key: (key || _item.id || _item.spuId) + "_" + index,
                        groupId,
                        windex,
                        parent: _item
                    };
                    if (maxLen > 2 && !this.expandObj[groupId] && index == 2)
                        _listItem.isFlagExpand = true;
                    tableData.push(_listItem)
                }
            })

            if (this.expandObj[groupId] && maxLen > 2) {
                const _iitem = listData[listData.length - 1]; // 获取
                const {
                    id,
                    spuId,
                    ...iitem
                } = _iitem;
                tableData.push({
                    ..._item,
                    ...iitem,
                    index_1: index_2,
                    index_2,
                    maxLen,
                    key: (_item.id || _item.spuId) + "expand",
                    groupId,
                    windex,
                    isFlagExpand: true
                })
            }
        })
        return tableData;
    }

    toggle = (row) => {
        this.expandObj[row.groupId] = !this.expandObj[row.groupId];
        this.setState({
            dataSource: this.resetTableData(this.props.dataSource),
        })
    }

    _getExpandItem = (row) => {
        return <a className="row-table-more" onClick={() => this.toggle(row)}>
            {!this.expandObj[row.groupId] ? `查看更多${this.props.moreTip} (${row.maxLen})` : `收起${this.props.moreTip}`}
        </a>
    }

    //js实现： 以下代码在横向滑动时也会加载数据--BUG
    onScrollEvent(el) {
        const { loading, allData, pagesNumber,pagesMax } = this.state
        if (el.scrollRef.scrollTop + el.scrollRef.clientHeight + 10 > el.scrollRef.scrollHeight && !loading && pagesNumber <= pagesMax) {
            this.setState({ loading: true })

            let _pagesNumber = pagesNumber + 1
            let _dataSource = allData.slice(0, _pagesNumber * 20)
            console.info('到底了！', _dataSource, _pagesNumber);
            setTimeout(() => {
                this.setState({
                    loading: false,
                    dataSource: _dataSource,
                    pagesNumber: _pagesNumber,
                })
                console.log('已加载！！')
            }, 1000);


            // 这里去做你的异步数据加载

        }
    }

    render() {
        const {
            columns,
            // dataSource,
            // pagination
        } = this.props;
        const {
            dataSource = [],
            allData
        } = this.state;
        console.log(dataSource, "dataSource")
        return [
            <div
                style={{ height: '300px', overflowY: 'scroll' }}
                onScrollCapture={() => this.onScrollEvent(this)}
                ref={c => {
                    this.scrollRef = c;
                }}
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
            </div>
        ]
    }
}