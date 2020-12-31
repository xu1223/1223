import React, { Component } from 'react';
import Table from './Component/Table'
import { Checkbox, Icon, Menu, Dropdown } from 'antd';
import Pagination from './Component/Pagination/'

export default class TableComp extends Component {
    static getDerivedStateFromProps(nextProps) {
        return {
            dataSource: nextProps.dataSource || [],
        }
    }

    static defaultProps = {
        pagination: {
            showTotal: (total) => `总计 ${total} 条记录`,
            current: 1,
            showQuickJumper: true,
        },
        tableType: "normal",
        columns: [{ title: 'ID', dataIndex: 'id' }],
    }

    constructor(props, context) {
        super(props, context);
        this.state = {}
        this.expandObj = {};
        this.moreNum = Number(props.moreNum) || 2; // 子SKU默认显示数量
        this.ctrlFlag = false
        this.menu = (
            <Menu onClick={this.onSelectCheck}>
                <Menu.Item key="all" style={{ minWidth: 96 }}>
                    全选当页
                </Menu.Item>
                <Menu.Item key="fan" style={{ minWidth: 96 }}>
                    反选当页
                </Menu.Item>
            </Menu>
        );
    }
    // changeKeyStatus = (e) => {
    //     e = e ? e : window.event;
    //     var keyCode = e.which ? e.which : e.keyCode;
    //     // 判断ctrl
    //     if (keyCode == 17) {
    //         this.ctrlFlag = e.ctrlKey
    //     }
    // }

    onSelectCheck = (obj) => {
        const { tableKey = 'key' } = this.props;
        if (obj.key == 'fan') {
            this.ctrlFlag = true
        }
        this.onCheckChange({ target: { checked: true } }, {}, tableKey, 'all')
    }

    // componentDidMount() {
    //     document.addEventListener('keydown', this.changeKeyStatus, false);
    //     document.addEventListener('keyup', this.changeKeyStatus, false);
    // }

    // componentWillUnmount() {
    //     document.removeEventListener('keydown', this.changeKeyStatus, false);
    //     document.removeEventListener('keyup', this.changeKeyStatus, false);
    // }

    /**
     * 切换
     * @param {object} row 行数据
     */
    _toggle = (row) => {
        this.expandObj[row.groupId] = !this.expandObj[row.groupId];
        this.setState({
            dataSource: this.resetTableData(this.props.dataSource),
        })
    }

    /**
     * 渲染操作行
     * @param {object} row 行数据
     */
    _getExpandItem = (row) => {
        const { moreTip = '' } = this.props
        return <a className="row-table-more row-table-moreSKU-center" onClick={() => this._toggle(row)}>
            {!this.expandObj[row.groupId] ? `查看更多${moreTip} (${row.maxLen})` : `收起${moreTip}`}
        </a>
    }

    // 计算表格高度
    calculationHeight = () => {
        const { tableId = 'main-table', h = '' } = this.props;
        let element = document.getElementById(tableId);  // 获取表格DOM
        if (element) {
            let t = element.offsetTop;
            while (element = element.offsetParent) {
                t += element.offsetTop;
            }
            return t + 80 - h
        }
    }

    /**
     * 渲染单个列
     * @param {object} row 当前行数据
     * @param {*} str Dom 节点
     * @param {*} count colSpan 多少列
     */
    _getColumn = (row, str, count) => {
        if (str && str.children) {
            return str;
        }
        const { index_1, index_2 } = row;
        const column_obj = { children: str, props: {} }
        if (count == undefined) {
            column_obj.props.rowSpan = index_1 == 1 ? index_2 : 0;
        } else if (index_2 > this.moreNum) {
            const isEnd = index_1 == index_2
            column_obj.props.colSpan = isEnd ? count : 1;
            if (isEnd) {
                column_obj.children = this._getExpandItem(row)
            }
        }
        return column_obj;
    }

