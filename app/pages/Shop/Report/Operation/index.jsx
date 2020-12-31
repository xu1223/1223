import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import { tabConfig } from './config'
import { ListContext } from '@/config/context';

import Search from '../Component/index.jsx';

import Echartsitem from './Component/index.jsx';
import './index.less'



export default class PositionManage extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {


        }




    }




    componentDidMount = () => {
    }

    // 共享 tool 和index
    toggleWin = (key = 'visible', rowData = {}) => {
        let { otherConfig = {} } = this.state;
        otherConfig = {
            rowData,
            [key]: !this.state[key]
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig,
            rowData,
        })
    }




    render() {
        const {
            test = {}
        } = this.state;



        const contextProps = {
            ...this.state.otherConfig,
        };


        return <div className="tabSwitching " >

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <div className="header-tool">
                        <p>运营总览</p>
                    </div>
                    <div className="report-main">
                        <Search></Search>
                        <p className="title">运营总览</p>
                        <div className="Operation-tab">
                            {
                                tabConfig.map((item) => {
                                    return <div className="item">
                                        <div className="le">
                                            {item.name}
                                        </div>
                                        <div className="ri">
                                            {test[item.key] || 0}
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className="operation-echart-main">
                             <Echartsitem id="main1"></Echartsitem>
                             <Echartsitem id="main2"></Echartsitem>
                             <Echartsitem id="main3"></Echartsitem>
                        </div>

                    </div>



                </ListContext.Provider>
            </div>
        </div>

    }
}