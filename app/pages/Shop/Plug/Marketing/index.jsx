import React, { Component } from 'react';
import './index.less'
export default class PositionManage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }


    componentDidMount() {
        const { rowData = {} } = this.context

    }


    render() {
        let data = [ {
            name: '优惠券',
            url: 'Coupons',
            class: 'markeing3'
        },{
            name: '全场活动',
            url: 'Activity',
            class: 'markeing2'
        }, {
            name: '邮件营销',
            url: 'EDM',
            class: 'markeing1'
        }, {
            name: '抽奖转盘',
            url: 'Lottery',
            class: 'markeing7'
        },{
            name: '跟单客服',
            url: 'Service',
            class: 'markeing4'
        }, {
            name: '联合登录',
            url: 'Jointlanding',
            class: 'markeing5'
        }, {
            name: '实时订单',
            url: 'Scrollorder',
            class: 'markeing6'
        },{
            name: 'INS广告',
            url: 'INS',
            class: 'markeing8'
        },]
        

        return (
            <div>
                <div className="header-tool">
                    <p>营销插件</p>
                </div>
                <div className="marketing-main">
                    {
                        data.map((item) => {
                            return <a className="item" href={window.location.origin + '/#/' + item.url} target="_blank">
                                <div className={ `${item.class}  item-tu`}></div>
                                {item.name}
                            </a>
                        })
                    }
                </div>
            </div>
        )
    }
}
