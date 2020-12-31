import React from 'react'
import {
    Router,
    Route,
    IndexRoute,
    IndexRedirect,
    withRouter
} from 'react-router'
import {
    message,
} from 'antd';
import App from '../pages'
import Action from './index'
import NotFound from '../pages/404'
import Login from '../pages/Login/index'
import {
    navTitle
} from '../config/localStoreKey'
class RouterMap extends React.Component {

    setIndex = (index, replace) => {
        let menu = JSON.parse(localStorage.getItem('menuids'))
        if (menu) {
            let marketing = ['EDM', 'Activity', 'Coupons', 'Service', 'Jointlanding', 'Scrollorder', 'Lottery', 'INS','Googleapis']
            if (menu.indexOf('marketing') != -1) {
                if (menu.indexOf(index) == -1 && index != 'personalDescriptions'
                    && index != 'ersonalDescriptions' && index.indexOf('edit') == -1
                    && marketing.indexOf(index) == -1) {
                    message.error('没有此页面权限，请联系管理员添加')
                    replace('personalDescriptions')
                }
            } else {
                if (menu.indexOf(index) == -1 && index != 'personalDescriptions'
                    && index != 'ersonalDescriptions' && index.indexOf('edit') == -1
                    ) {
                    message.error('没有此页面权限，请联系管理员添加')
                    replace('personalDescriptions')
                }
            }
        }
    }

    setTitle = (e, replace) => {
        let key = e.location.pathname;
        key = key.indexOf('/') == -1 ?  key : key.split('/')[1];
        this.setIndex(key, replace)
        document.title = navTitle[key] || "商城管理系统"
    }

