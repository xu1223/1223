import React from 'react';
import {
    Select,
    Icon,
    Input
} from 'antd';
const Option = Select.Option;

import './pagination.less';
/**
 *  分页插件
 *  @param total // 总条数
 *  @param page // 当前页
 *  @param pageSize // 一页多少条
 *  @param fastPage // 是否有上一页 或者 下一页
 *  @param onPageChange // 回调函数 页数改变时触发
 *  @param onPageSize // 回调函数，一页多少条时改变
 * **/

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        let params = {
            total: 0, // 总条数
            page: props.page || 1, // 当前页
            pageSize: props.pageSize || 20, // 一页多少条
            pageSizeArray: [{
                title: '20 条/页',
                key: 20,
            }, {
                title: '50 条/页',
                key: 50,
            }, {
                title: '100 条/页',
                key: 100,
            }, {
                title: '200 条/页',
                key: 200,
            }, {
                title: '500 条/页',
                key: 500,
            }, ],
            totalArray: [],
            activeIndex: props.page || 1,
            fastPage: true, // 是否 上一页 和 下一页
            defaultNum: 5,
            pageNum: 0, //总共多少页
            jumpValue: '',
        }
        this.state = Object.assign(params, this.props);
        this.nextHandle = this.nextHandle.bind(this);
        this.prevHandle = this.prevHandle.bind(this);
        this.pageInit = this.pageInit.bind(this);
        this.init = this.init.bind(this);
        this.pageSizeHandle = this.pageSizeHandle.bind(this);
    }
    init() { // 初始化整个函数
        let pageNum = Math.ceil(this.state.total / this.state.pageSize);
        if (this.props.setTotal) {
            pageNum = this.props.setTotal
        }
        
        return new Promise((resolve, reject) => {
            this.setState({
                pageNum: pageNum
            }, () => {
                resolve()
            })
        })
    }

    pageInit() {
        let {
            pageNum,
            defaultNum,
            activeIndex
        } = this.state;
        activeIndex = parseInt(activeIndex);
        let totalArr = [];
        /**
         *  默认展示 5 条
         *  1 ... 45678...10
         * **/
        let intervalNumber = defaultNum;
        //this.changePageSize()
        if (pageNum >= intervalNumber) {
            let arr = [],
                arr1 = [],
                arr2 = [];
            arr.push(1);

            if (activeIndex > intervalNumber && activeIndex < pageNum - intervalNumber) { // 取中间部分
                arr1.push('...');
                arr1.push(activeIndex - 2)
                arr1.push(activeIndex - 1)
                arr1.push(activeIndex)
                arr1.push(activeIndex + 1)
                arr1.push(activeIndex + 2)
                arr1.push('...');

            } else if (activeIndex <= intervalNumber) { // 取开头部分
                for (let i = 1; i < pageNum; i++) {
                    if (i == intervalNumber || i + 1 == pageNum) {
                        break;
                    }
                    arr1.push(i + 1);
                }
                if (pageNum > intervalNumber) {
                    arr1.push('...')
                }
            } else if (activeIndex >= pageNum - intervalNumber) { // 取末尾部分
                arr1.push('...');
                for (let i = pageNum - intervalNumber; i < pageNum; i++) {
                    if (i == pageNum) {
                        break;
                    }
                    arr1.push(i);
                }
            }
            arr2.push(pageNum);
            totalArr = totalArr.concat(arr, arr1, arr2)
        } else {
            for (let i = 0; i < pageNum; i++) {
                totalArr.push(i + 1)
            }
        }

        this.setState({
            totalArray: totalArr
        });
    }
    componentWillMount() { // 相当于mouted
        this.init().then(() => {
            this.pageInit()
        });
    }
    componentWillReceiveProps(props) { // props 改变时 触发的函数
        setTimeout(() => {
            this.state = Object.assign(this.state, props);
            this.state.activeIndex = this.state.page
            this.init().then(() => {
                this.pageInit()
            });
        }, 0)
    }

    nextHandle() {
        const {
            oriPagination
        } = this.props;
        let _this = this;
        if (this.state.activeIndex < this.state.pageNum) {
            let index = this.state.activeIndex + 1;

            this.setState({
                activeIndex: index
            }, () => {
                oriPagination.current = index
                _this.props.onPageChang(oriPagination, {}, {});
                _this.pageInit();

            })
        }
    }
    prevHandle() {
        const {
            oriPagination
        } = this.props;
        let _this = this;
        if (this.state.activeIndex > 1) {
            let index = this.state.activeIndex - 1;
            this.setState({
                activeIndex: index
            }, () => {
                oriPagination.current = index
                _this.props.onPageChang(oriPagination, {}, {});
                _this.pageInit();

            })
        }
    }
    jumpChange = (e) => {
        const activeIndex = e.target.value;
        const {
            oriPagination
        } = this.props;
        let _this = this;

        this.setState({
            activeIndex
        }, () => {
            oriPagination.current = activeIndex
            _this.props.onPageChang(oriPagination, {}, {});
            _this.pageInit();

        });
    }
    itemClick(item, index) {
        let _this = this;
        let num = this.state.activeIndex;
        const {
            oriPagination
        } = this.props;
        if (item == '...' && index > 2) {
            num += 5;
        } else if (item == '...' && index < 5) {
            num -= 5;
        } else {
            num = item;
        }
        this.setState({
            activeIndex: num
        }, () => {
            //console.log(num)
            oriPagination.current = num
            _this.pageInit()
            _this.props.onPageChang(oriPagination, {}, {});

        })
    }
    pageSizeHandle(val) {
        let _this = this;
        const {
            oriPagination
        } = this.props;
        oriPagination.pageSize = val;
        this.setState({
            pageSize: val
        }, () => {
            _this.init().then(() => {
                _this.pageInit()
            });
            _this.props.onPageChang(oriPagination, {}, {});

        })
    }
    render() {
        const {setTotal} = this.props;
        const totalHtml = this.state.totalArray.map((item, index) => {
            let activeClass = item == this.state.activeIndex ? 'text-active' : '';
            return (
                <span onClick={this.itemClick.bind(this,item,index)} key={index} className={`${activeClass}`}>
                {item}
            </span>
            )
        })
        const pageSizeHtml = this.state.pageSizeArray.map((item, index) => {
            return (
                <Option  key={index} value={item.key}>{item.title}</Option>
            )
        })
        const nextPage = this.state.fastPage ? (<button disabled={this.state.activeIndex == this.state.pageNum} onClick={this.nextHandle} className={'next-page'}><Icon type="right" /></button>) : '';
        const prevPage = this.state.fastPage ? (<button disabled={this.state.activeIndex == 1}   onClick={this.prevHandle} className={'prev-page'}><Icon type="left" /></button>) : '';
        return (
            <div id={'pagination'}>

            <div className={'page-content'}>
                <div className={'text-total'}>
                    总计{this.state.total}条记录
                </div>
                {prevPage}
                <div className={'text-content'}>
                    {totalHtml}
                </div>
                {nextPage}
                {
                    !setTotal && <div className="pageSize">
                        <Select 
                            defaultValue={parseInt(this.state.pageSize)}
                            onChange={this.pageSizeHandle}
                        >
                            {
                                pageSizeHtml
                            }
                        </Select>
                    </div>
                }
                
                <div className="jump">
                    <span>跳至</span>
                        <Input onPressEnter = {this.jumpChange} />
                    <span>页</span>    
                </div>
                
            </div>
 
        </div>
        )
    }
}
export default Pagination;