    /**
     * @desc 重置列表勾选数据定义
     * @param {object} e Event
     * @param {object} row 行数据
     * @param {string} key key值
     * @param {string} type 勾选类型 one all
     */
    onCheckChange = (e, row, key, type) => {
        const {
            rowSelection: { selectedRowKeys, onChange }
        } = this.props
        let dataSource = JSON.parse(JSON.stringify(this.props.dataSource))
        dataSource.forEach((item, index) => {
            const groupId = item.key || item.id || item.spuId
            item[key] = [groupId, 0, index].join('_')
        })

        let selectedRows = []
        let listSelData = selectedRowKeys || []
        if (type == 'one') { // 单行
            if (e.target.checked) { // 添加单行数据
                listSelData.push(row[key])
            } else { // 删除对应行已选中数据
                let findIndex = listSelData.findIndex(item => item == row[key]) // 获取勾选行数据下标
                listSelData.splice(findIndex, 1);
            }
        } else { // 全选或清空
            if (this.ctrlFlag == true) {
                listSelData = dataSource.filter(item => !listSelData.find(_item => _item == item[key])).map(item => item[key])
            } else {
                listSelData = e.target.checked ? dataSource.map(item => item[key]) : []
            }
        }
        dataSource.forEach(item => {
            let findIndex = listSelData.findIndex(obj => obj == item[key])
            findIndex != '-1' && selectedRows.push(item)
        })
        onChange(listSelData, selectedRows) // 设置勾选数据
        this.ctrlFlag = false
    }
    // 重置列定义
    resetTableColumns = (columns = [], key) => {
        if (!!this.props.rowSelection) { // 对选择功能的配置进行重定义
            const { dataSource, rowSelection: { selectedRowKeys } } = this.props
            let checkAll = selectedRowKeys && selectedRowKeys.length == dataSource.length // 是否全选
            let isCheck = selectedRowKeys && selectedRowKeys.length > 0 && !checkAll // 是否有选中且不是全选
            if (!!columns[0] && columns[0].dataIndex != 'check_box') { // 设置勾选框配置项
                columns.unshift({
                    title: <div style={{ position: 'relative' }}><Checkbox indeterminate={isCheck} checked={checkAll} onChange={(e) => this.onCheckChange(e, {}, key, 'all')}></Checkbox><Dropdown overlay={this.menu}><Icon type="down" style={{ position: 'absolute', right: -13, top: 5, fontSize: 12, color: '#bfbfbf' }} /></Dropdown></div>,
                    dataIndex: 'check_box',
                    align: 'center',
                    width: 45,
                    render: (text, row = {}, index) => {
                        const { rowSelection: { selectedRowKeys } } = this.props
                        let findIndex = selectedRowKeys && selectedRowKeys.findIndex(item => item == row.key)
                        return (
                            <Checkbox checked={findIndex != '-1' && findIndex != undefined} onChange={(e) => this.onCheckChange(e, row, key, 'one')}></Checkbox>
                        )
                    }
                })
            } else if (!!columns[0] && columns[0].dataIndex == 'check_box') { // 存在勾选框时 进行重新渲染全选表头
                columns[0].title = <div style={{ position: 'relative' }}><Checkbox indeterminate={isCheck} checked={checkAll} onChange={(e) => this.onCheckChange(e, {}, key, 'all')}></Checkbox><Dropdown overlay={this.menu}><Icon type="down" style={{ position: 'absolute', right: -13, top: 5, fontSize: 12, color: '#bfbfbf' }} /></Dropdown></div>
            }
        }
        return columns.map((item) => {
            const {
                ColSpan,
                render: renderItem,
                ..._item
            } = item;
            // 存在子列的情况
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
                                return this._getColumn(row, renderItem != undefined ? renderItem(text, row, index) : text, ColSpan)
                            }
                        }
                    })
                }
            } else {
                return {
                    ..._item,
                    render: (text, row, index) => {
                        return this._getColumn(row, renderItem != undefined ? renderItem(text, row, index) : text, ColSpan)
                    }
                }
            }
        });
    }

    /**
     * 存在 一对多的情况 需要的数据进行 扩展处理
     * @param {array} dataSource 表格原始数据
     */
    resetTableData = (dataSource = []) => {
        const tableData = [];
        const { subKey } = this.props;
        const { moreNum } = this
        dataSource.forEach((item, windex) => {
            let {
                list,
                skuDetailList,
                key,
                ..._item
            } = item;

            // 兼容历史数据 skuDetailList 后面都是用subKey 来获取值
            list = !!subKey ? item[subKey] : (skuDetailList || list);
            // 兼容非法数据
            const listData = !list || !list.length ? [{}] : list
            const maxLen = listData.length
            // 获取每组的id
            const groupId = key || _item.id || _item.spuId
            const expandSt = this.expandObj[groupId]
            const index_2 = maxLen > moreNum ? (!expandSt ? moreNum + 1 : maxLen + 1) : maxLen

            listData.forEach((_iitem, index) => {
                const { id, spuId, image, updateUser, createUser, ...iitem } = _iitem;
                if (index < index_2) {
                    const obj = {
                        ..._item,
                        ...iitem,
                        index_1: index + 1,
                        index_2,
                        windex,
                        maxLen,
                        key: [groupId, index, windex].join('_'),
                        groupId,
                        id_2: id,
                        parent: _item
                    }
                    obj.isFlagExpand = maxLen > 2 && !expandSt && index == 2
                    tableData.push(obj)
                }
            })

            if (expandSt && maxLen > moreNum) {
                const { id, spuId, ...iitem } = listData[listData.length - 1]
                tableData.push({
                    ..._item,
                    ...iitem,
                    index_1: index_2,
                    index_2,
                    maxLen,
                    key: `${groupId}expand`,
                    groupId,
                    windex,
                    isFlagExpand: true
                })
            }
        })
        return tableData;
    }
    // /**
    //  * @method
    //  * @desc 计算高度 详情
    //  * @param {*} tableId 
    //  * @author zhangyj 2020-8-25 add
    //  */
    // calculationHeightInfo = (tableId)=>{

    //     if(document.querySelector('#'+tableId)){ //是否存在
    //         //详情
    //         const _dom =  document.querySelector('#'+tableId);
    //         const _parent =_dom.parentNode.parentNode.parentNode.parentNode.parentNode;
    //         // ['ant-card-body','win-order-info-con','order-table','info']
    //         //需要排除的样式名称
    //         const _className = ['win-order-info-con','order-table','info'];
    //         _className.forEach(item=>{
    //             if(_parent.classList.contains(item)){
    //                 _parent.querySelector("#restTableStyle").style.height="auto";
    //                 return false;
    //             }
    //         });
    //     }
    // }
    render() {
        const {
            pagination,
            total,
            scroll,
            tableType,
            tableId = 'main-table',
            tableKey = 'key', // 一对多行数据key值定义
            totals = '', // 添加总计行
            ...tableProps
        } = this.props;
        let { dataSource = [] } = this.state;
        let pageExpandProps = {};
        if (totals && dataSource.length) {
            dataSource= [...dataSource]
            dataSource.push(totals)
        }
        if (tableType == "normal") {
            tableProps.dataSource = dataSource;
            tableProps.pagination = pagination;
            if (!tableProps.rowKey) {
                tableProps.rowKey = record => record.id
            }
            tableProps.columns = tableProps.columns.filter(item => {
                const { visible = true } = item
                return visible
            })
            // todo 未确定使用场景
            tableProps.scroll = scroll;
        } else {

            tableProps.dataSource = this.resetTableData(dataSource) // 重置表格数据
            tableProps.columns = this.resetTableColumns(this.props.columns, tableKey).filter(item => {
                const { visible = true } = item
                return visible
            }) //重置列定义
            tableProps.pagination = false // 删除默认分页
            tableProps.rowSelection = false // 禁用antd默认勾选 
            tableProps.rowKey = record => record.key //重置rowKey
            tableProps.rowClassName = (record) => {
                const { isFlagExpand, groupId } = record
                let className = 'row-table-default'
                if (isFlagExpand) {
                    className += 'row-table-tool'
                } else if (this.expandObj[groupId]) {
                    className += 'row-table-blue'
                }
                return className
            }
            pageExpandProps = {
                total: pagination.total,
                page: pagination.current,
                pageSize: pagination.pageSize,
                onPageChang: tableProps.onChange,
                oriPagination: pagination
            }
        }
        return <>
            <Table key='table' bordered id={tableId} scrollTopHeight={this.calculationHeight()} {...tableProps} />
            { tableType == 'expand' && !!pageExpandProps.total && <Pagination key='table-pagination' {...pageExpandProps} />}
        </>
    }
}