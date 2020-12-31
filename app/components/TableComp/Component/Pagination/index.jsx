import React from 'react';
import {
    Select,
    Icon,
    Input
} from 'antd';
const Option = Select.Option;
import './pagination.less';
/**
 *  自定义 分页插件 满足一对多的表格展示
 */
export default class Pagination extends React.Component {
    constructor(props) {
        super(props);
        const params = {
            total: 0, // 总条数
            page: 1, // 当前页
            activeIndex: props.page || 1,
            lastPage: 0, //总共多少页
            pageSize: 20, // 一页多少条
            pageSizeArray: [20, 50, 100, 200, 500].map(item => {
                return {
                    title: `${item} 条/页`,
                    key: item
                }
            }),
            totalArray: [], // 分页DOM结构
            fastPage: true, // 是否 上一页 和 下一页
        }
        this.defaultNum = 5 // 显示分页按钮数
        this.state = Object.assign(params, this.props);
        this.pageHandle = this.pageHandle.bind(this);
        this.pageInit = this.pageInit.bind(this);
        this.init = this.init.bind(this);
        this.pageSizeHandle = this.pageSizeHandle.bind(this);
    }

    // 初始化整个函数
    init() {
        const { setTotal } = this.props
        const lastPage = setTotal ? setTotal : Math.ceil(this.state.total / this.state.pageSize);
        return new Promise((resolve, reject) => {
            this.setState({
                lastPage
            }, () => {
                resolve()
            })
        })
    }

    /**
     * 渲染分页dom
     */
    pageInit() {
        let {
            lastPage,
            activeIndex
        } = this.state;
        activeIndex = parseInt(activeIndex);
        let totalArray = [];

        /**
         *  默认展示 5 条
         *  1 ... 45678...10
         * **/
        let intervalNumber = this.defaultNum;

        if (lastPage >= intervalNumber) {
            const arr = [1],
                arr1 = [],
                arr2 = [];

            if (activeIndex > intervalNumber && activeIndex < lastPage - intervalNumber) { // 取中间部分
                arr1.push('...');
                arr1.push(activeIndex - 2)
                arr1.push(activeIndex - 1)
                arr1.push(activeIndex)
                arr1.push(activeIndex + 1)
                arr1.push(activeIndex + 2)
                arr1.push('...');
            } else if (activeIndex <= intervalNumber) { // 取开头部分
                for (let i = 1; i < lastPage; i++) {
                    if (i == intervalNumber || i + 1 == lastPage) {
                        break;
                    }
                    arr1.push(i + 1);
                }
                if (lastPage > intervalNumber) {
                    arr1.push('...')
                }
            } else if (activeIndex >= lastPage - intervalNumber) { // 取末尾部分
                arr1.push('...');
                for (let i = lastPage - intervalNumber; i < lastPage; i++) {
                    if (i == lastPage) {
                        break;
                    }
                    arr1.push(i);
                }
            }
            arr2.push(lastPage);
            totalArray = totalArray.concat(arr, arr1, arr2)
        } else {
            for (let i = 0; i < lastPage; i++) {
                totalArray.push(i + 1)
            }
        }
        this.setState({
            totalArray
        });
    }

    componentWillMount() {
        this.init().then(() => {
            this.pageInit()
        });
    }

    // props 改变时 触发的函数
    componentWillReceiveProps(props) {
        setTimeout(() => {
            this.state = Object.assign(this.state, props);
            this.state.activeIndex = this.state.page
            this.init().then(() => {
                this.pageInit()
            });
        }, 0)
    }

    // 重置分页数据
    resetPage(current) {
        const { oriPagination } = this.props;
        oriPagination.current = current
        this.props.onPageChang(oriPagination, {}, {});
        this.pageInit();
    }

    /**
     * 控制分页跳转
     * @param {string} type 控制分页
     */
    pageHandle(type = 'prev') {
        const { activeIndex, lastPage } = this.state
        let index = activeIndex
        if (type == 'prev' && activeIndex < lastPage) {
            index = activeIndex + 1;
        } else if (type == 'next' && activeIndex > 1) {
            index = activeIndex - 1;
        } else if (type == 'jump') {
            index = e.target.value
        }
        if (activeIndex != index) {
            this.setState({
                activeIndex: index
            }, () => {
                this.resetPage(index)
            })
        }
    }

    /**
     * 数字按钮事件
     * @param {string} item 
     * @param {string} index 按钮索引
     */
    itemClick(item, index) {
        let { activeIndex } = this.state;
        if (item == '...' && index > 2) {
            activeIndex += 5;
        } else if (item == '...' && index < 5) {
            activeIndex -= 5;
        } else {
            activeIndex = item;
        }
        this.setState({
            activeIndex
        }, () => {
            this.resetPage(activeIndex)
        })
    }

    /**
     * 选择每页显示事件
     * @param {string} pageSize 分页数
     */
    pageSizeHandle(pageSize) {
        const { oriPagination } = this.props;
        oriPagination.pageSize = pageSize;
        this.setState({
            pageSize
        }, () => {
            this.init().then(() => {
                this.pageInit()
            });
            this.props.onPageChang(oriPagination, {}, {});
        })
    }

    render() {
        const { totalArray, activeIndex, pageSizeArray, fastPage, lastPage, pageSize } = this.state;
        const totalHtml = totalArray.map((item, index) => <span onClick={this.itemClick.bind(this, item, index)} key={index} className={`${item == activeIndex ? 'text-active' : ''}`}>{item}</span>)
        const pageSizeHtml = pageSizeArray.map((item, index) => <Option key={index} value={item.key}>{item.title}</Option>)
        const nextPage = fastPage ? (<button disabled={activeIndex == lastPage} onClick={() => this.pageHandle('next')} className='next-page'><Icon type="right" /></button>) : '';
        const prevPage = fastPage ? (<button disabled={activeIndex == 1} onClick={() => this.pageHandle('prev')} className='prev-page'><Icon type="left" /></button>) : '';
        return (
            <div id='pagination'>
                <div className={'page-content'}>
                    <div className={'text-total'}>总计{this.state.total}条记录</div>
                    {prevPage}
                    <div className={'text-content'}>{totalHtml}</div>
                    {nextPage}
                    {
                        !this.props.setTotal && <div className="pageSize">
                            <Select defaultValue={parseInt(pageSize)} onChange={this.pageSizeHandle} >
                                {pageSizeHtml}
                            </Select>
                        </div>
                    }
                    <div className="jump">
                        <span>跳至</span>
                        <Input onPressEnter={(e) => this.pageHandle('jump', e)} />
                        <span>页</span>
                    </div>
                </div>
            </div>
        )
    }
}