    render() {

        return (
            <Router history={this.props.history}>
                <Route path='/' component={App}>
                    <IndexRedirect to="/personalDescriptions" />
                    <Route path='/personalDescriptions(/:id)' getComponent={Action.PersonalDescriptions} onEnter={this.setTitle} />
                </Route>
                {/* 商城后台 */}
                <Route path="/Shop" component={App}>
                    <Route path='/Memberinfo(/:id)' getComponent={Action.Memberinfo} onEnter={this.setTitle} />
                    <Route path='/Memberinfoproedit(/:id)(/:type)' getComponent={Action.Memberinfopro} onEnter={this.setTitle} />
                    <Route path='/Commoditymanage' getComponent={Action.Commoditymanage} onEnter={this.setTitle} />
                    <Route path='/Subscription' getComponent={Action.Subscription} onEnter={this.setTitle} />
                    <Route path='/Cartmem(/:id)' getComponent={Action.Cartmem} onEnter={this.setTitle} />
                    <Route path='/Cartmemproedit(/:id)(/:type)' getComponent={Action.Cartmempro} onEnter={this.setTitle} />
                    <Route path='/Wishlist(/:id)' getComponent={Action.Wishlist} onEnter={this.setTitle} />
                    <Route path='/Wishlistproedit(/:id)(/:type)' getComponent={Action.Wishlistpro} onEnter={this.setTitle} />
                    <Route path='/Allorder(/:id)' getComponent={Action.Allorder} onEnter={this.setTitle} />
                    <Route path='/Allorderporedit(/:id)(/:type)' getComponent={Action.Allorderpor} onEnter={this.setTitle} />
                    <Route path='/ShopInsertedit(/:id)(/:type)' getComponent={Action.ShopInsert} onEnter={this.setTitle} />
                    <Route path='/Membercomments(/:id)' getComponent={Action.Membercomments} onEnter={this.setTitle} />
                    <Route path='/Classify' getComponent={Action.Classify} onEnter={this.setTitle} />
                    <Route path='/Sizerporedit(/:id)(/:type)' getComponent={Action.Sizerpor} onEnter={this.setTitle} />
                    <Route path='/Sizer' getComponent={Action.Sizer} onEnter={this.setTitle} />
                    <Route path='/Commodityproperty' getComponent={Action.Commodityproperty} onEnter={this.setTitle} />
                    <Route path='/Brandlabel' getComponent={Action.Brandlabel} onEnter={this.setTitle} />
                    <Route path='/Message' getComponent={Action.Message} onEnter={this.setTitle} />
                    <Route path='/Messageproedit(/:id)(/:type)' getComponent={Action.Messagepro} onEnter={this.setTitle} />
                    <Route path='/PrivilegeMenu' getComponent={Action.PrivilegeMenu} onEnter={this.setTitle} />
                    <Route path='/UserManagement' getComponent={Action.UserManagement} onEnter={this.setTitle} />
                    <Route path='/Service' getComponent={Action.Service} onEnter={this.setTitle} />
                    <Route path='/Logistics' getComponent={Action.Logistics} onEnter={this.setTitle} />
                    <Route path='/Decorateedit(/:tpl_id)(/:type)(/:id)' getComponent={Action.Decorateedit} onEnter={this.setTitle} />
                    <Route path='/Themetemplate' getComponent={Action.Themetemplate} onEnter={this.setTitle} />
                    <Route path='/Commodityproject' getComponent={Action.Commodityproject} onEnter={this.setTitle} />
                    <Route path='/Posts' getComponent={Action.Posts} onEnter={this.setTitle} />
                    <Route path='/Basic' getComponent={Action.Basic} onEnter={this.setTitle} />
                    <Route path='/Parameter' getComponent={Action.Parameter} onEnter={this.setTitle} />
                    <Route path='/Domain' getComponent={Action.Domain} onEnter={this.setTitle} />
                    <Route path='/Languageset' getComponent={Action.Languageset} onEnter={this.setTitle} />
                    <Route path='/Currencyset' getComponent={Action.Currencyset} onEnter={this.setTitle} />
                    <Route path='/Emailset' getComponent={Action.Emailset} onEnter={this.setTitle} />
                    <Route path='/Trace' getComponent={Action.Trace} onEnter={this.setTitle} />
                    <Route path='/Navmenu' getComponent={Action.Navmenu} onEnter={this.setTitle} />
                    <Route path='/Special' getComponent={Action.Special} onEnter={this.setTitle} />
                    <Route path='/Associatededit(/:id)' getComponent={Action.Associated} onEnter={this.setTitle} />
                    <Route path='/EDM' getComponent={Action.EDM} onEnter={this.setTitle} />
                    <Route path='/Jointlanding' getComponent={Action.Jointlanding} onEnter={this.setTitle} />
                    <Route path='/Payment' getComponent={Action.Payment} onEnter={this.setTitle} />
                    <Route path='/Marketing' getComponent={Action.Marketing} onEnter={this.setTitle} />
                    <Route path='/Activity' getComponent={Action.Activity} onEnter={this.setTitle} />
                    <Route path='/Coupons' getComponent={Action.Coupons} onEnter={this.setTitle} />
                    <Route path='/Scrollorder' getComponent={Action.Scrollorder} onEnter={this.setTitle} />
                    <Route path='/Lottery' getComponent={Action.Lottery} onEnter={this.setTitle} />
                    <Route path='/INS' getComponent={Action.INS} onEnter={this.setTitle} />
                    <Route path='/echarts' getComponent={Action.echarts} onEnter={this.setTitle} />
                    <Route path='/Productpermissions' getComponent={Action.Productpermissions} onEnter={this.setTitle} />
                    <Route path='/Hrinfo' getComponent={Action.Hrinfo} onEnter={this.setTitle} />
                    <Route path='/UserAnalysis' getComponent={Action.UserAnalysis} onEnter={this.setTitle} />
                    <Route path='/Operation' getComponent={Action.Operation} onEnter={this.setTitle} />
                    <Route path='/IBM' getComponent={Action.IBM} onEnter={this.setTitle} />
                    <Route path='/Googleapis' getComponent={Action.Googleapis} onEnter={this.setTitle} />
                </Route>
                <Route path='/Login' component={Login} />
                <Route path='*' component={NotFound} />
            </Router>
        )
    }
}
export default RouterMap