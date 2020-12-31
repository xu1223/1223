import React from 'react'
import {
    Input,
    Form,
    Icon,
    Tooltip,
    Menu,
} from 'antd';
const FormItem = Form.Item;
const {
    Search
} = Input;


const {
    SubMenu
} = Menu;


import './index.less'


export default class CategoryComponent extends React.Component {
    state = {
        categroyList: [],
        openKeys: []
    }
    rootSubmenuKeys = [];
    constructor(props, context) {
        super(props, context);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            categroyList: nextProps.categroyList,
        })
    }

    componentDidMount() {
        // this.searchCategroy()
        this.setState({
            categroyList: this.props.categroyList
        })
    }

    handleClick = e => {
        const {
            categroyList
        } = this.state;
        console.log(e.key, 'eee', categroyList)
        let str
        categroyList.forEach(item => {
            if (item.id == e.key) {
                str = item.name
            } else if (item.children) {
                item.children.forEach(i => {
                    if (i.id == e.key) {
                        str = item.name + '>>' + i.name
                    } else if (i.children) {
                        i.children.forEach(j => {
                            if (j.id == e.key) {
                                str = item.name + '>>' + i.name + '>>' + j.name
                            }
                        })
                    }
                })
            }
        })
        if (this.props.handleClick) {
            let param = {
                category_id: e.parent_cate || e.son_cate
            }
            this.props.handleClick(param)
        }
    }
    //清除选择的分类
    clearCategory = () => {
        this.setState({
            openKeys: []
        })
        this.props.clearCategory && this.props.clearCategory()
    }

    //组件还原
    resultCom = () => {
        this.setState({
            openKeys: []
        })
    }

    //模糊搜索
    fuzzySearch = e => {

        this.props.handleClick({
            sku: e
        })
        // const {
        //     categroyList
        // } = this.state;
        // let openKeys = []
        // categroyList.forEach(item => {
        //     if (item.name.indexOf(e) > -1 && e != '') {
        //         item.color = '#f00'
        //     } else {
        //         item.color = ''
        //     }
        //     if (item.children) {
        //         let flag = false
        //         item.children.forEach(i => {
        //             if (i.name.indexOf(e) > -1 && e != '') {
        //                 flag = true;
        //                 i.color = '#f00'
        //             } else {
        //                 i.color = ''
        //             }
        //             if (i.children) {
        //                 let f = false
        //                 i.children.forEach(k => {
        //                     if (k.name.indexOf(e) > -1 && e != '') {
        //                         f = true;
        //                         k.color = '#f00'
        //                     } else {
        //                         k.color = ''
        //                     }
        //                 })
        //                 f && openKeys.push(i.id + '') && openKeys.push(i.parent_id + '')
        //             }
        //         })
        //         flag && openKeys.push(item.id + '')
        //     }
        // })
        // message.success('搜索成功')
        // console.log(openKeys, 'openkeys')
        // this.setState({
        //     openKeys,
        //     categroyList
        // })
    }

    //非终极分类搜索数据
    searchUseParent = (e, id, type) => {
        let param = {}
        if (type == 'son_cate') {
            param = {
                son_cate: id
            }
        } else if (type == 'parent_cate') {
            param = {
                parent_cate: id,
                category_id: id,
            }
        }
        e.stopPropagation()
        this.props.handleClick({
            ...param
        })
    }

    //仿品库查询分类
    // searchCategroy = value => {
    //     console.log(value)
    //     post(api.shop_countInfringementByCategory).then(res => {
    //         this.setState({
    //             categroyList: res.resultData.data
    //         })
    //     })
    // }

    onOpenChange = openKeys => {
        console.log(openKeys, 'openkeys')
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    render() {
        const {
            categroyList,
            openKeys
        } = this.state;

        const menuProps = {
            onClick: this.handleClick,
            mode: "vertical",
            openKeys: openKeys,
            mode: "inline",
            onOpenChange: this.onOpenChange,
            inlineIndent: 24,
        }
        const {
            type
        } = this.props;
        return (
            <div className='categoryItem' style={{ height: this.props.height ? this.props.height : null }}>
                {this.props.height ? null : <div className='categoryTitle'>
                    {/* <span>产品分类</span> */}
                    <Icon type="appstore" />
                    <span onClick={this.clearCategory} style={styles.clear}>全部分类</span>
                </div>}
                {<Search
                    placeholder="搜索sku"
                    onSearch={value => this.fuzzySearch(value)}
                    className='inputSearch'
                />}
                <Menu {...menuProps}>
                    {categroyList.length > 0 && categroyList.map(item => {
                        if (item.children.length > 0) {
                            return <SubMenu
                                key={item.id}
                                popupClassName='childerMenu'
                                className='categoryDiv'
                                title={
                                    <Tooltip title={<div>{item.name}({item.total_product})</div>}>
                                        <span style={{ color: item.color ? item.color : null }} onClick={e => this.searchUseParent(e, item.id, 'parent_cate')} >{item.name}({item.total_product})</span>
                                    </Tooltip>
                                }
                            >
                                {item.children.map(i => {
                                    if (i.children) {
                                        return <SubMenu key={i.id} title={
                                            <Tooltip title={<div> {i.name}({i.total_product})</div>}>
                                                <span style={{ color: i.color ? i.color : null }} onClick={e => this.searchUseParent(e, i.id, 'parent_cate')}  >
                                                    {i.name}({i.total_product})</span>
                                            </Tooltip>
                                        } >
                                            {i.children.map(j => <Menu.Item key={j.id}>
                                                <Tooltip title={<div>{j.name}({i.total_product})</div>}>
                                                    <span onClick={e => this.searchUseParent(e, i.id, 'son_cate')} className='categoryText' style={{ color: j.color ? j.color : null }}>{j.name}({i.total_product})</span>
                                                </Tooltip>
                                            </Menu.Item>)
                                            }
                                        </SubMenu>
                                    } else {
                                        return <Menu.Item className='categoryDiv' key={i.id}>
                                            <Tooltip title={<div>{i.name}({i.total_product})</div>}>
                                                <span onClick={e => this.searchUseParent(e, i.id, 'son_cate')} className='categoryText' style={{ color: i.color ? i.color : null }}>{i.name}({i.total_product})</span>
                                            </Tooltip>
                                        </Menu.Item>
                                    }
                                })
                                }
                            </SubMenu>
                        } else {
                            return <Menu.Item key={item.id} className='categoryDiv'>
                                <Tooltip title={<div>{item.name}({item.total_product})</div>}>
                                    <span onClick={e => this.searchUseParent(e, item.id, 'parent_cate')} className='categoryText' style={{ color: item.color ? item.color : null }}>{item.name}({item.total_product})</span>
                                </Tooltip>
                            </Menu.Item>
                        }
                    })}
                </Menu>
            </div>
        )
    }
}


const styles = {
    clear: {
        cursor: 'pointer',
        marginLeft: '5px',
    }
}