import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { ListContext } from '@/config/context';
import BaseReport from "@/components/BaseReport";
import {
    Card,
    Spin,
    Icon,
    Select,
    Layout,
    Row,
    Col,
    Tooltip,
    Button
} from 'antd';
const { Content } = Layout;
const { Option } = Select;
import moment from 'moment';

/**
 * @file 运营总览
 */
export default class OperationOverviewPage extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
          
        }
    }

    componentDidMount = () => {
    }
 


   




    render() {
        const {
         
        } = this.state;

        const contextProps = {
         

        };
 
        return <Layout className="layout-content-main operation-overview-page">
            <div className="tabSwitching">
                <ListContext.Provider value={contextProps}>
                    <div>
                        <BaseReport id='main2' ref={ref => this.echartref2 = ref} type='bar' Eheight="400px" Ewidth="100%"></BaseReport>
                    </div>

                </ListContext.Provider>
            </div>
        </Layout>
    }
}