import React from 'react'
import {

    Button,
    Tabs,
    Spin
} from 'antd';
const { TabPane } = Tabs;
import './index.less'
import api from "@/fetch";
import Rechristen from './Component/rechristen'
import BatOperation from '@/components/BatOperation';
import pc from '../../../../static/img/pc.png'
import mobile from '../../../../static/img/mobile.png'
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            squaredata: {}
        }
        this._batProps = (rowData) => {
            return {
                config: [{
                    title: '更多',
                    noCheck: true,
                    ghost: true,
                    children: [{
                        title: '预览',
                        noCheck: true,
                        ghost: true,
                        onClick: () => { this.toggleWin('visibleLog', rowData) }
                    }, {
                        title: '编辑',
                        noCheck: true,
                        ghost: true,
                        url: `Decorateedit/${rowData.id}/edit`
                    },
                    {
                        title: '发布',
                        noCheck: true,
                        ghost: true,
                        visible: rowData.is_publish != 1,
                        onClick: () => { this.publish(rowData.id) }
                    }, {
                        title: '重命名',
                        noCheck: true,
                        ghost: true,
                        onClick: () => { this.toggleWin('rechristen', rowData) }
                    },
                    {
                        title: '复制',
                        noCheck: true,
                        ghost: true,
                        onClick: () => { this.copy(rowData.id) }
                    },
                    {
                        title: '删除',
                        noCheck: true,
                        type: "danger",
                        ghost: true,
                        visible: rowData.is_publish != 1,
                        onClick: () => { this.colse(rowData.id) }
                    },
                    ]
                }],
                unicode: 'tpl_id|id',
                batConfig: {
                    blistSelData: '',
                    selectedRows: '',
                    changeSearch: '',
                },
                rowData
            }
        };
        this.tabval = '0'
    }

    componentDidMount = () => {

        this.customizelist()


    }
    // 复制模板
    copy = (val) => {
        this.setState({
            loading: true
        })
        api.order.customizecopy({ tpl_id: val }).then((res) => {
            if (res) {
                this.setState({
                    loading: false
                })
                this.customizelist()

            }
        })
    }
    // 删除模板
    colse = (val) => {
        api.order.customizedeletetemplate({ tpl_id: val }).then((res) => {
            if (res) {
                this.customizelist()
            }
        })
    }
    // 发布
    publish = (value) => {
        api.order.customizepublish({ tpl_id: value }).then((res) => {
            if (res) {
                this.customizelist()
            }
        })
    }
    // 根据类型获取信息
    customizelist = (val = this.tabval) => {
        this.setState({
            loading: true
        })
        api.order.customizelist({ is_mobile: val }).then((res) => {
            if (res) {
                this.setState({
                    squaredata: res.resultData,
                    curr_template: res.resultData.curr_template,
                    loading: false
                })
            }
        })
    }
    // tab切换
    callback = (val) => {
        this.tabval = val
        this.customizelist(val)
    }
    // 切换模板
    tabclick = (val) => {
        this.setState({
            curr_template: val,
        })
    }

    jumpPage = (link, id = 0, type = 'edit') => {
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }

    toggleWin = (key = 'visible', rowData) => {
        this.setState({
            [key]: !this.state[key],
            rowData,
        })
    }

    render() {
        const {
            loading = true,
            squaredata = {},
            curr_template = {},
            rechristen = false,
            rowData
        } = this.state
        const {
            site = {}
        } = squaredata
        let Title = 'PC模板修改'
        let Themeimg = pc
        if (this.tabval == 1) {
            Title = '移动模板修改'
            Themeimg = mobile
        }
        return <div className="userStyle theme-main">
            <div className="header-tool">
                <p>{Title}</p>
            </div>
            <div className="theme-content-main" >
                <div className="content-le">
                    <h2>网站信息</h2>
                    <div>
                        <p>网站代码：{site.prefix}</p>
                        <p>网站名称：{site.name}</p>
                        <p>网站域名：<a href={site.domain} target="_blank">{site.domain}</a></p>
                    </div>
                </div >
                <div className="content-ri"  >
                    <Spin spinning={loading}>
                        <Tabs defaultActiveKey="0" onChange={(val) => this.callback(val)}>
                            <TabPane tab="PC端设置" key='0'>
                            </TabPane>
                            <TabPane tab="移动端设置" key='1'>
                            </TabPane>
                        </Tabs>
                        <div style={{ display: 'flex' }}>
                            <div className="theme-le " style={{ flex: '1' }}>
                                <p className="theme-le-title">当前模板: <a> {curr_template.name}</a></p>
                                <div className="theme-le-main">
                                    <div className={this.tabval == 1 ? 'theme-le-img img-model' : 'theme-le-img img-pc'}>
                                        <img src={Themeimg} >

                                        </img>
                                        <img src={curr_template.image}>

                                        </img>
                                        <div className="theme-le-buton">
                                            <HocWinLink url={`Decorateedit/${curr_template.id}/edit`}>
                                                <Button type="primary" >进入可视化编辑</Button>
                                            </HocWinLink>
                                            {/* <Button type="primary">网站预览</Button> */}
                                            {
                                                curr_template.is_publish != 1 ?
                                                    <Button type="primary" onClick={() => this.publish(curr_template.id)}>发布</Button>
                                                    : ''
                                            }
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="theme-ri" style={{ width: '300px' }}>
                                <p><span>模板列表</span> <a>新增模板</a></p>
                                <ul>
                                    {
                                        squaredata.templates ?
                                            squaredata.templates.map((item) => {
                                                return <li className={item == curr_template ? 'ative' : ''}>
                                                    <span className="theme-ri-name" onClick={() => this.tabclick(item)}>{item.name}</span>
                                                    <BatOperation {...this._batProps(item)} /></li>
                                            })
                                            : ''
                                    }

                                </ul>

                            </div>
                        </div>
                    </Spin>
                </div>
            </div>
            {rechristen && <Rechristen
                visible={rechristen}
                rowData={rowData}
                toggleWin={(val) => this.toggleWin(val)}
                customizelist={() => this.customizelist()}
            ></Rechristen>}


        </div>
    }
}

export default Decorate