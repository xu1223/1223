import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
    Layout,
    message,
    BackTop,
    Spin,
    ConfigProvider,
    Icon
} from 'antd';
const { Content } = Layout;

import * as BreadLang from '@/config/bread.js'
import Base64 from 'base-64';
import { is, fromJS } from 'immutable';
import zhCN from 'antd/es/locale/zh_CN';
import { getItem, setItem, getJson } from '@/util'
import Head from '../layouts/Head'
// import Bread from '../layouts/Bread'

import ErrorBoundary from '../layouts/errorBoundary.jsx'
// import MD5 from '../../public/js/md5.js';
import cart from 'fetch/';
import api from 'fetch/api'
import { post } from 'fetch/request'
import * as userAction from 'sagas/user'
const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
        <Icon type="smile" style={{ fontSize: '20px', color: '#4279f4' }} />
        <p>无数据</p>
    </div>
)

function mapStateToProps(state) {
    return {
        menu: state.user.menu,
        user: state.user.res.user_info,
        local: state.user.local,
        storeData: state.user.store
    }
}
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators(userAction, dispatch)
    }
}
@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            BreadLang
        }
        this.obj = {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    componentDidMount() {
        if (location.href.split('paramObj=').length > 1) {
            const str = (location.href.split('paramObj=')[1].split('&')[0]).replace(/%3D/g, "=")
            this.obj = JSON.parse(Base64.decode(str)) || {}
            const { member_token: token, user_id, access_token, member_uuid: uuid } = this.obj;
            if (token) {
                setItem('USER_TOKEN', token)
                setItem('USER_ID', user_id)
                setItem('USER_UUID', uuid);
                // this.props.getMenu({ uuid: uuid, isRefresh: 1 })
            } else {
                this.goLink('login')
            }
        } else {
            if (getItem('USE_INFO')) {
                const { member_token, member_id, member_uuid } = getJson('USE_INFO');

                if (member_token) {
                    setItem('USER_TOKEN', member_token)
                    setItem('USER_ID', member_id)
                    setItem('USER_UUID', member_uuid);
                    this.props.getMenu({ uuid: member_uuid, isRefresh: 1 })
                } else {
                    this.goLink('login')
                }

            } else {
                window.localStorage.clear()
                this.goLink('login')
            }

            // this.props.getMenu({ isRefresh: location.href.indexOf('refresh') != -1 ? 1 : 0 })
        }

        // 监听路由变化
        this.props.router.listen(({ pathname }) => {

            const {
                breadData
            } = this.props.menu

            const dest = breadData.find(item => {
                const _pathname = typeof item.url == 'string' ? item.url : item.url.pathname
                return pathname == _pathname
            })

            if (dest) {
                this.props.setBread({
                    curType: dest.type,
                    curMenu: dest.parent,
                    curSecMenu: dest.index,
                    curMname: dest.curMname
                })
            }
        })
    }

    getKey = (url) => {
        const pathname = typeof url == 'object' ? url.pathname : url
        return pathname.split('/')[1]
    }

    // 新增跳转 链接函数
    goLink(url, obj = {}) {
        const { type, ..._obj } = obj;
        const { BreadLang } = this.state
        const index = this.getKey(url)
        if (BreadLang[index]) {
            if (BreadLang[index][type]) {
                _obj.title = BreadLang[index][type]
            }
        }
        const param = {
            title: 'config|bread文件设置',
            ..._obj,
            url,
            index,
            type
        }
        this.props.changeRouter(param) //切换redux 面包屑
        this.props.router.push(url)  //跳转路由
    }

    goBack = () => {
        const {
            router: {
                location: {
                    pathname
                }
            }
        } = this.props;
        if(this.breadRef){
            this.breadRef.refs.wrappedInstance.remove(pathname, true)
        }else{
            let routerName = location.href.split('hash=')[1]
            if(routerName){
                routerName = routerName.indexOf('&') > -1?routerName.split('&')[0]:routerName

console.log(routerName,'routerNamerouterName')

                this.props.router.push(routerName)  //跳转路由
            }else{
                this.props.router.goBack()
            }
        }
    }

    clearSearchData = () => {
        this.props.clearStoreData()
    }

    render() {
        const { children, router, routes, menu: { initLoading = false } } = this.props
        const comPorps = {
            goLink: this.goLink.bind(this),
            router,
            routes
        }
        return (
            <ConfigProvider renderEmpty={customizeRenderEmpty} locale={zhCN}>
                <ErrorBoundary initLoading={initLoading} clearSearchData={this.clearSearchData}>
                    <div className="layoutWrap">
                        <Layout>
                            <Layout>
                                <Head {...comPorps} />
                                {/* <Bread {...comPorps} ref={ref => this.breadRef = ref} /> */}
                            </Layout>
                            <Layout style={{ width: '100%' }}>
                                <Content style={{ position: "relative", zIndex: 1 }}>
                                    {React.Children.map(children, (child, index) => {
                                        return React.cloneElement(child, {
                                            ...comPorps,
                                            storeSearchData: this.props.storeSearchData,
                                            storeData: this.props.storeData,
                                            curMenu: this.props.menu.curMenu,
                                            goBack: this.goBack,
                                            local: this.props.local
                                        })
                                    })}
                                </Content>
                            </Layout>
                        </Layout>
                        <BackTop>
                            {/* <img src={backtop_img} alt="" /> */}
                            <div className="ant-back-top-go">
                                <i className="iconfont order-ico-zhiding"></i>
                            </div>
                        </BackTop>
                    </div>
                </ErrorBoundary>
                <div id="J_printTableStr" style={{ "display": "none" }}></div>
            </ConfigProvider>
        )
    }

}


