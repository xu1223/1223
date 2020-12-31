import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
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
           
        } = this.state;



        const contextProps = {
            ...this.state.otherConfig,
        };


        return <div className="tabSwitching">

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <div className="header-tool">
                        <p>用户分析</p>
                    </div>
             
                </ListContext.Provider>
            </div>
        </div>

    }
}