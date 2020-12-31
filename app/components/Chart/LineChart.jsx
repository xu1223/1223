import React from 'react'
import echarts from 'echarts'
import {
	Row,
	Col,
	DatePicker
} from 'antd';
const {
	RangePicker
} = DatePicker;
import './index.less'

class ChartWrap extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			flag: false,
			title: [],
			chartData: [],
			timeData: [],
			active: 'serven'
		}
		this.chart = {
			target: null,
			option: {
				tooltip: {
					trigger: 'axis',
					formatter: '{a}<br />{b} : {c}'
				},
				legend: {
					data: this.state.title
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: [1, 2, 3, 4, 5, 6, 7]
				},
				yAxis: {
					type: 'value',
					min: 0,
					max: 100
				},
				series: [{
					data: this.state.chartData,
					type: 'line'
				}]
			}
		}
	}

	timeForMat = (count) => {
		// 拼接时间
		let time1 = new Date()
		time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
		let Y1 = time1.getFullYear()
		let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
		let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
		let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
		let time2 = new Date()
		time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
		let Y2 = time2.getFullYear()
		let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
		let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
		let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
		return {
			t1: timer1,
			t2: timer2
		}
	}

	onChange = (date, dateString) => {
		this.props.search(dateString[0], dateString[1])
	}

	componentDidMount() {
		this.chartsInit()
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			title: nextProps.title,
			chartData: nextProps.chartData,
			timeData: nextProps.timeData,
		}, () => {
			this.draw()
		})
	}


	chartsInit() {
		// 创建图表对象
		if (!this.chart.target) {
			this.chart.target = echarts.init(document.getElementById('chart1'), 'westeros')
		}
		// 绘制默认图表
		this.chart.target.setOption(this.chart.option)
	}

	// 重绘
	draw() {
		// 配置项需要变更
		let option = {
			tooltip: {
				trigger: 'axis',
				formatter: '{a}<br />{b} : {c}'
			},
			legend: {
				data: this.state.title,
				x: '600px',
				y: '10px',
				icon: "rect",
				itemWidth: 30, // 设置宽度
				itemHeight: 10, // 设置高度
				itemGap: 48
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: this.state.timeData,
			},
			yAxis: {
				type: 'value',
				min: 0,
				max: 500
			},
			series: this.state.chartData
		}
		this.chart.target.setOption(option)
	}

	searchData = (num, active) => {
		let timeObj = this.timeForMat(num)
		this.setState({
			active,
		})
		this.props.search(timeObj.t2, timeObj.t1)
	}

	render() {
		const {
			active
		} = this.state;
		return <div className='main'>
				<Row className='main-button'>
					<Col className='dateButton' span={6} onClick ={() => this.searchData(7,'serven')} style={{background:active != 'serven'?'rgba(238,238,238,1)':null,cursor: 'pointer'}}>
						<span className='activeText' style={{background:active != 'serven'?'rgba(191,191,191,1)':null}}></span>
						<span className='dateText'>近七天</span>
					</Col>
					<Col className='dateButton' span={6} onClick ={() => this.searchData(30,'thirty')} style={{background:active != 'thirty'?'rgba(238,238,238,1)':null,cursor: 'pointer'}}>
						<span className='activeText' style={{background:active != 'thirty'?'rgba(191,191,191,1)':null}}></span>
						<span className='dateText'>近三十天</span>
					</Col>
					<RangePicker onChange={this.onChange} className='datePicker'/>
				</Row>
				<div id="chart1"></div>
		</div>
	}
}
export default ChartWrap