import api from 'fetch/api'
export default {
	//TODO:
	toolConfig: {
		"list": {
			action: "get_menus",
			params: {

			}
		},
	},
};

export const typeData = [{
	value: '1',
	name: '模块'
}, {
	value: '2',
	name: '菜单'
}, {
	value: '3',
	name: '操作'
}];

const dataList = '违禁词库|prohibitWords,采集箱|collectionBox,刊登池|placementPool,编码库|codeLibrary,listing管理|listingManage,在线商品|publishProduct,SKU自动生成|SKUautogeneration,防关联设置|AntiAssociationSetting,新增|add,编辑|edit,删除|delete,状态|status,复制|copy,导出|export,导入|import,批量删除|batchDel,批量导入|batchImport,移动|move,全选|checkAll,审核|check,作废|cancel,通过|pass,驳回|reject,开发|develop,恢复|renew,关联|relevance'

const dealData = (data) => {
	const nameData = [];
	const routeData = [];
	data.split(",").map((item, index) => {
		const [name, code] = item.split("|");
		nameData.push({
			id: code,
			name: name,
		})
		routeData.push({
			id: name,
			name: code,
		})
	})
	return {
		nameData,
		routeData
	};
}
const objData = dealData(dataList)
export const nameData = objData.nameData;
export const routeData = objData.routeData;