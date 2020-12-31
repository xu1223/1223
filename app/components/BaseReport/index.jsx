import React from 'react';
import {
    Icon,
    Slider,
    Empty
} from 'antd';
import echarts from 'echarts'
// import wordcloud from 'echarts-wordcloud' // 预生成未安装包 暂时注释
import './index.less'
class BaseReport extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props.onRef && this.props.onRef(this)
        this.state = {
        }
        this.myChart = ''
    }

    componentDidMount() {
        this.creatEcharts()
    }

    componentWillUnmount() {
    }

    creatEcharts = () => {
        const { type, id } = this.props
        
        let option = {}
        if (type == 'line') {// 折线图
            option = {
                title: {
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#333',
                        fontSize: 18
                    }
                },
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    type: 'value',
                },
                series: [{
                    type: 'line',
                    lineStyle: {  // 线条样式
                        color: '#4486F7'
                    },
                    itemStyle: { // 拐点标志的样式
                        color: '#4486F7'
                    },
                    areaStyle: { // 区域填充样式
                        color: '#fff'
                    }
                }]
            }
        }
        else if (type == 'bar') { // 柱状图
            option = {
                title: {
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#333'
                    }
                },
                color: ['#2c99ff','#f96e86','#5dd781','#edd264','#f7b086','#b6e1a1','#f89090','#95d9fa','#feaacf','#d0d6db'],
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'bar',
                    barWidth: '50%',
                    // lineStyle: {  // 线条样式
                    //     color: '#4486F7'
                    // }
                }]
            }
        }
        else if (type == 'pie') { // 饼图
            option = {
                title: {
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#333'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                color: ['#2c99ff','#f96e86','#5dd781','#edd264','#f7b086','#b6e1a1','#f89090','#95d9fa','#feaacf','#d0d6db'],
                series: [{
                    type: 'pie'
                }]
            }
        }
        else if (type == 'scatter') {// 散点图
            option = {
                series: [{
                    type: 'scatter'
                }]
            }
        }
        else if (type == 'graph') {// 关系图
            option = {
                series: [{
                    type: 'graph'
                }]
            }
        }
        this.myChart = echarts.init(document.getElementById(id))
        this.myChart.setOption(option);
        window.addEventListener("resize", () => { this.myChart.resize();});
    }

    // 显示loading
    showLoading = () => {
        this.myChart.showLoading({
            text: '',
            color: '#4486F7',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        })
        this.setState({
            loading :true
        })
    }
    // 隐藏loading
    hideLoading = () => {
        this.myChart.hideLoading()
        this.setState({
            loading :false
        })
    }

    render() {
        const {
            seriesData,
            loading
        } = this.state
        const {
            Eheight = "100%",
            Ewidth = "100%",
            id = 'main',
        } = this.props
        let style = { width: Ewidth, height: Eheight, margin: '0 auto', display: seriesData && seriesData.length == 0 ? 'none' : 'block' }
        return (
            <div >
                <div id={id} className="baseReport" style={style}></div>
                {
                    !loading && seriesData && seriesData.length == 0 ?
                        <div className="echarts-empty" style={{ width: Ewidth, height: Eheight }} ><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div> : null
                }
            </div>
        )
    }
}
export default BaseReport
