import React, { Component } from 'react';

import {
    is,
    fromJS
} from 'immutable';

import moment from 'moment'

import {post} from 'fetch/request'


export default class Time extends Component {
    static defaultProps = {
      
    };

    state = {
        curTime:moment().format("YYYY-MM-DD HH:mm:ss")
    }
    componentDidMount(){
        post('/home/index/getServerTime').then(res=>{
            const {
                data
            } = res.resultData;
            var i = 0;
            this.setState({
                curTime:moment(data[0]).add(1,'s').format("YYYY-MM-DD HH:mm:ss")
            })
            this.setTime = setInterval(()=>{
                i++;
                this.setState({
                    curTime:moment(data[0]).add(i, 's').format("YYYY-MM-DD HH:mm:ss")
                })
            },1000)
        })
    }
    componentWillUnmount(){
        clearInterval(this.setTime);
    }

    constructor(props, context) {
        super(props, context);
    }
    
    render() {
       
        return (
            <span>
                {this.state.curTime}
            </span>
        )
    }
}