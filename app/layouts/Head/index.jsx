import React from 'react'
import {
    connect
} from 'react-redux'
import {
    is,
    fromJS
} from 'immutable';
import {
    getItem
} from '@/util'
import {
    Layout,
    Menu,
    Avatar,
    Modal,
    message,
    Dropdown,
    Row,
    Col,
} from 'antd'
const {
    Item
} = Menu;
const {
    Header
} = Layout
import {
    bindActionCreators
} from 'redux'
import Base64 from 'base-64';
import ResetPwd from '../ResetPwd/index'
import workBench from '../../static/img/workBench.png'
import werp from '../../static/img/bg-erp-wxz.png'
import wcrm from '../../static/img/bg-crm-wxz.png'
import werp_beta from '../../static/img/bg-beta-wxz.png'
import wbi from '../../static/img/bg-bi-wxz.png'
import wait from '../../static/img/waiting.png'
import publish from '../../static/img/publish.png'
import tongtu from '../../static/img/tongtu-erp.png'
import { get, post } from 'fetch/request'
import api from 'fetch/api'
import './head.less'
import { sysHostUrl, sysConfig } from '@/config/localStoreKey'
import { getNavList } from './head.js'

import * as userAction from 'sagas/user'

function mapStateToProps(state) {
    return {
        menu: state.user.menu,
        user: state.user.res.user_info,
        local: state.user.local
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(userAction, dispatch)
    }
}
@connect(mapStateToProps, mapDispatchToProps)
export default class Head extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            thoroughfareListingUrl: '',
            menuVisible: true, //控制菜单可现实
            backlogNum: 0,
            menuData: []

        }

    }

    componentDidMount() {
        let menuids = localStorage.getItem('menuids')
        let menudata = localStorage.getItem('menudata')
        if (menuids && menudata) {
            this.setState({
                menuids: JSON.parse(menuids),
                menudata: JSON.parse(menudata),
            })
        } else {
            this.getmenu()
        }
    }
    getmenu = () => {
        post(api.get_role_member_menus, {
            member_id: JSON.parse(localStorage.getItem('USE_INFO')).member_id
        }).then((res) => {
            if (res) {
                if (res.resultData) {
                    let ids = []
                    res.resultData.map((item) => {
                        ids.push(item.index)
                    })
                    this.setState({
                        menuids: ids
                    })
                    localStorage.setItem('menuids', JSON.stringify(ids))
                }
            }
        })
        post(api.get_menu_list_pager, {
            page_size: 1000
        }).then((res) => {
            if (res) {
                if (res.resultData.data) {
                    this.setState({
                        menudata: res.resultData.data
                    })
                    localStorage.setItem('menudata', JSON.stringify(res.resultData.data))
                }
            }
        })

    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    getUserMenu = () => {
        const arr = [<Item key="pwd">修改密码</Item>,
        <Item key="logout">退出登录</Item>,
        <Item key="0">清除全部</Item>,
        <Item key="1">清除首页</Item>,
        <Item key="2">清除列表页</Item>,
        <Item key="3">清除详情页</Item>,
        <Item key="4">清除头部</Item>,
        <Item key="5">清除底部</Item>,
        ]
        return <Menu onClick={this.handleMenu}>{arr}</Menu>;
    }

    //处理menu回调
    handleMenu = ({ key }) => {
        switch (key) {
            case "logout":
                post(process.env['APP_HOST_URL_API_USER'] + api.member_logout, {
                    uuid: getItem('UUID')
                }).then((res) => {
                    localStorage.clear()
                    sessionStorage.clear()
                    this.props.router.push('login')
                })
                break;
            case "pwd":
                this.setState({
                    visibleReset: true
                })
                break;
            default:
                this.eliminate(key);
                break;
        }
    }
    eliminate = (val) => {
        post(api.clear_front_cache, {
            type: val
        }).then((res) => {
            if (res) {
                message.success('清除成功')
            }
        })
    }
    setTimeAni = () => {
        this.setState({
            menuVisible: false
        }, () => {
            setTimeout(() => {
                this.setState({
                    menuVisible: true
                })
            }, 200)
        })
    }

    //跳转通途
    thoroughfareClick = () => {
        get(api.goThoroughfareListing, {}).then(res => {
            const data = res.resultData.data;
            this.setState({
                thoroughfareListingUrl: data[0],
            }, () => {
                document.getElementById("thoroughfare").click();
            })
        })
    }

    //跳转至CRM
    goToCRMPage = type => {
        let paramObj = {}
        paramObj.manager_id = getItem('MANAGER_ID')
        paramObj.uuid = getItem('USER_UUID')
        paramObj.token = getItem('USER_TOKEN')
        paramObj.user_id = getItem('USER_ID')
        let url = `${sysConfig[type].indexOf('http') != -1 ? sysConfig[type] : sysHostUrl + ':' + sysConfig[type]}/#/?paramObj=${Base64.encode(JSON.stringify(paramObj))}`
        open(url)
    }

    setPropsData = obj => {
        this.setState({
            ...obj
        })
    }

 

    reRefreshPower = () => {
        this.getmenu()
        message.success('更新权限成功')
    }


    render() {
        const {
            user = {},
        } = this.props;
        const {
            visibleType,
            type,
            backlogNum,
        } = this.state;
        const modalProps = {
            className: 'chooseStytem',
            visible: visibleType,
            onCancel: () => this.setPropsData({
                visibleType: false
            }),
            width: 1340,
            footer: null,
            closable: false,
        }

        return (
            <Header className="header-wrap">
                <Row type="flex" justify="start">
                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }} onClick={this.reRefreshPower}>
                        <img title='点击刷新权限' alt="和新科技"  style={{ width: 160 }} src='/logo.png' />
                        <span >
                            <img style={{ width: 24, marginLeft: 20, marginTop: 10 }} src={workBench} />
                            {backlogNum > 0 && <span className='tipNum'>{backlogNum > 99 ? '99+' : backlogNum}</span>}
                        </span>
                    </Col>
                    <Col span={15} className="erp-tab erp-tab-ul-main">
                        <ul className="erp-tab-ul">
                            {
                                getNavList.call(this)
                            }
                        </ul>
                        {
                            !!this.state.erpMenuActive && <div className='erp-mask-box' onClick={() => { this.setState({ erpMenuActive: '' }) }}></div>
                        }
                    </Col>
                    <Col span={5} >
                        <Row gutter={10} justify="end" type="flex">
                            <Col style={{ color: '#fff' }}>{!!user.name ? user.name : user.member_name}</Col>
                            <Col>
                                <Dropdown overlay={this.getUserMenu()} placement="bottomCenter">
                                    <Avatar src={user.member_avatar || '/img/header_img.png'} />
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <ResetPwd
                    visibleKey={this.state.visibleReset}
                    handleCancel={() => this.setState({ visibleReset: false })}
                />
                <Modal {...modalProps}>
                    <p className="stytemTitle">和新跨境电商解决方案</p>
                    <a href={this.state.thoroughfareListingUrl} id='thoroughfare' target="_blank"></a>
                    <Row className='stytemDiv' >
                        <Col disabled span={6}>
                            <div className='stytemImage '>
                                <span style={{ background: 'rgb(131, 207, 124)', width: 50, height: 22, position: 'absolute', top: 0, right: 0, borderRadius: 4, color: "#fff" }}>当前</span>
                                <img src={werp_beta} alt="" />
                            </div>
                            <span className='disabelText'>ERP_Beta</span>
                        </Col>
                        <Col span={6} onMouseEnter={() => this.setPropsData({ type: 'erp' })} onMouseLeave={() => this.setPropsData({ type: '' })} onClick={() => this.goToCRMPage('erp')}>
                            <div className='stytemImage hover' >
                                <img src={werp} alt="" />
                            </div>
                            <span className='isabelText'>ERP</span>
                        </Col>
                        <Col span={6} onMouseEnter={() => this.setPropsData({ type: 'publish' })} onMouseLeave={() => this.setPropsData({ type: '' })} onClick={() => this.goToCRMPage('publish')}>
                            <div className='stytemImage hover' >
                                <img src={publish} alt="" />
                            </div>
                            <span className='isabelText'>刊登系统</span>
                        </Col>
                        <Col span={6} onMouseEnter={() => this.setPropsData({ type: 'crm' })} onMouseLeave={() => this.setPropsData({ type: '' })} onClick={() => this.goToCRMPage('crm')}>
                            <div className='stytemImage hover'>
                                <img src={wcrm} alt="" />
                            </div>
                            <span className='isabelText'>CRM</span>
                        </Col>

                    </Row>
                    <Row className='stytemDiv' >
                        <Col span={6} onMouseEnter={() => this.setPropsData({ type: 'bi' })} onMouseLeave={() => this.setPropsData({ type: '' })} onClick={() => this.goToCRMPage('bi')}>
                            <div className='stytemImage hover'>
                                <img src={wbi} alt="" />
                            </div>
                            <span className='isabelText'>BI数据分析</span>
                        </Col>
                        <Col span={6} disabled>
                            <div className='stytemImage' >
                                <img src={wait} alt="" style={{ width: '100%' }} />
                            </div>
                            <span className='disabelText'>Cart</span>
                        </Col>
                    </Row>
                    <div className="stytemBottom">
                        <p className="tit">外部系统</p>
                        <div className='imgBox' >
                            <img src={tongtu} alt="" onClick={this.thoroughfareClick} />
                        </div>
                    </div>
                </Modal>
            </Header>
        )
    }
}

