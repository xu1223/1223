import React from 'react'

// import {
// 	Chart,
// 	Geom,
// 	Axis,
// 	Tooltip,
// 	Legend,
// 	Coord,
// 	Guide,
// 	Label
// } from 'bizcharts';
// import DataSet from "@antv/data-set";
// const {
// 	Html
// } = Guide;

class ChartWrap extends React.Component {

	state = {}

	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {

	}

	getGeom() {
		const {
			chartType,
			GemoLabelPm,
			params: {
				key,
				dimension, //名字（圆）
				as // 百分比（圆）
			}
		} = this.props;

		const namex = this.getNameAxis(),
			namey = this.getNameAxis(1),
			namey2 = this.getNameAxis(2);
		var arr = [];
		if (chartType.includes("line-point")) {
			if (chartType.includes("zhu")) {
				arr.push(<Geom type="interval" position={`${namex}*${namey2}`} color={key || '#3182bd'} />)
			}
			arr.push(<Geom type="line" position={`${namex}*${namey}`} size={2} color={ key || '#fdae6b'} />)
			if (!chartType.includes("zhu")) {
				arr.push(<Geom type="point" position={`${namex}*${namey}`} size={4} shape={"circle"}  style={{ stroke: "#fff", lineWidth: 1 }} />);
			}
		} else if (chartType.includes("intervalStack")) {
			arr.push(<Geom type="intervalStack"  position={as} color={dimension} style={{ lineWidth: 1, stroke: "#fff" }}
				tooltip={[`${dimension}*${as}`, (item, percent) => {
					percent = parseFloat(percent * 100).toFixed(2) + "%";
					return {
						name: item,
						value: percent
					};
				}
				]}
			>
				<Label
					content={as}
					formatter={(val, data) => {
						return data.point.item + ": " + val;
					}}
				/>
			</Geom>)
		} else if (chartType.includes("interval")) {
			arr.push(<Geom type="interval" position={`${namex}*${namey}`} color={key} adjust={[{ type: "dodge", marginRatio: 1 / 32 }]} >{GemoLabelPm && <Label
				{...GemoLabelPm}
				/>}</Geom>)
		}
		return arr;
	}

	getAxis() {
		const {
			coord = ["percent"]
		} = this.props;

		const arr = [];
		coord.map(item => {
			if (typeof item != "object") {
				arr.push(<Axis name={item} />)
			} else {
				arr.push(<Axis {...item} />)
			}
		})
		return arr;
	}

	getNameAxis(index = 0) {
		const {
			coord = ["percent"]
		} = this.props;

		const obj = coord[index];

		if (typeof obj != "object") {
			return obj;
		} else {
			return obj.name
		}
	}

	render() {

		let {
			data, // 数据源
			params, //视图转换行数 所需要的 参数
			chartType, //当前视图的类型
			radius = 0.75, //半径
			innerRadius = 0.6,
			isInner = false, // 是否具有内圆
			isLegend = true, //是否显示Leggend
			isTooltip = true, //是否显示Tooltip
			LegendPm = {}, //Legend 的参数
			TooltipPm = {}, // Tooltip 的参数
			coord, //横纵坐标 为圆的时候  只需要传一个
			forceFit = true, //是否需要占用满屏
			centerHtml,
			...ChartPm // 其他作用在Chart 上的参数
		} = this.props;


		const Ds = new DataSet();
		const Dv = Ds.createView().source(data);
		let chartIns = null;
		if (chartType == "intervalStack" && isInner) {
			const _field = params.field;
			let sum = 0;
			data.map(item => {
				sum += item[_field]
			})
			centerHtml = centerHtml.replace(/##/, sum);
		} else if (chartType == "line-point-zhu") {
			LegendPm = {
				...LegendPm,
				custom: true,
				allowAllCanceled: true,
				onClick: ev => {
					const item = ev.item;
					const value = item.value;
					const checked = ev.checked;
					const geoms = chartIns.getAllGeoms();

					for (let i = 0; i < geoms.length; i++) {
						const geom = geoms[i];

						if (geom.getYScale().field === value) {
							if (checked) {
								geom.show();
							} else {
								geom.hide();
							}
						}
					}
				},
			}
		}

		Dv.transform({
			...params
		});



		return (
			<Chart data={Dv} forceFit={forceFit} {...ChartPm}  onGetG2Instance={chart => {
				chartIns = chart;
			  }}>
				{
					this.getAxis()  //渲染  x  y 坐标
				}
				{
					this.getGeom()  //渲染 图形元素 点 线 圆
				}
				{
					isLegend && <Legend  {...LegendPm}/> //  线条控制
				}

				{
					isTooltip && <Tooltip {...TooltipPm} /> // 浮动的tip 悬窗
				}

				{
					//如果值为 interval_ 表示 横向柱状图
					chartType == "interval_" && <Coord transpose scale={[1, -1]} />  
				}

				{
			// isInner && <Guide>
			// 	<Html
			// 	position={["50%", "50%"]}
			// 	html={"<div style='color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;'>"+centerHtml+"</div>"}
			// 	alignX="middle"
			// 	alignY="middle"
			// 	/>
			// </Guide>
				}
				
				{
					//如果值为 intervalStack 表示圆 必须有半径
					chartType == "intervalStack" && (isInner ? <Coord type="theta" radius={radius}  innerRadius={innerRadius}/>  : <Coord type="theta" radius={radius}   /> ) 
				}

			</Chart>
		)
	}
}
export default ChartWrap