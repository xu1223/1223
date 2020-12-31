import React from 'react'
import {
	Row,
	Col,
	Button
} from 'antd';

import bg_404 from '../static/img/bg_404.png';
class NotFound extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		const _style = {
			color:'#4279F4',
			cursor:'pointer'
		}
		return (
			<div className="body404">
			<div className="wrap404">
				<div className="img404"></div>
				<div className="tip404">
					<h1 className="h1404">
						<img src = {bg_404} /> 
					</h1>
					<div className="cont404">发现彩蛋！！<span style = {_style} onClick = {()=>location.reload()}>刷新</span>一下试试~</div>
					{/* <div> 
						<Button type="primary" onClick={()=>{this.props.router.goBack()}}>返回上一页</Button>
					</div> */}
				</div>
			</div>
			</div>
		)
	}
}

export default NotFound